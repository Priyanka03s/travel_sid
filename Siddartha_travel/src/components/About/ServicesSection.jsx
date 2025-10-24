// components/ServicesSection.jsx
import React from "react";
import { FaSuitcaseRolling, FaGlassCheers, FaMountain } from "react-icons/fa";

const ServicesSection = () => {
  const services = [
    {
      title: "Trips",
      description:
        "Join thrilling domestic and international trips curated by travel experts. Explore girls-only retreats, family adventures, road trips, and pet-friendly getaways.",
      icon: <FaSuitcaseRolling className="w-6 h-6 text-white" />,
      cta: "Join and explore →",
      color: "from-red-400 to-red-600",
    },
    {
      title: "Events",
      description:
        "Participate in cultural fests, adventure rallies, and social meetups. Build lasting connections through exclusive one-day or weekend events.",
      icon: <FaGlassCheers className="w-6 h-6 text-white" />,
      cta: "Experience and connect →",
      color: "from-red-400 to-red-600",
    },
    {
      title: "Adventure Schools",
      description:
        "Train with certified instructors in mountaineering, scuba diving, surfing, and paragliding. Learn adventure sports from the best.",
      icon: <FaMountain className="w-6 h-6 text-white" />,
      cta: "Learn and master →",
      color: "from-red-400 to-red-600",
    },
  ];

  return (
    <section className="relative bg-red-600 py-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500 to-transparent rounded-full filter blur-3xl opacity-40 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-red-500 to-transparent rounded-full filter blur-3xl opacity-40 -z-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto text-center px-6 md:px-10">
        <span className="inline-block px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold tracking-wider mb-6 border border-white/30">
          WHAT WE OFFER
        </span>

        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Trips, Events & Adventures
        </h2>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-16">
          Discover amazing destinations, meet fellow adventurers, and grow your skills with Wandergoo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden border-2 border-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              {/* Icon Header */}
              <div
                className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mt-6 mx-auto transform transition-transform duration-300 group-hover:scale-110`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <div className="p-6 text-left space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-center">
                  {service.description}
                </p>
                <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                  <span className="text-red-500 font-semibold text-sm group-hover:underline cursor-pointer">
                    {service.cta}
                  </span>
                </div>
              </div>

              {/* Subtle Glow Hover Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-500/0 to-red-500/0 group-hover:from-red-500/5 group-hover:to-red-500/10 transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;