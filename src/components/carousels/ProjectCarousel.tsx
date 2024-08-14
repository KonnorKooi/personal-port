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

    useEffect(() => {
        if (inView) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [inView]);

    return (
        <a
            ref={ref}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-80 h-84 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-700 ease-in-out transform 
                ${
                    isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-full"
                }
                ${index % 2 === 0 ? "hover:scale-105" : "hover:scale-95"}
            `}
            style={{ transitionDelay: `${index * 50}ms` }}>
            <div className="relative w-full h-60">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-xl font-semibold text-white">
                    {project.title}
                </h3>
                <p className="text-sm text-gray-400 mt-2">{project.date}</p>
            </div>
        </a>
    );
};

const ProjectCarousel: React.FC = () => {
    return (
        <div className="w-full bg-black py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-semibold text-white mb-12">
                    Projects
                </h2>
                <div className="flex flex-wrap justify-center gap-8">
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
