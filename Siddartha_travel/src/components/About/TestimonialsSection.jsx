// components/TestimonialsSection.jsx
import React from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1170&q=80",
    text: "The Himalayan trekking trip with Wandergoo was incredible! Our local guide knew all the hidden spots and made us feel safe throughout the journey.",
  },
  {
    name: "Michael Chen",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=687&q=80",
    text: "I attended the Sky High Paragliding Festival and it was the most exhilarating experience of my life. The instructors were professional and the atmosphere was amazing!",
  },
  {
    name: "Emma Rodriguez",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=1170&q=80",
    text: "The Deep Blue Scuba Academy course was well-structured and the instructors were patient. I'm now a certified diver and planning my next underwater adventure!",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-red-50 to-red-100 py-20 px-6 md:px-12 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-700 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800 mt-4 mb-6">
            What Our Adventurers Say
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Real experiences. Real memories. Discover why adventurers love Wandergoo.
          </p>
        </div>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-500 hover:-translate-y-1"
            >
              {/* Quote mark */}
              <div className="absolute top-4 right-4 text-red-100 text-8xl font-serif leading-none z-0">"</div>

              {/* Content */}
              <div className="p-8 relative z-10">
                <div className="flex items-center mb-6">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-red-100 mr-4"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{t.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{t.text}"</p>
              </div>

              {/* Bottom accent */}
              <div className="h-2 bg-gradient-to-r from-red-500 to-red-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
