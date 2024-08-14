import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { socials } from "../../utils/constants";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const SocialCard: React.FC<{
    social: (typeof socials)[0];
    index: number;
}> = ({ social, index }) => {
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
            href={social.link}
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
                    src={social.backgroundImage}
                    alt={social.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-4">
                <div className="flex items-center">
                    <div className="relative w-10 h-10 mr-3">
                        <Image
                            src={social.imageUrl}
                            alt={social.name}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-full"
                        />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        {social.name}
                    </h3>
                </div>
            </div>
        </a>
    );
};

const SocialCarousel: React.FC = () => {
    return (
        <div className="w-full bg-black py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-semibold text-white mb-12">
                    Socials
                </h2>
                <div className="flex overflow-x-auto space-x-8 pb-8">
                    {socials.map((social, index) => (
                        <SocialCard key={index} social={social} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialCarousel;
