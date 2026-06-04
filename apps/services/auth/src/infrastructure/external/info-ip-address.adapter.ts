import type {
  InfoIpAddressPort,
  InfoIpAddressPortOutput,
} from "../../application/ports/info-ip-address.port";

export interface IpLookupSuccessResponse {
  query: string;
  status: "success";
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export interface IpLookupFailResponse {
  query: string;
  status: "fail";
  message: string; // O IP-API retorna a razão da falha aqui (ex: "invalid query")
}

export class InfoIpAddressAdapter implements InfoIpAddressPort {
  public async get(payload: string): Promise<InfoIpAddressPortOutput | Error> {
    const response = await fetch(`http://ip-api.com/json/${payload}`);

    try {
      const data = (await response.json()) as
        | IpLookupSuccessResponse
        | IpLookupFailResponse;

      if (data.status == "fail") {
        throw new Error("Error ocurrated on get InfoIpAddress");
      }

      return {
        city: data.city,
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        return err;
      }
      return new Error("Error ocurrated on get InfoIpAddress");
    }
  }
}
