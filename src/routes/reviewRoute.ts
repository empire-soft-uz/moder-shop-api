import { Router, Request, Response } from "express";
import "express-async-errors";
import jwt from "jsonwebtoken";
import validateUser from "../middlewares/validateUser";
import UserPayload from "../Interfaces/IUserPayload";
import Review from "../Models/Review";
import Product from "../Models/Product";
import NotFoundError from "../Classes/Errors/NotFoundError";
import { createReview } from "../Validation/ReviewRules";
import Validator from "../utils/Valiadtor";
import ForbidenError from "../Classes/Errors/ForbidenError";
const reviewRouter = Router();
const jwtKey = process.env.JWT || "someKEy";

reviewRouter.post(
  "/new/:postId",
  validateUser,
  [...createReview],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const product = await Product.findById(req.params.postId);
    if (!product) throw new NotFoundError("Product Not Found");
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jwt.verify(authHeader, jwtKey) as IUserPayload;
    const review = Review.build({
      ...req.body,
      authorId: author.id,
      createdDate: new Date(),
    });
    await review.save();
    product.reviews.push(review.id);
    await product.save();
    res.send(review);
  }
);
reviewRouter.put(
  "/edit/:reviewId",
  validateUser,
  [...createReview],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const review = await Review.findById(req.params.reviewId);
    if (!review) throw new NotFoundError("Review Not Found");
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jwt.verify(authHeader, jwtKey) as IUserPayload;

    //@ts-ignore
    if (!review.authorId.equals(author.id))
      throw new ForbidenError("You don't Own this Review!");
    review.rating = req.body.rating;
    review.review = req.body.review;
    await review.save();
    res.send(review);
  }
);
export default reviewRouter;
