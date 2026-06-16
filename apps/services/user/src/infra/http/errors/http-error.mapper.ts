import { HttpStatus } from "@nestjs/common";

import { UserAlreadyExistsError } from "../../../errors/application/user/user-already-exists.error";
import { ValueObjectError } from "../../../errors/domain/value-object-error";
import { AccountDisabledError } from "../../../errors/application/user/user-account-disabled-error";
import { InvalidCredentialsException } from "../../../errors/application/user/invalid-credentials-exception.error";

type ErrorConstructor = abstract new (...args: never[]) => Error;

type HttpErrorMapping = readonly [ErrorConstructor, HttpStatus];

const httpErrorMappings: HttpErrorMapping[] = [
  [UserAlreadyExistsError, HttpStatus.CONFLICT],
  [ValueObjectError, HttpStatus.BAD_REQUEST],
  [AccountDisabledError, HttpStatus.FORBIDDEN],
  [InvalidCredentialsException, HttpStatus.UNAUTHORIZED],
];

export type MappedHttpError = {
  statusCode: HttpStatus;
  name: string;
  code: string;
  message: string;
};

type ContractError = Error & {
  code: string;
};

export function isContractError(error: unknown): error is ContractError {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export function mapExceptionToHttp(error: unknown): MappedHttpError | null {
  if (!isContractError(error)) {
    return null;
  }

  const mapping = httpErrorMappings.find(([ErrorClass]) => {
    return error instanceof ErrorClass;
  });

  if (!mapping) {
    return null;
  }

  const [, statusCode] = mapping;

  return {
    statusCode,
    name: error.name,
    code: error.code,
    message: error.message,
  };
}
