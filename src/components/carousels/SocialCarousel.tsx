import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { socials } from "../../utils/constants";

const SocialCard: React.FC<{ social: (typeof socials)[0]; index: number }> = ({
    social,
    index,
}) => {
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
            className={`block w-40 sm:w-52 h-72 sm:h-76 bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                transition-all sm:duration-1000 duration-300 ease-in-out transform 
                ${
                    inView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-full"
                }
                hover:scale-105
                ${!animationComplete ? "pointer-events-none" : ""}
            `}
            style={{ transitionDelay: `${index * 50}ms` }}>
            <div className="relative w-full h-52 sm:h-60">
                <Image
                    src={social.backgroundImage}
                    alt={social.name}
                    fill
                    sizes="(max-width: 640px) 160px, 208px"
                    style={{ objectFit: "cover" }}
                />
            </div>
            <div className="p-3 sm:p-4">
                <div className="flex items-center">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3">
                        <Image
                            src={social.imageUrl}
                            alt={social.name}
                            className="rounded-full"
                            fill
                            sizes="(max-width: 640px) 32px, 40px"
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <h3 className="text-base sm:text-xl font-semibold text-white">
                        {social.name}
                    </h3>
                </div>
            </div>
        </a>
    );
};

const SocialCarousel: React.FC = () => {
    return (
        <div className="w-full bg-black py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-8 sm:mb-12">
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