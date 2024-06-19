import React, { useState, useRef } from "react";
import Image from "next/image";

const socials = [
  {
    name: "LinkedIn",
    imageUrl: "https://img.icons8.com/color/48/000000/linkedin.png",
    link: "https://www.linkedin.com/in/konnor-kooi-93b83a281/",
    backgroundImage: "/images/linkedin.png",
  },
  {
    name: "GitHub",
    imageUrl: "https://img.icons8.com/material-rounded/48/000000/github.png",
    link: "https://github.com/KonnorKooi",
    backgroundImage: "/images/github.png",
  },
  {
    name: "Facebook",
    imageUrl: "https://img.icons8.com/color/48/000000/facebook-new.png",
    link: "https://www.facebook.com/konnor.kooi.731/",
    backgroundImage: "/images/facebook.png",
  },
  {
    name: "Instagram",
    imageUrl: "https://img.icons8.com/color/48/000000/instagram-new.png",
    link: "https://www.instagram.com/konnorkooi/",
    backgroundImage: "/images/instagram.png",
  },
  {
    name: "Tiktok",
    imageUrl: "https://img.icons8.com/color/48/000000/tiktok.png",
    link: "https://www.tiktok.com/@konnorkooi32",
    backgroundImage: "/images/tiktok.png",
  },
];

const SocialCarousel: React.FC = () => {
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
    if (currentIndex < socials.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (carouselRef.current) {
        carouselRef.current.scrollBy({
          left: carouselRef.current.clientWidth,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="relative w-full bg-black antialiased text-gray-900 mt-8">
      <div className="flex justify-between items-center p-2 pb-0 ml-4 mr-4">
        <h2 className="text-2xl text-white">Socials</h2>
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
        className="carousel carousel-center w-full p-2 pt-2 space-x-5 flex items-start overflow-x-scroll no-scrollbar h-[325px]"
        ref={carouselRef}>
        {socials.map((social, index) => (
          <div
            key={index}
            className="carousel-item w-60 h-60 flex-shrink-0 sm:w-72 sm:h-72">
            <div className="relative w-full h-full">
              <div className="w-full h-full overflow-hidden rounded-lg shadow-md">
                <Image
                  src={social.backgroundImage}
                  alt={social.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105 rounded-lg"
                />
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-11/12 bg-white p-2 rounded-lg shadow-lg">
                  <div className="mt-1 flex items-center justify-center">
                    <Image
                      src={social.imageUrl}
                      alt={social.name}
                      width={32}
                      height={32}
                      className="object-cover rounded-lg"
                    />
                    <h4 className="text-l font-semibold uppercase leading-tight truncate ml-2">
                      {social.name}
                    </h4>
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

export default SocialCarousel;
