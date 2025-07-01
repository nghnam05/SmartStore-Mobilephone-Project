import {
  getCartItemCount,
  getProduct,
} from "../../services/client/product-service";
import { prisma } from "../../config/client";
import { Request, RequestHandler, Response } from "express";
import { addProductToCart } from "../../services/admin/product-service";

const postReview = async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { content, rating } = req.body;
  const user = req.user as { id: number };

  try {
    await prisma.review.create({
      data: {
        content,
        rating: parseInt(rating),
        productId: +productId,
        userId: user.id,
      },
    });

    res.redirect(`/product/${productId}`);
  } catch (error) {
    console.error("Lỗi khi gửi đánh giá:", error);
    res.status(500).send("Server Error");
  }
};

const getProductDetailPage = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        Review: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!product) {
      return res.status(404).render("error/404");
    }

    const products = await getProduct();

    res.render("client/product/detail", { product, products, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const showEditReview: RequestHandler = async (req, res) => {
  const { reviewId } = req.params;
  const user = req.user as { id: number };

  const review = await prisma.review.findUnique({
    where: { id: +reviewId },
    include: { product: true },
  });

  if (!review || review.userId !== user.id) {
    res.status(403).send("Unauthorized");
    return;
  }

  res.render("client/product/edit-review", {
    review,
    product: review.product,
  });
};

const updateReview: RequestHandler = async (req, res) => {
  const { productId, reviewId } = req.params;
  const { rating, content } = req.body;
  const user = req.user as { id: number };

  const review = await prisma.review.findUnique({ where: { id: +reviewId } });
  if (!review || review.userId !== user.id) {
    res.status(403).send("Unauthorized");
    return;
  }

  await prisma.review.update({
    where: { id: +reviewId },
    data: { rating: +rating, content },
  });

  res.redirect(`/product/${productId}`);
};

const deleteReview: RequestHandler = async (req, res) => {
  const { productId, reviewId } = req.params;
  const user = req.user as { id: number };

  const review = await prisma.review.findUnique({ where: { id: +reviewId } });
  if (!review || review.userId !== user.id) {
    res.status(403).send("Unauthorized");
    return;
  }

  await prisma.review.delete({ where: { id: +reviewId } });

  res.redirect(`/product/${productId}`);
};

const PostAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const cartItemCount = await getCartItemCount(req.user);
  if (user) {
    await addProductToCart(1, +id, user);
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};
export {
  postReview,
  getProductDetailPage,
  showEditReview,
  updateReview,
  deleteReview,
  PostAddProductToCart,
};
