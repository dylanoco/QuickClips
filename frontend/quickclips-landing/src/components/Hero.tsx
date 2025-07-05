// src/components/Hero.tsx
import '../styles/Hero.css';

export function Hero() {
  return (
    <section id="hero">
      <div className="hero-wrapper">
        <div className="hero-content">
          <p className='text-shadow'>QuickClips</p>
          <h1 className=' font-bold text-shadow-md/80 text-shadow-black text-shadow-blur'> <span className='text-red-500 text-shadow-red-800 text-shadow-md text-shadow-blur'>F***</span> Surfing Through VoD's.</h1>
          <p className='p-8'>Turn a hotkey into a highlight.</p>
          <a href="https://quickclips.uk/.netlify/functions/download " className="download-btn">Download for Windows (It's Free !)</a>
        </div>
        <div className="hero-image">
          <video autoPlay muted loop playsInline className="hero-video">
            <source src="/videos/better-webm.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}
