import { DBClient } from "../db";
import Entity, { EntityConstructorArgs } from "./entity.model";
import { ApolloError, UserInputError } from "apollo-server-express";
import { RESTRICTED_SHORTNAMES } from "./util";
import User from "./user.model";
import { OrgProperties, UserProperties } from "../graphql/apiTypes.gen";
import Org from "./org.model";

export const ALLOWED_SHORTNAME_CHARS = /^[a-zA-Z0-9-_]+$/;

type CreatorProperties = UserProperties | OrgProperties;

export type CreatorConstructorArgs = {
  properties: CreatorProperties;
} & EntityConstructorArgs;

abstract class Creator extends Entity {
  properties: CreatorProperties;

  constructor(args: CreatorConstructorArgs) {
    super(args);
    this.properties = args.properties;
  }

  private static checkShortnameChars = (shortname: string) => {
    if (shortname.search(ALLOWED_SHORTNAME_CHARS)) {
      throw new UserInputError(
        "Shortname may only contain letters, numbers, - or _"
      );
    }
    if (shortname[0] === "-") {
      throw new UserInputError("Shortname cannot start with '-'");
    }
  };

  static isShortnameReserved = (shortname: string): boolean =>
    RESTRICTED_SHORTNAMES.includes(shortname);

  static isShortnameTaken =
    (client: DBClient) =>
    async (shortname: string): Promise<boolean> => {
      const org = await Org.getOrgByShortname(client)({ shortname });

      const user = await User.getUserByShortname(client)({ shortname });

      return org !== null || user !== null;
    };

  static validateShortname =
    (client: DBClient) => async (shortname: string) => {
      Creator.checkShortnameChars(shortname);

      if (
        Creator.isShortnameReserved(shortname) ||
        (await Creator.isShortnameTaken(client)(shortname))
      ) {
        throw new ApolloError(`Shortname ${shortname} taken`, "NAME_TAKEN");
      }

      /** @todo: enable admins to have a shortname under 4 characters */
      if (shortname.length < 4) {
        throw new UserInputError(
          "Shortname must be at least 4 characters long."
        );
      }
      if (shortname.length > 24) {
        throw new UserInputError(
          "Shortname cannot be longer than 24 characters"
        );
      }
    };

  /**
   * Must occur in the same db transaction as when `this.properties` was fetched
   * to prevent overriding externally-updated properties
   */
  updateShortname = (db: DBClient) => async (updatedShortname: string) =>
    this.updateProperties(db)({
      ...this.properties,
      shortname: updatedShortname,
    });
}

export default Creator;
