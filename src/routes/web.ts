import express, { Express, Request, Response, RequestHandler } from "express";
import passport from "passport";
import { ACCOUNT_TYPE } from "../config/constant";

// ==== Middleware ====
import {
  checkAuth,
  isAdmin,
  isLogin,
  blockAdminHome,
} from "../middleware/auth";
import fileUploadMiddleware from "../middleware/multer";

// ==== Controllers - User ====

import {
  getLoginPage,
  getRegisterPage,
  getSuccessRedirect,
  postLogout,
  postRegister,
} from "../controllers/client/auth-controller";

import {
  getAllProductPage,
  getCartPage,
  getChangePasswordPage,
  getCheckOutPage,
  getEditProfilePage,
  getOrderHistory,
  getProductsPage,
  getThankyouPage,
  postCancelOrder,
  postChangePassword,
  postDeleteProductInCart,
  postPlaceOrder,
  postUpdateProfile,
} from "../controllers/client/product-controller";

import { suggestProducts } from "../controllers/client/search";

// ==== Controllers - Admin ====
import {
  getDashboard,
  getAdminUserPage,
} from "../controllers/admin/dashboard-controller";

// ==== Info Pages ====
import {
  getReturnPage,
  getSecurityPaymentPage,
  getShippingPage,
  getSupportPage,
} from "../services/client/auth-service";
import {
  deleteProduct,
  getAdminProductPage,
  getOrderDetailPage,
  getOrderPage,
  getProductPage,
  getViewProduct,
  postAdminProduct,
  postUpdateProduct,
} from "../controllers/admin/admin-product-controller";
import {
  deleteReview,
  getProductDetailPage,
  PostAddProductToCart,
  postReview,
  showEditReview,
  updateReview,
} from "../controllers/client/review-controller";
import {
  createUser,
  getHomePage,
  handleCreateUser,
  handleDelete,
  handleUpdate,
  handleViewUser,
} from "../controllers/admin/admin-user-controller";


const router = express.Router();

const webRoutes = (app: Express) => {
  // ==== Home & Redirect ====
  router.get("/", blockAdminHome, getHomePage);
  router.get("/success-redirect", getSuccessRedirect);

  // ==== Auth ====
  router.get("/login", isLogin, getLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-redirect",
      failureRedirect: "/login",
      failureMessage: true,
    })
  );
  router.get("/register", isLogin, getRegisterPage);
  router.post("/register", isLogin, postRegister);
  router.get("/logout", postLogout);

  // ==== Profile & Password ====
  router.get("/edit-profile", checkAuth, getEditProfilePage);
  router.post(
    "/update-profile",
    checkAuth,
    fileUploadMiddleware("avatar"),
    postUpdateProfile
  );
  router.get("/change-password", checkAuth, getChangePasswordPage);
  router.post("/change-password", checkAuth, postChangePassword);

  // ==== Products & Cart ====
  router.get("/all-product", getAllProductPage);
  router.get("/product/:id", getProductDetailPage);
  router.post("/add-product-to-card/:id", checkAuth, PostAddProductToCart);
  router.post(
    "/delete-product-in-cart/:id",
    checkAuth,
    postDeleteProductInCart
  );

  // ==== Orders ====
  router.get("/cart", checkAuth, getCartPage);
  router.get("/checkout", checkAuth, getCheckOutPage);
  router.post("/place-order", checkAuth, postPlaceOrder);
  router.post("/thanks", checkAuth, getThankyouPage);
  router.get("/history", checkAuth, getOrderHistory);
  router.post("/order/cancel/:id", checkAuth, postCancelOrder);

  // ==== Reviews ====
  router.post("/product/:productId/review", checkAuth, postReview);
  router.get(
    "/product/:productId/review/:reviewId/edit",
    checkAuth,
    showEditReview
  );
  router.post("/product/:productId/review/:reviewId", checkAuth, updateReview);
  router.post(
    "/product/:productId/review/:reviewId/delete",
    checkAuth,
    deleteReview
  );


  // momo
  // ==== Info Pages ====
  router.get("/shipping", getShippingPage);
  router.get("/security-payment", getSecurityPaymentPage);
  router.get("/return-product", getReturnPage);
  router.get("/supporting", getSupportPage);
  router.get("/search/suggest", suggestProducts as RequestHandler);

  // ==== Admin - Users ====
  router.get("/admin", checkAuth, isAdmin, getDashboard);
  router.get("/admin/user", checkAuth, isAdmin, getAdminUserPage);
  router.get("/admin/create-user", checkAuth, isAdmin, createUser);
  router.post(
    "/admin/handle-create-user",
    checkAuth,
    isAdmin,
    fileUploadMiddleware("avatar"),
    handleCreateUser
  );
  router.post("/admin/delete-user/:id", checkAuth, isAdmin, handleDelete);
  router.post(
    "/admin/handle-update-user/:id",
    checkAuth,
    isAdmin,
    fileUploadMiddleware("avatar"),
    handleUpdate as (req: Request, res: Response) => any
  );
  router.get("/admin/view-user/:id", checkAuth, isAdmin, handleViewUser);

  // ==== Admin - Products ====
  router.get("/admin/product", checkAuth, isAdmin, getProductPage);
  router.get(
    "/admin/create-product",
    checkAuth,
    isAdmin,
    fileUploadMiddleware("image", "images/product"),
    getAdminProductPage
  );
  router.post(
    "/admin/create-product",
    checkAuth,
    isAdmin,
    fileUploadMiddleware("image", "images/product"),
    postAdminProduct
  );
  router.get("/admin/view-product/:id", checkAuth, isAdmin, getViewProduct);
  router.post(
    "/admin/update-product/:id",
    checkAuth,
    isAdmin,
    fileUploadMiddleware("image", "images/product"),
    postUpdateProduct
  );
  router.post("/admin/delete-product/:id", checkAuth, isAdmin, deleteProduct);

  // ==== Admin - Orders ====
  router.get("/admin/order", checkAuth, isAdmin, getOrderPage);
  router.get("/admin/order/:id", checkAuth, isAdmin, getOrderDetailPage);

  // ==== Apply Routes ====
  app.use("/", router);
};

export default webRoutes;
