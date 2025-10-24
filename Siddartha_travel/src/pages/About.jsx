// App.js (Example of how to structure your app)
import React from 'react';
import HeroSection from '../components/About/HeroSection';
import AboutSection from '../components/About/AboutSection';
import ServicesSection from '../components/About/ServicesSection';
import TripsDetailSection from '../components/About/TripsDetailSection';
import EventsDetailSection from '../components/About/EventsDetailSection';
import AdventureSchoolsDetailSection from '../components/About/AdventureSchoolsDetailSection';
import TestimonialsSection from '../components/About/TestimonialsSection';
// import CallToActionSection from '../components/About/CallToActionSection';


function About() {
  return (
    <div className="App">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TripsDetailSection />
      <EventsDetailSection />
      <AdventureSchoolsDetailSection />
      <TestimonialsSection />
      {/* <CallToActionSection /> */}
  
     
    </div>
  );
}

export default About;