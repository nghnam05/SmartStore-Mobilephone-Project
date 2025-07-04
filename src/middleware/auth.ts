import { NextFunction, Request, Response } from "express";

/**
 * Ngăn không cho người đã đăng nhập truy cập /login, /register
 */
const isLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    if (user?.role?.name === "ADMIN") {
      return res.redirect("/admin");
    }
    return res.status(403).render("admin/status/404");
  }
  return next();
};

const blockAdminHome = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;

  if (req.isAuthenticated() && user?.role?.name === "ADMIN") {
    return res.status(403).render("admin/status/404");
  }
  return next();
};
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  // console.log("Auth:", req.isAuthenticated());
  // console.log("User info:", user);

  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  if (user?.role?.name?.toUpperCase() !== "ADMIN") {
    return res.status(403).render("admin/status/404");
  }

  return next();
};

/**
 * Bảo vệ route cần đăng nhập
 */
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    return next();
  }
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });
};

export { isLogin, isAdmin, checkAuth, blockAdminHome };
