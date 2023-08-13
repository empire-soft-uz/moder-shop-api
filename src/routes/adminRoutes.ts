import express, { Request, Response } from "express";
import "express-async-errors";
import Admin from "../Models/Admin";
import Password from "../utils/Password";
import jwt from "jsonwebtoken";
import { adminCreation } from "../Validation/AdminRules";
import validateAdmin, { isSuperAdmin } from "../middlewares/validateAdmin";
import Validator from "../utils/Valiadtor";
import BadRequestError from "../Classes/Errors/BadRequestError";
import ForbidenError from "../Classes/Errors/ForbidenError";
import NotFoundError from "../Classes/Errors/NotFoundError";
const adminRoute = express.Router();
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
interface adminPayload {
  id: string;
  email: string;
}
adminRoute.get("/", isSuperAdmin, async (req: Request, res: Response) => {
  const admins = await Admin.find({}, { password: 0 }).populate({
    path: "vendorId",
    select: "id name contacts",
  });
  res.send(admins);
});
adminRoute.post(
  "/edit/:id",
  isSuperAdmin,
  [...adminCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);

    const hash = await Password.hashPassword(req.body.password);

    const admin = await Admin.findByIdAndUpdate(req.params.id, {
      ...req.body,
      password: `${hash.buff}.${hash.salt}`,
    });
    if (!admin) throw new NotFoundError("Admin Not Found");
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      jwtKey
    );
    res.send({ id: admin.id, email: admin.email, token });
  }
);
adminRoute.post(
  "/new",
  isSuperAdmin,
  [...adminCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const authHeader = req.headers.authorization;
    //@ts-ignore
    const author = jwt.verify(authHeader, jwtKey) as adminPayload;
    const superAdmin = await Admin.findById(author.id);
    if (!superAdmin) throw new BadRequestError("Invalid Crtedentials");
    if (!superAdmin.super) throw new ForbidenError("Access Denied");
    const admin = Admin.build(req.body);
    const hash = await Password.hashPassword(req.body.password);
    admin.password = `${hash.buff}.${hash.salt}`;
    await admin.save();
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      jwtKey
    );
    res.send({ id: admin.id, email: admin.email, token });
  }
);
adminRoute.post(
  "/login",
  [...adminCreation],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    const isValidPass =
      admin &&
      (await Password.compare(password, {
        buff: admin.password.split(".")[0],
        salt: admin.password.split(".")[1],
      }));
    if (!admin || !isValidPass)
      throw new BadRequestError("Invalid Credentials");
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
      },
      jwtKey
    );

    res.send({ id: admin.id, email: admin.email, token });
  }
);
export default adminRoute;
