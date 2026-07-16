import sys

with open('app/globals.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update the body and html definitions
old_body = """body {
  background-color: #0A0A0A;
  color: #F5F0E8;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  /* Comic-book dot halftone */
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.028) 1px, transparent 1px);
  background-size: 22px 22px;
  overflow-x: hidden;
}"""

new_body = """body {
  background-color: #F5F0E8;
  color: #050505;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  /* Comic-book dot halftone */
  background-image: radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px);
  background-size: 24px 24px;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.1);
  overflow-x: hidden;
}"""
css = css.replace(old_body, new_body)

# 2. Update nb-card
old_card = """.nb-card {
  background: #111111;
  color: #F5F0E8;
  border: 2px solid #000000;
  box-shadow: 4px 4px 0 #000;
  border-radius: 8px;
  transition: box-shadow .12s ease, transform .12s ease;
}"""
new_card = """.nb-card {
  background: #FFFFFF;
  color: #050505;
  border: 3px solid #000000;
  box-shadow: 6px 6px 0 #000;
  border-radius: 8px;
  transition: box-shadow .12s ease, transform .12s ease;
  animation: comic-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}"""
css = css.replace(old_card, new_card)

# 3. Add Keyframes inside @theme block
# We find the end of @theme by looking for "@keyframes speed-lines {" and its closing bracket.
keyframes_to_add = """
  --animate-hover-jitter:  hover-jitter 0.3s ease-in-out infinite alternate;
  --animate-comic-pop:     comic-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

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
  }"""
css = css.replace("--animate-wiggle:        wiggle 0.5s ease-in-out;", "--animate-wiggle:        wiggle 0.5s ease-in-out;" + keyframes_to_add)

# 4. Button styles
old_btn_hover = ".nb-btn:hover  { box-shadow:2px 2px 0 #000; transform:translate(2px,2px); }"
new_btn_hover = ".nb-btn:hover  { box-shadow:2px 2px 0 #000; transform:translate(2px,2px); animation: hover-jitter 0.3s ease-in-out infinite alternate; }"
css = css.replace(old_btn_hover, new_btn_hover)

old_btn_active = ".nb-btn:active { box-shadow:0 0 0 #000;     transform:translate(4px,4px); }"
new_btn_active = ".nb-btn:active { box-shadow:0 0 0 #000; transform:translate(4px,4px); animation: none; }"
css = css.replace(old_btn_active, new_btn_active)

# 5. Fix Glass
old_glass = """.glass      { background:rgba(17,17,17,0.85); border:2px solid rgba(255,255,255,0.08); box-shadow:4px 4px 0 rgba(0,0,0,0.5); }
.glass-strong { background:rgba(17,17,17,0.96); border:2px solid rgba(255,255,255,0.13); box-shadow:4px 4px 0 rgba(0,0,0,0.7); }"""
new_glass = """.glass      { background:#FFFFFF; border:3px solid #000; box-shadow:6px 6px 0 #000; color: #050505; border-radius: 8px; }
.glass-strong { background:#FFFFFF; border:3px solid #000; box-shadow:6px 6px 0 #000; color: #050505; border-radius: 8px; }"""
css = css.replace(old_glass, new_glass)

with open('app/globals.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("globals.css successfully rewritten with pure string replacement!")
