import { VersionedUrl } from "@blockprotocol/type-system";
import {
  EntityStructuralQuery,
  Filter,
  GraphResolveDepths,
} from "@local/hash-graph-client";
import {
  currentTimeInstantTemporalAxes,
  zeroedGraphResolveDepths,
} from "@local/hash-isomorphic-utils/graph-queries";
import {
  AccountGroupId,
  AccountId,
  BaseUrl,
  Entity,
  EntityId,
  EntityMetadata,
  EntityPropertiesObject,
  EntityRootType,
  EntityTypeWithMetadata,
  EntityUuid,
  extractEntityUuidFromEntityId,
  extractOwnedByIdFromEntityId,
  OwnedById,
  splitEntityId,
  Subgraph,
} from "@local/hash-subgraph";
import { getRoots } from "@local/hash-subgraph/stdlib";
import { LinkEntity } from "@local/hash-subgraph/type-system-patch";
import { ApolloError } from "apollo-server-errors";

import {
  EntityDefinition,
  LinkedEntityDefinition,
} from "../../../graphql/api-types.gen";
import { publicUserAccountId } from "../../../graphql/context";
import { linkedTreeFlatten } from "../../../util";
import { ImpureGraphFunction } from "../..";
import { getEntityTypeById } from "../../ontology/primitive/entity-type";
import { createLinkEntity, isEntityLinkEntity } from "./link-entity";

export type CreateEntityParams = {
  ownedById: OwnedById;
  properties: EntityPropertiesObject;
  entityTypeId: VersionedUrl;
  entityUuid?: EntityUuid;
};

/** @todo: potentially directly export this from the subgraph package */
export type PropertyValue = EntityPropertiesObject[BaseUrl];

/**
 * Create an entity.
 *
 * @param params.ownedById - the id of the account who owns the entity
 * @param params.entityType - the type of the entity
 * @param params.properties - the properties object of the entity
 * @param params.actorId - the id of the account that is creating the entity
 * @param params.entityUuid (optional) - the uuid of the entity, automatically generated if left undefined
 */
export const createEntity: ImpureGraphFunction<
  CreateEntityParams,
  Promise<Entity>
> = async ({ graphApi }, { actorId }, params) => {
  const {
    ownedById,
    entityTypeId,
    properties,
    entityUuid: overrideEntityUuid,
  } = params;

  const { data: metadata } = await graphApi.createEntity(actorId, {
    ownedById,
    entityTypeId,
    properties,
    entityUuid: overrideEntityUuid,
  });

  return {
    properties,
    metadata: metadata as EntityMetadata,
  };
};

/**
 * Get entities by a structural query.
 *
 * @param params.query the structural query to filter entities by.
 */
export const getEntities: ImpureGraphFunction<
  {
    query: EntityStructuralQuery;
  },
  Promise<Subgraph<EntityRootType>>
> = async ({ graphApi }, { actorId }, { query }) => {
  return await graphApi
    .getEntitiesByQuery(actorId, query)
    .then(({ data: subgraph }) => {
      // filter archived entities from the vertices until we implement archival by timestamp, not flag: remove after H-349
      for (const [entityId, editionMap] of Object.entries(subgraph.vertices)) {
        const latestEditionTimestamp = Object.keys(editionMap).sort().pop();

        if (
          (
            editionMap[latestEditionTimestamp!]!.inner
              .metadata as EntityMetadata
          ).archived &&
          // if the vertex is in the roots of the query, then it is intentionally included
          !subgraph.roots.find((root) => root.baseId === entityId)
        ) {
          // eslint-disable-next-line no-param-reassign -- temporary hack
          delete subgraph.vertices[entityId];
        }
      }
      return subgraph as Subgraph<EntityRootType>;
    });
};

/**
 * Get the latest version of an entity by its entity ID.
 *
 * @param params.entityId - the id of the entity
 */
export const getLatestEntityById: ImpureGraphFunction<
  {
    entityId: EntityId;
  },
  Promise<Entity>
> = async (context, authentication, params) => {
  const { entityId } = params;

  const [ownedById, entityUuid] = splitEntityId(entityId);

  const [entity, ...unexpectedEntities] = await getEntities(
    context,
    authentication,
    {
      query: {
        filter: {
          all: [
            {
              equal: [{ path: ["uuid"] }, { parameter: entityUuid }],
            },
            {
              equal: [{ path: ["ownedById"] }, { parameter: ownedById }],
            },
            { equal: [{ path: ["archived"] }, { parameter: false }] },
          ],
        },
        graphResolveDepths: zeroedGraphResolveDepths,
        temporalAxes: currentTimeInstantTemporalAxes,
      },
    },
  ).then(getRoots);

  if (unexpectedEntities.length > 0) {
    throw new Error(
      `Critical: Latest entity with entityId ${entityId} returned more than one result.`,
    );
  }

  if (!entity) {
    throw new Error(
      `Critical: Entity with entityId ${entityId} doesn't exist.`,
    );
  }

  return entity;
};

/**
 * Get or create an entity given either by new entity properties or a reference
 * to an existing entity.
 *
 * @param params.ownedById the id of owner of the entity
 * @param params.entityDefinition the definition of how to get or create the entity (excluding any linked entities)
 * @param params.actorId - the id of the account that is creating the entity
 */
export const getOrCreateEntity: ImpureGraphFunction<
  {
    ownedById: OwnedById;
    entityDefinition: Omit<EntityDefinition, "linkedEntities">;
  },
  Promise<Entity>
> = async (context, authentication, params) => {
  const { entityDefinition, ownedById } = params;
  const { entityProperties, existingEntityId } = entityDefinition;

  let entity;

  if (existingEntityId) {
    entity = await getLatestEntityById(context, authentication, {
      entityId: existingEntityId,
    });

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- account for old browsers
    if (!entity) {
      throw new ApolloError(
        `Entity ${existingEntityId} not found`,
        "NOT_FOUND",
      );
    }
  } else if (entityProperties) {
    const { entityTypeId } = entityDefinition;

    if (!entityTypeId) {
      throw new ApolloError(
        `Given no valid type identifier. Must be one of entityTypeId`,
        "NOT_FOUND",
      );
    }

    entity = await createEntity(context, authentication, {
      ownedById,
      entityTypeId,
      properties: entityProperties,
    });
  } else {
    throw new Error(
      `entityType and one of entityId OR entityProperties must be provided`,
    );
  }

  return entity;
};

/**
 * Create an entity along with any new/existing entities specified through links.
 *
 * @param params.ownedById - the id of owner of the entity
 * @param params.entityTypeId - the id of the entity's type
 * @param params.entityProperties - the properties of the entity
 * @param params.linkedEntities (optional) - the linked entity definitions of the entity
 * @param params.actorId - the id of the account that is creating the entity
 */
export const createEntityWithLinks: ImpureGraphFunction<
  {
    ownedById: OwnedById;
    entityTypeId: VersionedUrl;
    properties: EntityPropertiesObject;
    linkedEntities?: LinkedEntityDefinition[];
  },
  Promise<Entity>
> = async (context, authentication, params) => {
  const { ownedById, entityTypeId, properties, linkedEntities } = params;

  const entitiesInTree = linkedTreeFlatten<
    EntityDefinition,
    LinkedEntityDefinition,
    "linkedEntities",
    "entity"
  >(
    {
      entityTypeId,
      entityProperties: properties,
      linkedEntities,
    },
    "linkedEntities",
    "entity",
  );

  /**
   * @todo Once the graph API validates the required links of entities on creation, this may have to be reworked in order
   *   to create valid entities.
   *   this code currently creates entities first, then links them together.
   *   See https://app.asana.com/0/1202805690238892/1203046447168478/f
   */
  const entities = await Promise.all(
    entitiesInTree.map(async (definition) => ({
      link: definition.meta
        ? {
            parentIndex: definition.parentIndex,
            meta: definition.meta,
          }
        : undefined,
      entity: await getOrCreateEntity(context, authentication, {
        ownedById,
        entityDefinition: definition,
      }),
    })),
  );

  let rootEntity: Entity;
  if (entities[0]) {
    // First element will be the root entity.
    rootEntity = entities[0].entity;
  } else {
    throw new ApolloError(
      "Could not create entity tree",
      "INTERNAL_SERVER_ERROR",
    );
  }

  await Promise.all(
    entities.map(async ({ link, entity }) => {
      if (link) {
        const parentEntity = entities[link.parentIndex];
        if (!parentEntity) {
          throw new ApolloError("Could not find parent entity");
        }
        const linkEntityType = await getEntityTypeById(
          context,
          authentication,
          {
            entityTypeId: link.meta.linkEntityTypeId,
          },
        );

        // links are created as an outgoing link from the parent entity to the children.
        await createLinkEntity(context, authentication, {
          linkEntityType,
          leftEntityId: parentEntity.entity.metadata.recordId.entityId,
          rightEntityId: entity.metadata.recordId.entityId,
          leftToRightOrder: link.meta.index ?? undefined,
          ownedById,
        });
      }
    }),
  );

  return rootEntity;
};

/**
 * Update an entity.
 *
 * @param entity - the entity being updated
 * @param params.properties - the properties object of the entity
 * @param params.actorId - the id of the account that is updating the entity
 */
export const updateEntity: ImpureGraphFunction<
  {
    entity: Pick<Entity, "metadata">;
    entityTypeId?: VersionedUrl;
    properties: EntityPropertiesObject;
  },
  Promise<Entity>
> = async ({ graphApi }, { actorId }, params) => {
  const { entity, properties, entityTypeId } = params;

  const { data: metadata } = await graphApi.updateEntity(actorId, {
    entityId: entity.metadata.recordId.entityId,
    /**
     * @todo: this field could be optional when updating an entity
     *
     * @see https://app.asana.com/0/1201095311341924/1203285029221330/f
     * */
    entityTypeId: entityTypeId ?? entity.metadata.entityTypeId,
    archived: entity.metadata.archived,
    properties,
  });

  return {
    ...entity,
    metadata: metadata as EntityMetadata,
    properties,
  };
};

export const archiveEntity: ImpureGraphFunction<
  {
    entity: Entity;
  },
  Promise<void>
> = async ({ graphApi }, { actorId }, params) => {
  const { entity } = params;
  await graphApi.updateEntity(actorId, {
    entityId: entity.metadata.recordId.entityId,
    archived: true,
    /**
     * @todo: these fields shouldn't be required when archiving an entity
     *
     * @see https://app.asana.com/0/1201095311341924/1203285029221330/f
     * */
    entityTypeId: entity.metadata.entityTypeId,
    properties: entity.properties,
  });
};

/**
 * Update multiple top-level properties on an entity.
 *
 * @param entity - the entity being updated
 * @param params.updatedProperties - an array of the properties being updated
 * @param params.actorId - the id of the account that is updating the entity
 */
export const updateEntityProperties: ImpureGraphFunction<
  {
    entity: Entity;
    updatedProperties: {
      propertyTypeBaseUrl: BaseUrl;
      value: PropertyValue | undefined | undefined;
    }[];
  },
  Promise<Entity>
> = async (ctx, authentication, params) => {
  const { entity, updatedProperties } = params;

  return await updateEntity(ctx, authentication, {
    entity,
    properties: updatedProperties.reduce<EntityPropertiesObject>(
      (prev, { propertyTypeBaseUrl, value }) =>
        value !== undefined
          ? {
              ...prev,
              [propertyTypeBaseUrl]: value,
            }
          : prev,
      entity.properties,
    ),
  });
};

/**
 * Update a top-level property on an entity.
 *
 * @param params.entity - the entity being updated
 * @param params.propertyTypeBaseUrl - the property type base URL of the property being updated
 * @param params.value - the updated value of the property
 * @param params.actorId - the id of the account that is updating the entity
 */
export const updateEntityProperty: ImpureGraphFunction<
  {
    entity: Entity;
    propertyTypeBaseUrl: BaseUrl;
    value: PropertyValue | undefined;
  },
  Promise<Entity>
> = async (ctx, authentication, params) => {
  const { entity, propertyTypeBaseUrl, value } = params;

  return await updateEntityProperties(ctx, authentication, {
    entity,
    updatedProperties: [{ propertyTypeBaseUrl, value }],
  });
};

/**
 * Get the incoming links of an entity.
 *
 * @param params.entity - the entity
 * @param params.linkEntityType (optional) - the specific link entity type of the incoming links
 */
export const getEntityIncomingLinks: ImpureGraphFunction<
  {
    entityId: EntityId;
    linkEntityType?: EntityTypeWithMetadata;
  },
  Promise<LinkEntity[]>
> = async (context, authentication, params) => {
  const { entityId } = params;
  const filter: Filter = {
    all: [
      {
        equal: [
          { path: ["rightEntity", "uuid"] },
          {
            parameter: extractEntityUuidFromEntityId(entityId),
          },
        ],
      },
      {
        equal: [
          { path: ["rightEntity", "ownedById"] },
          {
            parameter: extractOwnedByIdFromEntityId(entityId),
          },
        ],
      },
      {
        equal: [{ path: ["archived"] }, { parameter: false }],
      },
    ],
  };

  if (params.linkEntityType) {
    filter.all.push({
      equal: [
        { path: ["type", "versionedUrl"] },
        {
          parameter: params.linkEntityType.schema.$id,
        },
      ],
    });
  }

  const incomingLinkEntitiesSubgraph = await getEntities(
    context,
    authentication,
    {
      query: {
        filter,
        graphResolveDepths: zeroedGraphResolveDepths,
        temporalAxes: currentTimeInstantTemporalAxes,
      },
    },
  );

  const incomingLinkEntities = getRoots(incomingLinkEntitiesSubgraph).map(
    (linkEntity) => {
      if (!isEntityLinkEntity(linkEntity)) {
        throw new Error(
          `Entity with ID ${linkEntity.metadata.recordId.entityId} is not a link entity.`,
        );
      }
      return linkEntity;
    },
  );

  return incomingLinkEntities;
};

/**
 * Get the outgoing links of an entity.
 *
 * @param params.entityId - the entityId of the entity to get the outgoing links of
 * @param [params.linkEntityTypeVersionedUrl] (optional) – the specific link type of the outgoing links to filter to
 * @param [params.rightEntityId] (optional) – limit returned links to those with the specified right entity
 */
export const getEntityOutgoingLinks: ImpureGraphFunction<
  {
    entityId: EntityId;
    linkEntityTypeVersionedUrl?: VersionedUrl;
    rightEntityId?: EntityId;
  },
  Promise<LinkEntity[]>
> = async (context, authentication, params) => {
  const { entityId, linkEntityTypeVersionedUrl, rightEntityId } = params;
  const filter: Filter = {
    all: [
      {
        equal: [
          { path: ["leftEntity", "uuid"] },
          {
            parameter: extractEntityUuidFromEntityId(entityId),
          },
        ],
      },
      {
        equal: [
          { path: ["leftEntity", "ownedById"] },
          {
            parameter: extractOwnedByIdFromEntityId(entityId),
          },
        ],
      },
      {
        equal: [{ path: ["archived"] }, { parameter: false }],
      },
    ],
  };

  if (linkEntityTypeVersionedUrl) {
    filter.all.push({
      equal: [
        { path: ["type", "versionedUrl"] },
        {
          parameter: linkEntityTypeVersionedUrl,
        },
      ],
    });
  }

  if (rightEntityId) {
    filter.all.push(
      {
        equal: [
          { path: ["rightEntity", "uuid"] },
          {
            parameter: extractEntityUuidFromEntityId(rightEntityId),
          },
        ],
      },
      {
        equal: [
          { path: ["rightEntity", "ownedById"] },
          {
            parameter: extractOwnedByIdFromEntityId(rightEntityId),
          },
        ],
      },
    );
  }

  const outgoingLinkEntitiesSubgraph = await getEntities(
    context,
    authentication,
    {
      query: {
        filter,
        graphResolveDepths: zeroedGraphResolveDepths,
        temporalAxes: currentTimeInstantTemporalAxes,
      },
    },
  );

  const outgoingLinkEntities = getRoots(outgoingLinkEntitiesSubgraph).map(
    (linkEntity) => {
      if (!isEntityLinkEntity(linkEntity)) {
        throw new Error(
          `Entity with ID ${linkEntity.metadata.recordId.entityId} is not a link entity.`,
        );
      }
      return linkEntity;
    },
  );

  return outgoingLinkEntities;
};

/**
 * Get subgraph rooted at the entity.
 *
 * @param params.entity - the entity
 * @param params.graphResolveDepths - the custom resolve depths of the subgraph
 */
export const getLatestEntityRootedSubgraph: ImpureGraphFunction<
  { entity: Entity; graphResolveDepths: Partial<GraphResolveDepths> },
  Promise<Subgraph<EntityRootType>>
> = async (context, authentication, params) => {
  const { entity, graphResolveDepths } = params;

  return await getEntities(context, authentication, {
    query: {
      filter: {
        all: [
          {
            equal: [
              { path: ["uuid"] },
              {
                parameter: extractEntityUuidFromEntityId(
                  entity.metadata.recordId.entityId,
                ),
              },
            ],
          },
          {
            equal: [
              { path: ["ownedById"] },
              {
                parameter: extractOwnedByIdFromEntityId(
                  entity.metadata.recordId.entityId,
                ),
              },
            ],
          },
          { equal: [{ path: ["archived"] }, { parameter: false }] },
        ],
      },
      graphResolveDepths: {
        ...zeroedGraphResolveDepths,
        ...graphResolveDepths,
      },
      temporalAxes: currentTimeInstantTemporalAxes,
    },
  });
};

export const addEntityOwner: ImpureGraphFunction<
  { entityId: EntityId; viewer: AccountId | AccountGroupId },
  Promise<void>
> = async ({ graphApi }, { actorId }, params) => {
  await graphApi.addEntityOwner(actorId, params.entityId, params.viewer);
};

export const removeEntityOwner: ImpureGraphFunction<
  { entityId: EntityId; viewer: AccountId | AccountGroupId },
  Promise<void>
> = async ({ graphApi }, { actorId }, params) => {
  await graphApi.removeEntityOwner(actorId, params.entityId, params.viewer);
};

export const addEntityViewer: ImpureGraphFunction<
  { entityId: EntityId; viewer: AccountId | AccountGroupId | "public" },
  Promise<void>
> = async ({ graphApi }, { actorId }, params) => {
  await graphApi.addEntityViewer(actorId, params.entityId, params.viewer);
};

export const removeEntityViewer: ImpureGraphFunction<
  { entityId: EntityId; viewer: AccountId | AccountGroupId | "public" },
  Promise<void>
> = async ({ graphApi }, { actorId }, params) => {
  await graphApi.removeEntityViewer(actorId, params.entityId, params.viewer);
};

export const canViewEntity: ImpureGraphFunction<
  { entityId: EntityId },
  Promise<boolean>
> = async ({ graphApi }, { actorId }, params) =>
  graphApi
    .canViewEntity(actorId, params.entityId)
    .then(({ data }) => data.has_permission);

export const canUpdateEntity: ImpureGraphFunction<
  { entityId: EntityId },
  Promise<boolean>
> = async ({ graphApi }, { actorId }, params) =>
  graphApi
    .canUpdateEntity(actorId, params.entityId)
    .then(({ data }) => data.has_permission);

export const isEntityPublic: ImpureGraphFunction<
  { entityId: EntityId },
  Promise<boolean>
> = async (ctx, _, params) =>
  canViewEntity(ctx, { actorId: publicUserAccountId }, params);
