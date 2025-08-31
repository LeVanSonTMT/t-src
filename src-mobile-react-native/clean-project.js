const fs = require('fs');
const path = require('path');

const DIRS_TO_REMOVE = [
  'android/app/build',
  'ios/build',
];

const REMOVE_FILE_EXTENSIONS = [
  '.log',
  '.tmp',
  '.jsbundle',
  '.map',
  '.bak',
];

const SIZE_LIMIT_MB = 20;

function formatSize(size) {
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function removeDirRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`🗑️ Removed directory: ${dirPath}`);
  }
}

function scanAndClean(dir) {
  // Xóa các thư mục build trước
  DIRS_TO_REMOVE.forEach(d => {
    const fullPath = path.join(dir, d);
    removeDirRecursive(fullPath);
  });

  // Scan để xóa file rác
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Bỏ qua đã xóa bên trên
      if (DIRS_TO_REMOVE.some(d => fullPath.includes(path.join(dir, d)))) {
        continue;
      }
      scanAndClean(fullPath);
    } else {
      const ext = path.extname(item).toLowerCase();

      if (REMOVE_FILE_EXTENSIONS.includes(ext)) {
        fs.unlinkSync(fullPath);
        console.log(`🗑️ Removed file: ${path.relative(process.cwd(), fullPath)}`);
        continue;
      }

      if (stats.size > SIZE_LIMIT_MB * 1024 * 1024) {
        console.warn(`⚠️ LARGE FILE: ${path.relative(process.cwd(), fullPath)} (${formatSize(stats.size)})`);
      }
    }
  }
}

console.log('🧹 Cleaning project...');

scanAndClean(process.cwd());

console.log('✅ Done!');
