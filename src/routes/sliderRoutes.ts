import { Router, Request, Response } from "express";
import "express-async-errors";
import Slider from "../Models/Slider";
import multer from "multer";
import validateAdmin from "../middlewares/validateAdmin";
import { sliderCreation } from "../Validation/SliderRules";
import Validator from "../utils/Valiadtor";
import BadRequestError from "../Classes/Errors/BadRequestError";
import MediaManager from "../utils/MediaManager";
import NotFoundError from "../Classes/Errors/NotFoundError";

const sliderRouter = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 50 * 1048576 } });
sliderRouter.get("/", async (req: Request, res: Response) => {
  const slider = await Slider.find();
  res.send(slider);
});
sliderRouter.post(
  "/new",
  validateAdmin,
  [...sliderCreation],
  upload.single("image"),
  async (req: Request, res: Response) => {
    Validator.validate(req);

    if (!req.file) throw new BadRequestError("Slider Image is Required");
    const slide = Slider.build(req.body);
    slide.image = await MediaManager.uploadFile(req.file);
    await slide.save();
    res.send(slide);
  }
);
sliderRouter.delete(
  "/delete/:id",
  validateAdmin,
  async (req: Request, res: Response) => {
    const slide = await Slider.findByIdAndDelete(req.params.id);
    if (!slide) throw new NotFoundError("Slide Not Found");
    await MediaManager.deletefiles(slide.image);
    res.send(slide);
  }
);
export default sliderRouter;
