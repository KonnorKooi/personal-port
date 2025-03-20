import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const Navbar: React.FC = () => {
    const [showHelp, setShowHelp] = useState(false);
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

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [showHelp]);

    const handleHelpClick = () => {
        setShowHelp(!showHelp);
    };

    return (
        <nav className="bg-black py-4 px-6 relative">
            <div className="flex justify-between items-center">
                <div className="h-12 w-12 relative">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        priority // Added priority for LCP optimization
                        className="object-contain"
                    />
                </div>
                <span className="text-white text-xl font-semibold">
                    Konnor Kooi
                </span>
                <button
                    ref={helpButtonRef}
                    className={`p-2 rounded-full transition-colors ${
                        showHelp ? "bg-gray-200" : "bg-transparent"
                    }`}
                    onClick={handleHelpClick}>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z" />
                    </svg>
                </button>
            </div>
            {showHelp && (
                <div
                    ref={helpBoxRef}
                    className="absolute top-16 right-6 w-64 p-4 bg-white text-black rounded-lg shadow-lg z-50">
                    <h2 className="text-lg font-semibold mb-2 ">
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