"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.postLogout = exports.getSuccessRedirect = exports.postRegister = exports.getRegisterPage = exports.getLoginPage = void 0;
const passport_1 = __importDefault(require("passport"));
const login_schemas_1 = require("../../schemas/login.schemas");
const auth_service_1 = require("../../services/client/auth-service");
const getLoginPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = req.session;
    const messages = (_a = session === null || session === void 0 ? void 0 : session.messages) !== null && _a !== void 0 ? _a : [];
    if (session) {
        delete session.messages;
    }
    return res.render("client/auth/login.ejs", {
        messages,
    });
});
exports.getLoginPage = getLoginPage;
const postLogin = (req, res, next) => {
    passport_1.default.authenticate("local", (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            req.session.messages = [(info === null || info === void 0 ? void 0 : info.message) || "Đăng nhập thất bại."];
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
};
exports.postLogin = postLogin;
// register page
const getRegisterPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/auth/register.ejs", {
        oldData: {
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        errors: [],
    });
});
exports.getRegisterPage = getRegisterPage;
// post value sau khi dki
const postRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validate = yield login_schemas_1.UserSchemas.safeParseAsync(req.body);
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
        yield (0, auth_service_1.registerNewUSer)(fullname, email, password);
        return res.redirect("/login");
    }
    catch (error) {
        console.error("Error during registration:", error);
        return res.render("client/auth/register.ejs", {
            errors: [error.message || "Đăng ký thất bại"],
            oldData: req.body,
        });
    }
});
exports.postRegister = postRegister;
const getSuccessRedirect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user;
    if (((_a = user === null || user === void 0 ? void 0 : user.role) === null || _a === void 0 ? void 0 : _a.name) === "ADMIN") {
        return res.redirect("/admin");
    }
    return res.redirect("/");
});
exports.getSuccessRedirect = getSuccessRedirect;
const postLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.logOut(function (err) {
        if (err)
            return next(err);
        req.session.destroy((err) => {
            if (err)
                return next(err);
            res.clearCookie("connect.sid");
            res.redirect("/");
        });
    });
});
exports.postLogout = postLogout;
//# sourceMappingURL=auth-controller.js.map