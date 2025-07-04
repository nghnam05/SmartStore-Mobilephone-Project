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
exports.getSupportPage = exports.getReturnPage = exports.getSecurityPaymentPage = exports.getShippingPage = exports.getRoleUserByID = exports.handleLogin = exports.registerNewUSer = void 0;
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
        const user = yield client_1.prisma.user.findUnique({ where: { username } });
        if (!user) {
            // console.log("⚠️ Đăng nhập thất bại: Không tìm thấy người dùng");
            return done(null, false, {
                message: "Tên đăng nhập hoặc mật khẩu không đúng.",
            });
        }
        const isMatch = yield (0, user_service_1.comparePassword)(password, user.password);
        if (!isMatch) {
            // console.log("⚠️ Đăng nhập thất bại: Mật khẩu không khớp");
            return done(null, false, {
                message: "Tên đăng nhập hoặc mật khẩu không đúng.",
            });
        }
        return done(null, user);
    }
    catch (error) {
        console.error(error);
        return done(error);
    }
});
exports.handleLogin = handleLogin;
const getShippingPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    return res.render("client/support/freeShip.ejs", { sumCart, user });
});
exports.getShippingPage = getShippingPage;
const getSecurityPaymentPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    return res.render("client/support/security.ejs", { sumCart, user });
});
exports.getSecurityPaymentPage = getSecurityPaymentPage;
const getReturnPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    return res.render("client/support/return.ejs", { sumCart, user });
});
exports.getReturnPage = getReturnPage;
const getSupportPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    return res.render("client/support/supporting.ejs", { sumCart, user });
});
exports.getSupportPage = getSupportPage;
//# sourceMappingURL=auth-service.js.map