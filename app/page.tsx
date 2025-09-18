import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsGrid } from "@/components/news-grid"
import { FeaturedNews } from "@/components/featured-news"
import { CategoryTabs } from "@/components/category-tabs"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Featured News Section */}
        <section className="container mx-auto px-4 py-8">
          <FeaturedNews />
        </section>

        {/* Category Tabs */}
        <section className="container mx-auto px-4">
          <CategoryTabs />
        </section>

        {/* News Grid */}
        <section className="container mx-auto px-4 py-8">
          <NewsGrid />
        </section>
      </main>
      <Footer />
    </div>
  )
}
