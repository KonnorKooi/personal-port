import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { X } from "lucide-react";
import Image from "next/image";

interface Skill {
    name: string;
    level: number;
    explanation: string;
}

interface SkillCategory {
    title: string;
    skills: Skill[];
}

const skillsData: SkillCategory[] = [
    {
        title: "Languages",
        skills: [
            {
                name: "TypeScript",
                level: 4,
                explanation: "Used daily in Qidds internship and building this web-application."
            },
            {
                name: "SQL",
                level: 3,
                explanation: "Used for Classwork and Qidds internship, comfortable with PostgreSQL and MySQL."
            },
            {
                name: "Java",
                level: 3,
                explanation: "Academic and Qidds experience with object-oriented programming, Spring framework, and enterprise applications."
            },
            {
                name: "Python",
                level: 2,
                explanation: "Used in Computer vision projects with Scott training TL-GANs for WWU CS Research."
            },
            
            {
                name: "C",
                level: 2,
                explanation: "Used for system level programming and understanding low-level operations in school."
            },
            {
                name: "Julia",
                level: 2,
                explanation: "Computer Graphics class creating 3d graphics from scratch."
            },
            {
                name: "Basic HTML/CSS/JS",
                level: 2,
                explanation: "Created small projects and web pages for personal use like the json quiz app."
            }

            
        ]
    },
    {
        title: "Tools & Technologies",
        skills: [
            {
                name: "Git",
                level: 5,
                explanation: "Daily use for school and Internship for version control, branching strategies, conflict resolution, and collaborative development workflows."
            },
            {
                name: "Linux <3",
                level: 4,
                explanation: "Preferred OS - Comfortable with command line, shell scripting, system administration, and deploying applications on Linux servers."
            },
            {
                name: "n8n",
                level: 4,
                explanation: "Created n8n workflows to scrape the web, fill resource data in, and automate daily tasks."
            },
            {
                name: "Docker",
                level: 3,
                explanation: "Used docker on my at home mini-PC server to run multiple local applications like n8n and Crawl4AI."
            },
            {
                name: "AWS",
                level: 3,
                explanation: "Proficient with EC2, S3, RDS, Lambda, and other core services. Used in School and managing Qidds."
            },
            {
                name: "MongoDB",
                level: 2,
                explanation: "Used for School on a few projects. "
            },
            
        ]
    },
    {
        title: "Frameworks & Libraries",
        skills: [
            {
                name: "React",
                level: 4,
                explanation: "My primary frontend framework. Proficient in hooks, context, state management, and building complex interactive UIs."
            },
            {
                name: "Next.js",
                level: 4,
                explanation: "Used for full-stack React applications with SSR, API routes, and optimized performance."
            },
            {
                name: "Tailwind CSS",
                level: 3,
                explanation: "Advanced level - My preferred CSS framework for rapid, responsive UI development. Used in most of my recent projects including this portfolio."
            },
            {
                name: "PyTorch",
                level: 2,
                explanation: "Applied in computer vision research, specifically for training and implementing TL-GANs during WWU CS research projects."
            },
            {
                name: "WebGL",
                level: 2,
                explanation: "Been awhile since I used it, but I have experience with 3D graphics programming and rendering techniques from the 3D gaussian viewer project trying to optimize it for browser performance."
            },
        ]
    }
];


const SkillsSection: React.FC = () => {
    const { theme } = useTheme();
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    
    const levelDescriptions = [
        { level: 1, title: "Familiar" },
        { level: 2, title: "Capable" },
        { level: 3, title: "Comfortable" },
        { level: 4, title: "Proficient" },
        { level: 5, title: "Advanced" }
    ];

    const renderSkillLevel = (level: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                        key={dot}
                        className={`w-2 h-2 rounded-full ${
                            dot <= level
                                ? theme === "dark" 
                                    ? "bg-white" 
                                    : "bg-black"
                                : theme === "dark"
                                    ? "bg-gray-700"
                                    : "bg-gray-300"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <section
            id="skills"
            className="min-h-screen py-8 px-6 relative overflow-hidden"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={theme === "dark" ? "/images/night-day-photos/guitar_night.jpg" : "/images/night-day-photos/guitar_day.jpg"}
                    alt={theme === "dark" ? "Guitar at night background" : "Guitar during day background"}
                    fill
                    className="object-cover transition-opacity duration-500"
                    priority
                />
                {/* Overlay for better text readability */}
                <div 
                    className={`absolute inset-0 transition-all duration-300 ${
                        theme === "dark" 
                            ? "bg-black bg-opacity-20" 
                            : "bg-white bg-opacity-15"
                    }`} 
                />
            </div>

            {/* Content with higher z-index */}
            <div className={`relative z-10 max-w-7xl mx-auto transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-black"
            }`}>
                <motion.div
                    className="text-center mb-16 pt-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                        theme === "dark" ? "text-white" : "text-black"
                    }`}>
                        Skills & Technologies
                    </h2>
                    <p className={`text-xl max-w-2xl mx-auto ${
                        theme === "dark" ? "text-white opacity-90" : "text-black opacity-80"
                    }`}>
                        An overview of my technical skills
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                    {skillsData.map((category, categoryIndex) => (
                        <motion.div
                            key={category.title}
                            className={`p-4 md:p-6 rounded-lg backdrop-blur-sm shadow-lg ${
                                theme === "dark" ? "bg-gray-900 bg-opacity-80" : "bg-white bg-opacity-90"
                            }`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                        >
                            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
                                {category.title}
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                                {category.skills.map((skill, skillIndex) => (
                                    <motion.div
                                        key={skill.name}
                                        className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm ${
                                            theme === "dark"
                                                ? "bg-gray-800 bg-opacity-80 hover:bg-gray-700 hover:bg-opacity-90"
                                                : "bg-white bg-opacity-90 hover:bg-gray-50 hover:bg-opacity-95 shadow-sm hover:shadow-md"
                                        }`}
                                        onClick={() => setSelectedSkill(skill)}
                                        whileHover={{ scale: 1.02 }}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ 
                                            duration: 0.4, 
                                            delay: categoryIndex * 0.1 + skillIndex * 0.05 
                                        }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-sm md:text-base">{skill.name}</span>
                                            {renderSkillLevel(skill.level)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Skill Level Key */}
                <motion.div
                    className={`p-6 rounded-lg ${
                        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="text-xl font-bold mb-4 text-center">Skill Level Guide</h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { level: 1, title: "Familiar" },
                            { level: 2, title: "Capable" },
                            { level: 3, title: "Comfortable" },
                            { level: 4, title: "Proficient" },
                            { level: 5, title: "Advanced" }
                        ].map((levelDesc) => (
                            <div key={levelDesc.level} className="text-center">
                                <div className="flex justify-center mb-2">
                                    {renderSkillLevel(levelDesc.level)}
                                </div>
                                <div className="font-medium mb-1">{levelDesc.title}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Skill Detail Modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSkill(null)}
                    >
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                            onClick={() => setSelectedSkill(null)}
                        />
                        <motion.div
                            className={`relative max-w-md w-full p-4 md:p-6 rounded-lg backdrop-blur-sm shadow-2xl max-h-[90vh] overflow-y-auto ${
                                theme === "dark" ? "bg-gray-900 bg-opacity-90" : "bg-white bg-opacity-95"
                            }`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedSkill(null)}
                                className={`absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full transition-colors ${
                                    theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                                }`}
                            >
                                <X size={18} />
                            </button>
                            
                            <div className="mb-4">
                                <h3 className="text-xl md:text-2xl font-bold mb-2 pr-8">{selectedSkill.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    {renderSkillLevel(selectedSkill.level)}
                                    <span className="text-xs md:text-sm opacity-70">
                                        {levelDescriptions[selectedSkill.level - 1].title}
                                    </span>
                                </div>
                            </div>
                            
                            <p className="leading-relaxed text-sm md:text-base">{selectedSkill.explanation}</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default SkillsSection;