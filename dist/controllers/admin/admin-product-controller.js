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
exports.getOrderDetailPage = exports.getOrderPage = exports.postUpdateProduct = exports.getViewProduct = exports.getProductPage = exports.deleteProduct = exports.postAdminProduct = exports.getAdminProductPage = void 0;
const product_service_1 = require("../../services/admin/product-service");
const client_1 = require("../../config/client");
const order_service_1 = require("../../services/admin/order-service");
const user_service_1 = require("../../services/admin/user-service");
const getAdminProductPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.render("admin/layout/product/create-product.ejs");
});
exports.getAdminProductPage = getAdminProductPage;
const postAdminProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, price, detailDesc, shortDesc, quantity, factory, target, ram, storage, os, status, screen, battery, camera, rating, } = req.body;
        const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || "";
        yield (0, product_service_1.createProduct)(name, parseFloat(price), detailDesc, shortDesc, parseInt(quantity), factory, target, image, ram, storage, os, status, screen, battery, camera, parseFloat(rating));
        return res.redirect("/admin/product");
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).send("Internal Server Error");
    }
});
exports.postAdminProduct = postAdminProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, product_service_1.handleDeleteProduct)(+id);
    return res.redirect("/admin/product");
});
exports.deleteProduct = deleteProduct;
const getProductPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const [products, total] = yield Promise.all([
        client_1.prisma.product.findMany({
            skip: offset,
            take: limit,
            orderBy: { id: "asc" },
        }),
        client_1.prisma.product.count(),
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.render("admin/layout/product/product.ejs", {
        products,
        page,
        limit,
        totalPages,
    });
});
exports.getProductPage = getProductPage;
const getViewProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const product = yield (0, product_service_1.getProductByID)(+id);
    const factoryOptions = [
        { name: "Apple", value: "APPLE" },
        { name: "Samsung", value: "SAMSUNG" },
        { name: "Oppo", value: "OPPO" },
        { name: "Xiaomi", value: "XIAOMI" },
        { name: "Realme", value: "REALME" },
        { name: "Vivo", value: "VIVO" },
    ];
    const targetOptions = [
        { name: "Gaming", value: "Gaming" },
        { name: "Thin & Light", value: "Thin & Light" },
        { name: "HOT", value: "HOT" },
    ];
    const osOptions = ["iOS", "Android", "HarmonyOS"];
    const statusOptions = ["Còn hàng", "Hết hàng", "Ngừng kinh doanh"];
    const ramOptions = ["4GB", "6GB", "8GB", "12GB"];
    const storageOptions = ["64GB", "128GB", "256GB", "512GB"];
    const screenOptions = ["6.1 inch", "6.5 inch", "6.7 inch", "7.0 inch"];
    const batteryOptions = ["3500mAh", "4000mAh", "4500mAh", "5000mAh"];
    const cameraOptions = ["12MP", "48MP", "64MP", "108MP"];
    return res.render("admin/layout/product/view-product.ejs", {
        product,
        factoryOptions,
        targetOptions,
        osOptions,
        statusOptions,
        ramOptions,
        storageOptions,
        screenOptions,
        batteryOptions,
        cameraOptions,
    });
});
exports.getViewProduct = getViewProduct;
const postUpdateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, price, detailDesc, shortDesc, quantity, factory, target, ram, storage, os, status, screen, battery, camera, rating, } = req.body;
    const oldProduct = yield (0, product_service_1.getProductByID)(+id);
    const image = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || (oldProduct === null || oldProduct === void 0 ? void 0 : oldProduct.image) || "";
    yield (0, product_service_1.updateProductById)(+id, name, parseFloat(price), detailDesc, shortDesc, parseInt(quantity), factory, target, image, ram, storage, os, status, screen, battery, camera, parseFloat(rating) || 0);
    return res.redirect("/admin/product");
});
exports.postUpdateProduct = postUpdateProduct;
const getOrderPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield (0, order_service_1.getOrderAdmin)();
    const users = yield (0, user_service_1.getAllUsers)();
    return res.render("admin/layout/order/dashboard.ejs", {
        orders,
        users,
    });
});
exports.getOrderPage = getOrderPage;
const getOrderDetailPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const orderDetails = yield (0, order_service_1.getOrderDetailAdmin)(+id);
    return res.render("admin/layout/order/view-order.ejs", {
        orderDetails,
    });
});
exports.getOrderDetailPage = getOrderDetailPage;
//# sourceMappingURL=admin-product-controller.js.map