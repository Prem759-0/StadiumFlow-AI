const fs = require('fs');

let content = fs.readFileSync('app/globals.css', 'utf8');

// 1. Body background and color (lines 143-153)
content = content.replace(
  /body\s*\{[^}]*overflow-x:\s*hidden;\s*\}/,
  `body {
  background-color: #F5F0E8;
  color: #050505;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  /* Comic-book dot halftone */
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.1);
  overflow-x: hidden;
}`
);

// 2. Custom scrollbar track
content = content.replace(/::-webkit-scrollbar-track\s*\{\s*background:#111;\s*\}/, '::-webkit-scrollbar-track  { background:#F5F0E8; }');
content = content.replace(/::-webkit-scrollbar-thumb\s*\{\s*background:#00FF87;\s*border-radius:3px;\s*\}/, '::-webkit-scrollbar-thumb  { background:#00FF87; border:1px solid #000; border-radius:3px; }');

// 3. nb-card background to white, text to black
content = content.replace(
  /\.nb-card\s*\{\s*background:\s*#111111;\s*border:\s*2px solid #000000;\s*box-shadow:\s*4px 4px 0 #000;\s*transition:\s*box-shadow \.12s ease, transform \.12s ease;\s*\}/,
  `.nb-card {
  background: #FFFFFF;
  color: #050505;
  border: 3px solid #000000;
  box-shadow: 6px 6px 0 #000;
  border-radius: 8px;
  transition: box-shadow .12s ease, transform .12s ease;
}`
);

// 4. Update glass classes
content = content.replace(
  /\.glass\s*\{[^}]*\}\s*\.glass-strong\s*\{[^}]*\}/,
  `.glass      { background:#FFFFFF; border:3px solid #000; box-shadow:6px 6px 0 #000; color: #050505; border-radius: 8px; }
.glass-strong { background:#FFFFFF; border:3px solid #000; box-shadow:6px 6px 0 #000; color: #050505; border-radius: 8px; }`
);

// 5. Add custom cursor CSS at the end
if (!content.includes('CUSTOM CURSOR')) {
  content += `

/* ════════════════════════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════════════════════════ */
#custom-cursor-dot {
  position: fixed;
  top: 0; left: 0;
  width: 8px; height: 8px;
  background: #000;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
}
#custom-cursor-ring {
  position: fixed;
  top: 0; left: 0;
  width: 32px; height: 32px;
  border: 2px solid #000;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.15s ease-out, height 0.15s ease-out, background 0.15s ease-out, border-style 0.15s ease-out, border-color 0.15s ease-out;
}
body.cursor-hover #custom-cursor-ring {
  width: 48px;
  height: 48px;
  background: rgba(255, 45, 45, 0.1);
  border: 3px dashed #FF2D2D;
  animation: cursor-spin 4s linear infinite;
}

@keyframes cursor-spin {
  100% { transform: translate3d(var(--cx), var(--cy), 0) translate(-50%, -50%) rotate(360deg); }
}`;
}

fs.writeFileSync('app/globals.css', content);
console.log('globals.css successfully updated for Neo-Brutalist White mode.');
