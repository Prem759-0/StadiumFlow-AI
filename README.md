<div align="center">
  <img src="https://img.shields.io/badge/NEXT.JS-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TAILWIND_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/ZUSTAND-443E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/GEMINI_2.0-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Gemini AI" />
</div>

<br />

<div align="center">
  <h1 align="center">⚡ StadiumFlow AI ⚡</h1>
  <p align="center">
    <strong>The Ultimate AI-Powered Smart Stadium Operations Center for the FIFA World Cup 2026</strong>
  </p>
  <p align="center">
    A stunning <em>Neo-Brutalist</em> web application designed to manage 132,000+ fans in real-time, built for absolute beginners and pros alike!
  </p>
</div>

<br />

---

## 🌟 What is StadiumFlow AI?

Imagine you are managing the biggest stadium in the world. How do you keep 132,000 screaming fans safe, fed, and entertained? **StadiumFlow AI** is the answer! 

It is a dual-dashboard web application:
1. **Fan Dashboard (Attendee PWA):** A vibrant, gamified mobile experience where fans can track live match scores, view wait times for bathrooms/food, play FIFA Trivia, scan for virtual Merch Drops (AR Hunt), and hit a panic button (SOS) if there's an emergency.
2. **Staff Dashboard (Secure Admin):** A highly advanced command center where stadium security can view live crowd density heatmaps, simulate AI crisis scenarios (like a gate closure), push global alerts, and activate "God Mode" to lock down entire stadium zones.

This project uses an eye-catching **Neo-Brutalist & Comic Book design style** (think thick black borders, bright neon colors, drop shadows, and big bold text).

---

## 🔥 Awesome Features

### 👤 For the Fans (The Gamified Experience)
- **⚡ Live Hype Meter:** Tracks the stadium's "decibel" level in real-time.
- **📸 Jumbotron Fan Cam:** Connects directly to the user's webcam so Gemini AI can analyze their "vibe" and stamp comic-book stickers on their face!
- **🛍️ AR Scavenger Hunt:** A mock augmented-reality camera scanner to find hidden merch drops for points.
- **🧠 FIFA Trivia 1954:** Interactive flashcards with historic World Cup facts to pass the time in lines.
- **🚨 90-Second SOS Response:** A giant panic button to instantly dispatch staff to their exact seat.

### 🛡️ For the Staff (The Command Center)
- **🗺️ Live Heatmap:** A visual SVG map of the stadium showing real-time occupancy. Watch zones turn from green to yellow to flashing red when they overflow!
- **🤖 Gemini Crisis Simulator:** Staff can click buttons to simulate disasters (e.g., "Heavy Rain" or "Gate B Closure") and the AI will predict crowd flow and suggest redirects.
- **🔒 "God Mode" Zone Lockdown:** A massive red button that completely locks down a stadium zone, flashing it in emergency red and black on the map.
- **📊 Real-time AI Performance Metrics:** Live updating statistics on throughput, wait times, and crowd flow scores.

---

## 🛠️ Tech Stack Explained (For Beginners)

If you are new to web development, don't worry! Here is exactly what we used and why:

* **[Next.js (App Router)](https://nextjs.org/)**: The core framework. It handles our routing (moving between pages like `/fan` and `/dashboard`).
* **[React](https://react.dev/)**: The UI library. We use React "Hooks" like `useState` (to remember things, like if a modal is open) and `useEffect` (to do things when the page loads, like start a timer).
* **[Tailwind CSS](https://tailwindcss.com/)**: How we style everything so quickly! Instead of writing separate CSS files, we use classes like `bg-[#FF3333]` (red background) and `rounded-2xl` (rounded corners) directly in our HTML.
* **[Zustand](https://github.com/pmndrs/zustand)**: A super simple "State Management" tool. It acts like a global brain so the Staff Dashboard can see when a Fan presses the SOS button!
* **[Lucide React](https://lucide.dev/)**: Our beautiful, crisp SVG icons (like the camera, siren, and lightning bolts).

---

## 🚀 Getting Started (Step-by-Step)

Ready to run this on your own computer? Follow these simple steps!

### 1. Prerequisites
You need to have **Node.js** installed on your computer. 
* [Download Node.js here](https://nodejs.org/) (Choose the "LTS" version).
* To check if it installed correctly, open your terminal (Command Prompt or Mac Terminal) and type `node -v`. It should print a version number!

### 2. Clone the Repository
Download the code to your computer. Open your terminal and run:
```bash
git clone https://github.com/YOUR-USERNAME/StadiumFlow-AI.git
cd StadiumFlow-AI
```

### 3. Install Dependencies
We need to download all the libraries (like Next.js and Tailwind) that the project needs to run. In your terminal, type:
```bash
npm install
```
*(This might take a minute, grab some coffee! ☕)*

### 4. Run the Development Server
Time to turn on the engine! Type:
```bash
npm run dev
```
You will see a message saying `ready - started server on 0.0.0.0:3000`.

### 5. Open the App!
Open your favorite web browser (Chrome, Safari, Edge) and type this into the address bar:
👉 **[http://localhost:3000](http://localhost:3000)**

*Boom! You are now running StadiumFlow AI.*

---

## 📁 Folder Structure (Where is everything?)

If you want to read or change the code, here is a map of the project:

```text
📦 stadiumpulse-main
 ┣ 📂 app
 ┃ ┣ 📂 (attendee)      # Everything for the Fan App!
 ┃ ┃ ┗ 📂 fan           # Fan Dashboard page (page.tsx)
 ┃ ┣ 📂 (staff)         # Everything for the Staff App!
 ┃ ┃ ┗ 📂 dashboard     # Staff Dashboard page (page.tsx)
 ┃ ┣ 📜 layout.tsx      # The main wrapper around our app
 ┃ ┗ 📜 page.tsx        # The beautiful Landing Page!
 ┣ 📂 components        # Reusable UI parts (ScoreTicker, StadiumMap, etc.)
 ┣ 📂 lib               # Brains of the app!
 ┃ ┣ 📜 mock-data.ts    # Fake data for our stadium zones
 ┃ ┗ 📜 store.ts        # Zustand Global State (where Staff and Fans share data)
 ┗ 📜 tailwind.config.ts # Where we configure our colors
```

---

## 🤝 Contributing
Want to add a feature? Found a bug? 
1. **Fork** the repository (Click the "Fork" button at the top right of this page).
2. Create a new branch (`git checkout -b feature/MyCoolFeature`).
3. Commit your changes (`git commit -m 'Added a cool feature'`).
4. Push to the branch (`git push origin feature/MyCoolFeature`).
5. Open a **Pull Request**!

---

<div align="center">
  <p>Built with ❤️ and ⚡ for the future of sports entertainment.</p>
</div>
