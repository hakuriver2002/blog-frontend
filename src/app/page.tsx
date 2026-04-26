import ArticlesSection from "../components/articles/ArticleSection";
import HeroSection from "../components/layout/Hero";
import ArticleFilterSection from "../components/layout/ArticleFilterSection";
import AthleteCardSection from "../components/layout/AthleteCardSection";
import GallerySection from "../components/layout/GallerySection";
import ContactSection from "../components/layout/ContactSection";

export default function Home() {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--background)" }}>
      <HeroSection />
      <ArticlesSection />
      <GallerySection />
      <AthleteCardSection />
      <ContactSection />
    </div>
  );
}
