// components/AdventureSchoolsDetailSection.jsx
import React from "react";
import { FaArrowRight, FaMountain, FaWater, FaBiking, FaSwimmer, FaPaperPlane, FaTree } from "react-icons/fa";
import bg1 from "../../assets/bg1.jpg"
import bg2 from "../../assets/bg2.jpg"



const AdventureSchoolsDetailSection = () => {
  const schools = [
    {
      name: "Sky High Paragliding Academy",
      image: bg1,
      description: "Learn to soar with certified instructors. Courses for beginners to advanced pilots.",
      icon: <FaPaperPlane className="text-red-600 w-5 h-5 mr-2" />
    },
    {
      name: "Wave Rider Surf School",
      image: bg2,
      description: "Master the waves with our professional surf coaches. All equipment provided.",
      icon: <FaWater className="text-red-600 w-5 h-5 mr-2" />
    },
    {
      name: "Deep Blue Scuba Center",
      image:bg1,
      description: "Explore underwater worlds with PADI certified courses. From beginner to divemaster.",
      icon: <FaSwimmer className="text-red-600 w-5 h-5 mr-2" />
    },
    {
      name: "Summit Seekers Mountaineering",
      image: bg2,
      description: "Conquer peaks with expert mountaineers. Safety-focused expeditions for all levels.",
      icon: <FaMountain className="text-red-600 w-5 h-5 mr-2" />
    },
    {
      name: "Trail Blazers Biking Academy",
      image: bg1,
      description: "Master mountain biking techniques with certified coaches. Trails for all skill levels.",
      icon: <FaBiking className="text-red-600 w-5 h-5 mr-2" />
    },
    {
      name: "Rock Solid Climbing School",
      image:bg2,
      description: "Scale new heights with our climbing courses. Indoor and outdoor options available.",
      icon: <FaTree className="text-red-600 w-5 h-5 mr-2" />
    }
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium tracking-wider border border-red-100">
            ADVENTURE SCHOOLS
          </span>
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mt-6 mb-4">
            Learn and <span className="font-semibold text-red-600">Master</span>
          </h2>
          <div className="w-16 h-0.5 bg-red-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Registered academies, schools, or certified trainers offering structured courses, workshops, and training packages. Build skills with safety, certifications, and professional guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {schools.map((school, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={school.image}
                  alt={school.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center mb-3">
                  {school.icon}
                  <h3 className="text-xl font-medium text-gray-900">{school.name}</h3>
                </div>
                <p className="text-gray-600 font-light mb-6">{school.description}</p>
              
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AdventureSchoolsDetailSection;
