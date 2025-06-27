import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getRoleUserByID, handleLogin } from "../services/client/auth-service";
import { prisma } from "../config/client";
import { getCartItemCount } from "../services/client/item-service";

const configPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async function verify(email, password, done) {
        // console.log(">>>>>> Login info: ", email, password);
        return await handleLogin(email, password, done);
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        console.warn("⚠️ User không tồn tại trong database - sẽ huỷ session.");
        return done(null, false);
      }

      const userWithRole = await getRoleUserByID(id);
      const sumCart = await getCartItemCount(id);
      return done(null, { ...userWithRole, sumCart: sumCart });
    } catch (error) {
      console.error("Lỗi khi deserializeUser:", error);
      return done(error);
    }
  });
};

export { configPassportLocal };
