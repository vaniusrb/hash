import { useMutation } from "@apollo/client";
import { useCallback } from "react";

import {
  UpdatePropertyTypeMutation,
  UpdatePropertyTypeMutationVariables,
} from "../../../../graphql/apiTypes.gen";
import { updatePropertyTypeMutation } from "../../../../graphql/queries/ontology/property-type.queries";
import { UpdatePropertyTypeMessageCallback } from "./ontology-types-shim";

export const useBlockProtocolUpdatePropertyType = (
  accountId: string,
  readonly?: boolean,
): {
  updatePropertyType: UpdatePropertyTypeMessageCallback;
} => {
  const [updateFn] = useMutation<
    UpdatePropertyTypeMutation,
    UpdatePropertyTypeMutationVariables
  >(updatePropertyTypeMutation);

  const updatePropertyType: UpdatePropertyTypeMessageCallback = useCallback(
    async ({ data }) => {
      if (readonly) {
        return {
          errors: [
            {
              code: "FORBIDDEN",
              message: "Operation can't be carried out in readonly mode",
            },
          ],
        };
      }

      if (!data) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "'data' must be provided for updatePropertyType",
            },
          ],
        };
      }

      const { propertyTypeVersionedUri, propertyType } = data;
      const { data: responseData } = await updateFn({
        variables: {
          accountId,
          propertyTypeVersionedUri,
          updatedPropertyType: propertyType,
        },
      });

      if (!responseData) {
        return {
          errors: [
            {
              code: "INVALID_INPUT",
              message: "Error calling updatePropertyType",
            },
          ],
        };
      }

      return {
        data: {
          propertyTypeVersionedUri:
            responseData.updatePropertyType.propertyTypeVersionedUri,
          propertyType: responseData.updatePropertyType.propertyType,
        },
      };
    },
    [accountId, updateFn, readonly],
  );

  return {
    updatePropertyType,
  };
};
