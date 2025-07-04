import {
  createProduct,
  getProductByID,
  handleDeleteProduct,
  updateProductById,
} from "../../services/admin/product-service";
import { prisma } from "../../config/client";
import { Request, RequestHandler, Response } from "express";
import {
  getOrderAdmin,
  getOrderDetailAdmin,
} from "../../services/admin/order-service";
import { getAllUsers } from "../../services/admin/user-service";

const getAdminProductPage = async (req: Request, res: Response) => {
  const user = req.user as any;

  return res.render("admin/layout/product/create-product.ejs", {
    user,
  });
};

const postAdminProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      detailDesc,
      shortDesc,
      quantity,
      factory,
      target,
      ram,
      storage,
      os,
      status,
      screen,
      battery,
      camera,
      rating,
    } = req.body;

    const image = req.file?.filename || "";

    await createProduct(
      name,
      parseFloat(price),
      detailDesc,
      shortDesc,
      parseInt(quantity),
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
      parseFloat(rating)
    );

    return res.redirect("/admin/product");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleDeleteProduct(+id);
  return res.redirect("/admin/product");
};

const getProductPage = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  const user = req.user as any;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: offset,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.product.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.render("admin/layout/product/product.ejs", {
    products,
    page,
    limit,
    totalPages,
    user,
  });
};

const getViewProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductByID(+id);
  const user = req.user as any;
  const factoryOptions = [
    { name: "Apple", value: "APPLE" },
    { name: "Samsung", value: "SAMSUNG" },
    { name: "Oppo", value: "OPPO" },
    { name: "Xiaomi", value: "XIAOMI" },
    { name: "Realme", value: "REALME" },
    { name: "Vivo", value: "VIVO" },
  ];

  const targetOptions = [
    { name: "Gaming", value: "Gaming" },
    { name: "Thin & Light", value: "Thin & Light" },
    { name: "HOT", value: "HOT" },
  ];

  const osOptions = ["iOS", "Android", "HarmonyOS"];
  const statusOptions = ["Còn hàng", "Hết hàng", "Ngừng kinh doanh"];
  const ramOptions = ["4GB", "6GB", "8GB", "12GB"];
  const storageOptions = ["64GB", "128GB", "256GB", "512GB"];
  const screenOptions = ["6.1 inch", "6.5 inch", "6.7 inch", "7.0 inch"];
  const batteryOptions = ["3500mAh", "4000mAh", "4500mAh", "5000mAh"];
  const cameraOptions = ["12MP", "48MP", "64MP", "108MP"];

  return res.render("admin/layout/product/view-product.ejs", {
    product,
    factoryOptions,
    targetOptions,
    osOptions,
    statusOptions,
    ramOptions,
    storageOptions,
    screenOptions,
    batteryOptions,
    cameraOptions,
    user,
  });
};

const postUpdateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const {
    name,
    price,
    detailDesc,
    shortDesc,
    quantity,
    factory,
    target,
    ram,
    storage,
    os,
    status,
    screen,
    battery,
    camera,
    rating,
  } = req.body;

  const oldProduct = await getProductByID(+id);
  const image = req.file?.filename || oldProduct?.image || "";

  await updateProductById(
    +id,
    name,
    parseFloat(price),
    detailDesc,
    shortDesc,
    parseInt(quantity),
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
    parseFloat(rating) || 0
  );

  return res.redirect("/admin/product");
};

const getOrderPage = async (req: Request, res: Response) => {
  const orders = await getOrderAdmin();
  const users = await getAllUsers();
  const user = req.user as any;
  return res.render("admin/layout/order/dashboard.ejs", {
    orders,
    users,
    user,
  });
};

const getOrderDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as any;

  const orderDetails = await getOrderDetailAdmin(+id);
  console.log(orderDetails);
  return res.render("admin/layout/order/view-order.ejs", {
    orderDetails,
    user,
  });
};

export {
  getAdminProductPage,
  postAdminProduct,
  deleteProduct,
  getProductPage,
  getViewProduct,
  postUpdateProduct,
  getOrderPage,
  getOrderDetailPage,
};
