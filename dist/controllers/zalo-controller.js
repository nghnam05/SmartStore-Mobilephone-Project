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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderZalo = void 0;
const auth_service_1 = require("../services/client/auth-service");
const zalo_service_1 = require("../services/payment/zalo-service");
const createOrderZalo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("✅ Đã nhận request từ form ZaloPay!");
    const orderId = Number(req.body.orderId);
    if (!orderId) {
        res.status(400).send("Thiếu orderId");
        return;
    }
    try {
        const order = yield (0, auth_service_1.getOrderById)(orderId);
        // Gửi dữ liệu đơn hàng sang ZaloPay
        const zaloRes = yield (0, zalo_service_1.createZaloOrder)({
            totalPrice: order.totalPrice,
            userId: order.userId,
            products: order.products,
        });
        if (zaloRes === null || zaloRes === void 0 ? void 0 : zaloRes.order_url) {
            res.redirect(zaloRes.order_url);
        }
        else {
            res.status(500).send("Không lấy được URL thanh toán ZaloPay");
        }
    }
    catch (error) {
        console.error("ZaloPay error", error);
        res.status(500).send("Lỗi khi tạo đơn hàng ZaloPay");
    }
});
exports.createOrderZalo = createOrderZalo;
//# sourceMappingURL=zalo-controller.js.map