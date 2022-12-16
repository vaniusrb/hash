import { useEffect, useMemo, useState } from "react";
import { Container, Typography } from "@mui/material";
import { ValueOrArray, Array } from "@blockprotocol/type-system";
import { Button } from "@hashintel/hash-design-system";
import { types } from "@hashintel/hash-shared/ontology-types";
import { Entity, Subgraph, SubgraphRootTypes } from "@hashintel/hash-subgraph";
import { getRoots } from "@hashintel/hash-subgraph/src/stdlib/roots";
import { getEntityTypeById } from "@hashintel/hash-subgraph/src/stdlib/element/entity-type";
import { getPropertyTypeById } from "@hashintel/hash-subgraph/src/stdlib/element/property-type";
import { brand, OwnedById } from "@hashintel/hash-shared/types";

import { NextPageWithLayout } from "../shared/layout";
import { useBlockProtocolFunctionsWithOntology } from "./type-editor/blockprotocol-ontology-functions-hook";
import { useAdvancedInitTypeSystem } from "../lib/use-init-type-system";
import { useAuthenticatedUser } from "./shared/auth-info-context";

/**
 * Helper type-guard for determining if a `ValueOrArray` definition is an array or a value.
 */
const isArrayDefinition = <T,>(input: ValueOrArray<T>): input is Array<T> =>
  input &&
  typeof input === "object" &&
  "type" in input &&
  input.type === "array";

/**
 * This component is an example usage of the `getEntity` BP function.
 * This is meant to be removed as soon as it's unneeded.
 */
const ExampleUsage = ({ ownedById }: { ownedById: OwnedById }) => {
  const { authenticatedUser } = useAuthenticatedUser();
  const [userSubgraph, setUserSubgraph] =
    useState<Subgraph<SubgraphRootTypes["entity"]>>();
  const [aggregateEntitiesSubgraph, setAggregateEntitiesSubgraph] =
    useState<Subgraph<SubgraphRootTypes["entity"]>>();

  const [createdEntity, setCreatedEntity] = useState<Entity>();

  const { getEntity, createEntity, archiveEntity, aggregateEntities } =
    useBlockProtocolFunctionsWithOntology(ownedById);

  useEffect(() => {
    // As an example entity, we are going to use the currently logged in user's entity ID
    const entityId = authenticatedUser.entityEditionId.baseId;

    void getEntity({ data: { entityId } }).then(({ data }) => {
      setUserSubgraph(data);
    });
  }, [authenticatedUser, getEntity]);

  useEffect(() => {
    if (!aggregateEntitiesSubgraph) {
      void aggregateEntities({ data: {} }).then(({ data }) => {
        setAggregateEntitiesSubgraph(data);
      });
    }
  }, [
    aggregateEntities,
    aggregateEntitiesSubgraph,
    setAggregateEntitiesSubgraph,
  ]);

  const entity = userSubgraph ? getRoots(userSubgraph)[0] : undefined;

  const entityType =
    userSubgraph && entity
      ? getEntityTypeById(userSubgraph, entity.metadata.entityTypeId)?.schema
      : undefined;

  // The (top-level) property type IDs defined in the entity type
  const propertyTypeIds = useMemo(
    () =>
      entityType
        ? Object.values(entityType.properties).map((value) =>
            isArrayDefinition(value) ? value.items.$ref : value.$ref,
          )
        : undefined,
    [entityType],
  );

  // The (top-level) property type definitions, referenced in the entity type
  const propertyTypeDefinitions = useMemo(
    () =>
      userSubgraph && propertyTypeIds
        ? propertyTypeIds.map(
            (propertyTypeId) =>
              getPropertyTypeById(userSubgraph, propertyTypeId)?.schema,
          )
        : undefined,
    [userSubgraph, propertyTypeIds],
  );

  const allEntities = useMemo(
    () =>
      aggregateEntitiesSubgraph
        ? getRoots(aggregateEntitiesSubgraph)
        : undefined,
    [aggregateEntitiesSubgraph],
  );

  const handleCreateEntity = async () => {
    await createEntity({
      data: {
        entityTypeId: types.entityType.dummy.entityTypeId,
        properties: {},
      },
    }).then(({ data }) => setCreatedEntity(data));
  };

  const handleArchiveCreatedEntity = async () => {
    if (!createdEntity) {
      return;
    }
    await archiveEntity({
      data: { entityId: createdEntity.metadata.editionId.baseId },
    }).then(() => setCreatedEntity(undefined));
  };

  return (
    <Container>
      <Typography>Entity</Typography>
      <Button onClick={handleCreateEntity}>Create Entity</Button>
      {createdEntity ? (
        <>
          <p>Created entity:</p>
          <pre style={{ overflowX: "scroll" }}>
            {JSON.stringify(createdEntity, null, 2)}
          </pre>
          <Button onClick={handleArchiveCreatedEntity}>
            Archive The Created Entity
          </Button>
        </>
      ) : null}
      <pre style={{ overflowX: "scroll" }}>
        {JSON.stringify(entity ?? {}, null, 2)}
      </pre>
      <Typography>Entity type</Typography>
      <pre style={{ overflowX: "scroll" }}>
        {JSON.stringify(entityType ?? {}, null, 2)}
      </pre>
      <Typography>Top-level property type definitions</Typography>
      <pre style={{ overflowX: "scroll" }}>
        {JSON.stringify(propertyTypeDefinitions ?? {}, null, 2)}
      </pre>
      <Typography>Aggregate Entities</Typography>
      <pre style={{ overflowX: "scroll" }}>
        {JSON.stringify(allEntities ?? {}, null, 2)}
      </pre>
    </Container>
  );
};

const ExampleEntityEditorPage: NextPageWithLayout = () => {
  const { authenticatedUser } = useAuthenticatedUser();
  const [loadingTypeSystem, _setLoadingTypeSystem] =
    useAdvancedInitTypeSystem();

  return loadingTypeSystem ? (
    <Container sx={{ pt: 10 }}>Loading...</Container>
  ) : (
    <Container sx={{ pt: 10 }}>
      <ExampleUsage ownedById={brand(authenticatedUser.accountId)} />
    </Container>
  );
};

export default ExampleEntityEditorPage;
