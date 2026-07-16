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

  // Replace text colors
  content = content.replace(/#9fa8da/g, '#555555');
  content = content.replace(/text-white/g, 'text-black');
  
  // Replace semi-transparent white backgrounds with something better suited for light mode
  // e.g. rgba(255,255,255,0.12) -> rgba(0,0,0,0.05) or transparent if it's just a spacer
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.05\)/g, 'rgba(0,0,0,0.04)');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.12\)/g, '#000000');
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, '#000000');
  
  // Clean up any stray background: "none" or etc that was missed
  content = content.replace(/text-gray-300/g, 'text-gray-700');
  content = content.replace(/text-gray-400/g, 'text-gray-600');
  content = content.replace(/text-gray-500/g, 'text-gray-600');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated visibility in ${file}`);
  }
});
