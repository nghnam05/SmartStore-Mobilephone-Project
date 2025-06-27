import { prisma } from "../../config/client";

const createProduct = async (
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string
) => {
  await prisma.product.create({
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      image,
    },
  });
};
const getProductList = async () => {
  return prisma.product.findMany();
};
const handleDeleteProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    console.log(`❌ Product with ID ${id} not found.`);
    return;
  }

  await prisma.cartDetail.deleteMany({ where: { productId: id } });
  await prisma.orderDetail.deleteMany({ where: { productId: id } });

  await prisma.product.delete({ where: { id } });

  console.log(`✅ Deleted product ID ${id}`);
};

const getProductByID = async (id: number) => {
  return await prisma.product.findUnique({
    where: { id },
  });
};

const updateProductById = async (
  id: number,
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image?: string | null
) => {
  await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      image,
    },
  });
};
const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User
) => {
  const userId = (user as { id: number }).id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { cartDetails: true },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Product not found");

  if (cart) {
    const existingDetail = cart.cartDetails.find(
      (detail) => detail.productId === productId
    );

    if (existingDetail) {
      await prisma.cartDetail.update({
        where: { id: existingDetail.id },
        data: { quantity: existingDetail.quantity + quantity },
      });
    } else {
      await prisma.cartDetail.create({
        data: {
          cartId: cart.id,
          productId,
          price: product.price,
          quantity,
        },
      });
    }
    await prisma.cart.update({
      where: { userId },
      data: { sum: cart.sum + quantity * product.price },
    });
  } else {
    await prisma.cart.create({
      data: {
        userId,
        sum: quantity,
        cartDetails: {
          create: [
            {
              productId,
              price: product.price,
              quantity,
            },
          ],
        },
      },
    });
  }
};

export {
  createProduct,
  getProductList,
  handleDeleteProduct,
  getProductByID,
  updateProductById,
  addProductToCart,
};
