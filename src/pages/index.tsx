// src/pages/index.tsx
import React from "react";
import { Navbar } from "../components";
import AboutSection from "../components/sections/AboutSection";
import ProjectsSection from "../components/sections/ProjectsSection";
import SkillsSection from "../components/sections/SkillsSection";
import ContactSection from "../components/sections/ContactSection";

const Home: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <AboutSection />
                <ProjectsSection />
                <SkillsSection />
                <ContactSection />
            </main>
        </div>
    );
};

export default Home;