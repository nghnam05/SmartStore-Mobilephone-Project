"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchemas = void 0;
const zod_1 = require("zod");
exports.UserSchemas = zod_1.z
    .object({
    fullname: zod_1.z.string().min(1, "Full name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.z.string().min(6, "Confirm password is required"),
})
    .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});
//# sourceMappingURL=login.schemas.js.map