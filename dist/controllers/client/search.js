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
exports.suggestProducts = void 0;
const client_1 = require("../../config/client");
const suggestProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const q = (_a = req.query.q) === null || _a === void 0 ? void 0 : _a.trim();
    if (!q) {
        res.json([]);
        return;
    }
    const products = yield client_1.prisma.product.findMany({
        where: {
            name: {
                contains: q.toLowerCase(),
            },
        },
        select: {
            id: true,
            name: true,
        },
        take: 5,
    });
    res.json(products);
});
exports.suggestProducts = suggestProducts;
//# sourceMappingURL=search.js.map