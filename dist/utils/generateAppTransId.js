"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAppTransId = void 0;
const generateAppTransId = () => {
    const now = Date.now();
    return `zp_${now}_${Math.floor(Math.random() * 10000)}`;
};
exports.generateAppTransId = generateAppTransId;
//# sourceMappingURL=generateAppTransId.js.map