import ArticlesSection from "../components/articles/ArticleSection";
import HeroSection from "../components/layout/Hero";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ArticleFilterSection from "../components/layout/ArticleFilterSection";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#F0F4FA" }}>
      <HeroSection />
      <ArticlesSection />
      <ArticleFilterSection />
    </div>
  );
}
