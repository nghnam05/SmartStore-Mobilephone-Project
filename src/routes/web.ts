import { ACCOUNT_TYPE } from "./../config/constant";
import express, { Express, Request, Response, RequestHandler } from "express";
import passport from "passport";

// Controller imports
import {
  createUser,
  getHomePage,
  handleCreateUser,
  handleDelete,
  handleUpdate,
  handleViewUser,
} from "../controllers/user-controller";
import {
  getDashboard,
  getAdminUserPage,
} from "../controllers/admin/dashboard-controller";
import {
  getAllProductPage,
  getCartPage,
  getCheckOutPage,
  getProductsPage,
  getThankyouPage,
  postDeleteProductInCart,
  postPlaceOrder,
} from "../controllers/client/product-controller";
import {
  deleteProduct,
  getAdminProductPage,
  getOrderDetailPage,
  getOrderPage,
  getProductDetailPage,
  getProductPage,
  getViewProduct,
  PostAddProductToCart,
  postAdminProduct,
  postUpdateProduct,
} from "../controllers/admin/product-controller";
import {
  getLoginPage,
  getRegisterPage,
  getSuccessRedirect,
  postLogout,
  postRegister,
} from "../controllers/client/auth-controller";
import {
  blockAdminHome,
  checkAuth,
  isAdmin,
  isLogin,
} from "../middleware/auth";
import { suggestProducts } from "../controllers/client/search";
import fileUploadMiddleware from "../middleware/multer";
import { getReturnPage, getSecurityPaymentPage, getShippingPage, getSupportPage } from "src/services/client/auth-service";

const router = express.Router();

const webRoutes = (app: Express) => {
  // ==== Guest & User Routes ====
  router.get("/", blockAdminHome, getHomePage);
  router.get("/success-redirect", getSuccessRedirect);
  router.get("/cart", getCartPage);
  router.get("/checkout", getCheckOutPage);
  router.post("/place-order", postPlaceOrder);
  router.post("/thanks", getThankyouPage);
  router.get("/product/:id", getProductDetailPage);
  router.post("/add-product-to-card/:id", checkAuth, PostAddProductToCart);
  router.post("/delete-product-in-cart/:id", postDeleteProductInCart);
  router.get("/all-product", getAllProductPage);
  router.get("/search/suggest", suggestProducts as RequestHandler);
  router.get("/shipping" , getShippingPage)
  router.get("/security-payment" , getSecurityPaymentPage)
  router.get("/return-product" , getReturnPage)
  router.get("/supporting" , getSupportPage)

  // Login/Register/Logout - Prevent access if already logged in
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

  
  //All  Admin routes
  router.get("/admin/order", checkAuth, isAdmin, getOrderPage);
  router.get("/admin/order/:id", checkAuth, isAdmin, getOrderDetailPage);
  router.get("/admin", checkAuth, isAdmin, getDashboard);
  router.get("/admin/user", checkAuth, isAdmin, getAdminUserPage);
  router.get("/admin/create-user", checkAuth, isAdmin, createUser);
  router.post("/admin/delete-user/:id", checkAuth, isAdmin, handleDelete);
  router.post(
    "/admin/handle-update-user/:id",
    checkAuth,
    fileUploadMiddleware("avatar"),
    handleUpdate as (req: Request, res: Response) => any
  );
  router.post(
    "/admin/handle-create-user",
    checkAuth,
    fileUploadMiddleware("avatar"),
    handleCreateUser
  );
  router.get("/admin/view-user/:id", checkAuth, isAdmin, handleViewUser);
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
  router.post("/admin/delete-product/:id", checkAuth, isAdmin, deleteProduct);
  router.get("/admin/view-product/:id", checkAuth, isAdmin, getViewProduct);
  router.post(
    "/admin/update-product/:id",
    checkAuth,
    isAdmin,
    fileUploadMiddleware("image", "images/product"),
    postUpdateProduct
  );

  // ==== Register all routes ====
  app.use("/", router);
};

export default webRoutes;
