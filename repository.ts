import { Algorithm, create, getNumericDate } from "./deps.ts";
import { AuthRepository, Configuration } from "./types.ts";

export type RepositoryDependencies = { configuration: Configuration };

const defaultConfiguration: Configuration = {
  algorithm: "HS512" as Algorithm,
  key: "SET-YOUR-KEY",
  tokenExpirationInSeconds: 120,
};

/**
 * Generates, gets and stores (in-memory) jwt tokens for a userId
 */
export class Repository implements AuthRepository {
  private storage = new Map<string, string>();
  private configuration: Configuration;

  /**
   * @param dependencies object with Repository dependencies
   */
  constructor(
    dependencies: RepositoryDependencies = {
      configuration: defaultConfiguration,
    },
  ) {
    if (dependencies.configuration.key === defaultConfiguration.key) {
      throw new Error("You need to set the jwt key");
    }

    this.configuration = dependencies.configuration;
  }

  /**
   * Retrieves the stored token for the provided userId
   *
   * @param userId the userId to retrieve the token for
   */
  async getToken(userId: string) {
    const token = this.storage.get(userId);

    if (!token) {
      return Promise.reject("Could not get token for that userId");
    }

    return token;
  }

  /**
   * Generates and persists the token for the provided userId
   *
   * @param userId the userId to generate the token for
   */
  async generateToken(userId: string) {
    const payload = {
      iss: "museums",
      exp: getNumericDate(this.configuration.tokenExpirationInSeconds),
      user: userId,
    };
    const token = await create(
      { alg: this.configuration.algorithm, typ: "JWT" },
      payload,
      this.configuration.key,
    );

    return token;
  }
}
