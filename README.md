# 📱 SmartStore-Mobilephone-Project – Hướng dẫn chạy và quản lý dự án

---

## 🌐 Tích hợp giao diện với Tidio chat app:

- Dashboard: [https://www.tidio.com/panel/inbox/conversations/unassigned/37c4192609d4451e8a148676c9a4b811](https://www.tidio.com/panel/inbox/conversations/unassigned/37c4192609d4451e8a148676c9a4b811)

---

## 🔄 Khi thay đổi file `prisma/schema.prisma`:

```bash
npx prisma generate
npx prisma migrate dev --name update
```

---

## 🌱 Khi cần chạy file `seed.ts` để thêm dữ liệu mẫu:

```bash
npx ts-node -r tsconfig-paths/register src/config/seed.ts
```

---

## 📀 Export database trước khi push lên Git:

```bash
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -u root -p userdashboard > database\backup.sql
```

---

## ♻️ Khôi phục dữ liệu (khi mất hoặc clone về):

````bash
mysql -u root -p userdashboard < database/backup.sql
OR
"/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" -u root -p userdashboard < database/backup.sql



> Nhập mật khẩu MySQL khi được yêu cầu.

---

## 🚀 CÁCH CHẠY DỰ ÁN SAU KHI CLONE VỀ

### 1️⃣ Clone repo

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo-folder>
````

### 2️⃣ Cập nhật file `.env`:

```env
DATABASE_URL="mysql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>"
```

Ví dụ:

```env
DATABASE_URL="mysql://root:123456@localhost:3306/userdashboard"
```

### 3️⃣ Cập nhật lại password trong `src/config/database.ts` nếu cần

---

### 4️⃣ Tạo database thủ công:

```sql
mysql -u root -p
```

```sql
CREATE DATABASE userdashboard;
EXIT;
```

---

### 5️⃣ Import dữ liệu:

```bash
mysql -u root -p userdashboard < database/backup.sql
```

---

### 6️⃣ Cài dependencies và chạy project:

```bash
npm install
npx prisma generate
npm run dev
```

---

## 📌 Ghi chú

- Đảm bảo cài sẵn Node.js, MySQL và Prisma CLI
- Đảm bảo port, user/password MySQL trùng với file `.env` và `schema.prisma`
- KHÔNG mở file `backup.sql` bằng VS Code hoặc editor nếu không sửa gì

---

Vậy là bạn đã có thể chạy được project đầy đủ frontend + backend + database như máy chính! 🚀
