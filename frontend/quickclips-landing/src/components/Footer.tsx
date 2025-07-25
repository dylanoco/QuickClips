export function Footer() {
  return ( 
    <section className="flex flex-col items-center text-center justify-center p-16 bg-gray-800 text-white">
        <h2 className="text-6xl font-bold">And We <span className="font-bold text-[#1bbfbf]">Deliver</span></h2>
        <p className="p-8">What are you waiting for? Download QuickClips now and enhance your content creation.</p>
        <a href="https://quickclips.uk/.netlify/functions/download " className="download-btn">Download Now</a>
    </section>
  );
}