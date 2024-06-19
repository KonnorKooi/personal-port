import React, { useState, useRef } from "react";
import Image from "next/image";

// Sample project data with random dates
const projects = [
  {
    title: "WWU Schedule Optimizer",
    date: "2024",
    imageUrl: "/images/scheduleOpt.png",
    buttonText: "Link",
    link: "https://cwooper.me/schedule-optimizer/",
  },
  {
    title: "WA Care Website",
    date: "2021",
    imageUrl: "/images/WAcare.png",
    buttonText: "Link",
    link: "https://washington-state-hospital-records.vercel.app/",
  },
  {
    title: "Covid Adventures Game",
    date: "2020",
    imageUrl: "/images/CovidAdventures.png",
    buttonText: "Link",
    link: "https://flowlab.io/game/play/1719733",
  },
  {
    title: "Project 4",
    date: "2020",
    imageUrl:
      "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.jpg",
    buttonText: "Link",
    link: "#",
  },
  {
    title: "Project 5",
    date: "2019",
    imageUrl:
      "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.jpg",
    buttonText: "Link",
    link: "#",
  },
  {
    title: "Personal Portfolio",
    date: "2024",
    imageUrl:
      "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg",
    buttonText: "Link",
    link: "#",
  },
];

const ProjectCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null); // Reference to the carousel container

  // Function to handle the previous button click
  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  // Function to handle the next button click
  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full bg-black antialiased text-gray-900">
      <div className="flex justify-between items-center p-2 pb-0 ml-4 mr-4">
        {/* Title */}
        <h2 className="text-2xl text-white">Projects</h2>
        {/* Navigation Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={handlePrevClick}
            className="btn btn-square bg-black text-white border-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNextClick}
            className="btn btn-square bg-black text-white border-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className="carousel carousel-center w-full p-2 pt-2 space-x-5 flex items-start overflow-x-scroll no-scrollbar h-[365px]"
        ref={carouselRef} // Reference to the carousel container
      >
        {projects.map((project, index) => (
          <div
            key={index}
            className="carousel-item w-96 sm:w-112 md:w-[50%] lg:w-[40%] xl:w-[30%]">
            <div className="relative w-full h-80">
              <div className="w-full h-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg"
                />
                {/* Project Link */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-3 transform translate-y-1/2 w-5/12 bg-white p-2 rounded-lg shadow-lg">
                  {/* Adjust bottom property to move up */}
                  <div className="mt-1">
                    <h4 className="text-l font-semibold uppercase leading-tight ">
                      {project.title}
                    </h4>
                    <div className="text-gray-600 text-md font-semibold mt-2">
                      {project.date}
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;
