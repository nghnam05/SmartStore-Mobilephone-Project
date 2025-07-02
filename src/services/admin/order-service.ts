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

export { getOrderAdmin, getOrderDetailAdmin };
