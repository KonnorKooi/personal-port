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
        threshold: 0.7,
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
                    style={{ objectFit: "cover" }}
                    className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-8">
                    <h2
                        className={`text-4xl md:text-6xl font-bold mb-4 text-center transition-opacity duration-1000 ${
                            inView ? "opacity-100" : "opacity-0"
                        }`}>
                        {project.title}
                    </h2>
                    <h3
                        className={`text-2xl md:text-3xl mb-6 text-center transition-opacity duration-1000 delay-300 ${
                            inView ? "opacity-100" : "opacity-0"
                        }`}>
                        {project.subtitle}
                    </h3>
                    <p
                        className={`text-lg md:text-xl text-center max-w-2xl transition-opacity duration-1000 delay-600 ${
                            inView ? "opacity-100" : "opacity-0"
                        }`}>
                        {project.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FullPageImages;