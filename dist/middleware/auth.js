"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockAdminHome = exports.checkAuth = exports.isAdmin = exports.isLogin = void 0;
/**
 * Ngăn không cho người đã đăng nhập truy cập /login, /register
 */
const isLogin = (req, res, next) => {
    var _a;
    if (req.isAuthenticated()) {
        const user = req.user;
        if (((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) === "ADMIN") {
            return res.redirect("/admin");
        }
        return res.status(403).render("admin/status/404");
    }
    return next();
};
exports.isLogin = isLogin;
const blockAdminHome = (req, res, next) => {
    var _a;
    const user = req.user;
    if (req.isAuthenticated() && ((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) === "ADMIN") {
        return res.status(403).render("admin/status/404");
    }
    return next();
};
exports.blockAdminHome = blockAdminHome;
const isAdmin = (req, res, next) => {
    var _a;
    const user = req.user;
    if (req.isAuthenticated() && ((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) === "ADMIN") {
        return next();
    }
    return res.status(403).render("admin/status/404");
};
exports.isAdmin = isAdmin;
/**
 * Bảo vệ route cần đăng nhập
 */
const checkAuth = (req, res, next) => {
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    req.logout(() => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=auth.js.map