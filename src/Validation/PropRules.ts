import { body } from "express-validator";

export const propCreation = [
  body("name").notEmpty().withMessage("Property name is required"),
  body("label").notEmpty().withMessage("Provide property displaying field"),
  // body("values").custom((input) => {
  //   if (input.length < 0) throw new Error("Please provide value for Property");
  // }),
];
