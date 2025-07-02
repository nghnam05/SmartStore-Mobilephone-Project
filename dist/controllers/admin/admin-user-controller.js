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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdate = exports.handleViewUser = exports.handleDelete = exports.handleCreateUser = exports.createUser = exports.getHomePage = void 0;
const user_service_1 = require("../../services/admin/user-service");
const client_1 = require("../../config/client");
const getHomePage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;
    const [products, total] = yield Promise.all([
        client_1.prisma.product.findMany({
            skip: offset,
            take: limit,
            orderBy: { id: "asc" },
            select: {
                id: true,
                name: true,
                image: true,
                price: true,
                detailDesc: true,
                quantity: true,
                ram: true,
                storage: true,
                rating: true,
                factory: true,
            },
        }),
        client_1.prisma.product.count(),
    ]);
    const totalPages = Math.ceil(total / limit);
    let sumCart = 0;
    if (user) {
        const cart = yield client_1.prisma.cart.findFirst({
            where: { userId: user.id },
            include: { cartDetails: true },
        });
        sumCart =
            (cart === null || cart === void 0 ? void 0 : cart.cartDetails.reduce((total, item) => total + item.quantity, 0)) || 0;
    }
    return res.render("client/home/home.ejs", {
        products,
        page,
        limit,
        totalPages,
        sumCart,
        user,
    });
});
exports.getHomePage = getHomePage;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield (0, user_service_1.getAllRoles)();
    return res.render("admin/layout/user/create-user.ejs", {
        roles,
    });
});
exports.createUser = createUser;
const handleCreateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, username, phone, role, address } = req.body;
    // console.log("req.body toàn bộ:", req.body);
    const file = req.file;
    const avatar = (file === null || file === void 0 ? void 0 : file.filename) || null;
    yield (0, user_service_1.handleCreateNewUser)(fullname, username, address, phone, avatar, role);
    return res.redirect("/admin/user");
});
exports.handleCreateUser = handleCreateUser;
const handleDelete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = req.user;
    if (user.id === Number(id)) {
        res.status(400).send("Bạn không thể tự xóa tài khoản của mình!");
        return;
    }
    try {
        yield (0, user_service_1.handleDeleteUser)(id, user.id);
        res.redirect("/admin/user");
    }
    catch (error) {
        res.status(400).send(error.message || "Xóa user thất bại");
    }
});
exports.handleDelete = handleDelete;
// view user
const handleViewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
        res.status(400).send("Invalid ID");
    }
    try {
        const user = yield client_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).send("User not found");
        }
        const roles = yield client_1.prisma.role.findMany();
        res.render("admin/layout/user/view-user", {
            user,
            roles,
        });
    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).send("Internal Server Error");
    }
});
exports.handleViewUser = handleViewUser;
const handleUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id, fullname, username, phone, role, address } = req.body;
    const file = req.file;
    const avatar = (_a = file === null || file === void 0 ? void 0 : file.filename) !== null && _a !== void 0 ? _a : null;
    yield (0, user_service_1.UpdateUserById)(id, fullname, username, address, phone, role, avatar);
    // console.log(req.body);
    return res.redirect("/admin/user");
});
exports.handleUpdate = handleUpdate;
//# sourceMappingURL=admin-user-controller.js.map