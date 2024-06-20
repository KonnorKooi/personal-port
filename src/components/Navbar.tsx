import React, { useState, useEffect } from "react";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const lastUpdated = new Date().toLocaleDateString();

  const handleHelpClick = () => {
    setShowHelp(!showHelp);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showHelp &&
        !document.getElementById("helpBox")?.contains(event.target as Node) &&
        !document.getElementById("helpButton")?.contains(event.target as Node)
      ) {
        setShowHelp(false);
      }
    };

    const handleScroll = () => {
      if (showHelp) {
        setShowHelp(false);
      }
    };

    const handleWheel = () => {
      if (showHelp) {
        setShowHelp(false);
      }
    };

    const handleTouchStart = () => {
      if (showHelp) {
        setShowHelp(false);
      }
    };

    const handleResize = () => {
      if (showHelp) {
        setShowHelp(false);
      }
    };

    if (showHelp) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
      document.addEventListener("wheel", handleWheel);
      document.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("resize", handleResize);
    } else {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("resize", handleResize);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("resize", handleResize);
    };
  }, [showHelp]);

  return (
    <div className="navbar bg-black pb-2 relative">
      <div className="navbar-start">
        <div className="pl-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="h-12 w-12"
          />
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Konnor Kooi</a>
      </div>
      <div className="navbar-end">
        <button
          className={`btn btn-ghost btn-circle ${showHelp ? "open" : ""}`}
          onClick={handleHelpClick}
          id="helpButton">
          <svg
            width="32px"
            height="32px"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z" />
          </svg>
        </button>
        <div
          id="helpBox"
          className={`text-black absolute w-64 p-4 bg-white rounded-lg shadow-lg z-50 transform transition-transform duration-300 ease-out origin-top-right ${
            showHelp ? "scale-100" : "scale-0"
          }`}
          style={{
            top: "2.5rem",
            right: "2rem", // Adjusted from "1rem" to move further left
            transformOrigin: "top right",
            visibility: showHelp ? "visible" : "hidden", // Ensure visibility
          }}>
          <h2 className="text-lg font-semibold mb-2">Project Information</h2>
          <p className="text-sm mb-1">This project is built using:</p>
          <ul className="list-disc list-inside text-sm mb-2">
            <li>React</li>
            <li>Next.js</li>
            <li>Tailwind CSS</li>
          </ul>
          <p className="text-sm">
            Last Updated: <strong>{lastUpdated}</strong>
          </p>
        </div>
      </div>
      <style>{`
        .btn-circle.open {
          background-color: #f3f4f6; /* Example background color when the button is expanded */
        }

        #helpBox {
          transition: transform 0.3s ease-out, visibility 0.3s;
          transform-origin: top right;
        }

        .scale-0 {
          transform: scale(0);
        }

        .scale-100 {
          transform: scale(1);
        }
      `}</style>
    </div>
  );
};

export default Navbar;
