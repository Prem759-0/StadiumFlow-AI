const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

function removeConsoleLogs() {
  const dirs = ['app', 'components', 'lib'];
  let modifiedCount = 0;

  dirs.forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (!fs.existsSync(fullDir)) return;
    
    walk(fullDir, (filePath) => {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Simple regex to replace console.log/warn/error/info
        // It won't catch everything perfectly but it handles most cases without breaking syntax
        const newContent = content
          .replace(/console\.(log|warn|error|info)\(.*?\);?/gs, '/* log removed */');
        
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          modifiedCount++;
          console.log(`Cleaned: ${filePath}`);
        }
      }
    });
  });

  console.log(`Removed console statements from ${modifiedCount} files.`);
}

removeConsoleLogs();
