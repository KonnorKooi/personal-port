import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useTheme } from "../ThemeProvider";
import { 
  getResumes, 
  GoogleDocResume
} from "../../utils/googleDocsUtils";

const ResumeCard: React.FC<{
  resume: GoogleDocResume;
  index: number;
}> = ({ resume, index }) => {
  const { theme } = useTheme();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  const [animationComplete, setAnimationComplete] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (inView) {
      // Set animation complete after transition finishes
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 300 + index * 50); // Match duration + delay
      return () => clearTimeout(timer);
    }
  }, [inView, index]);

  // Function to open Google Doc in a new tab
  const openResume = () => {
    if (resume.docLink) {
      window.open(resume.docLink, "_blank", "noopener,noreferrer");
    }
  };

  // Function to get the preview image URL
  const getPreviewImageUrl = () => {
    if (imageError) {
      return `https://via.placeholder.com/320x480/333333/FFFFFF?text=${encodeURIComponent(resume.title)}`;
    }
    return resume.thumbnailUrl;
  };

  return (
    <div
      ref={ref}
      onClick={openResume}
      className={`block w-80 sm:w-80 h-96
            ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"} 
            rounded-lg shadow-lg overflow-hidden 
            transition-all sm:duration-1000 duration-300 ease-in-out transform 
            ${
              inView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            }
            hover:scale-105 cursor-pointer
            ${!animationComplete ? "pointer-events-none" : ""}
        `}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="relative w-full h-64">
        <Image
          src={getPreviewImageUrl()}
          alt={resume.title}
          fill
          sizes="(max-width: 640px) 320px, 320px"
          style={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
        
        {/* Show a document overlay icon */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 p-1 rounded">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-white"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h3
          className={`text-lg sm:text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          {resume.title}
        </h3>
        <p
          className={`text-xs sm:text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          } mt-1`}
        >
          {resume.description}
        </p>
        <p
          className={`text-xs ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          } mt-2 italic`}
        >
          Click to view full resume
        </p>
      </div>
    </div>
  );
};

const ResumeCarousel: React.FC = () => {
  const { theme } = useTheme();
  const [resumes, setResumes] = useState<GoogleDocResume[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load resume data
  useEffect(() => {
    try {
      setResumes(getResumes());
    } catch (error) {
      console.error("Error loading resumes:", error);
    }
  }, []);

  // Periodically refresh to check for any updates you might have made to the component code
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  if (resumes.length === 0) {
    return null; // Don't render anything if no resumes
  }

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
          Resumes
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {resumes.map((resume, index) => (
            <ResumeCard 
              key={`${resume.title}-${refreshTrigger}`} 
              resume={resume} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumeCarousel;