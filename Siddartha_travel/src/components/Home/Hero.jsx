// pages/Homepage.js
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import planeModel from '../../assets/plane4.glb';
import heroVideo from '../../assets/red.mp4'; // Import the video file

const Homepage = () => {
  const canvasContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('events');

  useEffect(() => {
    // Set body styles
    document.body.style.backgroundColor = '#f8f9fa';
    document.body.style.fontFamily = "'Libre Baskerville', serif";
    document.body.style.overflowX = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

    // Clear console
    console.clear();

    // Scene class
    class Scene {
      constructor(model, container) {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Cap pixel ratio for better mobile performance
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;

        container.appendChild(this.renderer.domElement);
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.fromArray([0, 0, 180]);
        this.camera.lookAt(new THREE.Vector3(0, 5, 0));
        
        // Lighting setup to preserve original colors
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(5, 10, 7);
        this.directionalLight.castShadow = true;
        this.scene.add(this.directionalLight);
        
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(this.ambientLight);
        
        this.fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        this.fillLight.position.set(-5, 0, -5);
        this.scene.add(this.fillLight);

        // Add model with original materials
        this.modelGroup = new THREE.Group();
        
        // Adjust model scale based on screen size
        const scale = window.innerWidth < 768 ? 0.5 : 0.8;
        model.scale.set(scale, scale, scale);
        this.modelGroup.add(model);
        this.scene.add(this.modelGroup);
        
        // Set initial position
        this.modelGroup.position.set(0, 0, -80);
        this.modelGroup.rotation.y = Math.PI * -0.25;
        
        // Start animation loop
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', this.onResize, false);
      }
      
      animate = () => {
        requestAnimationFrame(this.animate);
        
        // Simple rotation animation
        this.modelGroup.rotation.y += 0.005;
        
        this.render();
      }
      
      render = () => {
        this.renderer.setViewport(0, 0, this.w, this.h);
        this.renderer.render(this.scene, this.camera);
      }
      
      onResize = () => {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        
        this.camera.aspect = this.w / this.h;
        const camZ = (screen.width - (this.w * 1)) / 3;
        this.camera.position.z = camZ < 180 ? 180 : camZ;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.w, this.h);    
        this.render();
      }
    }

    // Load model
    const loadModel = () => {
      let object;
      
      const onModelLoaded = () => {
        setupScene(object);
      };
      
      const onProgress = (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      };
      
      const onError = (error) => {
        console.error('An error happened loading the model:', error);
        const geometry = new THREE.BoxGeometry(10, 2, 10);
        const material = new THREE.MeshPhongMaterial({ color: 0x3498db });
        const fallbackModel = new THREE.Mesh(geometry, material);
        setupScene(fallbackModel);
      };
      
      const manager = new THREE.LoadingManager(onModelLoaded, onProgress, onError);
      
      const loader = new GLTFLoader(manager);
      loader.load(
        planeModel,
        (gltf) => {
          object = gltf.scene;
          object.position.set(0, 0, 0);
        },
        onProgress,
        onError
      );
    };

    // Setup scene without animations
    const setupScene = (model) => {
      const scene = new Scene(model, canvasContainerRef.current);
      sceneRef.current = scene;
      
      // Fade in the canvas
      canvasContainerRef.current.style.visibility = 'visible';
      canvasContainerRef.current.style.opacity = '1';
      
      // Hide loading indicator if exists
      const loadingElement = document.querySelector('.loading');
      if (loadingElement) {
        loadingElement.style.opacity = '0';
      }
    };

    loadModel();

    // Cleanup function
    return () => {
      if (sceneRef.current) {
        window.removeEventListener('resize', sceneRef.current.onResize);
        if (canvasContainerRef.current && sceneRef.current.renderer.domElement) {
          canvasContainerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
      document.body.style.backgroundColor = '';
      document.body.style.fontFamily = '';
      document.body.style.overflowX = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, []);

  // Category data for the Explore More section
  const categories = {
    events: [
      { 
        id: 1, 
        title: "Music Festivals", 
        description: "Experience the best music festivals around the world", 
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/events/music-festivals"
      },
      { 
        id: 2, 
        title: "Cultural Events", 
        description: "Immerse yourself in local cultures and traditions", 
        image: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/events/cultural"
      },
      { 
        id: 3, 
        title: "Sports Events", 
        description: "Witness thrilling sports competitions live", 
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/events/sports"
      },
      { 
        id: 4, 
        title: "Food Festivals", 
        description: "Taste culinary delights from around the globe", 
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=1180&q=80",
        link: "/events/food"
      },
      { 
        id: 5, 
        title: "Art Exhibitions", 
        description: "Explore world-class art and exhibitions", 
        image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/events/art"
      },
      { 
        id: 6, 
        title: "Seasonal Celebrations", 
        description: "Join unique seasonal festivities worldwide", 
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/events/seasonal"
      }
    ],
    adventure: [
      { 
        id: 1, 
        title: "Mountain Trekking", 
        description: "Challenge yourself with breathtaking mountain treks", 
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/adventure/mountain-trekking"
      },
      { 
        id: 2, 
        title: "Scuba Diving", 
        description: "Explore the underwater world", 
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/adventure/scuba-diving"
      },
      { 
        id: 3, 
        title: "Safari Adventures", 
        description: "Witness wildlife in their natural habitat", 
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/adventure/safari"
      },
      { 
        id: 4, 
        title: "Rock Climbing", 
        description: "Scale new heights with expert guides", 
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/adventure/rock-climbing"
      },
      { 
        id: 5, 
        title: "Skydiving", 
        description: "Experience the ultimate adrenaline rush", 
        image: "https://images.unsplash.com/photo-1659221876406-31a3746f41b9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        link: "/adventure/skydiving"
      },
      { 
        id: 6, 
        title: "White Water Rafting", 
        description: "Navigate thrilling river rapids", 
        image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/adventure/rafting"
      }
    ],
    trips: [
      { 
        id: 1, 
        title: "Family Vacation", 
        description: "Plan the perfect family getaway", 
        image: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/trips/family"
      },
      { 
        id: 2, 
        title: "Honeymoon Packages", 
        description: "Romantic destinations for your special trip", 
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/trips/honeymoon"
      },
      { 
        id: 3, 
        title: "Solo Travel", 
        description: "Discover yourself on a solo journey", 
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/trips/solo"
      },
      { 
        id: 4, 
        title: "Luxury Escapes", 
        description: "Indulge in premium travel experiences", 
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/trips/luxury"
      },
      { 
        id: 5, 
        title: "Group Tours", 
        description: "Travel with like-minded explorers", 
        image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/trips/group"
      },
      { 
        id: 6, 
        title: "Wellness Retreats", 
        description: "Rejuvenate your mind and body", 
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        link: "/trips/wellness"
      }
    ]
  };

  return (
    <div className="relative min-h-screen">
      {/* Canvas container */}
      <div 
        ref={canvasContainerRef} 
        className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none"
        style={{ visibility: 'hidden', opacity: 0 }}
      />
      
      {/* Main content */}
      <div className="content relative z-1">
        <div className="trigger absolute top-0 h-full w-full" />
        
        {/* Hero Section with Video Background */}
        <div className="relative w-full h-screen overflow-hidden">
          {/* Video Background */}
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              transform: 'translate(-50%, -50%)',
              zIndex: '-1'
            }}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          
          {/* Hero Content with Search Bar */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <div className="max-w-4xl w-full">
              {/* Search Bar */}
              <div className="w-full pb-90 max-w-2xl mx-auto">
                <form className="flex flex-col sm:flex-row gap-2  bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-2">
                  <input 
                    type="text" 
                    placeholder="Search destinations, activities, or more..." 
                    className="flex-grow px-4 py-3 rounded-lg focus:outline-none text-gray-800"
                  />
                  <button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300"
                  >
                    Search
                  </button>
                </form>
                <div className="mt-3 text-white text-sm">
                  Popular: Bali, Paris, Tokyo, New York
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Model Section - Travel Experience Showcase */}
        <div className="model-section relative flex items-center justify-center p-6 sm:p-8 md:p-[10vmin] w-full min-h-screen mx-auto z-2 bg-white">
          <div className="max-w-6xl flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-6 lg:pr-12">
              <div className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-red-500 text-white rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                TRAVEL EXPERIENCE
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
                Discover <span className="text-red-600">Extraordinary</span> Journeys
              </h2>
              <p className="text-base sm:text-lg text-black mb-6 sm:mb-8 leading-relaxed">
                Our travel experts craft personalized itineraries that combine breathtaking destinations, 
                authentic cultural experiences, and seamless logistics.
              </p>
              <Link to="/services" className="inline-block px-5 py-2 sm:px-6 sm:py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300 text-sm sm:text-base">
                Learn More About Our Services
              </Link>
            </div>
            <div className="md:w-1/2 relative w-full">
              <div className="absolute inset-0 bg-red-500 rounded-2xl sm:rounded-3xl transform rotate-6 opacity-20"></div>
              <div className="relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200">
                <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
                    alt="Interactive Travel Experience" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Links Section */}
        <div className="section relative flex items-center justify-center py-12 sm:py-16 md:py-20 px-4 sm:px-6 w-full bg-red-600">
          <div className="max-w-6xl text-center w-full">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 sm:mb-12">Explore More</h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 sm:mb-14">
              <button
                onClick={() => setActiveCategory('events')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === 'events' 
                    ? 'bg-white text-red-600 shadow-lg' 
                    : 'bg-transparent text-white border-2 border-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveCategory('adventure')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === 'adventure' 
                    ? 'bg-white text-red-600 shadow-lg' 
                    : 'bg-transparent text-white border-2 border-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Adventure
              </button>
              <button
                onClick={() => setActiveCategory('trips')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === 'trips' 
                    ? 'bg-white text-red-600 shadow-lg' 
                    : 'bg-transparent text-white border-2 border-white hover:bg-white hover:bg-opacity-20'
                }`}
              >
                Trips
              </button>
            </div>
            
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories[activeCategory].map((item) => (
                <Link to={item.link} key={item.id} className="group">
                  <div className="card bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 text-black">{item.title}</h3>
                      <p className="text-gray-700 mb-4 flex-grow">{item.description}</p>
                      <div className="mt-auto">
                        <span className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold transition-colors duration-300 group-hover:bg-red-600 group-hover:text-white">
                          Explore
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* View All Button */}
            <div className="mt-10 sm:mt-12">
              <Link 
                to={`/${activeCategory}`} 
                className="inline-block px-8 py-3 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition duration-300 shadow-md"
              >
                View All {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;