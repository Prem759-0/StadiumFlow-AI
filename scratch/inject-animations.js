const fs = require('fs');

let content = fs.readFileSync('app/globals.css', 'utf8');

// 1. Add animation keyframes
if (!content.includes('hover-jitter')) {
  content = content.replace(
    /--animate-wiggle:[^;]+;/g,
    `--animate-wiggle:        wiggle 0.5s ease-in-out;
  --animate-hover-jitter:  hover-jitter 0.3s ease-in-out infinite alternate;
  --animate-comic-pop:     comic-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;`
  );

  content = content.replace(
    /@keyframes wiggle \{[^}]+\}/g,
    `@keyframes wiggle {
    0%,100% { transform:rotate(0); }
    25%     { transform:rotate(-3deg); }
    75%     { transform:rotate(3deg); }
  }
  @keyframes hover-jitter {
    0% { transform: translate(2px, 2px) rotate(0deg); }
    25% { transform: translate(1px, 3px) rotate(-1deg); }
    50% { transform: translate(3px, 1px) rotate(1deg); }
    75% { transform: translate(2px, 2px) rotate(-0.5deg); }
    100% { transform: translate(1px, 2px) rotate(0.5deg); }
  }
  @keyframes comic-pop {
    0% { transform: scale(0.8) rotate(-2deg); opacity: 0; box-shadow: 0 0 0 #000; }
    50% { transform: scale(1.05) rotate(1deg); opacity: 1; box-shadow: 8px 8px 0 #000; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; box-shadow: 6px 6px 0 #000; }
  }`
  );
}

// 2. Add animation classes to cards
content = content.replace(
  /\.nb-card\s*\{[^}]*\}/g,
  `.nb-card {
  background: #FFFFFF;
  color: #050505;
  border: 3px solid #000000;
  box-shadow: 6px 6px 0 #000;
  border-radius: 8px;
  transition: box-shadow .12s ease, transform .12s ease;
  animation: comic-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}`
);

// 3. Add hover-jitter to buttons
content = content.replace(
  /\.nb-btn:hover\s*\{\s*box-shadow:2px 2px 0 #000;\s*transform:translate\(2px,2px\);\s*\}/g,
  `.nb-btn:hover  { box-shadow:2px 2px 0 #000; transform:translate(2px,2px); animation: hover-jitter 0.3s ease-in-out infinite alternate; }`
);

content = content.replace(
  /\.nb-btn:active\s*\{\s*box-shadow:0 0 0 #000;\s*transform:translate\(4px,4px\);\s*\}/g,
  `.nb-btn:active { box-shadow:0 0 0 #000; transform:translate(4px,4px); animation: none; }`
);

content = content.replace(
  /\.nb-btn-outline:hover\s*\{\s*box-shadow:2px 2px 0 rgba\(255,255,255,0\.2\);\s*transform:translate\(2px,2px\);\s*\}/g,
  `.nb-btn-outline:hover  { box-shadow:2px 2px 0 #000; transform:translate(2px,2px); animation: hover-jitter 0.3s ease-in-out infinite alternate; }`
);

content = content.replace(
  /\.nb-btn-outline:active\s*\{\s*box-shadow:0 0 0 rgba\(255,255,255,0\.2\);\s*transform:translate\(4px,4px\);\s*\}/g,
  `.nb-btn-outline:active { box-shadow:0 0 0 #000; transform:translate(4px,4px); animation: none; }`
);

// Ensure .nb-btn-outline is dark text since we are on light background
content = content.replace(
  /\.nb-btn-outline\s*\{([^}]*)color:\s*#F5F0E8;([^}]*)border:\s*2px solid rgba\(255,255,255,0\.5\);([^}]*)box-shadow:\s*4px 4px 0 rgba\(255,255,255,0\.2\);([^}]*)\}/g,
  `.nb-btn-outline {$1color: #050505;$2border: 2px solid #000;$3box-shadow: 4px 4px 0 #000;$4}`
);

fs.writeFileSync('app/globals.css', content);
console.log('globals.css advanced animations injected successfully.');
