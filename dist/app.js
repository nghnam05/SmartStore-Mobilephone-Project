"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const method_override_1 = __importDefault(require("method-override"));
require("dotenv/config");
const web_1 = __importDefault(require("./routes/web"));
const database_1 = __importDefault(require("./config/database"));
const seed_1 = __importDefault(require("./config/seed"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("./middleware/passport-local");
const express_session_1 = __importDefault(require("express-session"));
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// 📌 Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
// 📌 Middleware xử lý body
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 📌 Static
app.use(express_1.default.static("public"));
// 📌 Session và Passport
app.use((0, express_session_1.default)({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_local_1.configPassportLocal)();
// 📌 Biến toàn cục
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});
// 📌 Kết nối DB và seed
(0, database_1.default)();
(0, seed_1.default)();
// 📌 GỌI ROUTES (gồm cả Zalo đã gộp trong webRoutes)
(0, web_1.default)(app);
// 📌 Override method PUT/DELETE
app.use((0, method_override_1.default)("_method"));
// 📌 Xử lý lỗi 403/404
app.use((req, res) => {
    const path = req.originalUrl;
    if (path.startsWith("/login") ||
        path.startsWith("/register") ||
        path.startsWith("/admin")) {
        return res.status(403).render("admin/status/403");
    }
    res.status(404).render("admin/status/404");
});
app.get("/test2", (req, res) => {
    res.send("✅ Route test2 hoạt động");
});
// ✅ BẮT ĐẦU CHẠY SERVER
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map