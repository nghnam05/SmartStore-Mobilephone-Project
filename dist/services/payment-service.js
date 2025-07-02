"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMomoPayment = void 0;
// src/services/payment-service.ts
const https_1 = __importDefault(require("https"));
const crypto_1 = __importDefault(require("crypto"));
const createMomoPayment = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const orderInfo = "Thanh toán đơn hàng tại Dai Viet Mobile";
    const redirectUrl = process.env.MOMO_REDIRECT_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const requestType = "payWithMethod";
    const extraData = "";
    const orderGroupId = "";
    const autoCapture = true;
    const lang = "vi";
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto_1.default
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");
    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "DaiVietMobile",
        storeId: "DaiVietStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        orderGroupId,
        signature,
    });
    const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
        },
    };
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                }
                catch (err) {
                    reject("Parse error: " + err);
                }
            });
        });
        req.on("error", (e) => reject("Request error: " + e.message));
        req.write(requestBody);
        req.end();
    });
});
exports.createMomoPayment = createMomoPayment;
//# sourceMappingURL=payment-service.js.map