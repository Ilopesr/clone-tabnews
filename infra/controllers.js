import {
  InternalServerError,
  MethodNotAllowedError,
  ServiceError,
} from "@/infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.status_code).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ServiceError) {
    return response.status(error.statusCode).json(error);
  }

  if (error instanceof InternalServerError) {
    return response.status(error.statusCode).json(error);
  }
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
