import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";

const destination = path.resolve("temp");
const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const name = `${Date.now()}_${nanoid()}`;
    const extension = file.originalname.split(".").pop();
    const filename = `${name}.${extension}`;
    callback(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split(".").pop();
  if (extension === "exe") {
    return callback(HttpError(400, ".exe extension not allow"));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
