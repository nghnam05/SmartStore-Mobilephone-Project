"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
// ==== Middleware ====
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
// ==== Controllers - User ====
const auth_controller_1 = require("../controllers/client/auth-controller");
const product_controller_1 = require("../controllers/client/product-controller");
const search_1 = require("../controllers/client/search");
// ==== Controllers - Admin ====
const dashboard_controller_1 = require("../controllers/admin/dashboard-controller");
// ==== Info Pages ====
const auth_service_1 = require("../services/client/auth-service");
const admin_product_controller_1 = require("../controllers/admin/admin-product-controller");
const review_controller_1 = require("../controllers/client/review-controller");
const admin_user_controller_1 = require("../controllers/admin/admin-user-controller");
const payment_controller_1 = require("../controllers/payment-controller");
const router = express_1.default.Router();
const webRoutes = (app) => {
    // ==== Home & Redirect ====
    router.get("/", auth_1.blockAdminHome, admin_user_controller_1.getHomePage);
    router.get("/success-redirect", auth_controller_1.getSuccessRedirect);
    // ==== Auth ====
    router.get("/login", auth_1.isLogin, auth_controller_1.getLoginPage);
    router.post("/login", passport_1.default.authenticate("local", {
        successRedirect: "/success-redirect",
        failureRedirect: "/login",
        failureMessage: true,
    }));
    router.get("/register", auth_1.isLogin, auth_controller_1.getRegisterPage);
    router.post("/register", auth_1.isLogin, auth_controller_1.postRegister);
    router.get("/logout", auth_controller_1.postLogout);
    // ==== Profile & Password ====
    router.get("/edit-profile", auth_1.checkAuth, product_controller_1.getEditProfilePage);
    router.post("/update-profile", auth_1.checkAuth, (0, multer_1.default)("avatar"), product_controller_1.postUpdateProfile);
    router.get("/change-password", auth_1.checkAuth, product_controller_1.getChangePasswordPage);
    router.post("/change-password", auth_1.checkAuth, product_controller_1.postChangePassword);
    // ==== Products & Cart ====
    router.get("/all-product", product_controller_1.getAllProductPage);
    router.get("/product/:id", review_controller_1.getProductDetailPage);
    router.post("/add-product-to-card/:id", auth_1.checkAuth, review_controller_1.PostAddProductToCart);
    router.post("/delete-product-in-cart/:id", auth_1.checkAuth, product_controller_1.postDeleteProductInCart);
    // ==== Orders ====
    router.get("/cart", auth_1.checkAuth, product_controller_1.getCartPage);
    router.get("/checkout", auth_1.checkAuth, product_controller_1.getCheckOutPage);
    router.post("/place-order", auth_1.checkAuth, product_controller_1.postPlaceOrder);
    router.post("/thanks", auth_1.checkAuth, product_controller_1.getThankyouPage);
    router.get("/history", auth_1.checkAuth, product_controller_1.getOrderHistory);
    router.post("/order/cancel/:id", auth_1.checkAuth, product_controller_1.postCancelOrder);
    // ==== Reviews ====
    router.post("/product/:productId/review", auth_1.checkAuth, review_controller_1.postReview);
    router.get("/product/:productId/review/:reviewId/edit", auth_1.checkAuth, review_controller_1.showEditReview);
    router.post("/product/:productId/review/:reviewId", auth_1.checkAuth, review_controller_1.updateReview);
    router.post("/product/:productId/review/:reviewId/delete", auth_1.checkAuth, review_controller_1.deleteReview);
    // momo
    router.post("/momo", payment_controller_1.createMomoPaymentController);
    // ==== Info Pages ====
    router.get("/shipping", auth_service_1.getShippingPage);
    router.get("/security-payment", auth_service_1.getSecurityPaymentPage);
    router.get("/return-product", auth_service_1.getReturnPage);
    router.get("/supporting", auth_service_1.getSupportPage);
    router.get("/search/suggest", search_1.suggestProducts);
    // ==== Admin - Users ====
    router.get("/admin", auth_1.checkAuth, auth_1.isAdmin, dashboard_controller_1.getDashboard);
    router.get("/admin/user", auth_1.checkAuth, auth_1.isAdmin, dashboard_controller_1.getAdminUserPage);
    router.get("/admin/create-user", auth_1.checkAuth, auth_1.isAdmin, admin_user_controller_1.createUser);
    router.post("/admin/handle-create-user", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("avatar"), admin_user_controller_1.handleCreateUser);
    router.post("/admin/delete-user/:id", auth_1.checkAuth, auth_1.isAdmin, admin_user_controller_1.handleDelete);
    router.post("/admin/handle-update-user/:id", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("avatar"), admin_user_controller_1.handleUpdate);
    router.get("/admin/view-user/:id", auth_1.checkAuth, auth_1.isAdmin, admin_user_controller_1.handleViewUser);
    // ==== Admin - Products ====
    router.get("/admin/product", auth_1.checkAuth, auth_1.isAdmin, admin_product_controller_1.getProductPage);
    router.get("/admin/create-product", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("image", "images/product"), admin_product_controller_1.getAdminProductPage);
    router.post("/admin/create-product", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("image", "images/product"), admin_product_controller_1.postAdminProduct);
    router.get("/admin/view-product/:id", auth_1.checkAuth, auth_1.isAdmin, admin_product_controller_1.getViewProduct);
    router.post("/admin/update-product/:id", auth_1.checkAuth, auth_1.isAdmin, (0, multer_1.default)("image", "images/product"), admin_product_controller_1.postUpdateProduct);
    router.post("/admin/delete-product/:id", auth_1.checkAuth, auth_1.isAdmin, admin_product_controller_1.deleteProduct);
    // ==== Admin - Orders ====
    router.get("/admin/order", auth_1.checkAuth, auth_1.isAdmin, admin_product_controller_1.getOrderPage);
    router.get("/admin/order/:id", auth_1.checkAuth, auth_1.isAdmin, admin_product_controller_1.getOrderDetailPage);
    // ==== Apply Routes ====
    app.use("/", router);
};
exports.default = webRoutes;
//# sourceMappingURL=web.js.map