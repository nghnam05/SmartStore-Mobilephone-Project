import {
  comparePassword,
  hashPasswords,
} from "../../services/admin/user-service";
import { prisma } from "../../config/client";
import { ACCOUNT_TYPE } from "../../config/constant";
import { Request, Response } from "express";

const registerNewUSer = async (
  fullname: string,
  email: string,
  password: string
) => {
  const newPassword = await hashPasswords(password);

  const existingUser = await prisma.user.findUnique({
    where: {
      username: email,
    },
  });

  if (existingUser) {
    throw new Error("Email đã tồn tại trong hệ thống!");
  }

  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (!userRole) {
    throw new Error("Role USER không tồn tại.");
  }

  await prisma.user.create({
    data: {
      username: email,
      password: newPassword,
      fullname,
      accountType: ACCOUNT_TYPE.SYSTEM,
      roleID: userRole.id,
    },
  });
};

const getRoleUserByID = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullname: true,
        address: true,
        phone: true,
        avatar: true,
        accountType: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User không tồn tại");
    }

    return user;
  } catch (error) {
    console.error("❌ Lỗi getRoleUserByID:", error);
    throw error;
  }
};

const handleLogin = async (
  username: string,
  password: string,
  done: (err: any, user?: any, info?: any) => void
) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      console.log("⚠️ Đăng nhập thất bại: Không tìm thấy người dùng");
      return done(null, false, {
        message: "Tên đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      console.log("⚠️ Đăng nhập thất bại: Mật khẩu không khớp");
      return done(null, false, {
        message: "Tên đăng nhập hoặc mật khẩu không đúng.",
      });
    }

    // Tùy chọn: kiểm tra trạng thái tài khoản
    // if (!user.isActive) {

    console.log("✅ Đăng nhập thành công:", user.username);
    return done(null, user);
  } catch (err) {
    console.error("❌ Lỗi trong handleLogin:", err);
    return done(err);
  }
};

const getShippingPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };

  let sumCart = 0;

  if (user) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  return res.render("client/support/freeShip.ejs", { sumCart });
};

const getSecurityPaymentPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };

  let sumCart = 0;

  if (user) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  return res.render("client/support/security.ejs", { sumCart });
};

const getReturnPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };

  let sumCart = 0;

  if (user) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;
  }

  return res.render("client/support/return.ejs", { sumCart });
};

const getSupportPage = async (req: Request, res: Response) => {
  const user = req.user as { id: number };

  let sumCart = 0;

  if (user) {
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { cartDetails: true },
    });

    sumCart =
      cart?.cartDetails.reduce((total, item) => total + item.quantity, 0) || 0;
  }
  return res.render("client/support/supporting.ejs", { sumCart });
};

export {
  registerNewUSer,
  handleLogin,
  getRoleUserByID,
  getShippingPage,
  getSecurityPaymentPage,
  getReturnPage,
  getSupportPage,
};
