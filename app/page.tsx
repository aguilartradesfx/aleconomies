import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import QualifyCards from '@/components/sections/QualifyCards'
import CompoundCalculator from '@/components/sections/CompoundCalculator'
import ProblemSection from '@/components/sections/ProblemSection'
import BankVsInvest from '@/components/sections/BankVsInvestLazy'
import ProcessTimeline from '@/components/sections/ProcessTimeline'
import RiskProfile from '@/components/sections/RiskProfile'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import Testimonials from '@/components/sections/Testimonials'
import Resources from '@/components/sections/Resources'
import FAQ from '@/components/sections/FAQ'
import CTA from '@/components/sections/CTA'
import ExitIntentModal from '@/components/sections/ExitIntentModal'

export default function Page() {
  return (
    <>
      <Nav />
      <ExitIntentModal />
      <main>
        <Hero />
        <QualifyCards />
        <CompoundCalculator />
        <ProblemSection />
        <BankVsInvest />
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
