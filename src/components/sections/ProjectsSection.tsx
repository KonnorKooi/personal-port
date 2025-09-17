import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import Image from "next/image";
import { ExternalLink, Calendar } from "lucide-react";

interface Project {
    id: string;
    title: string;
    date: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    link: string;
}

const projects: Project[] = [
    {
        id: "wwu-schedule-optimizer",
        title: "WWU Schedule Optimizer",
        date: "March-Nov 2024",
        description: "Helped create React/TypeScript frontend serving 3,000+ monthly users that automatically generates conflict-free course schedules with customizable preferences. Built and published a reusable React calendar component as an npm package (schedule-glance) for dynamic schedule visualization. The team implemented personalized schedule weights, GPA analysis, and fuzzy course search, integrated with a high-performance Go backend.",
        imageUrl: "/images/scheduleOpt_optimized.jpg",
        buttonText: "Link",
        link: "https://cwooper.me/schedule-optimizer/",
    },
    
    {
        id: "schedule-npm-package",
        title: "Schedule NPM Package",
        date: "July-Sept 2024",
        description: "A lightweight, reusable NPM package for a week at a glance calendar. Includes comprehensive documentation.",
        imageUrl: "/images/schedulenpm_optimized.jpg",
        buttonText: "Link",
        link: "https://www.npmjs.com/package/@konnorkooi/schedule-glance",
    },
    {
        id: "json-quiz-app",
        title: "Json Quiz App",
        date: "Nov-March 2025",
        description: "A quiz application that loads questions from JSON files inputted by user. Really cool confetti animation on correct answers and in the help menu.",
        imageUrl: "/images/quiz-app_optimized.jpg",
        buttonText: "Link",
        link: "https://konnorkooi.com/quiz-app/",
    },
    {
        id: "gaussian-viewer",
        title: "Gaussian Viewer",
        date: "Nov-Dec 2024",
        description: "Developed a WebGL-based 3D rendering engine for visualizing point-cloud data using Gaussian Splatting techniques with PLY file support. Implemented advanced shader programs for GPU-accelerated rendering with covariance matrix calculations, quaternion-based rotations, and tile-based sorting for performance. Created a modular JavaScript architecture with separate modules for rendering, camera control, and file parsing.",
        imageUrl: "/images/gausian-vango_optimized.jpg",
        buttonText: "Link",
        link: "https://konnorkooi.com/gaussian-viewer/",
    },
];

const ProjectsSection: React.FC = () => {
    const { theme } = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Only apply GSAP animations on desktop (md breakpoint and above)
        const initDesktopAnimations = async () => {
            if (window.innerWidth < 768) return; // Skip animations on mobile
            
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            
            gsap.registerPlugin(ScrollTrigger);

            if (containerRef.current) {
                // Calculate total scroll distance
                const cardScrollDistance = 1500; // Distance per card
                const totalCards = projects.length;
                const totalScrollDistance = cardScrollDistance * (totalCards - 1); // -1 because first card is already visible
                
                // Animation for cards flying in from the right with custom timing
                const timeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        pin: containerRef.current,
                        markers: false,
                        scrub: true,
                        start: "top top",
                        end: `+=${totalScrollDistance}`,
                        invalidateOnRefresh: true
                    }
                });

                // Add each card animation to timeline with specific timing
                projects.slice(1).forEach((_, index) => {
                    const cardIndex = index + 1; // +1 because we're skipping first card
                    const isLastCard = cardIndex === totalCards - 1;
                    const cardDuration = isLastCard ? 1200 : cardScrollDistance; // Last card much shorter
                    
                    timeline.fromTo(
                        `.project-card:nth-child(${cardIndex + 1})`,
                        {
                            x: () => window.innerWidth / 2 + 100,
                            rotate: 90,
                        },
                        {
                            x: 0,
                            rotate: 0,
                            duration: cardDuration,
                        },
                        index * cardScrollDistance // Start time for each card
                    );
                });
            }
        };

        initDesktopAnimations();

        // Cleanup function
        return () => {
            if (typeof window !== 'undefined') {
                import("gsap").then(({ gsap }) => {
                    gsap.killTweensOf(".project-card");
                    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                    });
                });
            }
        };
    }, []); // Remove theme dependency to prevent re-running animations on theme change

    return (
        <div 
            ref={containerRef}
            id="projects"
            className={`container ${
                theme === "dark" ? "bg-black" : "bg-white"
            } transition-colors duration-300`}
            style={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem', // Reduced horizontal padding for mobile
                margin: '0 auto'
            }}
        >
            {/* Projects Title */}
            <h2 
                className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-center px-4 ${
                    theme === "dark" ? "text-white" : "text-black"
                }`}
            >
                Projects
            </h2>
            
            <h3 
                className={`text-base md:text-lg lg:text-xl mb-8 md:mb-12 text-center px-4 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
            >
                Recent Projects Outside of School
            </h3>

            {/* Desktop: Stack animation layout */}
            <div 
                className="cards hidden md:block"
                style={{
                    position: 'relative',
                    width: '500px',
                    height: '600px',
                    margin: '0 auto'
                }}
            >
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        theme={theme}
                        isMobile={false}
                    />
                ))}
            </div>

            {/* Mobile: Simple grid layout */}
            <div className="md:hidden w-full max-w-sm mx-auto space-y-6">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        theme={theme}
                        isMobile={true}
                    />
                ))}
            </div>
        </div>
    );
};

interface ProjectCardProps {
    project: Project;
    index: number;
    theme: "light" | "dark";
    isMobile: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, theme, isMobile }) => {
    const isOdd = index % 2 === 1;
    
    if (isMobile) {
        // Mobile layout: Simple card with better spacing
        return (
            <motion.div
                className={`project-card card-angular-small`}
                style={{
                    width: '100%',
                    backgroundColor: theme === "dark" ? '#1f2937' : '#f8fafc',
                    padding: '16px',
                    boxShadow: theme === "dark" 
                        ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
                        : '0 10px 25px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    color: theme === "dark" ? 'white' : 'black'
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
            >
                {/* Project Image */}
                <div 
                    className="image-angular"
                    style={{
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        marginBottom: '12px'
                    }}
                >
                    <Image
                        src={project.imageUrl}
                        alt={project.title}
                        width={300}
                        height={200}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                {/* Project Details */}
                <div style={{ flex: 1 }}>
                    <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: 'bold', 
                        marginBottom: '6px',
                        color: theme === "dark" ? 'white' : 'black'
                    }}>
                        {project.title}
                    </h3>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        marginBottom: '12px',
                        opacity: 0.8
                    }}>
                        <Calendar size={14} />
                        <span style={{ fontSize: '0.75rem' }}>{project.date}</span>
                    </div>

                    <p style={{ 
                        fontSize: '0.75rem', 
                        lineHeight: '1.4',
                        opacity: 0.9,
                        marginBottom: '16px'
                    }}>
                        {project.description}
                    </p>
                </div>

                {/* Project Link Button */}
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-angular-button"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        fontWeight: '500',
                        textDecoration: 'none',
                        backgroundColor: theme === "dark" ? 'white' : 'black',
                        color: theme === "dark" ? 'black' : 'white',
                        transition: 'all 0.3s ease',
                        alignSelf: 'flex-start',
                        fontSize: '0.875rem'
                    }}
                >
                    <ExternalLink size={14} />
                    {project.buttonText}
                </a>
            </motion.div>
        );
    }
    
    // Desktop layout: Original stacked card design
    return (
        <div
            className={`project-card card-angular`}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: theme === "dark" ? '#1f2937' : '#f8fafc',
                padding: '20px',
                boxShadow: theme === "dark" 
                    ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 25px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: theme === "dark" ? 'white' : 'black'
            }}
        >
            {/* Project Image */}
            <div 
                className="image-angular"
                style={{
                    width: '100%',
                    height: '400',
                    overflow: 'hidden',
                    marginBottom: '16px'
                }}
            >
                <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={400}
                    height={400}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>

            {/* Project Details */}
            <div style={{ flex: 1 }}>
                <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    marginBottom: '8px',
                    color: theme === "dark" ? 'white' : 'black'
                }}>
                    {project.title}
                </h3>
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '16px',
                    opacity: 0.8
                }}>
                    <Calendar size={16} />
                    <span style={{ fontSize: '0.875rem' }}>{project.date}</span>
                </div>

                <p style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5',
                    opacity: 0.9,
                    marginBottom: '20px'
                }}>
                    {project.description}
                </p>
            </div>

            {/* Project Link Button */}
            <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="card-angular-button"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    backgroundColor: theme === "dark" ? 'white' : 'black',
                    color: theme === "dark" ? 'black' : 'white',
                    transition: 'all 0.3s ease',
                    alignSelf: 'flex-start'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <ExternalLink size={16} />
                {project.buttonText}
            </a>
        </div>
    );
};

export default ProjectsSection;