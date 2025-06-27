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

const postDeleteProductInCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as { id: number };

  if (!user) return res.redirect("/login");

  const cartDetailsId = parseInt(id);

  await deleteProductInCart(cartDetailsId, user.id);

  return res.redirect("/cart");
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

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  // console.log("👤 Current user:", req.user);
  if (!req.user) return res.redirect("/login");
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: { sum: true },
  });

  const cartDetails = await getProductInCart(user.id);
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
    sum: cart?.sum ?? 0,
    totalPrice,
    sumCart,
  });
};

const getCheckOutPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  // console.log("👤 Current user:", req.user);
  if (!req.user) return res.redirect("/login");
  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: { sum: true },
  });
  const cartDetails = await getProductInCart(user.id);
  const totalPrice = cartDetails.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
  const sumCart = cartDetails.reduce((acc, item) => acc + item.quantity, 0);
  return res.render("client/product/checkout", {
    user,
    cartDetails,
    sum: cart?.sum ?? 0,
    totalPrice,
    sumCart,
  });
};

const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!req.user) return res.redirect("/login");
  const { receiverName, receiverPhone, receiverAddress, totalPrice } = req.body;
  console.log(req.body);
  await handlePlaceOrder(
    user.id,
    receiverName,
    receiverPhone,
    receiverAddress,
    +totalPrice
  );
  res.render("client/product/thanks.ejs");
};

const getThankyouPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  // console.log("👤 Current user:", req.user);
  if (!req.user) return res.redirect("/login");
  res.render("client/product/thanks");
};

export {
  getAdminProductPage,
  postAdminProduct,
  deleteProduct,
  getViewProduct,
  postUpdateProduct,
  getProductDetailPage,
  PostAddProductToCart,
  getCartPage,
  postDeleteProductInCart,
  getCheckOutPage,
  postPlaceOrder,
  getThankyouPage,
};
