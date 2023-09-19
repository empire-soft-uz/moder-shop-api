import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../Classes/Errors/UnauthoruzedError";
import ForbidenError from "../Classes/Errors/ForbidenError";
import JWTDecrypter from "../utils/JWTDecrypter";
import Admin from "../Models/Admin";
import IAdmin from "../Interfaces/IAdmin";
const jwtKey = process.env.JWT_ADMIN || "SomeJwT_keY-ADmIn";
export default async function validateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const u = JWTDecrypter.decryptUser<IAdmin>(req, jwtKey);
  const admin = await Admin.findById(u.id);
  if (!admin) throw new ForbidenError("Access denied");
  next();
}
export const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const u = JWTDecrypter.decryptUser<{
    email: string;
    id: string;
  }>(req, jwtKey);

  const admin = await Admin.findOne({ _id: u.id, super: true });
  if (!admin) throw new ForbidenError("Access denied");
  next();
};
