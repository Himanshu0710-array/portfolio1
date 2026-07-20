# 🌌 Interstellar Developer Portfolio

A breathtaking, interactive 3D developer portfolio built with React Three Fiber, Next.js, and Tailwind CSS. 

Take your visitors on a cinematic journey through multiple galaxies, explore interactive planetary nodes, and plunge through a black hole—all seamlessly rendered in WebGL.

## 🚀 Features

- **Immersive 3D Universe**: A fully realized 3D space environment complete with an asteroid belt, starfields, dynamic lighting, and cinematic post-processing (Bloom).
- **Interactive Navigation**: Clickable planets act as navigation nodes. Hovering triggers dynamic effects like coronal blasts and planetary scaling.
- **Multi-Galaxy Travel**: Scroll to travel smoothly from the Solar System to the Eridani System using a custom spline-based camera rig.
- **Black Hole Transition**: At the end of the journey, travel directly into a stunning black hole accretion disk to trigger a pure-white hyper-contact interface.
- **Gamified Elements**: Collect data probes scattered throughout the asteroid fields to unlock hidden lore or developer fun facts.
- **Mobile Responsive & Performant**: Uses distance-based culling, optimized textures, and 3D sprite billboarding to ensure smooth WebGL performance and layout stability across desktop and mobile.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **React Abstraction**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) & [Drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: Zustand

## 🛸 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Development Server**
   ```bash
   npm run dev
   ```

3. **Explore**
   Open [http://localhost:3000](http://localhost:3000) in your browser and start scrolling!

## 🎮 Controls

- **Scroll**: Move the camera forward and backward through the cosmos.
- **Click Planets**: Open the interactive HUD sidebar to view Projects, Skills, About Me, and Experience.
- **Click Data Probes**: Collect hidden floating beacons.
- **Free Look**: When no side panel is open, the camera will auto-rotate slightly, simulating a dynamic cockpit view.
