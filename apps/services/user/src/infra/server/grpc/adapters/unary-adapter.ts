import type * as grpc from "@grpc/grpc-js";
import { GrpcErrorMapper } from "../../../mappers/grpcErrorMapper";

export function grpcUnaryAdapter<Req, Res>(
  applicationHandler: (input: Req) => Promise<Res>,
): grpc.handleUnaryCall<Req, Res> {
  return (call, callback) => void handler(call, callback, applicationHandler);
}

async function handler<Req, Res>(
  call: grpc.ServerUnaryCall<Req, Res>,

  callback: grpc.sendUnaryData<Res>,

  applicationHandler: (input: Req) => Promise<Res>,
) {
  try {
    const result = await applicationHandler(call.request);

    callback(null, result);
  } catch (err) {
    const error =
      err instanceof Error
        ? GrpcErrorMapper.toGrpcError(err)
        : GrpcErrorMapper.unknownError();

    callback(error, null);
  }
}
