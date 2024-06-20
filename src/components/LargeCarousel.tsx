import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const largeProjects = [
  {
    title: "Konnor Kooi",
    imageUrl: "/images/wwubg.png",
    buttonText: "Learn More",
    link: "https://example.com/large-project2",
  },
  {
    title: "Computer Science",
    imageUrl: "/images/Taylor+dock.png",
    buttonText: "Learn More",
    link: "https://example.com/large-project1",
  },
  {
    title: "WWU",
    imageUrl: "/images/wwutrees.png",
    buttonText: "Learn More",
    link: "https://example.com/large-project3",
  },
];

const LargeCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: -carouselRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handleNextClick = () => {
    if (currentIndex < largeProjects.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: carouselRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const newIndex = Math.round(
        carouselRef.current.scrollLeft / carouselRef.current.clientWidth
      );
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const currentCarouselRef = carouselRef.current;
    if (currentCarouselRef) {
      currentCarouselRef.addEventListener("scroll", handleScroll);
      return () => {
        currentCarouselRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <div className="w-full h-[90vh] relative flex items-start justify-center">
      <div
        className="carousel carousel-center h-full w-full p-2 pt-2 space-x-5 flex items-start overflow-x-scroll no-scrollbar sm:px-4 md:px-4 lg:px-4 xl:px-10" // Adjusted px-8 for padding
        ref={carouselRef}>
        {largeProjects.map((project, index) => (
          <div
            key={index}
            className={`carousel-item w-full h-5/6 flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-50"
            }`}>
            <div className="w-full h-full relative overflow-hidden rounded-lg shadow-lg">
              <Image
                src={project.imageUrl}
                alt={project.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 ease-in-out hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                {" "}
                {/* Reduced opacity */}
                <h2 className="text-4xl md:text-6xl text-white p-4">
                  {project.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <button
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
          className={`btn btn-active bg-opacity-0 border-none text-white p-2 rounded-full ${
            currentIndex === 0
              ? "cursor-not-allowed opacity-50 bg-opacity-0 border-none"
              : ""
          }`}>
          &#10094;
        </button>
        {largeProjects.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}></div>
        ))}
        <button
          onClick={handleNextClick}
          disabled={currentIndex === largeProjects.length - 1}
          className={`btn btn-active bg-opacity-0 border-none text-white p-2 rounded-full ${
            currentIndex === largeProjects.length - 1
              ? "cursor-not-allowed opacity-30"
              : ""
          }`}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default LargeCarousel;
