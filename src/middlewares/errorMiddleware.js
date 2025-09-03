// import mongoose from "mongoose";

// import { ApiError } from "../utils/apiError.js";

// const errorHandler = (err, req, res, next) => {
//   let error = err;

//   if (!(err instanceof ApiError)) {
//     const statusCode =
//       err.statusCode || error instanceof mongoose.Error ? 400 : 500;

//     const message = err.message || "Something went wrong";
//     error = new ApiError(statusCode, message, error?.errors || [], err.stack);
//   }

//   const response = {
//     ...error,
//     message: error.message,
//     ...ApiError(
//       process.env.NODE_ENV === "development" ? { stack: error.stack } : {}
//     ),
//   };

//   return res.status(response.statusCode).json(response);
// };

// export { errorHandler };

import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode =
      err.statusCode || (error instanceof mongoose.Error ? 400 : 500);

    const message = err.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
