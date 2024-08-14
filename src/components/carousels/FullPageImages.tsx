import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { largeProjects } from "../../utils/constants";

const FullPageImages: React.FC = () => {
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("translate-x-0");
                    entry.target.classList.remove("-translate-x-full");
                }
            });
        };

        const observer = new IntersectionObserver(
            observerCallback,
            observerOptions
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            sectionRefs.current.forEach((ref) => {
                if (ref) {
                    observer.unobserve(ref);
                }
            });
        };
    }, []);

    return (
        <div className="w-full">
            {largeProjects.map((project, index) => (
                <div
                    key={index}
                    ref={(el) => {
                        sectionRefs.current[index] = el;
                    }}
                    className="min-h-screen w-full relative overflow-hidden transform transition-transform duration-1000 ease-out -translate-x-full">
                    <Link href={project.link}>
                        <div className="w-full h-screen relative cursor-pointer">
                            <Image
                                src={project.imageUrl}
                                alt={project.title}
                                fill
                                sizes="100vw"
                                priority={index === 0}
                                className="object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <h2 className="text-4xl md:text-6xl text-white p-4 text-center">
                                    {project.title}
                                </h2>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default FullPageImages;
