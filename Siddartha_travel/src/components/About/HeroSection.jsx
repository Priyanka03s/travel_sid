// components/HeroSection.jsx
import React from "react";
import { FaPlane } from "react-icons/fa";
import bg from "../../assets/bg1.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative w-full h-screen flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-white px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide drop-shadow-lg">
          <span className="text-white">Discover.</span> Connect.{" "}
          <span className="text-white">Wander.</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 leading-relaxed text-white">
          Wandergoo helps you explore the world through curated trips, events,
          and adventures. Let's make every journey unforgettable.
        </p>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 mb-8">
          <h3 className="text-xl font-semibold mb-3 text-white">
            What you can do here
          </h3>
          <ul className="text-left text-white space-y-2 list-disc list-inside">
            <li>Join trips with explorers around the globe</li>
            <li>Attend thrilling events & cultural festivals</li>
            <li>Explore adventure schools & exclusive packages</li>
          </ul>
        </div>

        <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-gray-200 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md mx-auto">
          Let's Go Together <FaPlane />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;