import { session } from "passport";
import { NextFunction, Request, Response } from "express";
import { TRegister, UserSchemas } from "../../schemas/login.schemas";
import { registerNewUSer } from "../../services/client/auth-service";

// login page
const getLoginPage = async (req: Request, res: Response) => {
  const user = req.user;
  const session = req.session as any;

  const messages = session?.messages ?? [];

  // Xoá messages khỏi session sau khi lấy ra
  if (session) {
    delete session.messages;
  }

  return res.render("client/auth/login.ejs", {
    messages,
  });
};

// register page
const getRegisterPage = async (req: Request, res: Response) => {
  res.render("client/auth/register.ejs", {
    oldData: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    errors: [],
  });
};
// post value sau khi dki
const postRegister = async (req: Request, res: Response) => {
  const validate = await UserSchemas.safeParseAsync(req.body);

  if (!validate.success) {
    const errors = validate.error.issues.map((item) => item.message);
    const oldData = req.body;
    return res.render("client/auth/register.ejs", {
      errors,
      oldData,
    });
  }

  const { fullname, email, password } = validate.data;

  try {
    await registerNewUSer(fullname, email, password);
    return res.redirect("/login");
  } catch (error: any) {
    console.error("Error during registration:", error);

    return res.render("client/auth/register.ejs", {
      errors: [error.message || "Đăng ký thất bại"],
      oldData: req.body,
    });
  }
};

const getSuccessRedirect = async (req: Request, res: Response) => {
  const user = req.user as any;

  if (user?.role?.name === "ADMIN") {
    return res.redirect("/admin");
  }
  return res.redirect("/");
};

const postLogout = async (req: Request, res: Response, next: NextFunction) => {
  req.logOut(function (err) {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.redirect("/");
    });
  });
};

export {
  getLoginPage,
  getRegisterPage,
  postRegister,
  getSuccessRedirect,
  postLogout,
};
