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
exports.getAdminUserPage = exports.getDashboard = void 0;
const client_1 = require("../../config/client");
const getDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        // Đếm tổng đơn hàng đã bán (status approved)
        const totalOrders = yield client_1.prisma.order.count({
            where: { status: "approved" },
        });
        // Tính tổng tiền từ tất cả đơn đã duyệt
        const totalRevenueResult = yield client_1.prisma.order.aggregate({
            where: { status: "approved" },
            _sum: { totalPrice: true }, // Giả sử có trường totalPrice trong order
        });
        const totalRevenue = totalRevenueResult._sum.totalPrice || 0;
        return res.render("admin/layout/dashboard/dashboard.ejs", {
            totalOrders,
            totalRevenue,
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Lỗi thống kê");
    }
});
exports.getDashboard = getDashboard;
const getAdminUserPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const user = req.user;
    const [users, total] = yield Promise.all([
        client_1.prisma.user.findMany({
            skip: offset,
            take: limit,
            orderBy: { id: "asc" },
        }),
        client_1.prisma.user.count(),
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.render("admin/layout/user/dashboard.ejs", {
        users,
        user,
        page,
        limit,
        totalPages,
    });
});
exports.getAdminUserPage = getAdminUserPage;
//# sourceMappingURL=dashboard-controller.js.map