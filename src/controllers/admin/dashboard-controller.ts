import { Request, Response } from "express";

import { prisma } from "../../config/client";

const getDashboard = async (req: Request, res: Response) => {
  const user = req.user as any;

  try {
    // Đếm tổng đơn hàng đã bán (status approved)
    const totalOrders = await prisma.order.count({
      where: { status: "approved" },
    });

    // Tính tổng tiền từ tất cả đơn đã duyệt
    const totalRevenueResult = await prisma.order.aggregate({
      where: { status: "approved" },
      _sum: { totalPrice: true }, // Giả sử có trường totalPrice trong order
    });

    const totalRevenue = totalRevenueResult._sum.totalPrice || 0;

    return res.render("admin/layout/dashboard/dashboard.ejs", {
      totalOrders,
      totalRevenue,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi thống kê");
  }
};

const getAdminUserPage = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const user = req.user as any;

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
    user,
    page,
    limit,
    totalPages,
  });
};

export { getDashboard, getAdminUserPage };
