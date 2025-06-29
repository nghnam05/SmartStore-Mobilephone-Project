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
exports.getCheckOutPage = exports.getCartPage = exports.getThankyouPage = exports.postPlaceOrder = exports.postDeleteProductInCart = exports.getAllProductPage = exports.getProductsPage = void 0;
const client_1 = require("config/client");
const item_service_1 = require("src/services/client/item-service");
const getProductsPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render("client/layout/product/detail.ejs");
});
exports.getProductsPage = getProductsPage;
const getAllProductPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const offset = (page - 1) * limit;
    const factory = req.query.factory;
    const price = req.query.price;
    const sortQuery = req.query.sort;
    const where = {};
    if (factory) {
        if (Array.isArray(factory)) {
            where.factory = { in: factory };
        }
        else {
            where.factory = factory;
        }
    }
    if (price && price !== "all") {
        const [min, max] = price.split("-").map(Number);
        where.price = {
            gte: min,
            lte: max,
        };
    }
    let orderBy = { id: "asc" };
    if (sortQuery === "asc") {
        orderBy = { price: "asc" };
    }
    else if (sortQuery === "desc") {
        orderBy = { price: "desc" };
    }
    const [products, total] = yield Promise.all([
        client_1.prisma.product.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy,
        }),
        client_1.prisma.product.count({ where }),
    ]);
    const totalPages = Math.ceil(total / limit);
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    const hasFilter = !!(req.query.factory || req.query.price || req.query.sort);
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
const postDeleteProductInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    if (!user)
        return res.redirect("/login");
    const cartDetailsId = parseInt(id);
    yield (0, item_service_1.deleteProductInCart)(cartDetailsId, user.id);
    return res.redirect("/cart");
});
exports.postDeleteProductInCart = postDeleteProductInCart;
const getCartPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    // console.log("👤 Current user:", req.user);
    if (!req.user)
        return res.redirect("/login");
    const cart = yield client_1.prisma.cart.findUnique({
        where: { userId: user.id },
        select: { sum: true },
    });
    const cartDetails = yield (0, item_service_1.getProductInCart)(user.id);
    // if (cartDetails.length === 0) {
    //   console.log("🛒 Giỏ hàng trống");
    // } else {
    //   console.log("🛒 Có sản phẩm trong giỏ hàng");
    // }
    const totalPrice = cartDetails.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
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
const getCheckOutPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    // console.log("👤 Current user:", req.user);
    if (!req.user)
        return res.redirect("/login");
    const cart = yield client_1.prisma.cart.findUnique({
        where: { userId: user.id },
        select: { sum: true },
    });
    const cartDetails = yield (0, item_service_1.getProductInCart)(user.id);
    const totalPrice = cartDetails.reduce((total, item) => {
        return total + item.product.price * item.quantity;
    }, 0);
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
const postPlaceOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!req.user)
        return res.redirect("/login");
    const { receiverName, receiverPhone, receiverAddress, totalPrice } = req.body;
    console.log(req.body);
    yield (0, item_service_1.handlePlaceOrder)(user.id, receiverName, receiverPhone, receiverAddress, +totalPrice);
    res.render("client/product/thanks.ejs");
});
exports.postPlaceOrder = postPlaceOrder;
const getThankyouPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // console.log("👤 Current user:", req.user);
    if (!req.user)
        return res.redirect("/login");
    res.render("client/product/thanks");
});
exports.getThankyouPage = getThankyouPage;
//# sourceMappingURL=product-controller.js.map