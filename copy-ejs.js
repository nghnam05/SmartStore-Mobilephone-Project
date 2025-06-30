// copy-ejs.js
const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "src", "views");
const destDir = path.join(__dirname, "dist", "views");

const copyRecursiveSync = (src, dest) => {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyRecursiveSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

copyRecursiveSync(srcDir, destDir);
console.log("✅ Copied views to dist/views");
