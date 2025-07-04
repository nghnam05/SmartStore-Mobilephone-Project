import { Request, Response } from "express";
import { prisma } from "../../config/client";

const getOrderAdmin = async () => {
  return await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
    },
    include: {
      user: true,
    },
  });
};

const getOrderDetailAdmin = async (orderId: number) => {
  return await prisma.orderDetail.findMany({
    where: { orderId },
    include: {
      product: true,
      order: {
        include: {
          user: true,
        },
      },
    },
  });
};

const approveOrder = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "approved" },
    });

    res.redirect("/admin/layout/order/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi khi duyệt đơn hàng");
  }
};

export { getOrderAdmin, getOrderDetailAdmin, approveOrder };
