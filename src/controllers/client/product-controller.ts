import { prisma } from "config/client";
import { Request, Response } from "express";
import {
  deleteProductInCart,
  getProductInCart,
  handlePlaceOrder,
} from "src/services/client/item-service";

const getProductsPage = async (req: Request, res: Response) => {
  return res.render("client/layout/product/detail.ejs");
};

const getAllProductPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number } | undefined;

  const page = parseInt(req.query.page as string) || 1;
  const limit = 8;
  const offset = (page - 1) * limit;

  const factory = req.query.factory;
  const price = req.query.price as string;
  const sortQuery = req.query.sort as string;

  const where: any = {};
  if (factory) {
    if (Array.isArray(factory)) {
      where.factory = { in: factory };
    } else {
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

  let orderBy: any = { id: "asc" };
  if (sortQuery === "asc") {
    orderBy = { price: "asc" };
  } else if (sortQuery === "desc") {
    orderBy = { price: "desc" };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);
  const totalPages = Math.ceil(total / limit);

  let sumCart = 0;
  if (user) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;
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
};

const postDeleteProductInCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as { id: number };

  if (!user) return res.redirect("/login");

  const cartDetailsId = parseInt(id);

  await deleteProductInCart(cartDetailsId, user.id);

  return res.redirect("/cart");
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
  getProductsPage,
  getAllProductPage,
  postDeleteProductInCart,
  postPlaceOrder,
  getThankyouPage,
  getCartPage,
  getCheckOutPage,
};
