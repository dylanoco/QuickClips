import './App.css'
import { Features } from './components/Features.tsx'
import { Hero } from './components/Hero.tsx'
import { Quotes } from './components/Quotes.tsx'
// import { NavBar } from './components/NavBar.tsx'
import { Footer } from './components/Footer.tsx'
import { SocialProof } from './components/SocialProof.tsx'
import { HowItWorks } from './components/HowItWorks.tsx'

function App() {
  return (
    <>
      <Hero />
      <Features/>
      <HowItWorks />
      <SocialProof />
      <Quotes />      
      <Footer />
    </>
  )
}

export default App
