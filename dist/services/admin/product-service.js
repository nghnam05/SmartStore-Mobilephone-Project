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
exports.addProductToCart = exports.handleDeleteProduct = exports.updateProductById = exports.getProductByID = exports.getProductList = exports.createProduct = void 0;
const client_1 = require("../../config/client");
//  Create Product
const createProduct = (name, price, detailDesc, shortDesc, quantity, factory, target, image, ram, storage, os, status, screen, battery, camera, rating) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.product.create({
        data: {
            name,
            price,
            detailDesc,
            shortDesc,
            quantity,
            factory,
            target,
            image,
            ram,
            storage,
            os,
            status,
            screen,
            battery,
            camera,
            rating,
        },
    });
});
exports.createProduct = createProduct;
//  Get All Products
const getProductList = () => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.product.findMany();
});
exports.getProductList = getProductList;
//  Get Product by ID
const getProductByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return client_1.prisma.product.findUnique({
        where: { id },
    });
});
exports.getProductByID = getProductByID;
// Update Product
const updateProductById = (id, name, price, detailDesc, shortDesc, quantity, factory, target, image, ram, storage, os, status, screen, battery, camera, rating) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.product.update({
        where: { id },
        data: {
            name,
            price,
            detailDesc,
            shortDesc,
            quantity,
            factory,
            target,
            image,
            ram,
            storage,
            os,
            status,
            screen,
            battery,
            camera,
            rating,
        },
    });
});
exports.updateProductById = updateProductById;
// ❌ Delete Product
const handleDeleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield client_1.prisma.product.findUnique({ where: { id } });
    if (!product) {
        console.log(`❌ Product with ID ${id} not found.`);
        return;
    }
    // Xoá dữ liệu liên quan
    yield client_1.prisma.cartDetail.deleteMany({ where: { productId: id } });
    yield client_1.prisma.orderDetail.deleteMany({ where: { productId: id } });
    yield client_1.prisma.product.delete({ where: { id } });
    // console.log(`✅ Deleted product ID ${id}`);
});
exports.handleDeleteProduct = handleDeleteProduct;
//  Add Product to Cart
const addProductToCart = (quantity, productId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = user.id;
    const product = yield client_1.prisma.product.findUnique({ where: { id: productId } });
    if (!product)
        throw new Error("Product not found");
    // ❗Kiểm tra tồn kho
    if (product.quantity < quantity) {
        throw new Error("Not enough stock");
    }
    const cart = yield client_1.prisma.cart.findUnique({
        where: { userId },
        include: { cartDetails: true },
    });
    if (cart) {
        const existingDetail = cart.cartDetails.find((detail) => detail.productId === productId);
        if (existingDetail) {
            yield client_1.prisma.cartDetail.update({
                where: { id: existingDetail.id },
                data: {
                    quantity: existingDetail.quantity + quantity,
                },
            });
        }
        else {
            yield client_1.prisma.cartDetail.create({
                data: {
                    cartId: cart.id,
                    productId,
                    price: product.price,
                    quantity,
                },
            });
        }
        yield client_1.prisma.cart.update({
            where: { userId },
            data: {
                sum: cart.sum + quantity * product.price,
            },
        });
    }
    else {
        yield client_1.prisma.cart.create({
            data: {
                userId,
                sum: quantity * product.price,
                cartDetails: {
                    create: [
                        {
                            productId,
                            price: product.price,
                            quantity,
                        },
                    ],
                },
            },
        });
    }
    // 🔄 Cập nhật lại tồn kho sản phẩm
    yield client_1.prisma.product.update({
        where: { id: productId },
        data: {
            quantity: product.quantity - quantity,
        },
    });
});
exports.addProductToCart = addProductToCart;
//# sourceMappingURL=product-service.js.map