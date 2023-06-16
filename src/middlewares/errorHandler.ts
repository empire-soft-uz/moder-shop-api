import BaseError from "../Classes/Errors/BaseError";

//@ts-ignore
const errorHandler = (err, req, res, next) => {
  console.log("error handling middleware", err);
  if (err instanceof BaseError) {
    res
      .status(err.statusCode)
      .send({ message: err.message, errors: err.formatError() });
    return;
  }
  res.status(500).send({ message: "Something went wrong", errors: [err] });
};
export default errorHandler;
