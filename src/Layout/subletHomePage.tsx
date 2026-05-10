import Navbar from "../components/subletHomepage/Navbar";
import Hero from "../components/subletHomepage/Hero";
import Features from "../components/subletHomepage/Features";
import OfferBox from "../components/subletHomepage/OfferBox";
import Footer from "../components/subletHomepage/Footer";

const SubletHomePage = () => {
  return (
    <div className="sublet-homepage min-h-screen font-sans selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <main className="container mx-auto">
        <Hero />
        <Features />
        <OfferBox />
      </main>
      <Footer />
    </div>
  );
};

export default SubletHomePage;
