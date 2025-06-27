import { hashPasswords } from "../services/admin/user-service";
import { prisma } from "./client";
import { ACCOUNT_TYPE } from "./constant";

const initData = async () => {
  const defaultPassword = await hashPasswords("123456");
  const adminRoles = await prisma.role.findFirst({
    where: { name: "ADMIN" },
  });

  if (adminRoles) {
    try {
      await prisma.user.upsert({
        where: { username: "hoainam205@gmail.com" },
        update: {}, 
        create: {
          fullname: "Nam Hoai",
          username: "hoainam205@gmail.com",
          password: defaultPassword,
          accountType: ACCOUNT_TYPE.SYSTEM,
          address: "Ha Noi",
          avatar:
            "https://i.pinimg.com/736x/03/82/39/0382396087da28c40b9950580447ad8b.jpg",
          roleID: adminRoles.id,
        },
      });

      await prisma.user.upsert({
        where: { username: "hoainam2053@gmail.com" },
        update: {},
        create: {
          fullname: "Hoai Nam",
          username: "hoainam2053@gmail.com",
          password: defaultPassword,
          accountType: ACCOUNT_TYPE.SYSTEM,
          address: "HCM",
          avatar:
            "https://i.pinimg.com/736x/67/12/95/671295e651e221b93ea71d736d1df0b2.jpg",
          roleID: adminRoles.id,
        },
      });

      console.log("✅ Seed dữ liệu user thành công.");
    } catch (error) {
      console.error("❌ Lỗi khi khởi tạo dữ liệu:", error);
    }
  }
};

export default initData;
