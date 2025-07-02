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
exports.createZaloOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const moment_1 = __importDefault(require("moment"));
const zalo_config_1 = require("../../config/zalo-config");
const createZaloOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const transID = Math.floor(Math.random() * 1000000);
    const embed_data = {
        redirecturl: "http://localhost:3000/checkout", // 👈 Đổi thành domain thật nếu deploy
    };
    const items = orderData.products.map((p) => ({
        itemid: p.id,
        itemname: p.name,
        itemprice: p.price,
        itemquantity: p.quantity,
    }));
    const order = {
        app_id: zalo_config_1.zaloPayConfig.app_id, // 👈 dùng đúng key trong config
        app_trans_id: `${(0, moment_1.default)().format("YYMMDD")}_${transID}`,
        app_user: `user_${orderData.userId}`,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: orderData.totalPrice,
        description: `Thanh toán đơn hàng #${transID}`,
        bank_code: "zalopayapp",
    };
    // ✅ Tạo chữ ký (MAC)
    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order["mac"] = crypto_js_1.default.HmacSHA256(data, zalo_config_1.zaloPayConfig.key1).toString();
    // ✅ Gửi yêu cầu tạo đơn hàng đến ZaloPay
    const response = yield axios_1.default.post(zalo_config_1.zaloPayConfig.endpoint, null, {
        params: order,
    });
    console.log("ZaloPay response:", response.data);
    return response.data;
});
exports.createZaloOrder = createZaloOrder;
//# sourceMappingURL=zalo-service.js.map