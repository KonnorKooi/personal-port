// src/pages/index.tsx
import React, { useState, useEffect } from "react";
import {
    Navbar,
    FullPageImages,
    ProjectCarousel,
    SocialCarousel,
    Footer,
} from "../components";
import ResumeCarousel from "../components/carousels/ResumeCarousel";

const Home: React.FC = () => {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        // Initialize theme from localStorage
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }

        // Listen for theme changes from other components
        const handleStorageChange = () => {
            const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null;
            if (currentTheme && currentTheme !== theme) {
                setTheme(currentTheme);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        
        // Also check for theme changes every second (for local state changes)
        const interval = setInterval(() => {
            const currentTheme = localStorage.getItem("theme") as "light" | "dark" | null;
            if (currentTheme && currentTheme !== theme) {
                setTheme(currentTheme);
            }
        }, 1000);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            clearInterval(interval);
        };
    }, [theme]);

    return (
        <div className={`${theme === "dark" ? "bg-black" : "bg-white"} ${theme === "dark" ? "text-white" : "text-black"} transition-colors duration-300`}>
            <Navbar />
            <main>
                <ProjectCarousel />
                <ResumeCarousel /> {/* Added Resume Carousel here, above Socials */}
                <SocialCarousel />
                <FullPageImages />
            </main>
            <Footer />
        </div>
    );
};

export default Home;