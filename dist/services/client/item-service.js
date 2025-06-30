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
exports.getOrderHistory = exports.handlePlaceOrder = exports.getProductInCart = exports.deleteProductInCart = exports.getCartItemCount = exports.getProduct = void 0;
const client_1 = require("../../config/client");
const getProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.prisma.product.findMany();
});
exports.getProduct = getProduct;
// lấy tổng số lượng hàng đã thêm vào giỏ
const getCartItemCount = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = user.id;
    // ✅ Dùng findFirst thay vì findUnique
    const cart = yield client_1.prisma.cart.findFirst({
        where: { userId },
        include: { cartDetails: true },
    });
    if (!cart)
        return 0;
    const totalQuantity = cart.cartDetails.reduce((total, detail) => total + detail.quantity, 0);
    return totalQuantity;
});
exports.getCartItemCount = getCartItemCount;
const getProductInCart = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield client_1.prisma.cart.findUnique({
        where: {
            userId: userId,
        },
        include: {
            cartDetails: {
                include: {
                    product: true,
                },
            },
        },
    });
    return (cart === null || cart === void 0 ? void 0 : cart.cartDetails) || [];
});
exports.getProductInCart = getProductInCart;
const deleteProductInCart = (cartDetailsId, userID) => __awaiter(void 0, void 0, void 0, function* () {
    const cartDetail = yield client_1.prisma.cartDetail.findUnique({
        where: {
            id: cartDetailsId,
        },
    });
    if (!cartDetail)
        return;
    if (cartDetail.quantity > 1) {
        yield client_1.prisma.cartDetail.update({
            where: {
                id: cartDetailsId,
            },
            data: {
                quantity: {
                    decrement: 1,
                },
            },
        });
    }
    else {
        yield client_1.prisma.cartDetail.delete({
            where: {
                id: cartDetailsId,
            },
        });
    }
    const remainingItems = yield client_1.prisma.cartDetail.findMany({
        where: {
            cart: {
                userId: userID,
            },
        },
    });
    if (remainingItems.length === 0) {
        yield client_1.prisma.cart.delete({
            where: { userId: userID },
        });
    }
    else {
        const totalQuantity = remainingItems.reduce((sum, item) => sum + item.quantity, 0);
        yield client_1.prisma.cart.update({
            where: { userId: userID },
            data: {
                sum: totalQuantity,
            },
        });
    }
});
exports.deleteProductInCart = deleteProductInCart;
const handlePlaceOrder = (userId, receiverName, receiverPhone, receiverAddress, totalPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield client_1.prisma.cart.findUnique({
        where: { userId },
        include: {
            cartDetails: true,
        },
    });
    if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
        throw new Error("Giỏ hàng trống hoặc không tồn tại.");
    }
    const dataOrderDetail = cart.cartDetails.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
    }));
    // Dùng upsert để: nếu chưa có order thì tạo, nếu có thì cập nhật
    yield client_1.prisma.order.upsert({
        where: { userId }, // Vì userId có @unique
        update: {
            receiverName,
            receiverPhone,
            receiverAddress,
            totalPrice,
            paymentMethod: "COD",
            paymentStatus: "pending",
            status: "pending",
            orderDetails: {
                deleteMany: {}, // Xoá hết chi tiết cũ
                create: dataOrderDetail, // Tạo lại chi tiết mới
            },
        },
        create: {
            userId,
            receiverName,
            receiverPhone,
            receiverAddress,
            totalPrice,
            paymentMethod: "COD",
            paymentStatus: "pending",
            status: "pending",
            orderDetails: {
                create: dataOrderDetail,
            },
        },
    });
    // Xóa giỏ hàng sau khi đặt
    yield client_1.prisma.cartDetail.deleteMany({ where: { cartId: cart.id } });
});
exports.handlePlaceOrder = handlePlaceOrder;
const getOrderHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.prisma.order.findMany({
        where: { userId },
        include: {
            orderDetails: {
                include: {
                    product: true,
                },
            },
        },
    });
});
exports.getOrderHistory = getOrderHistory;
//# sourceMappingURL=item-service.js.map