import { ShortsVideo } from "./ShortsVideo.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import '../styles/SocialProof.css';

export function SocialProof() {
  return (
    <section className='bg-[#13171f] p-12'>

      <div className="flex flex-col items-center justify-center p-8 ">
        <h2 className=" inline-block bg-clip-text text-center font-bold text-6xl gradient-text">Trusted by the Community</h2>
         <p className='text-center text-lg font-medium text-gray-500 p-8'>Join the community of content creators who trust QuickClips to enhance their streams and engage their audience.</p>
      </div>
    <div className="flex flex-row justify-center items-center space-x-16 w-full">
      <Card className=" card w-80 p-4 text-center flex flex-col ">
        <CardHeader className="flex flex-col items-center">
          <div className="gradient-text">
            <CardTitle className="font-bold text-6xl">1k+</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="">
          <h3 className="font-medium text-lg">Clips Created</h3>
          <p className="font-light text-sm">Amazing Moments Captured</p>
        </CardContent>
      </Card>

      <Card className=" card w-80 p-4 text-center flex flex-col ">
        <CardHeader className="flex flex-col items-center">
          <div className="gradient-text">
            <CardTitle className="font-bold text-6xl">50+</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="">
          <h3 className="font-medium text-lg">Active Streamers</h3>
          <p className="font-light text-sm">And Growing</p>
        </CardContent>
      </Card>

      <Card className=" card w-80 p-4 text-center flex flex-col ">
        <CardHeader className="flex flex-col items-center">
          <div className="gradient-text">
            <CardTitle className="font-bold text-6xl"> &lt;2s</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="">
          <h3 className="font-medium text-lg">Clips Creation</h3>
          <p className="font-light text-sm">Amazing Moments Captured</p>
        </CardContent>
      </Card>
    </div>










      <div className='flex flex-row items-center justify-center p-12 text-center gap-16 flex-wrap'>
          <ShortsVideo videoID='https://youtube.com/embed/U-5RI0_bNz4'/>
          <ShortsVideo videoID='https://youtube.com/embed/UrXgCjY406Q?feature=share'/>
          <ShortsVideo videoID='https://youtube.com/embed/jkUAqxqjFA4?feature=share'/>
      </div>
    </section>
  );
}