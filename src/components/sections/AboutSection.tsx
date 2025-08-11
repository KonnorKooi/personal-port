import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../ThemeProvider";
import {
  GraduationCap,
  Briefcase,
  Linkedin
} from "lucide-react";
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
          src={
            theme === "dark"
              ? "/images/night-day-photos/night.PNG"
              : "/images/night-day-photos/day.JPG"
          }
          alt={
            theme === "dark"
              ? "Night sky background"
              : "Day sky background"
          }
          fill
          className="object-cover transition-opacity duration-500"
          style={{
            objectPosition: "0% 0%",
          }}
          priority
        />
        <div
          className={`absolute inset-0 transition-all duration-300 ${
            theme === "dark"
              ? "bg-black bg-opacity-20"
              : "bg-white bg-opacity-15"
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 w-full transition-colors duration-300 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}
      >
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Name + LinkedIn */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-10 md:mb-14"
          >
            <h1
              className={`text-4xl md:text-5xl font-bold mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Konnor Kooi
            </h1>
            <div
              className={`flex items-center justify-center gap-2 text-base md:text-lg ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              <Linkedin size={20} />
              <a
                href="https://linkedin.com/in/konnor-kooi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                linkedin.com/in/konnor-kooi
              </a>
            </div>
          </motion.div>

          {/* Education & Experience */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-14"
          >
            <div
              className={`p-4 md:p-6 card-angular-small backdrop-blur-sm shadow-angular ${theme === "dark" ? 'border-accent-dark' : 'border-accent'} ${
                theme === "dark"
                  ? "bg-gray-900 bg-opacity-90"
                  : "bg-white bg-opacity-90"
              } shadow-lg`}
            >
              <div className="flex items-center mb-3 md:mb-4">
                <GraduationCap className="mr-3" size={22} />
                <h3 className="text-lg md:text-xl font-semibold">
                  Education
                </h3>
              </div>
              <p className="mb-2">
                <strong>BS Computer Science</strong> — Western Washington
                University
              </p>
              <p className="text-sm opacity-80 mb-3">
                Graduating March 2026
              </p>
              <p>
                <strong>Accelerated Master&apos;s Program</strong> — Western
                Washington University
              </p>
              <p className="text-sm opacity-80">
                Finishing March 2027
              </p>
            </div>

            <div
              className={`p-4 md:p-6 card-angular-small backdrop-blur-sm shadow-angular ${theme === "dark" ? 'border-accent-dark' : 'border-accent'} ${
                theme === "dark"
                  ? "bg-gray-900 bg-opacity-90"
                  : "bg-white bg-opacity-90"
              } shadow-lg`}
            >
              <div className="flex items-center mb-3 md:mb-4">
                <Briefcase className="mr-3" size={22} />
                <h3 className="text-lg md:text-xl font-semibold">
                  Experience
                </h3>
              </div>
              <p className="mb-2">
                <strong>Software Development Intern</strong>
              </p>
              <p className="text-sm opacity-80 mb-3">@ Qidds — Apr 2025–Present</p>
              <p className="text-sm opacity-90">
                Pursuing more 2026 summer internship opportunities in software development
              </p>
            </div>
          </motion.div>

          {/* About Me */}
          <motion.div variants={itemVariants} className="text-center">
            <div
              className={`p-6 md:p-8 card-angular-small shadow-angular ${theme === "dark" ? 'border-accent-dark' : 'border-accent'} ${
                theme === "dark"
                  ? "bg-gray-900 bg-opacity-90"
                  : "bg-gray-50 bg-opacity-90"
              }`}
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-5">
                About Me
              </h3>
              <div className="text-base md:text-lg leading-relaxed space-y-5 max-w-3xl mx-auto">
                <p>
                  Hi, I&apos;m Konnor Kooi, a <strong>Computer Science</strong> student at{" "}
                  <strong>Western Washington University</strong> focusing on{" "}
                  <strong>software development</strong> and{" "}
                  <strong>computer vision research</strong>. I&apos;m currently working under{" "}
                  <strong>Dr. Scott Wehrwein</strong> on{" "}
                  <em>multi-timescale scene dynamics</em> research while maintaining a{" "}
                  <strong>3.81 GPA</strong>.
                </p>
                <p>
                  I&apos;m gaining hands-on experience as a{" "}
                  <strong>Full-stack Developer Intern</strong> at{" "}
                  <strong>Qidds</strong>, contributing to{" "}
                  website migration, testing automation, and an{" "}
                  <strong>AI-Agent for K–12 educational resources</strong>. I&apos;ve also developed
                  the <strong>WWU Schedule Optimizer</strong> to help students find the best
                  class combinations.
                </p>
                <p>
                  When I&apos;m not coding, I work as an{" "}
                  <strong>Intramural Sports Supervisor</strong>, leading teams of referees
                  and organizing games for hundreds of participants. I&apos;m passionate
                  about building practical, impactful solutions and enjoy collaborating
                  to bring ideas to life.
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
