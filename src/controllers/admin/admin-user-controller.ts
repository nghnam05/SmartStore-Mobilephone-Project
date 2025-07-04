import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

import {
  getAllRoles,
  handleCreateNewUser,
  handleDeleteUser,
  UpdateUserById,
} from "../../services/admin/user-service";
import { prisma } from "../../config/client";
import { Request, Response } from "express";

const getHomePage = async (req: Request, res: Response) => {
  const user = req.user as { id: number } | undefined;

  const page = parseInt(req.query.page as string) || 1;
  const limit = 12;
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        image: true,
        price: true,
        detailDesc: true,
        quantity: true,
        ram: true,
        storage: true,
        rating: true,
        factory: true,
      },
    }),
    prisma.product.count(),
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
  return res.render("client/home/home.ejs", {
    products,
    page,
    limit,
    totalPages,
    sumCart,
    user,
  });
};

const createUser = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  const user = req.user as any;

  return res.render("admin/layout/user/create-user.ejs", {
    roles,
    user,
  });
};
const handleCreateUser = async (req: Request, res: Response) => {
  const { fullname, username, phone, role, address } = req.body;
  const user = req.user as any;

  // console.log("req.body toàn bộ:", req.body);
  const file = req.file;
  const avatar = file?.filename || null;
  await handleCreateNewUser(fullname, username, address, phone, avatar, role);
  return res.redirect("/admin/user");
};

const handleDelete = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const user = req.user as { id: number };

  if (user.id === Number(id)) {
    res.status(400).send("Bạn không thể tự xóa tài khoản của mình!");
    return;
  }

  try {
    await handleDeleteUser(id, user.id);
    res.redirect("/admin/user");
  } catch (error: any) {
    res.status(400).send(error.message || "Xóa user thất bại");
  }
};

// view user
const handleViewUser = async (req: Request, res: Response): Promise<void> => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) {
    res.status(400).send("Invalid ID");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).send("User not found");
    }
    const roles = await prisma.role.findMany();
    res.render("admin/layout/user/view-user", {
      user,
      roles,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("Internal Server Error");
  }
};

const handleUpdate = async (req: Request, res: Response) => {
  const { id, fullname, username, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? null;
  const user = req.user as any;

  await UpdateUserById(id, fullname, username, address, phone, role, avatar);
  // console.log(req.body);
  return res.redirect("/admin/user");
};

export {
  getHomePage,
  createUser,
  handleCreateUser,
  handleDelete,
  handleViewUser,
  handleUpdate,
};
