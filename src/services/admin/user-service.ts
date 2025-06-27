// import { hashPasswords } from 'src/services/user-service';
// import { Query } from "./../../node_modules/mysql2/typings/mysql/index.d";
// import { Prisma } from "@prisma/client";
// import getConnect from "../config/database";
import { prisma } from "../../config/client";
import { ACCOUNT_TYPE } from "../../config/constant";

import bcrypt from "bcrypt";
const saltRounds = 10; //do phuc tap cua thuat toan

const hashPasswords = async (plaintext: string) => {
  return await bcrypt.hash(plaintext, saltRounds);
};

const comparePassword = async (plaintext: string, hashPasswords: string) => {
  return await bcrypt.compare(plaintext, hashPasswords);
};

const handleCreateNewUser = async (
  name: string,
  email: string,
  address: string,
  phone: string,
  avatar: string,
  role: string
) => {
  const roleID = parseInt(role, 10);
  if (isNaN(roleID)) {
    throw new Error("role không hợp lệ. Phải là số nguyên ID.");
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      username: email,
    },
  });

  if (existingUser) {
    throw new Error("Email này đã tồn tại trong hệ thống!");
  }

  const defaultPassword = await hashPasswords("123456");

  const newUser = await prisma.user.create({
    data: {
      fullname: name,
      username: email,
      address: address,
      password: defaultPassword,
      accountType: ACCOUNT_TYPE.SYSTEM,
      avatar: avatar,
      phone: phone,
      roleID: roleID,
    },
  });

  return newUser;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
  // const connection = await getConnect();
  // try {
  //   const [results, fields] = await connection.execute("SELECT * FROM `user`");
  //   return results;
  // } catch (err) {
  //   console.error("Error selecting users:", err);
  //   throw err;
  // }
};
const getAllRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
  // const connection = await getConnect();
  // try {
  //   const [results, fields] = await connection.execute("SELECT * FROM `user`");
  //   return results;
  // } catch (err) {
  //   console.error("Error selecting users:", err);
  //   throw err;
  // }
};
const handleDeleteUser = async (
  targetUserId: string,
  currentUserId: number
) => {
  const idToDelete = +targetUserId;

  if (idToDelete === currentUserId) {
    throw new Error("❌ Bạn không thể tự xóa tài khoản của mình!");
  }

  // Xóa cartDetail của user
  await prisma.cartDetail.deleteMany({
    where: {
      cart: {
        userId: idToDelete,
      },
    },
  });

  // Xóa cart của user
  await prisma.cart.deleteMany({
    where: {
      userId: idToDelete,
    },
  });

  // Xóa orderDetail liên quan đến các order của user
  await prisma.orderDetail.deleteMany({
    where: {
      order: {
        userId: idToDelete,
      },
    },
  });

  // Xóa các order của user
  await prisma.order.deleteMany({
    where: {
      userId: idToDelete,
    },
  });

  // Xóa user
  await prisma.user.delete({
    where: { id: idToDelete },
  });
};


const UpdateUserById = async (
  id: string,
  name: string,
  email: string,
  address: string,
  phone: string,
  role: string,
  avatar: string
) => {
  // console.log(">> role nhận được:", role);
  const roleID = parseInt(role, 10);
  if (isNaN(roleID)) {
    throw new Error("Role không hợp lệ. Phải là số.");
  }

  const updateUser = await prisma.user.update({
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
};

const getUserByID = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("❌ Lỗi getUserByID:", error);
    throw error;
  }
};

export {
  handleCreateNewUser,
  getAllUsers,
  handleDeleteUser,
  UpdateUserById,
  getAllRoles,
  hashPasswords,
  comparePassword,
  getUserByID,
};
