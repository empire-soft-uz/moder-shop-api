import { body } from "express-validator";

export const vendorCreation = [
  body("name").notEmpty().withMessage("Vendor name is Required"),
  body("contacts")
    .exists()
    .withMessage("Vendor contacts are Required")
    .custom((c) => {
      if (!c.phoneNumber) throw new Error("Vendor phone number required");
    }),
];
