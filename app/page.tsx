import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { FeatureGrid } from '@/components/marketing/feature-grid'
import { HeroSection } from '@/components/marketing/hero-section'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <HeroSection />
      <FeatureGrid />
      <SiteFooter />
    </>
  )
}
