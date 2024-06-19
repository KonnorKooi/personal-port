import React from "react";
import Navbar from "../components/Navbar";
import LargeCarousel from "../components/LargeCarousel";
import ProjectCarousel from "../components/ProjectCarousel";
import SocialCarousel from "../components/SocialCarousel";
import FooterKonnor from "../components/FooterKonnor";

const App: React.FC = () => {
  return (
    <div className=" bg-black text-white">
      <Navbar />
      <div className="w-full bg-black">
        <LargeCarousel />
      </div>
      <div className="pt-8 pb-8">
        <ProjectCarousel />
      </div>
      <div className="pt-8 pb-8">
        <SocialCarousel />
      </div>
      <div className="text-white bg-black">
        {" "}
        <FooterKonnor />
      </div>
    </div>
  );
};

export default App;
