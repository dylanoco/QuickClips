import { ShortsVideo } from "./ShortsVideo.tsx";

export function SocialProof() {
  return (
    <section className='rounded-lg '>
    <div className='flex flex-row items-center justify-center p-12 text-center gap-16 flex-wrap'>
      <ShortsVideo videoID='https://youtube.com/embed/U-5RI0_bNz4'/>
      <ShortsVideo videoID='https://youtube.com/embed/UrXgCjY406Q?feature=share'/>
      <ShortsVideo videoID='https://youtube.com/embed/jkUAqxqjFA4?feature=share'/>
    </div>
    <div className="flex flex-col items-center justify-center p-2 text-white">
      <p className='text-center text-xl p-8'>Join the community of content creators who trust QuickClips to enhance their streams and engage their audience.</p>
    </div>
    </section>
  );
}