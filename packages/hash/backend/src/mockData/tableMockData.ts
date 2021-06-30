import { Visibility } from "../graphql/autoGeneratedTypes";
import { DbUnknownEntity } from "../types/dbTypes";
import { randomTimes } from "./util";

const london: DbUnknownEntity = {
  id: "place1",
  type: "Location",
  properties: {
    country: "UK",
    name: "London",
  },
  namespaceId: "2",
  createdById: "2",
  visibility: Visibility.Public,
  ...randomTimes(),
};

const HASH: DbUnknownEntity = {
  properties: {
    name: "HASH",
    url: "https://hash.ai",
  },
  id: "c1",
  type: "Company",
  namespaceId: "2",
  createdById: "2",
  visibility: Visibility.Public,
  ...randomTimes(),
};

const people: DbUnknownEntity[] = [
  {
    id: "p1",
    type: "Person",
    properties: {
      email: "aj@hash.ai",
      name: "Akash Joshi",
      employer: {
        __linkedData: {
          entityType: "Company",
          entityId: "c1",
        },
      },
    },
    namespaceId: "2",
    createdById: "2",
    visibility: Visibility.Public,
    ...randomTimes(),
  },
  {
    properties: {
      email: "c@hash.ai",
      name: "Ciaran Morinan",
      employer: {
        __linkedData: {
          entityType: "Company",
          entityId: "c1",
        },
      },
    },
    id: "p2",
    type: "Person",
    namespaceId: "2",
    createdById: "2",
    visibility: Visibility.Public,
    ...randomTimes(),
  },
  {
    properties: {
      email: "d@hash.ai",
      name: "David Wilkinson",
      employer: {
        __linkedData: {
          entityType: "Company",
          entityId: "c1",
        },
      },
    },
    namespaceId: "2",
    createdById: "2",
    visibility: Visibility.Public,
    ...randomTimes(),
    id: "p3",
    type: "Person",
  },
  {
    properties: {
      email: "ef@hash.ai",
      name: "Eadan Fahey",
      employer: {
        __linkedData: {
          entityType: "Company",
          entityId: "c1",
        },
      },
    },
    id: "p4",
    type: "Person",
    namespaceId: "2",
    createdById: "2",
    visibility: Visibility.Public,
    ...randomTimes(),
  },
  {
    properties: {
      email: "nh@hash.ai",
      name: "Nate Higgins",
      employer: {
        __linkedData: {
          entityType: "Company",
          entityId: "c1",
        },
      },
    },
    id: "p5",
    type: "Person",
    namespaceId: "2",
    createdById: "2",
    visibility: Visibility.Public,
    ...randomTimes(),
  },
];

const tableData: DbUnknownEntity = {
  id: "t1",
  type: "Table",
  namespaceId: "2",
  createdById: "2",
  visibility: Visibility.Public,
  ...randomTimes(),
  properties: {
    initialState: {
      hiddenColumns: [
        "id",
        "__typename",
        "createdById",
        "namespaceId",
        "createdAt",
        "updatedAt",
        "visibility",
        "properties.employer.__typename",
        "properties.employer.createdAt",
        "properties.employer.createdById",
        "properties.employer.id",
        "properties.employer.namespaceId",
        "properties.employer.type",
        "properties.employer.updatedAt",
        "properties.employer.visibility",
        "properties.employer.properties.location.__typename",
        "properties.employer.properties.location.createdAt",
        "properties.employer.properties.location.createdById",
        "properties.employer.properties.location.id",
        "properties.employer.properties.location.namespaceId",
        "properties.employer.properties.location.type",
        "properties.employer.properties.location.updatedAt",
        "properties.employer.properties.location.visibility"
      ],
    },
    data: {
      __linkedData: {
        entityType: "Person",
        aggregate: {
          perPage: 5,
          sort: {
            field: "createdAt",
          },
        },
      },
    },
  },
};

export const tableMockData = [...people, HASH, london, tableData];
