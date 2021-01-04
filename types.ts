export type Configuration = {
  key: string;
  algorithm: string;
  tokenExpirationInSeconds: number;
};

export interface AuthRepository {
  getToken: (username: string) => Promise<string>;
  generateToken: (username: string) => Promise<string>;
}
