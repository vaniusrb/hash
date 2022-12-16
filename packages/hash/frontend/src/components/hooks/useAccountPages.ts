import { useQuery } from "@apollo/client";
import { EntityId } from "@hashintel/hash-subgraph";
import { useMemo } from "react";
import { OwnedById } from "@hashintel/hash-shared/types";

import {
  GetAccountPagesTreeQuery,
  GetAccountPagesTreeQueryVariables,
} from "../../graphql/apiTypes.gen";
import { getAccountPagesTree } from "../../graphql/queries/account.queries";
import { useWorkspaceShortnameByAccountId } from "./use-workspace-shortname-by-account-id";

export type AccountPage = {
  title: string;
  entityId: EntityId;
  ownerShortname: string;
  parentPageEntityId?: EntityId | null;
  index: string;
};

export type AccountPagesInfo = {
  data: AccountPage[];
  loading: boolean;
};

export const useAccountPages = (ownedById: OwnedById): AccountPagesInfo => {
  const { data, loading } = useQuery<
    GetAccountPagesTreeQuery,
    GetAccountPagesTreeQueryVariables
  >(getAccountPagesTree, {
    variables: { ownedById },
  });

  const { shortname: ownerShortname } = useWorkspaceShortnameByAccountId({
    accountId: ownedById,
  });

  const accountPages = useMemo(() => {
    if (!data || !ownerShortname) {
      return [];
    }

    return data?.pages.map(
      ({
        metadata: {
          editionId: { baseId: pageEntityId },
        },
        parentPage,
        title,
        index,
      }): AccountPage => {
        const parentPageEntityId =
          parentPage?.metadata.editionId.baseId ?? null;

        return {
          entityId: pageEntityId,
          parentPageEntityId,
          title,
          ownerShortname,
          index: index ?? "",
        };
      },
    );
  }, [data, ownerShortname]);

  return { data: accountPages, loading };
};
