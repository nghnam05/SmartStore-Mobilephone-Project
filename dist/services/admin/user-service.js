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
exports.getUserByID = exports.comparePassword = exports.hashPasswords = exports.getAllRoles = exports.UpdateUserById = exports.handleDeleteUser = exports.getAllUsers = exports.handleCreateNewUser = void 0;
const client_1 = require("../../config/client");
const constant_1 = require("../../config/constant");
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const hashPasswords = (plaintext) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(plaintext, saltRounds);
});
exports.hashPasswords = hashPasswords;
const comparePassword = (plaintext, hashPasswords) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(plaintext, hashPasswords);
});
exports.comparePassword = comparePassword;
const handleCreateNewUser = (name, email, address, phone, avatar, role) => __awaiter(void 0, void 0, void 0, function* () {
    const roleID = parseInt(role, 10);
    if (isNaN(roleID)) {
        throw new Error("role không hợp lệ. Phải là số nguyên ID.");
    }
    const existingUser = yield client_1.prisma.user.findUnique({
        where: {
            username: email,
        },
    });
    if (existingUser) {
        throw new Error("Email này đã tồn tại trong hệ thống!");
    }
    const defaultPassword = yield hashPasswords("123456");
    const newUser = yield client_1.prisma.user.create({
        data: {
            fullname: name,
            username: email,
            address: address,
            password: defaultPassword,
            accountType: constant_1.ACCOUNT_TYPE.SYSTEM,
            avatar: avatar,
            phone: phone,
            roleID: roleID,
        },
    });
    return newUser;
});
exports.handleCreateNewUser = handleCreateNewUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield client_1.prisma.user.findMany();
    return users;
});
exports.getAllUsers = getAllUsers;
const getAllRoles = () => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield client_1.prisma.role.findMany();
    return roles;
});
exports.getAllRoles = getAllRoles;
const handleDeleteUser = (targetUserId, currentUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const idToDelete = +targetUserId;
    if (idToDelete === currentUserId) {
        throw new Error("❌ Bạn không thể tự xóa tài khoản của mình!");
    }
    // Xóa cartDetail của user
    yield client_1.prisma.cartDetail.deleteMany({
        where: {
            cart: {
                userId: idToDelete,
            },
        },
    });
    // Xóa cart của user
    yield client_1.prisma.cart.deleteMany({
        where: {
            userId: idToDelete,
        },
    });
    // Xóa orderDetail liên quan đến các order của user
    yield client_1.prisma.orderDetail.deleteMany({
        where: {
            order: {
                userId: idToDelete,
            },
        },
    });
    // Xóa các order của user
    yield client_1.prisma.order.deleteMany({
        where: {
            userId: idToDelete,
        },
    });
    // Xóa user
    yield client_1.prisma.user.delete({
        where: { id: idToDelete },
    });
});
exports.handleDeleteUser = handleDeleteUser;
const UpdateUserById = (id, name, email, address, phone, role, avatar) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(">> role nhận được:", role);
    const roleID = parseInt(role, 10);
    if (isNaN(roleID)) {
        throw new Error("Role không hợp lệ. Phải là số.");
    }
    const updateUser = yield client_1.prisma.user.update({
        where: { id: +id },
        data: {
            fullname: name,
            username: email,
            address: address,
            phone: phone,
            roleID: roleID,
            avatar: avatar,
        },
    });
    return updateUser;
});
exports.UpdateUserById = UpdateUserById;
const getUserByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                fullname: true,
                address: true,
                phone: true,
                avatar: true,
                roleID: true,
                accountType: true,
            },
        });
        if (!user) {
            throw new Error("User không tồn tại");
        }
        return user;
    }
    catch (error) {
        console.error("❌ Lỗi getUserByID:", error);
        throw error;
    }
});
exports.getUserByID = getUserByID;
//# sourceMappingURL=user-service.js.map