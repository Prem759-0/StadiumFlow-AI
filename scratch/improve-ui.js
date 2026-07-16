const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.next')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('app');
files.push(...walkSync('components'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace background colors from dark to white
  content = content.replace(/background:\s*["']#(?:050505|111|111111|1a1a1a|222)["']/gi, 'background: "#FFFFFF"');
  
  // Also we want to ensure text color is #050505 on these white cards, but wait...
  // In the previous step I made text F5F0E8 on pitch black cards.
  // Let's replace F5F0E8 text color with 050505.
  content = content.replace(/color:\s*["']#F5F0E8["']/g, 'color: "#050505"');
  
  // Make comic panels and cards have white background instead of #050505
  content = content.replace(/className=["']([^"']*)comic-panel([^"']*)["']/g, 'className="$1comic-panel bg-white$2"');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
