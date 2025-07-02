import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../config/client";
import {
  deleteProductInCart,
  getProductInCart,
  handlePlaceOrder,
} from "../../services/client/product-service";

// ========== Trang sản phẩm ==========
const getProductsPage = async (req: Request, res: Response) => {
  return res.render("client/layout/product/detail.ejs");
};

const getAllProductPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number } | undefined;

  const page = parseInt(req.query.page as string) || 1;
  const limit = 8;
  const offset = (page - 1) * limit;

  const { factory, price, storage: memory, sort } = req.query;
  const where: any = {};

  if (factory) {
    where.factory = Array.isArray(factory) ? { in: factory } : factory;
  }

  if (memory) {
    const memories = Array.isArray(memory) ? memory : [memory];
    where.memory = { in: memories };
  }

  if (price && price !== "all") {
    const [min, max] = (price as string).split("-").map(Number);
    where.price = { gte: min, lte: max };
  }

  let orderBy: any = { id: "asc" };
  if (sort === "asc") orderBy = { price: "asc" };
  else if (sort === "desc") orderBy = { price: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, skip: offset, take: limit, orderBy }),
    prisma.product.count({ where }),
  ]);
  const totalPages = Math.ceil(total / limit);

  let sumCart = 0;
  if (user) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });
    sumCart = cart?.cartDetails.reduce((t, item) => t + item.quantity, 0) || 0;
  }

  const hasFilter = !!(factory || price || sort);

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

// ========== Trang giỏ hàng ==========
const getCartPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!user) return res.redirect("/login");

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: { sum: true },
  });

  const cartDetails = await getProductInCart(user.id);
  const totalPrice = cartDetails.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const sumCart = cartDetails.reduce((acc, item) => acc + item.quantity, 0);

  return res.render("client/product/cart", {
    user,
    cartDetails,
    sum: cart?.sum ?? 0,
    totalPrice,
    sumCart,
  });
};

// ========== Trang thanh toán ==========
const getCheckOutPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!user) return res.redirect("/login");

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    select: { sum: true },
  });

  const cartDetails = await getProductInCart(user.id);
  const totalPrice = cartDetails.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const sumCart = cartDetails.reduce((acc, item) => acc + item.quantity, 0);

  return res.render("client/product/checkout", {
    user,
    cartDetails,
    sum: cart?.sum ?? 0,
    totalPrice,
    sumCart,
  });
};

const getThankyouPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!user) return res.redirect("/login");

  return res.render("client/product/thanks");
};

// ========== Trang lịch sử đơn hàng ==========
const getOrderHistory = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!user) return res.redirect("/login");

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderDetails: {
          include: { product: true },
        },
      },
    });

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    const sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;

    res.render("client/product/order-history", {
      orders,
      user,
      sumCart,
    });
  } catch (error) {
    console.error("❌ getOrderHistory error:", error);
    res.render("client/product/order-history", {
      orders: [],
      user,
      sumCart: 0,
      error: "Không thể tải dữ liệu đơn hàng!",
    });
  }
};

// ========== Đặt hàng ==========
const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!user) return res.redirect("/login");

  const { receiverName, receiverPhone, receiverAddress, totalPrice } = req.body;

  await handlePlaceOrder(
    user.id,
    receiverName,
    receiverPhone,
    receiverAddress,
    +totalPrice
  );

  res.render("client/product/thanks.ejs");
};

// ========== Xoá sản phẩm khỏi giỏ ==========
const postDeleteProductInCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as { id: number };

  if (!user) return res.redirect("/login");

  const cartDetailsId = parseInt(id);
  await deleteProductInCart(cartDetailsId, user.id);

  return res.redirect("/cart");
};

// ========== Hủy đơn hàng ==========
const postCancelOrder = async (req: Request, res: Response): Promise<void> => {
  const orderId = parseInt(req.params.id);
  const user = req.user as { id: number };

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderDetails: { include: { product: true } } },
    });

    if (!order || order.userId !== user.id || order.status === "CANCELLED") {
      res.status(403).send("Không thể huỷ đơn.");
      return;
    }

    await Promise.all(
      order.orderDetails.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { quantity: item.product.quantity + item.quantity },
        })
      )
    );

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    res.redirect("/history");
  } catch (error) {
    console.error("❌ Hủy đơn thất bại:", error);
    res.status(500).send("Lỗi hệ thống khi huỷ đơn.");
  }
};

// ========== Trang chỉnh sửa thông tin ==========
const getEditProfilePage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
  }); 
  let sumCart: number;
  if (req.query.sumCart) {
    sumCart = parseInt(req.query.sumCart as string, 10);
  } else {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  return res.render("client/user/edit-profile", { user: profile, sumCart });
};
  

// ========== Cập nhật thông tin ==========
const postUpdateProfile = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  const { fullname, phone, address } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    const avatar = req.file?.filename || existingUser?.avatar;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        fullname,
        phone,
        address,
        avatar,
      },
    });

    res.redirect("/edit-profile");
  } catch (error) {
    console.error("❌ Lỗi cập nhật profile:", error);
    res.status(500).send("Lỗi hệ thống.");
  }
};

// ========== Đổi mật khẩu ==========

const getChangePasswordPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };
  if (!user) return res.redirect("/login");
  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderDetails: {
          include: { product: true },
        },
      },
    });

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    const sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;

    res.render("client/product/order-history", {
      orders,
      user,
      sumCart,
    });
  } catch (error) {
    console.error("❌ getOrderHistory error:", error);
    res.render("client/user/changePass", {
      orders: [],
      user,
      sumCart: 0,
      error: "Không thể tải dữ liệu đơn hàng!",
    });
  }
  // res.render("client/user/changePass"); // đường dẫn đến file .ejs
};

const postChangePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as { id: number };

    if (!req.body) {
      res.status(400).send("Dữ liệu không hợp lệ.");
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Kiểm tra đủ dữ liệu
    if (!oldPassword || !newPassword || !confirmPassword) {
      res.status(400).send("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // Tìm người dùng trong database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser || !dbUser.password) {
      res.status(404).send("Không tìm thấy người dùng.");
      return;
    }

    // So sánh mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, dbUser.password);
    if (!isMatch) {
      res.status(400).send("Mật khẩu hiện tại không đúng.");
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      res.status(400).send("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Hash và cập nhật mật khẩu
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    res.redirect("/");
  } catch (error) {
    console.error("❌ Lỗi đổi mật khẩu:", error);
    res.status(500).send("Đã có lỗi xảy ra khi đổi mật khẩu.");
  }
};

export {
  getProductsPage,
  getAllProductPage,
  getCartPage,
  getCheckOutPage,
  getThankyouPage,
  getOrderHistory,
  postPlaceOrder,
  postDeleteProductInCart,
  postCancelOrder,
  getEditProfilePage,
  postUpdateProfile,
  postChangePassword,
  getChangePasswordPage,
};
