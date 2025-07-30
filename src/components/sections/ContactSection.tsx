import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from "next/image";
import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook } from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

interface ContactInfo {
    name: string;
    icon: React.ComponentType<any>;
    url: string;
    description: string;
}

const contactData: ContactInfo[] = [
    {
        name: "GitHub",
        icon: Github,
        url: "https://github.com/konnorkooi",
        description: "Check out my Code and Projects"
    },
    {
        name: "LinkedIn",
        icon: Linkedin,
        url: "https://linkedin.com/in/konnorkooi",
        description: "Professional Networking and Experience"
    },
    {
        name: "Instagram",
        icon: Instagram,
        url: "https://instagram.com/konnorkooi",
        description: "Personal updates of my Actual Life"
    },
    {
        name: "Facebook",
        icon: Facebook,
        url: "https://facebook.com/konnorkooi",
        description: "Connect with me on Facebook"
    },
    {
        name: "TikTok",
        icon: ({ size = 24, className = "" }) => (
            <svg 
                width={size} 
                height={size} 
                className={className}
                viewBox="0 0 24 24" 
                fill="currentColor"
            >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
        ),
        url: "https://tiktok.com/@konnorkooi",
        description: "Guitar and General Life Content"
    }
];

const ContactSection: React.FC = () => {
    const { theme } = useTheme();

    return (
        <section
            id="contact"
            className={`min-h-screen py-8 px-6 ${
                theme === "dark" ? "bg-black text-white" : "bg-white text-black"
            } transition-colors duration-300`}
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Get In Touch</h2>
                    <p className="text-base md:text-xl opacity-80 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                        I&apos;m always open to discussing new opportunities, collaborations, 
                        or just having a conversation about technology and development.
                    </p>
                </motion.div>

                {/* Contact Information Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className={`p-4 md:p-6 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                    }`}>
                        <Mail className="mx-auto mb-3 md:mb-4" size={28} />
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Email</h3>
                        <a 
                            href="mailto:konnorjkooi@gmail.com" 
                            className="text-sm md:text-base hover:opacity-70 transition-opacity block"
                        >
                            konnorjkooi@gmail.com
                        </a>
                    </div>
                    
                    <div className={`p-4 md:p-6 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                    }`}>
                        <Phone className="mx-auto mb-3 md:mb-4" size={28} />
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Phone</h3>
                        <a 
                            href="tel:+13608673717" 
                            className="text-sm md:text-base hover:opacity-70 transition-opacity block"
                        >
                            +1 (360) 867-3717
                        </a>
                    </div>
                    
                    <div className={`p-4 md:p-6 rounded-lg text-center ${
                        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                    }`}>
                        <MapPin className="mx-auto mb-3 md:mb-4" size={28} />
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Location</h3>
                        <p className="text-sm md:text-base">Bellingham, WA</p>
                        <p className="text-xs md:text-sm opacity-70">Open to remote work</p>
                    </div>
                </motion.div>

                {/* Social Media Carousel */}
                <motion.div
                    className="mb-8 md:mb-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <h3 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Connect With Me</h3>
                    
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            loop
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                },
                                768: {
                                    slidesPerView: 3,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                                1280: {
                                    slidesPerView: 5,
                                },
                            }}
                            className="social-carousel"
                        >
                            {[...contactData, ...contactData].map((contact, index) => (
                                <SwiperSlide key={`${contact.name}-${index}`}>
                                    <motion.div
                                        className={`relative group cursor-pointer p-4 md:p-6 rounded-lg ${
                                            theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                                        } hover:scale-105 transition-all duration-300`}
                                        whileHover={{ y: -10 }}
                                        onClick={() => window.open(contact.url, '_blank')}
                                    >
                                        <div className="text-center">
                                            <div className="relative mb-3 md:mb-4 mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center">
                                                <contact.icon 
                                                    size={32}
                                                    className={`md:w-10 md:h-10 group-hover:scale-110 transition-transform duration-300 ${
                                                        theme === "dark" ? "text-white" : "text-black"
                                                    }`}
                                                />
                                            </div>
                                            <h4 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{contact.name}</h4>
                                            <p className="text-xs md:text-sm opacity-70">{contact.description}</p>
                                        </div>
                                        
                                        {/* Hover overlay */}
                                        <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${
                                            theme === "dark" 
                                                ? "bg-white bg-opacity-10" 
                                                : "bg-black bg-opacity-10"
                                        }`}>
                                            <span className="text-xs md:text-sm font-medium">Click to visit</span>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="text-center px-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <p className="text-base md:text-lg mb-4 md:mb-6 opacity-80">
                        Ready to work together? Let&apos;s create something amazing!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                        <a
                            href="mailto:konnorjkooi@gmail.com"
                            className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium transition-colors text-sm md:text-base ${
                                theme === "dark"
                                    ? "bg-white text-black hover:bg-gray-200"
                                    : "bg-black text-white hover:bg-gray-800"
                            }`}
                        >
                            Send Email
                        </a>
                        <a
                            href="https://github.com/konnorkooi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-medium border transition-colors text-sm md:text-base ${
                                theme === "dark"
                                    ? "border-white text-white hover:bg-white hover:text-black"
                                    : "border-black text-black hover:bg-black hover:text-white"
                            }`}
                        >
                            View GitHub
                        </a>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="text-center mt-12 md:mt-16 pt-6 md:pt-8 border-t border-opacity-20 px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                >
                    <p className="opacity-60 text-sm md:text-base">
                        © 2025 Konnor Kooi. Built with Next.js, TypeScript, and Tailwind CSS.
                    </p>
                </motion.div>
            </div>

            <style jsx global>{`
                .social-carousel .swiper-slide {
                    transition: all 0.3s ease;
                }
                
                .social-carousel .swiper-slide:hover {
                    transform: translateY(-5px);
                }
                
                .social-carousel svg {
                    transition: transform 0.3s ease, color 0.3s ease;
                }
            `}</style>
        </section>
    );
};

export default ContactSection;