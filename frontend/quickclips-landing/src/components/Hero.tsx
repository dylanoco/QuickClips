// src/components/Hero.tsx
import '../styles/Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClapperboard,  faCameraRetro} from "@fortawesome/free-solid-svg-icons";
export function Hero() {
  return (
    <section id="hero" className='w-1280 h-screen flex justify-center align-middle px-16 
    bg-[linear-gradient(135deg,_#000000_0%,_#23243a_90%,_#23243a_100%)]'>
      <div className="flex flex-row items-center justify-center align-middle px-16">
        <div className="hero-content flex flex-col text-left w-200 pr-16">
          <p className='text-shadow bg-blue-900/30 rounded-2xl w-fit p-1 px-6 my-8 border-blue-500 border-2 text-s 
          font-medium animate-[bounce_2s_ease-in-out_infinite]'>QuickClips</p>
          <h1 className=' font-bold text-shadow-md/80 text-shadow-black text-shadow-blur text-7xl'> 
            <span className='text-red-500 text-shadow-red-800 text-shadow-md text-shadow-blur 
            animate-[pulse_3s_ease-in-out_infinite]'>F***</span> Surfing Through VoD's.
          </h1>
          <p className='py-8 text-lg w-150'>QuickClips transforms your streaming workflow. Capture, edit, 
            and share your best gaming moments instantly without interrupting your stream.</p>
          <a href="https://quickclips.uk/.netlify/functions/download " className="cta_btn">
          Download Free</a>
          <hr className='my-8'></hr>
          <div className='flex flex-row space-x-12'>
            <p className='text-md text-gray-500'><FontAwesomeIcon icon={faClapperboard} className='px-2 text-blue-500'/>1000+ Clips Created</p>
            <p className='text-md text-gray-500'><FontAwesomeIcon icon={faCameraRetro} className='px-2 text-green-500'/>50+ Active Streamers and Growing</p>
          </div>
      </div>
        <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/better-webm.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
}
