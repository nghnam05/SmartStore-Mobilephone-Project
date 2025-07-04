"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.momoConfig = void 0;
exports.createMomoSignature = createMomoSignature;
const crypto_1 = __importDefault(require("crypto"));
function createMomoSignature(secretKey, rawData) {
    return crypto_1.default.createHmac("sha256", secretKey).update(rawData).digest("hex");
}
exports.momoConfig = {
    partnerCode: "MOMO",
    accessKey: "F8BBA842ECF85",
    secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
    redirectUrl: "https://428d-171-224-240-187.ngrok-free.app/thanks",
    ipnUrl: "https://428d-171-224-240-187.ngrok-free.app/payment/ipn",
};
//# sourceMappingURL=momo.config.js.map