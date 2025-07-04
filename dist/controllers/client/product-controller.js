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
exports.getChangePasswordPage = exports.postChangePassword = exports.postUpdateProfile = exports.getEditProfilePage = exports.postCancelOrder = exports.postDeleteProductInCart = exports.postPlaceOrder = exports.getOrderHistory = exports.getThankyouPage = exports.getCheckOutPage = exports.getCartPage = exports.getAllProductPage = exports.getProductsPage = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../../config/client");
const product_service_1 = require("../../services/client/product-service");
// ========== Trang sản phẩm ==========
const getProductsPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render("client/layout/product/detail.ejs");
});
exports.getProductsPage = getProductsPage;
const getAllProductPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    const { factory, price, storage: memory, sort } = req.query;
    const where = {};
    if (factory) {
        where.factory = Array.isArray(factory) ? { in: factory } : factory;
    }
    if (memory) {
        const memories = Array.isArray(memory) ? memory : [memory];
        where.memory = { in: memories };
    }
    if (price && price !== "all") {
        const [min, max] = price.split("-").map(Number);
        where.price = { gte: min, lte: max };
    }
    let orderBy = { id: "asc" };
    if (sort === "asc")
        orderBy = { price: "asc" };
    else if (sort === "desc")
        orderBy = { price: "desc" };
    const [products, total] = yield Promise.all([
        client_1.prisma.product.findMany({ where, skip: offset, take: limit, orderBy }),
        client_1.prisma.product.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart = (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((t, item) => t + item.quantity, 0)) || 0;
    }
    const hasFilter = !!(factory || price || sort);
    return res.render("client/product/all-product.ejs", {
        products,
        page,
        limit,
        totalPages,
        sumCart,
        user,
        hasFilter,
        query: req.query,
    });
});
exports.getAllProductPage = getAllProductPage;
// ========== Trang giỏ hàng ==========
const getCartPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    const cart = yield client_1.prisma.cart.findUnique({
        where: { userId: user.id },
        select: { sum: true },
    });
    const cartDetails = yield (0, product_service_1.getProductInCart)(user.id);
    const totalPrice = cartDetails.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const sumCart = cartDetails.reduce((acc, item) => acc + item.quantity, 0);
    return res.render("client/product/cart", {
        user,
        cartDetails,
        sum: (_a = cart === null || cart === void 0 ? void 0 : cart.sum) !== null && _a !== void 0 ? _a : 0,
        totalPrice,
        sumCart,
    });
});
exports.getCartPage = getCartPage;
// ========== Trang thanh toán ==========
const getCheckOutPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    const cart = yield client_1.prisma.cart.findUnique({
        where: { userId: user.id },
        select: { sum: true },
    });
    const cartDetails = yield (0, product_service_1.getProductInCart)(user.id);
    const totalPrice = cartDetails.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const sumCart = cartDetails.reduce((acc, item) => acc + item.quantity, 0);
    return res.render("client/product/checkout", {
        user,
        cartDetails,
        sum: (_a = cart === null || cart === void 0 ? void 0 : cart.sum) !== null && _a !== void 0 ? _a : 0,
        totalPrice,
        sumCart,
    });
});
exports.getCheckOutPage = getCheckOutPage;
const getThankyouPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    return res.render("client/product/thanks");
});
exports.getThankyouPage = getThankyouPage;
// ========== Trang lịch sử đơn hàng ==========
const getOrderHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    try {
        const orders = yield client_1.prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { id: "desc" },
            include: {
                orderDetails: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        const sumCart = (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
        res.render("client/product/order-history", {
            orders,
            user,
            sumCart,
        });
    }
    catch (error) {
        console.error("❌ getOrderHistory error:", error);
        res.render("client/product/order-history", {
            orders: [],
            user,
            sumCart: 0,
            error: "Không thể tải dữ liệu đơn hàng!",
        });
    }
});
exports.getOrderHistory = getOrderHistory;
// ========== Đặt hàng ==========
const postPlaceOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    const { receiverName, receiverPhone, receiverAddress, totalPrice } = req.body;
    yield (0, product_service_1.handlePlaceOrder)(user.id, receiverName, receiverPhone, receiverAddress, +totalPrice);
    res.render("client/product/thanks.ejs", { user });
});
exports.postPlaceOrder = postPlaceOrder;
// ========== Xoá sản phẩm khỏi giỏ ==========
const postDeleteProductInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    const cartDetailsId = parseInt(id);
    yield (0, product_service_1.deleteProductInCart)(cartDetailsId, user.id);
    return res.redirect("/cart");
});
exports.postDeleteProductInCart = postDeleteProductInCart;
// ========== Hủy đơn hàng ==========
const postCancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = parseInt(req.params.id);
    const user = req.user;
    try {
        const order = yield client_1.prisma.order.findUnique({
            where: { id: orderId },
            include: { orderDetails: { include: { product: true } } },
        });
        if (!order || order.userId !== user.id || order.status === "CANCELLED") {
            res.status(403).send("Không thể huỷ đơn.");
            return;
        }
        // Cộng lại số lượng sản phẩm
        yield Promise.all(order.orderDetails.map((item) => client_1.prisma.product.update({
            where: { id: item.productId },
            data: { quantity: item.product.quantity + item.quantity },
        })));
        // Xóa orderDetails trước (vì có quan hệ foreign key)
        yield client_1.prisma.orderDetail.deleteMany({
            where: { orderId },
        });
        // Xóa order
        yield client_1.prisma.order.delete({
            where: { id: orderId },
        });
        res.redirect("/history");
    }
    catch (error) {
        console.error("❌ Hủy đơn thất bại:", error);
        res.status(500).send("Lỗi hệ thống khi huỷ đơn.");
    }
});
exports.postCancelOrder = postCancelOrder;
// ========== Trang chỉnh sửa thông tin ==========
const getEditProfilePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const profile = yield client_1.prisma.user.findUnique({
        where: { id: user.id },
    });
    let sumCart;
    if (req.query.sumCart) {
        sumCart = parseInt(req.query.sumCart, 10);
    }
    else {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    return res.render("client/user/edit-profile", { user: profile, sumCart });
});
exports.getEditProfilePage = getEditProfilePage;
// ========== Cập nhật thông tin ==========
const postUpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    const { fullname, phone, address } = req.body;
    try {
        const existingUser = yield client_1.prisma.user.findUnique({
            where: { id: user.id },
        });
        const avatar = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || (existingUser === null || existingUser === void 0 ? void 0 : existingUser.avatar);
        yield client_1.prisma.user.update({
            where: { id: user.id },
            data: {
                fullname,
                phone,
                address,
                avatar,
            },
        });
        res.redirect("/edit-profile");
    }
    catch (error) {
        console.error("❌ Lỗi cập nhật profile:", error);
        res.status(500).send("Lỗi hệ thống.");
    }
});
exports.postUpdateProfile = postUpdateProfile;
// ========== Đổi mật khẩu ==========
const getChangePasswordPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    try {
        const orders = yield client_1.prisma.order.findMany({
            where: { userId: user.id },
            include: {
                orderDetails: {
                    include: { product: true },
                },
            },
        });
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        const sumCart = (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
        res.render("client/user/changePass", {
            orders,
            user,
            sumCart,
        });
    }
    catch (error) {
        console.error("❌ getOrderHistory error:", error);
        res.render("client/user/changePass", {
            orders: [],
            user,
            sumCart: 0,
            error: "Không thể tải dữ liệu đơn hàng!",
        });
    }
    // res.render("client/user/changePass"); // đường dẫn đến file .ejs
});
exports.getChangePasswordPage = getChangePasswordPage;
const postChangePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!req.body) {
            res.status(400).send("Dữ liệu không hợp lệ.");
            return;
        }
        const { oldPassword, newPassword, confirmPassword } = req.body;
        // Kiểm tra đủ dữ liệu
        if (!oldPassword || !newPassword || !confirmPassword) {
            res.status(400).send("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        // Tìm người dùng trong database
        const dbUser = yield client_1.prisma.user.findUnique({
            where: { id: user.id },
        });
        if (!dbUser || !dbUser.password) {
            res.status(404).send("Không tìm thấy người dùng.");
            return;
        }
        // So sánh mật khẩu cũ
        const isMatch = yield bcrypt_1.default.compare(oldPassword, dbUser.password);
        if (!isMatch) {
            res.status(400).send("Mật khẩu hiện tại không đúng.");
            return;
        }
        // Kiểm tra xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            res.status(400).send("Mật khẩu xác nhận không khớp.");
            return;
        }
        // Hash và cập nhật mật khẩu
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield client_1.prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });
        res.redirect("/");
    }
    catch (error) {
        console.error("❌ Lỗi đổi mật khẩu:", error);
        res.status(500).send("Đã có lỗi xảy ra khi đổi mật khẩu.");
    }
});
exports.postChangePassword = postChangePassword;
//# sourceMappingURL=product-controller.js.map