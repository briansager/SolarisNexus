# Wuthering Waves Build Tracker

A web application to track, score, and optimize character builds for the game Wuthering Waves. 

🔗 **Live Demo:** [https://wuthering-waves-build-tracker.vercel.app/](https://wuthering-waves-build-tracker.vercel.app/)

> 🚧 **Project Status: Work in Progress** 
> The core 5-echo build calculation, custom UI dropdowns, and Sonata Set detection are fully functional. I am currently refining the OCR-based Echo Scanner and adding full character/weapon databases.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS (Fully responsive)
- **OCR Processing:** Tesseract.js (Client-side, zero server uploads)
- **Deployment:** Vercel (CI/CD from `main` branch)

## 🧠 Challenges Solved
- **Strict TypeScript Builds:** Implemented rigorous type safety for stat weights and echo data structures to ensure Vercel deployments never fail due to strict `tsc` checks.
- **Client-Side OCR:** Integrated Tesseract.js to allow users to upload Echo screenshots. Wrote a custom regex parser to extract Main Stats, Base ATK, and Sub-Stats directly in the browser without saving the image to a server.
- **Complex State Management:** Architected a 5-slot Echo array state that dynamically calculates total build scores, individual echo scores, and active Sonata Set bonuses (2-piece and 5-piece).
- **Custom Hover UI:** Built a custom hover-delay dropdown component to mimic in-game selection menus, bypassing clunky native HTML `<select>` elements.

## 🚀 Roadmap
- [x] 5-Echo build array structure (4-3-3-1-1)
- [x] Dynamic Echo database (Cost 1, 3, 4)
- [x] Sonata effect tracking and display
- [x] Character selection with dynamic stat weights
- [x] OCR Screenshot scanning (Beta)
- [ ] Weapon and Waveband tracking
- [ ] Full character icon asset compilation
- [ ] Refine OCR accuracy for Main Stats

## 💻 Running Locally
```bash
# Clone the repository
git clone https://github.com/briansager/wuwa-build-tracker.git

# Install dependencies
npm install

# Start the development server
npm run dev
