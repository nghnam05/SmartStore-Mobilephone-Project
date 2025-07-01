import { prisma } from "../../config/client";

//  Create Product

const createProduct = async (
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string,
  ram: string,
  storage: string,
  os: string,
  status: string,
  screen: string,
  battery: string,
  camera: string,
  rating: number
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
      ram,
      storage,
      os,
      status,
      screen,
      battery,
      camera,
      rating,
    },
  });
};


//  Get All Products

const getProductList = async () => {
  return prisma.product.findMany();
};


//  Get Product by ID

const getProductByID = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
  });
};


// Update Product

const updateProductById = async (
  id: number,
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string,
  ram: string,
  storage: string,
  os: string,
  status: string,
  screen: string,
  battery: string,
  camera: string,
  rating: number
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
      ram,
      storage,
      os,
      status,
      screen,
      battery,
      camera,
      rating,
    },
  });
};


// ❌ Delete Product

const handleDeleteProduct = async (id: number) => {
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    console.log(`❌ Product with ID ${id} not found.`);
    return;
  }

  // Xoá dữ liệu liên quan
  await prisma.cartDetail.deleteMany({ where: { productId: id } });
  await prisma.orderDetail.deleteMany({ where: { productId: id } });

  await prisma.product.delete({ where: { id } });

  console.log(`✅ Deleted product ID ${id}`);
};


//  Add Product to Cart
const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User
) => {
  const userId = (user as { id: number }).id;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");

  // ❗Kiểm tra tồn kho
  if (product.quantity < quantity) {
    throw new Error("Not enough stock");
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { cartDetails: true },
  });

  if (cart) {
    const existingDetail = cart.cartDetails.find(
      (detail) => detail.productId === productId
    );

    if (existingDetail) {
      await prisma.cartDetail.update({
        where: { id: existingDetail.id },
        data: {
          quantity: existingDetail.quantity + quantity,
        },
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
      data: {
        sum: cart.sum + quantity * product.price,
      },
    });
  } else {
    await prisma.cart.create({
      data: {
        userId,
        sum: quantity * product.price,
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

  // 🔄 Cập nhật lại tồn kho sản phẩm
  await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: product.quantity - quantity,
    },
  });
};


//  Export Functions

export {
  createProduct,
  getProductList,
  getProductByID,
  updateProductById,
  handleDeleteProduct,
  addProductToCart,
};
