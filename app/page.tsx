import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import IntroStrip from '@/components/sections/IntroStrip'
import CompoundCalculator from '@/components/sections/CompoundCalculator'
import BankVsInvest from '@/components/sections/BankVsInvestLazy'
import QualifyCards from '@/components/sections/QualifyCards'
import ProblemSection from '@/components/sections/ProblemSection'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import RiskProfile from '@/components/sections/RiskProfile'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import Resources from '@/components/sections/Resources'
import FAQ from '@/components/sections/FAQ'
import CTA from '@/components/sections/CTA'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <IntroStrip />
        <CompoundCalculator />
        <BankVsInvest />
        <QualifyCards />
        <ProblemSection />
        <ProcessTimeline />
        <RiskProfile />
        <Services />
        <About />
        <Testimonials />
        <Resources />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
