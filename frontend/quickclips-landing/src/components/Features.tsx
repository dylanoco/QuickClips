import '../styles/Features.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt,faGauge,faHardDrive } from "@fortawesome/free-solid-svg-icons";

export function Features() {
  return (
    <>
    <h1 className='text-4xl font-bold text-center pt-8 text-shadow-lg text-shadow-gray-400/10'>Built For <span className='font-bold text-blue-400'>Growth</span>. For <span className='font-bold text-blue-400'>You</span>.</h1>
    <section className='flex flex-row items-center justify-center p-24 text-center gap-16 flex-wrap'>
        <Card className="card-format">
        <CardHeader className='flex flex-col justify-center items-center'>
            {/* Icon */}
            <FontAwesomeIcon icon={faBolt} beat className='text-8xl p-8 text-blue-300    transition-colors duration-300 ease-in-out hover:text-white'/>
            <CardTitle className='text-2xl font-bold '>Instant Clips</CardTitle>
            {/* <CardDescription className='pt-2 font-semibold'>No time wasted.</CardDescription> */}
        </CardHeader>
        <CardContent>
            <p className='font-extralight'>One clip can open you up to <span className='font-bold text-blue-400'>millions of viewers</span>. Do not hold back.
            </p>
        </CardContent>
        </Card>

        <Card className="card-format">
        <CardHeader className='flex flex-col justify-center items-center'>
            {/* Icon */}
            <FontAwesomeIcon icon={faHardDrive} beat className='text-8xl p-8 text-blue-300 transition-colors duration-300 ease-in-out hover:text-white'/>
            <CardTitle className='text-2xl font-bold '>Instant Clips</CardTitle>
            {/* <CardDescription className='pt-2 font-semibold'>No time wasted.</CardDescription> */}
        </CardHeader>
        <CardContent>
            <p className='font-extralight'>Worried about storage? All your clips will be held by <span className='font-bold'>Twitch</span>.
            </p>
        </CardContent>
        </Card>

        <Card className="card-format">
        <CardHeader className='flex flex-col justify-center items-center'>
            {/* Icon */}
            <FontAwesomeIcon icon={faGauge} beat className='text-8xl p-8 text-blue-300   transition-colors duration-300 ease-in-out hover:text-white'/>
            <CardTitle className='text-2xl font-bold '>Keep your Performance</CardTitle>
            {/* <CardDescription className='pt-2 font-semibold'>No time wasted.</CardDescription> */}
        </CardHeader>
        <CardContent>
            <p className='font-extralight'>We don't take up much resources. Enjoy your game without worrying about performance.
            </p>
        </CardContent>
        </Card>
    </section>
    </>
  );
}