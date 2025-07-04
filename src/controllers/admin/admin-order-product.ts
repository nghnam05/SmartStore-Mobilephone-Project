import { getOrderAdmin } from "../../services/admin/order-service";
import { prisma } from "../../config/client";
import { Request, RequestHandler, Response } from "express";
import { getAllUsers } from "../../services/admin/user-service";

const adminOrderController = async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);
  const user = req.user as any;

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "approved" },
    });

    // ⚠️ Lấy lại orders và users trước khi render
    const orders = await getOrderAdmin();
    const users = await getAllUsers();

    return res.render("admin/layout/order/dashboard.ejs", {
      orders,
      users,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Lỗi khi duyệt đơn hàng");
  }
};

export { adminOrderController };
