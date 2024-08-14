import React from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { largeProjects } from "../../utils/constants";

const FullPageImages: React.FC = () => {
    return (
        <div className="w-full">
            {largeProjects.map((project, index) => (
                <FullPageSection key={index} project={project} />
            ))}
        </div>
    );
};

const FullPageSection: React.FC<{ project: (typeof largeProjects)[0] }> = ({
    project,
}) => {
    const [ref, inView] = useInView({
        threshold: 0.5,
        triggerOnce: false,
    });

    return (
        <div ref={ref} className="min-h-screen w-full relative overflow-hidden">
            <div className="w-full h-screen relative">
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <h2
                        className={`text-4xl md:text-6xl text-white p-4 text-center transition-opacity duration-1000 ${
                            inView ? "opacity-100" : "opacity-0"
                        }`}>
                        {project.title}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default FullPageImages;
