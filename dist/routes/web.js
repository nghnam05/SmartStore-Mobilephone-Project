"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
// Controller imports
const user_controller_1 = require("../controllers/user-controller");
const dashboard_controller_1 = require("../controllers/admin/dashboard-controller");
const product_controller_1 = require("../controllers/client/product-controller");
const product_controller_2 = require("../controllers/admin/product-controller");
const auth_controller_1 = require("../controllers/client/auth-controller");
const auth_1 = require("../middleware/auth");
const search_1 = require("../controllers/client/search");
const multer_1 = __importDefault(require("../middleware/multer"));
const auth_service_1 = require("src/services/client/auth-service");
const router = express_1.default.Router();
const webRoutes = (app) => {
    // ==== Guest & User Routes ====
    router.get("/", auth_1.blockAdminHome, user_controller_1.getHomePage);
    router.get("/success-redirect", auth_controller_1.getSuccessRedirect);
    router.get("/cart", product_controller_1.getCartPage);
    router.get("/checkout", product_controller_1.getCheckOutPage);
    router.post("/place-order", product_controller_1.postPlaceOrder);
    router.post("/thanks", product_controller_1.getThankyouPage);
    router.get("/product/:id", product_controller_2.getProductDetailPage);
    router.post("/add-product-to-card/:id", auth_1.checkAuth, product_controller_2.PostAddProductToCart);
    router.post("/delete-product-in-cart/:id", product_controller_1.postDeleteProductInCart);
    router.get("/all-product", product_controller_1.getAllProductPage);
    router.get("/search/suggest", search_1.suggestProducts);
    router.get("/shipping", auth_service_1.getShippingPage);
    router.get("/security-payment", auth_service_1.getSecurityPaymentPage);
    router.get("/return-product", auth_service_1.getReturnPage);
    router.get("/supporting", auth_service_1.getSupportPage);
    // Login/Register/Logout - Prevent access if already logged in
    router.get("/login", auth_1.isLogin, auth_controller_1.getLoginPage);
    router.post("/login", passport_1.default.authenticate("local", {
        successRedirect: "/success-redirect",
        failureRedirect: "/login",
        failureMessage: true,
    }));
    router.get("/register", auth_1.isLogin, auth_controller_1.getRegisterPage);
    router.post("/register", auth_1.isLogin, auth_controller_1.postRegister);
    router.get("/logout", auth_controller_1.postLogout);
    //All  Admin routes
    router.get("/admin/order", auth_1.checkAuth, auth_1.isAdmin, product_controller_2.getOrderPage);
    router.get("/admin/order/:id", auth_1.checkAuth, auth_1.isAdmin, product_controller_2.getOrderDetailPage);
    router.get("/admin", auth_1.checkAuth, auth_1.isAdmin, dashboard_controller_1.getDashboard);
    router.get("/admin/user", auth_1.checkAuth, auth_1.isAdmin, dashboard_controller_1.getAdminUserPage);
    router.get("/admin/create-user", auth_1.checkAuth, auth_1.isAdmin, user_controller_1.createUser);
    router.post("/admin/delete-user/:id", auth_1.checkAuth, auth_1.isAdmin, user_controller_1.handleDelete);
    router.post("/admin/handle-update-user/:id", auth_1.checkAuth, (0, multer_1.default)("avatar"), user_controller_1.handleUpdate);
    router.post("/admin/handle-create-user", auth_1.checkAuth, (0, multer_1.default)("avatar"), user_controller_1.handleCreateUser);
    router.get("/admin/view-user/:id", auth_1.checkAuth, auth_1.isAdmin, user_controller_1.handleViewUser);
    router.get("/admin/product", auth_1.checkAuth, auth_1.isAdmin, product_controller_2.getProductPage);
    router.get("/admin/create-product", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("image", "images/product"), product_controller_2.getAdminProductPage);
    router.post("/admin/create-product", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("image", "images/product"), product_controller_2.postAdminProduct);
    router.post("/admin/delete-product/:id", auth_1.checkAuth, auth_1.isAdmin, product_controller_2.deleteProduct);
    router.get("/admin/view-product/:id", auth_1.checkAuth, auth_1.isAdmin, product_controller_2.getViewProduct);
    router.post("/admin/update-product/:id", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("image", "images/product"), product_controller_2.postUpdateProduct);
    // ==== Register all routes ====
    app.use("/", router);
};
exports.default = webRoutes;
//# sourceMappingURL=web.js.map