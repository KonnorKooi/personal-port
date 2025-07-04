import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";

const Navbar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [showHelp, setShowHelp] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const helpBoxRef = useRef<HTMLDivElement>(null);
    const helpButtonRef = useRef<HTMLButtonElement>(null);
    const lastUpdated = new Date().toLocaleDateString();

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                showHelp &&
                !helpBoxRef.current?.contains(event.target as Node) &&
                !helpButtonRef.current?.contains(event.target as Node)
            ) {
                setShowHelp(false);
            }
        };

        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        document.addEventListener("click", handleOutsideClick);
        window.addEventListener("scroll", handleScroll);
        
        return () => {
            document.removeEventListener("click", handleOutsideClick);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [showHelp]);

    const handleHelpClick = () => {
        setShowHelp(!showHelp);
    };

    return (
        <nav className={`${theme === "dark" ? "bg-black" : "bg-white"} py-2 px-6 fixed top-0 left-0 right-0 z-50 transition-colors duration-300`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className={`font-bold transition-all duration-500 ease-in-out flex items-center ${
                        theme === "dark" ? "text-white" : "text-black"
                    } ${isScrolled ? "text-2xl" : "text-2xl"}`}>
                        <div className="relative">
                            <span className={`transition-opacity duration-300 ease-in-out ${
                                isScrolled ? "opacity-0" : "opacity-100"
                            }`}>
                                K
                            </span>
                            <span className={`absolute top-1/2 w-1 bg-current transition-all duration-10 ease-in-out transform -translate-y-1/2 ${
                                isScrolled ? "opacity-100" : "opacity-0"
                            }`} style={{ height: '17px', left: '2px' }}>
                            </span>
                        </div>
                        <span className={`inline-block transition-all duration-500 ease-in-out overflow-hidden ${
                            isScrolled 
                                ? "max-w-0 opacity-0 transform scale-x-0" 
                                : "max-w-[200px] opacity-100 transform scale-x-100"
                        }`} style={{ transformOrigin: "left center" }}>
                            onnor
                        </span>
                        <span className={`transition-all duration-200 ease-in-out ${
                            isScrolled ? "opacity-100" : "ml-2 opacity-100"
                        }`} style={isScrolled ? { marginLeft: '-12px' } : { left: '-2px' }}>
                            K
                        </span>
                        <span className={`inline-block transition-all duration-500 ease-in-out overflow-hidden ${
                            isScrolled 
                                ? "max-w-0 opacity-0 transform scale-x-0" 
                                : "max-w-[200px] opacity-100 transform scale-x-100"
                        }`} style={{ transformOrigin: "left center" }}>
                            ooi
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full transition-colors ${
                            theme === "dark" ? "text-white hover:bg-gray-800" : "text-black hover:bg-gray-200"
                        }`}
                        aria-label="Toggle theme">
                        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                    <button
                        ref={helpButtonRef}
                        className={`p-2 rounded-full transition-colors ${
                            showHelp ? 
                                (theme === "dark" ? "bg-gray-700" : "bg-gray-300") : 
                                "bg-transparent"
                        } ${theme === "dark" ? "text-white" : "text-black"}`}
                        onClick={handleHelpClick}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z" />
                        </svg>
                    </button>
                </div>
            </div>
            {showHelp && (
                <div
                    ref={helpBoxRef}
                    id="helpBox"
                    
                    className={`absolute top-16 right-6 w-64 p-4 ${
                        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                    } rounded-lg shadow-lg z-50`}>
                    <h2 className="text-lg font-semibold mb-2">
                        Project Information
                    </h2>
                    <p className="text-sm mb-1">This project is built using:</p>
                    <ul className="list-disc list-inside text-sm mb-2">
                        <li>Next.js</li>
                        <li>Tailwind CSS</li>
                    </ul>
                    <p className="text-sm">
                        Last Updated: <strong>{lastUpdated}</strong>
                    </p>
                </div>
            )}
        </nav>
    );
};

export default Navbar;