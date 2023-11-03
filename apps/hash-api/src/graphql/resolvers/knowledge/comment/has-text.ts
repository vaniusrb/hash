import { TextToken } from "@local/hash-graphql-shared/graphql/types";

import { getCommentText } from "../../../../graph/knowledge/system-types/comment";
import { ResolverFn } from "../../../api-types.gen";
import { LoggedInGraphQLContext } from "../../../context";
import { dataSourcesToImpureGraphContext } from "../../util";
import { UnresolvedCommentGQL } from "../graphql-mapping";

export const commentHasTextResolver: ResolverFn<
  TextToken[],
  UnresolvedCommentGQL,
  LoggedInGraphQLContext,
  {}
> = async ({ metadata }, _, { dataSources, authentication }) => {
  const context = dataSourcesToImpureGraphContext(dataSources);

  const text = await getCommentText(context, authentication, {
    commentEntityId: metadata.recordId.entityId,
  });

  return text.textualContent;
};
