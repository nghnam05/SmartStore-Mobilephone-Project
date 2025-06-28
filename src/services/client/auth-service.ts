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

const handleLogin = async (username: string, password: string, done: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log("❌ User not found");
      return done(null, false, { message: "Incorrect email or password." });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      console.log("❌ Password mismatch");
      return done(null, false, { message: "Incorrect email or password." });
    }

    console.log("✅ User authenticated:", user.username);
    return done(null, user);
  } catch (err) {
    console.error("🚨 Error in handleLogin:", err);
    return done(err);
  }
};

const getShippingPage = (req: Request, res: Response) => {
  return res.render("client/support/freeShip.ejs");
};
const getSecurityPaymentPage = (req: Request, res: Response) => {
  return res.render("client/support/security.ejs");
};

const getReturnPage = (req: Request, res: Response) => {
  return res.render("client/support/return.ejs");
};

const getSupportPage = (req: Request, res: Response) => {
  return res.render("client/support/supporting.ejs");
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
