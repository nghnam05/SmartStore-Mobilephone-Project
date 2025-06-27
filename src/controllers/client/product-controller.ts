import { Request, Response } from "express";

const getProductsPage = async (req: Request, res: Response) => {
  return res.render("client/layout/product/detail.ejs");
};

export { getProductsPage };
