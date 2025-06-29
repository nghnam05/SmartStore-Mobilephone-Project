"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fileUploadMiddleware = (fieldName, dir = "images") => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: "public/" + dir,
            filename: (req, file, cb) => {
                const extension = path_1.default.extname(file.originalname);
                cb(null, (0, uuid_1.v4)() + extension);
            },
        }),
        // vadiate file la anh 
        limits: {
            fileSize: 1024 * 1024 * 3,
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            }
            else {
                cb(new Error("Only JPEG and PNG images are allowed."), false);
            }
        },
    }).single(fieldName);
};
exports.default = fileUploadMiddleware;
//# sourceMappingURL=multer.js.map