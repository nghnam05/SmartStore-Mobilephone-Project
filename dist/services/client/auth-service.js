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
exports.getOrderById = exports.getSupportPage = exports.getReturnPage = exports.getSecurityPaymentPage = exports.getShippingPage = exports.getRoleUserByID = exports.handleLogin = exports.registerNewUSer = void 0;
const user_service_1 = require("../../services/admin/user-service");
const client_1 = require("../../config/client");
const constant_1 = require("../../config/constant");
const registerNewUSer = (fullname, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const newPassword = yield (0, user_service_1.hashPasswords)(password);
    const existingUser = yield client_1.prisma.user.findUnique({
        where: {
            username: email,
        },
    });
    if (existingUser) {
        throw new Error("Email đã tồn tại trong hệ thống!");
    }
    const userRole = yield client_1.prisma.role.findUnique({
        where: { name: "USER" },
    });
    if (!userRole) {
        throw new Error("Role USER không tồn tại.");
    }
    yield client_1.prisma.user.create({
        data: {
            username: email,
            password: newPassword,
            fullname,
            accountType: constant_1.ACCOUNT_TYPE.SYSTEM,
            roleID: userRole.id,
        },
    });
});
exports.registerNewUSer = registerNewUSer;
const getRoleUserByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                fullname: true,
                address: true,
                phone: true,
                avatar: true,
                accountType: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
            },
        });
        if (!user) {
            throw new Error("User không tồn tại");
        }
        return user;
    }
    catch (error) {
        console.error("❌ Lỗi getRoleUserByID:", error);
        throw error;
    }
});
exports.getRoleUserByID = getRoleUserByID;
const handleLogin = (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.prisma.user.findUnique({
            where: { username },
        });
        if (!user) {
            console.log("❌ User not found");
            return done(null, false, { message: "Incorrect email or password." });
        }
        const isMatch = yield (0, user_service_1.comparePassword)(password, user.password);
        if (!isMatch) {
            console.log("❌ Password mismatch");
            return done(null, false, { message: "Incorrect email or password." });
        }
        console.log("✅ User authenticated:", user.username);
        return done(null, user);
    }
    catch (err) {
        console.error("🚨 Error in handleLogin:", err);
        return done(err);
    }
});
exports.handleLogin = handleLogin;
const getShippingPage = (req, res) => {
    return res.render("client/support/freeShip.ejs");
};
exports.getShippingPage = getShippingPage;
const getSecurityPaymentPage = (req, res) => {
    return res.render("client/support/security.ejs");
};
exports.getSecurityPaymentPage = getSecurityPaymentPage;
const getReturnPage = (req, res) => {
    return res.render("client/support/return.ejs");
};
exports.getReturnPage = getReturnPage;
const getSupportPage = (req, res) => {
    return res.render("client/support/supporting.ejs");
};
exports.getSupportPage = getSupportPage;
const getOrderById = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield client_1.prisma.order.findUnique({
        where: { id: orderId },
        include: {
            orderDetails: {
                include: {
                    product: true,
                },
            },
        },
    });
    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }
    return {
        totalPrice: order.totalPrice,
        userId: order.userId,
        products: order.orderDetails.map((od) => ({
            id: od.product.id,
            name: od.product.name,
            quantity: od.quantity,
            price: od.product.price,
        })),
    };
});
exports.getOrderById = getOrderById;
//# sourceMappingURL=auth-service.js.map