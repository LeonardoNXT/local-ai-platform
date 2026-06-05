export type InfoIpAddressPortOutput = {
  country: string;
  countryCode: string;
  region: string;
  city: string;
};

export abstract class InfoIpAddressPort {
  public abstract get(
    payload: string,
  ): Promise<InfoIpAddressPortOutput | Error>;
}
