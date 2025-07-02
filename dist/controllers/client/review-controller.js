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
exports.PostAddProductToCart = exports.deleteReview = exports.updateReview = exports.showEditReview = exports.getProductDetailPage = exports.postReview = void 0;
const product_service_1 = require("../../services/client/product-service");
const client_1 = require("../../config/client");
const product_service_2 = require("../../services/admin/product-service");
const postReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { content, rating } = req.body;
    const user = req.user;
    try {
        yield client_1.prisma.review.create({
            data: {
                content,
                rating: parseInt(rating),
                productId: +productId,
                userId: user.id,
            },
        });
        res.redirect(`/product/${productId}`);
    }
    catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        res.status(500).send("Server Error");
    }
});
exports.postReview = postReview;
const getProductDetailPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = parseInt(req.params.id);
    try {
        const product = yield client_1.prisma.product.findUnique({
            where: { id: productId },
            include: {
                Review: {
                    include: {
                        user: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });
        if (!product) {
            return res.status(404).render("error/404");
        }
        const products = yield (0, product_service_1.getProduct)();
        const user = req.user;
        let sumCart = 0;
        if (user) {
            const cart = yield client_1.prisma.cart.findFirst({
                where: { userId: user.id },
                include: { cartDetails: true },
            });
            sumCart =
                (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((t, item) => t + item.quantity, 0)) || 0;
        }
        res.render("client/product/detail", {
            product,
            products,
            user,
            sumCart,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});
exports.getProductDetailPage = getProductDetailPage;
const showEditReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const user = req.user;
    const review = yield client_1.prisma.review.findUnique({
        where: { id: +reviewId },
        include: { product: true },
    });
    if (!review || review.userId !== user.id) {
        res.status(403).send("Unauthorized");
        return;
    }
    const cart = yield client_1.prisma.cart.findFirst({
        where: { userId: user.id },
        include: { cartDetails: true },
    });
    const sumCart = (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    res.render("client/product/edit-review", {
        review,
        product: review.product,
        sumCart,
    });
});
exports.showEditReview = showEditReview;
const updateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, reviewId } = req.params;
    const { rating, content } = req.body;
    const user = req.user;
    const review = yield client_1.prisma.review.findUnique({ where: { id: +reviewId } });
    if (!review || review.userId !== user.id) {
        res.status(403).send("Unauthorized");
        return;
    }
    yield client_1.prisma.review.update({
        where: { id: +reviewId },
        data: { rating: +rating, content },
    });
    res.redirect(`/product/${productId}`);
});
exports.updateReview = updateReview;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, reviewId } = req.params;
    const user = req.user;
    const review = yield client_1.prisma.review.findUnique({ where: { id: +reviewId } });
    if (!review || review.userId !== user.id) {
        res.status(403).send("Unauthorized");
        return;
    }
    yield client_1.prisma.review.delete({ where: { id: +reviewId } });
    res.redirect(`/product/${productId}`);
});
exports.deleteReview = deleteReview;
const PostAddProductToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    const cartItemCount = yield (0, product_service_1.getCartItemCount)(req.user);
    if (user) {
        yield (0, product_service_2.addProductToCart)(1, +id, user);
        res.redirect("/");
    }
    else {
        res.redirect("/login");
    }
});
exports.PostAddProductToCart = PostAddProductToCart;
//# sourceMappingURL=review-controller.js.map