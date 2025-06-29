import { Request, Response } from "express";
import { getProductList } from "../../services/admin/product-service";
import { getAllUsers } from "../../services/admin/user-service";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "../../services/admin/order-service";
import { getOrderHistory } from "../../services/client/item-service";
import { prisma } from "../../config/client";

const getDashboard = async (req: Request, res: Response) => {
  return res.render("admin/layout/dashboard/dashboard.ejs");
};

const getAdminUserPage = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.render("admin/layout/user/dashboard.ejs", {
    users,
    page,
    limit,
    totalPages,
  });
};

export { getDashboard, getAdminUserPage };
