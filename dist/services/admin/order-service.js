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
exports.approveOrder = exports.getOrderDetailAdmin = exports.getOrderAdmin = void 0;
const client_1 = require("../../config/client");
const getOrderAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.prisma.order.findMany({
        where: {
            status: { not: "CANCELLED" },
        },
        include: {
            user: true,
        },
    });
});
exports.getOrderAdmin = getOrderAdmin;
const getOrderDetailAdmin = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.prisma.orderDetail.findMany({
        where: { orderId },
        include: {
            product: true,
            order: {
                include: {
                    user: true,
                },
            },
        },
    });
});
exports.getOrderDetailAdmin = getOrderDetailAdmin;
const approveOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.id);
    try {
        yield client_1.prisma.order.update({
            where: { id: orderId },
            data: { status: "approved" },
        });
        res.redirect("/admin/layout/order/dashboard");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi duyệt đơn hàng");
    }
});
exports.approveOrder = approveOrder;
//# sourceMappingURL=order-service.js.map