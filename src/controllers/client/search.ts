import { Request, Response } from "express";
import { prisma } from "../../config/client";

export const suggestProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const q = (req.query.q as string)?.trim();
  if (!q) {
    res.json([]);
    return;
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: q.toLowerCase(),
      },
    },
    select: {
      id: true,
      name: true,
    },
    take: 5,
  });

  res.json(products);
};
