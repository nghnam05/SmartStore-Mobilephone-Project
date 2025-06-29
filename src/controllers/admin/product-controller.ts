import { prisma } from "../../config/client";
import { Request, Response } from "express";
import {
  addProductToCart,
  createProduct,
  getProductByID,
  handleDeleteProduct,
  updateProductById,
} from "../../services/admin/product-service";
import {
  deleteProductInCart,
  getCartItemCount,
  getProduct,
  getProductInCart,
  handlePlaceOrder,
} from "../../services/client/item-service";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "../../services/admin/order-service";
import { getAllUsers } from "../../services/admin/user-service";

const getAdminProductPage = async (req: Request, res: Response) => {
  return res.render("admin/layout/product/create-product.ejs");
};
const postAdminProduct = async (req: Request, res: Response) => {
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body;
  const image = req?.file?.filename ?? null;
  await createProduct(
    name,
    +price,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target,
    image
  );

  return res.redirect("/admin/product");
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteProduct(+id);
  return res.redirect("/admin/product");
};

const getProductPage = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.render("admin/layout/product/product.ejs", {
    products,
    page,
    limit,
    totalPages,
  });
};

const getViewProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByID(+id);
  const factoryOptions = [
    { name: "Apple", value: "APPLE" },
    { name: "Samsung", value: "SAMSUNG" },
    { name: "Oppo", value: "OPPO" },
    { name: "XIAOMI", value: "Xiaomi" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "Gaming" },
    { name: "Mỏng nhẹ", value: "Thin & Light" },
    { name: "Hot trend", value: "HOT" },
  ];
  return res.render("admin/layout/product/view-product.ejs", {
    product,
    factoryOptions,
    targetOptions,
  });
};

const postUpdateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, detailDesc, shortDesc, quantity, factory, target } =
    req.body;
  const oldProduct = await getProductByID(+id);
  const image = req?.file?.filename || oldProduct?.image;
  await updateProductById(
    +id,
    name,
    +price,
    detailDesc,
    shortDesc,
    +quantity,
    factory,
    target,
    image
  );
  return res.redirect("/admin/product");
};

const getProductDetailPage = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  try {
    const product = await getProductByID(productId);
    if (!product) {
      return res.status(404).render("error/404");
    }
    const products = await getProduct();
    res.render("client/product/detail", { product, products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const PostAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const cartItemCount = await getCartItemCount(req.user);
  // res.render("home", { cartItemCount });
  if (user) {
    await addProductToCart(1, +id, user);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

const getOrderPage = async (req: Request, res: Response) => {
  const orders = await getOrderAdmin();
  const users = await getAllUsers();
  return res.render("admin/layout/order/dashboard.ejs", {
    orders,
    users,
  });
};

const getOrderDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderDetails = await getOrderDetailAdmin(+id);
  return res.render("admin/layout/order/view-order.ejs", {
    orderDetails,
  });
};

export {
  getAdminProductPage,
  postAdminProduct,
  deleteProduct,
  getViewProduct,
  postUpdateProduct,
  getProductDetailPage,
  PostAddProductToCart,
  getProductPage,
  getOrderDetailPage,
  getOrderPage,
};
