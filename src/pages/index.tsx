import {
    Navbar,
    FullPageImages,
    ProjectCarousel,
    SocialCarousel,
    Footer,
} from "../components";

const Home: React.FC = () => {
    return (
        <div className="bg-black text-white">
            <Navbar />
            <main>
                <ProjectCarousel />
                <SocialCarousel />
                <FullPageImages />
                
            </main>
            <Footer />
        </div>
    );
};

export default Home;
