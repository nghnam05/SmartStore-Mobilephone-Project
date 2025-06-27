import { Request, Response } from "express";
import { getProductList } from "../../services/admin/product-service";
import { getAllUsers } from "../../services/admin/user-service";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "src/services/admin/order-service";
import { getOrderHistory } from "src/services/client/item-service";
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

const getHistoryPage = async (req: Request, res: Response) => {
  const user = req.user as any;

  if (!user?.id) return res.redirect("/login");

  const orders = await getOrderHistory(user.id);

  return res.render("client/product/order-history", {
    orders,
  });
};

const getProductPage = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5; 
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "asc" }, // có thể đổi thành name, price,...
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

export {
  getDashboard,
  getAdminUserPage,
  getOrderPage,
  getProductPage,
  getOrderDetailPage,
  getHistoryPage,
};
