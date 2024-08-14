import React from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { socials } from "../../utils/constants";

const SocialCard: React.FC<{ social: (typeof socials)[0]; index: number }> = ({
    social,
    index,
}) => {
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 0.15,
    });

    return (
        <a
            ref={ref}
            href={social.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-52 height:76 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-1000 ease-in-out transform 
                ${
                    inView
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-full"
                }
                hover:scale-105
            `}
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
                            className="rounded-full"
                            layout="fill"
                            objectFit="contain"
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
                <div className="flex flex-wrap justify-center gap-8">
                    {socials.map((social, index) => (
                        <SocialCard key={index} social={social} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialCarousel;
