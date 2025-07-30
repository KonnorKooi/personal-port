import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import { Github, MapPin, GraduationCap, Briefcase } from "lucide-react";
import Image from "next/image";

const AboutSection: React.FC = () => {
  const { theme } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-6 py-8 relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={theme === "dark" ? "/images/night-day-photos/night.PNG" : "/images/night-day-photos/day.JPG"}
          alt={theme === "dark" ? "Night sky background" : "Day sky background"}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        {/* Overlay for better text readability */}
        <div 
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "dark" 
              ? "bg-black bg-opacity-40" 
              : "bg-white bg-opacity-50"
          }`} 
        />
      </div>

      {/* Content with higher z-index */}
      <div className={`relative z-10 w-full transition-colors duration-300 ${
        theme === "dark" ? "text-white" : "text-black"
      }`}>
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Konnor Kooi</h1>
          
          <div className="flex items-center justify-center gap-2 text-base md:text-lg">
            <Github size={18} className="md:hidden" />
            <Github size={20} className="hidden md:block" />
            <a
              href="https://github.com/KonnorKooi"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              github.com/KonnorKooi
            </a>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12"
        >
          <div
            className={`p-4 md:p-6 rounded-lg backdrop-blur-sm ${
              theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-white bg-opacity-70"
            } shadow-lg`}
          >
            <div className="flex items-center mb-3 md:mb-4">
              <GraduationCap className="mr-2 md:mr-3" size={20} />
              <h3 className="text-lg md:text-xl font-semibold">Education</h3>
            </div>
            <p className="mb-2">
              <strong>BS Computer Science</strong> - Western Washington
              University
            </p>
            <p className="text-sm opacity-80 mb-3">Graduating March 2026</p>
            <p>
              <strong>Accelerated Master&apos;s Program</strong> - Western
              Washington University
            </p>
            <p className="text-sm opacity-80">Finishing March 2027</p>
          </div>

          <div
            className={`p-4 md:p-6 rounded-lg backdrop-blur-sm ${
              theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-white bg-opacity-70"
            } shadow-lg`}
          >
            <div className="flex items-center mb-3 md:mb-4">
              <Briefcase className="mr-2 md:mr-3" size={20} />
              <h3 className="text-lg md:text-xl font-semibold">Experience</h3>
            </div>
            <p className="mb-2">
              <strong>Software Development Intern</strong>
            </p>
            <p className="text-sm opacity-80 mb-3"> @ Qidds Since Apr 2025</p>
            <p className="text-sm">
              Pursuing more 2026 summer internship opportunities in software
              development
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <div
            className={`p-6 md:p-8 rounded-lg ${
              theme === "dark" ? "bg-gray-900 bg-opacity-50" : "bg-gray-100 bg-opacity-70"
            }`}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">About Me</h3>
            <div className="text-base md:text-lg leading-relaxed space-y-3 md:space-y-4 max-w-3xl mx-auto">
              <p>
                Hi, I&apos;m Konnor Kooi, a Computer Science student at Western Washington
                University focusing on software development and computer vision research.
                I&apos;m currently working under Dr. Scott Wehrwein, contributing to research
                on multi-timescale scene dynamics while maintaining a 3.81 GPA.
              </p>
              <p>
                Beyond academics, I&apos;m gaining hands-on experience as a Full-stack Developer
                Intern at Qidds, working on website migration, testing automation, and a
                resource AI-Agent for their K-12 platform. I&apos;ve worked on meaningful projects
                like the WWU Schedule Optimizer, which helps students find optimal class combinations.
              </p>
              <p>
                When I&apos;m not coding, you can find me supervising intramural sports on campus,
                where I lead teams of referees and run fun intramural games for hundreds of
                participants. I&apos;m passionate about building practical solutions and enjoy
                collaborating with others to bring ideas to life.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
