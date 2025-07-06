import './App.css'
import { Features } from './components/Features.tsx'
import { Hero } from './components/Hero.tsx'
import { Quotes } from './components/Quotes.tsx'
// import { NavBar } from './components/NavBar.tsx'
import { Footer } from './components/Footer.tsx'
import { SocialProof } from './components/SocialProof.tsx'
import { motion } from 'framer-motion'

function App() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}>
      <Hero />
      <Features/>
      <SocialProof />
      <Quotes />      
      <Footer />
    </motion.div>
  )
}

export default App
