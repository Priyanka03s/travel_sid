// components/EventsDetailSection.jsx
import React from "react";
import { FaMountain, FaBriefcase, FaTheaterMasks, FaUsers } from "react-icons/fa";
import bg1 from "../../assets/bg1.jpg"
import bg2 from "../../assets/bg2.jpg"


const EventsDetailSection = () => {
  const events = [
    {
      title: "Adventure Events",
      description:
        "Join thrilling activities like trekking, rafting, paragliding camps, and more. Perfect for adrenaline junkies looking for a day of excitement.",
      icon: <FaMountain className="text-white w-6 h-6 mr-3" />,
      img: bg1,
    },
    {
      title: "Business Meetups",
      description:
        "Network with like-minded professionals in unique settings. Combine business with pleasure in our curated business events.",
      icon: <FaBriefcase className="text-white w-6 h-6 mr-3" />,
      img:bg2,
    },
    {
      title: "Cultural Experiences",
      description:
        "Immerse yourself in local traditions, festivals, and cultural activities. Experience the authentic essence of different communities.",
      icon: <FaTheaterMasks className="text-white w-6 h-6 mr-3" />,
      img:bg2,
    },
    {
      title: "Community Fests",
      description:
        "Join community gatherings, music festivals, food events, and more. Connect with people who share your interests.",
      icon: <FaUsers className="text-white w-6 h-6 mr-3" />,
      img:bg1,
    },
  ];

  return (
    <section className="bg-red-600 py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-white text-red-600 rounded-full text-sm font-medium tracking-wider border border-white">
            EVENTS
          </span>
          <h2 className="text-5xl md:text-6xl font-light text-white mt-6 mb-4">
            Experience and <span className="font-semibold text-white">Connect</span>
          </h2>
          <div className="w-16 h-0.5 bg-white mx-auto mb-6"></div>
          <p className="text-lg text-white max-w-3xl mx-auto font-light">
            Hosted by popular trainers, academies, or organizations, our events are perfect for people looking for one-day or short-duration experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="group">
                <div className="flex items-center mb-3">
                  {event.icon}
                  <h3 className="text-2xl font-medium text-white">{event.title}</h3>
                </div>
                <p className="text-white font-light pl-9 opacity-90">{event.description}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-6 w-72 h-72 bg-white rounded-2xl opacity-10 blur-2xl"></div>
            <div className="grid grid-cols-2 gap-4 relative">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-500"
                >
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-56 object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl p-12 text-center overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">Upcoming Events</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-light">
              Don't miss out on our exciting events. Join us for unforgettable experiences.
            </p>
            <button className="group inline-flex items-center px-8 py-3.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
              View All Events
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsDetailSection;