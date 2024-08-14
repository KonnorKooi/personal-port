import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { projects } from "../../utils/constants";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const ProjectCard: React.FC<{
    project: (typeof projects)[0];
    index: number;
}> = ({ project, index }) => {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
    });
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShouldAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            ref={ref as React.RefObject<HTMLAnchorElement>}
            className={`block w-80 h-96 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-105 ${
                shouldAnimate && isVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-full"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}>
            <div className="relative w-full h-60">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="100vw"
                    style={{
                        objectFit: "cover"
                    }} />
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
        <div className="w-full bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-semibold text-white mb-12">
                    Projects
                </h2>
                <div className="flex overflow-x-auto space-x-8 pb-8">
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
