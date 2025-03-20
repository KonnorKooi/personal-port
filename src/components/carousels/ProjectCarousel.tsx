import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { projects } from "../../utils/constants";

const ProjectCard: React.FC<{
    project: (typeof projects)[0];
    index: number;
}> = ({ project, index }) => {
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.04,
        rootMargin: "-50px 0px -50px 0px",
    });

    const [isVisible, setIsVisible] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        if (inView) {
            setIsVisible(true);
            // Set animation complete after transition finishes
            const timer = setTimeout(() => {
                setAnimationComplete(true);
            }, 300 + index * 25); // Match duration + delay
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            setAnimationComplete(false);
        }
    }, [inView, index]);

    return (
        <a
            ref={ref}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-80 sm:w-80 w-64 h-80 sm:h-84 bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                transition-all sm:duration-700 duration-300 ease-in-out transform 
                ${
                    isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-full"
                }
                ${index % 2 === 0 ? "hover:scale-105" : "hover:scale-95"}
                ${!animationComplete ? "pointer-events-none" : ""}
            `}
            style={{ transitionDelay: `${index * 25}ms` }}>
            <div className="relative w-full h-48 sm:h-60">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 256px, 320px"
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">{project.date}</p>
            </div>
        </a>
    );
};

const ProjectCarousel: React.FC = () => {
    return (
        <div className="w-full bg-black py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-8 sm:mb-12">
                    Projects
                </h2>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            project={project}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCarousel;