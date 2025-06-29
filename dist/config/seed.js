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
const user_service_1 = require("../services/admin/user-service");
const client_1 = require("./client");
const constant_1 = require("./constant");
const initData = () => __awaiter(void 0, void 0, void 0, function* () {
    const defaultPassword = yield (0, user_service_1.hashPasswords)("123456");
    const adminRoles = yield client_1.prisma.role.findFirst({
        where: { name: "ADMIN" },
    });
    if (adminRoles) {
        try {
            yield client_1.prisma.user.upsert({
                where: { username: "hoainam205@gmail.com" },
                update: {},
                create: {
                    fullname: "Nam Hoai",
                    username: "hoainam205@gmail.com",
                    password: defaultPassword,
                    accountType: constant_1.ACCOUNT_TYPE.SYSTEM,
                    address: "Ha Noi",
                    avatar: "https://i.pinimg.com/736x/03/82/39/0382396087da28c40b9950580447ad8b.jpg",
                    roleID: adminRoles.id,
                },
            });
            yield client_1.prisma.user.upsert({
                where: { username: "hoainam2053@gmail.com" },
                update: {},
                create: {
                    fullname: "Hoai Nam",
                    username: "hoainam2053@gmail.com",
                    password: defaultPassword,
                    accountType: constant_1.ACCOUNT_TYPE.SYSTEM,
                    address: "HCM",
                    avatar: "https://i.pinimg.com/736x/67/12/95/671295e651e221b93ea71d736d1df0b2.jpg",
                    roleID: adminRoles.id,
                },
            });
            console.log("✅ Seed dữ liệu user thành công.");
        }
        catch (error) {
            console.error("❌ Lỗi khi khởi tạo dữ liệu:", error);
        }
    }
});
exports.default = initData;
//# sourceMappingURL=seed.js.map