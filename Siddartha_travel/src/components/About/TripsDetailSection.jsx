// components/TripsDetailSection.jsx
import React from "react";
import { FaGlobeAmericas, FaPlane, FaHiking } from "react-icons/fa";

const TripsDetailSection = () => {
  const trips = [
    {
      title: "Domestic Journeys",
      description: "Explore the hidden gems in your own country with expert local guides.",
      icon: <FaGlobeAmericas className="text-red-600 w-6 h-6 mr-3" />,
      img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      title: "International Adventures",
      description: "Discover new cultures and landscapes across the globe with our curated trips.",
      icon: <FaPlane className="text-red-600 w-6 h-6 mr-3" />,
      img: "https://images.unsplash.com/photo-1549180030-48bf079fb38a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
    {
      title: "Specialty Trips",
      description: "Girls-only, family trips, group treks, road trips, or pet-friendly tours.",
      icon: <FaHiking className="text-red-600 w-6 h-6 mr-3" />,
      img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium tracking-wider border border-red-100">
            TRIPS
          </span>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mt-6 mb-4">
            Join and <span className="font-semibold text-red-600">Explore</span>
          </h2>
          <div className="w-16 h-0.5 bg-red-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Hosted by passionate travelers and local experts, our trips are focused on connection, discovery, and memorable experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {trips.map((trip, index) => (
            <div key={index} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="h-64 overflow-hidden">
                <img
                  src={trip.img}
                  alt={trip.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-3">
                  {trip.icon}
                  <h3 className="text-xl font-medium text-gray-900">{trip.title}</h3>
                </div>
                <p className="text-gray-600 font-light">{trip.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TripsDetailSection;
