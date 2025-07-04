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
exports.adminOrderController = void 0;
const order_service_1 = require("../../services/admin/order-service");
const client_1 = require("../../config/client");
const user_service_1 = require("../../services/admin/user-service");
const adminOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.id);
    const user = req.user;
    try {
        yield client_1.prisma.order.update({
            where: { id: orderId },
            data: { status: "approved" },
        });
        // ⚠️ Lấy lại orders và users trước khi render
        const orders = yield (0, order_service_1.getOrderAdmin)();
        const users = yield (0, user_service_1.getAllUsers)();
        return res.render("admin/layout/order/dashboard.ejs", {
            orders,
            users,
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Lỗi khi duyệt đơn hàng");
    }
});
exports.adminOrderController = adminOrderController;
//# sourceMappingURL=admin-order-product.js.map