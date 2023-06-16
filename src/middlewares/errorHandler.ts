import BaseError from "../Classes/Errors/BaseError";

//@ts-ignore
const errorHandler = (err, req, res, next) => {
  console.log(err, err instanceof BaseError);
  if (err instanceof BaseError) {
    console.log("Base Error instance");
    res.status(err.statusCode).send({ errors: err.formatError() });
    return;
  }
  res.status(500).send({ errors: [err] });
};
export default errorHandler;
