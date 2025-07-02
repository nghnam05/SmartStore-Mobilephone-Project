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
exports.configPassportLocal = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const auth_service_1 = require("../services/client/auth-service");
const client_1 = require("../config/client");
const product_service_1 = require("../services/client/product-service");
const configPassportLocal = () => {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: "username",
        passwordField: "password",
    }, function verify(email, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, auth_service_1.handleLogin)(email, password, done);
        });
    }));
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield client_1.prisma.user.findUnique({ where: { id } });
            if (!user) {
                console.warn("⚠️ User không tồn tại trong database - sẽ huỷ session.");
                return done(null, false);
            }
            const userWithRole = yield (0, auth_service_1.getRoleUserByID)(id);
            const sumCart = yield (0, product_service_1.getCartItemCount)(id);
            return done(null, Object.assign(Object.assign({}, userWithRole), { sumCart: sumCart }));
        }
        catch (error) {
            console.error("Lỗi khi deserializeUser:", error);
            return done(error);
        }
    }));
};
exports.configPassportLocal = configPassportLocal;
//# sourceMappingURL=passport-local.js.map