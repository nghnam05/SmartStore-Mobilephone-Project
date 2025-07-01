import { Product } from ".prisma/client";
import { number } from "zod";
import { prisma } from "../../config/client";

const getProduct = async () => {
  return await prisma.product.findMany();
};
// lấy tổng số lượng hàng đã thêm vào giỏ
const getCartItemCount = async (user: Express.User) => {
  const userId = (user as { id: number }).id;

  // ✅ Dùng findFirst thay vì findUnique
  const cart = await prisma.cart.findFirst({
    where: { userId },
    include: { cartDetails: true },
  });

  if (!cart) return 0;

  const totalQuantity = cart.cartDetails.reduce(
    (total, detail) => total + detail.quantity,
    0
  );

  return totalQuantity;
};

const getProductInCart = async (userId: number) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId: userId,
    },
    include: {
      cartDetails: {
        include: {
          product: true,
        },
      },
    },
  });

  return cart?.cartDetails || [];
};

const deleteProductInCart = async (cartDetailsId: number, userID: number) => {
  const cartDetail = await prisma.cartDetail.findUnique({
    where: {
      id: cartDetailsId,
    },
  });

  if (!cartDetail) return;

  // Cập nhật lại số lượng trong bảng product
  await prisma.product.update({
    where: { id: cartDetail.productId },
    data: {
      quantity: {
        increment: 1, // Cộng lại 1 sản phẩm vào kho
      },
    },
  });

  // Nếu quantity > 1 thì giảm 1, ngược lại thì xóa
  if (cartDetail.quantity > 1) {
    await prisma.cartDetail.update({
      where: {
        id: cartDetailsId,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    });
  } else {
    await prisma.cartDetail.delete({
      where: {
        id: cartDetailsId,
      },
    });
  }

  // Cập nhật lại giỏ hàng
  const remainingItems = await prisma.cartDetail.findMany({
    where: {
      cart: {
        userId: userID,
      },
    },
  });

  if (remainingItems.length === 0) {
    await prisma.cart.delete({
      where: { userId: userID },
    });
  } else {
    const totalQuantity = remainingItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    await prisma.cart.update({
      where: { userId: userID },
      data: {
        sum: totalQuantity,
      },
    });
  }
};

const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverPhone: string,
  receiverAddress: string,
  totalPrice: number
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      cartDetails: true,
    },
  });

  if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
    throw new Error("Giỏ hàng trống hoặc không tồn tại.");
  }

  const dataOrderDetail = cart.cartDetails.map((item) => ({
    price: item.price,
    quantity: item.quantity,
    productId: item.productId,
  }));

  // Dùng upsert để: nếu chưa có order thì tạo, nếu có thì cập nhật
  await prisma.order.upsert({
    where: { userId }, // Vì userId có @unique
    update: {
      receiverName,
      receiverPhone,
      receiverAddress,
      totalPrice,
      paymentMethod: "COD",
      paymentStatus: "pending",
      status: "pending",
      orderDetails: {
        deleteMany: {}, // Xoá hết chi tiết cũ
        create: dataOrderDetail, // Tạo lại chi tiết mới
      },
    },
    create: {
      userId,
      receiverName,
      receiverPhone,
      receiverAddress,
      totalPrice,
      paymentMethod: "COD",
      paymentStatus: "pending",
      status: "pending",
      orderDetails: {
        create: dataOrderDetail,
      },
    },
  });

  // Xóa giỏ hàng sau khi đặt
  await prisma.cartDetail.deleteMany({ where: { cartId: cart.id } });
};

const getOrderHistory = async (userId: number) => {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      orderDetails: {
        include: {
          product: true,
        },
      },
    },
  });
};

export {
  getProduct,
  getCartItemCount,
  deleteProductInCart,
  getProductInCart,
  handlePlaceOrder,
  getOrderHistory,
};
