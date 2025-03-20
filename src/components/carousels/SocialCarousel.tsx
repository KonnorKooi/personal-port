import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { socials } from "../../utils/constants";
import { useTheme } from "../ThemeProvider";

const SocialCard: React.FC<{
  social: (typeof socials)[0];
  index: number;
}> = ({ social, index }) => {
  const { theme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (inView) {
      // Set animation complete after transition finishes
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 300 + index * 50); // Match duration + delay
      return () => clearTimeout(timer);
    }
  }, [inView, index]);

  return (
    <a
      ref={ref}
      href={social.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-40 sm:w-52 h-[15.8rem] sm:h-[16.8rem]
            ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} 
            rounded-lg shadow-lg overflow-hidden 
            transition-all sm:duration-1000 duration-300 ease-in-out transform 
            ${
              inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }
            hover:scale-105
            ${!animationComplete ? "pointer-events-none" : ""}
            `}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="relative w-full h-[12.2rem] sm:h-[12.5rem]">
        <Image
          src={social.backgroundImage}
          alt={social.name}
          fill
          sizes="(max-width: 640px) 160px, 208px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-2.5 sm:p-3.5">
        <div className="flex items-center">
          <div className="relative w-7 h-7 sm:w-9 sm:h-9 mr-2 sm:mr-3">
            <Image
              src={social.imageUrl}
              alt={social.name}
              className="rounded-full"
              fill
              sizes="(max-width: 640px) 28px, 36px"
              style={{ objectFit: "contain" }}
            />
          </div>
          <h3
            className={`text-base sm:text-xl font-semibold ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {social.name}
          </h3>
        </div>
      </div>
    </a>
  );
};

const SocialCarousel: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`w-full ${
        theme === "dark" ? "bg-black" : "bg-white"
      } py-8 sm:py-12 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className={`text-3xl sm:text-4xl font-semibold ${
            theme === "dark" ? "text-white" : "text-black"
          } mb-8 sm:mb-12`}
        >
          Socials
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {socials.map((social, index) => (
            <SocialCard key={index} social={social} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialCarousel;
