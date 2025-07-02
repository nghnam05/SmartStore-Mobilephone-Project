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
exports.createMomoPaymentController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const https_1 = __importDefault(require("https"));
const createMomoPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔥 Momo route hit");
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "pay with MoMo";
    const partnerCode = "MOMO";
    const redirectUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
    const requestType = "payWithMethod";
    const amount = "50000";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = "";
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto_1.default
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");
    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang: "vi",
        requestType,
        autoCapture: true,
        extraData,
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
    const momoRequest = https_1.default.request(options, (momoRes) => {
        let data = "";
        momoRes.on("data", (chunk) => (data += chunk));
        momoRes.on("end", () => {
            const result = JSON.parse(data);
            return res.json(result); // ✅ Trả về response của Momo
        });
    });
    momoRequest.on("error", (e) => {
        console.error(`❌ Momo request error: ${e.message}`);
        return res.status(500).json({ error: "Momo request failed" });
    });
    momoRequest.write(requestBody);
    momoRequest.end();
});
exports.createMomoPaymentController = createMomoPaymentController;
//# sourceMappingURL=payment-controller.js.map