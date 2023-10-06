import { body } from "express-validator";

export const createReview = [
  body("review").notEmpty().withMessage("Review text is required"),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ max: 5, min: 1 })
    .withMessage("Rating must be Number in range 1 to 5"),
];
