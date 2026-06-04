export abstract class AuthConfigPort {
  public abstract get refreshTokenExpireAtSeconds(): number;
  public abstract get accessTokenExpireAtSeconds(): number;
  public abstract get refreshTokenFamilyExpireAtSeconds(): number;
}
