import '../styles/Features.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt,faFaceSmileBeam,faGauge,faHardDrive } from "@fortawesome/free-solid-svg-icons";

export function Features() {
    return (
        <section className='rounded-lg'>
            <h2 className='font-bold text-center pt-8 text-shadow-lg text-shadow-gray-400/10 text-4xl md:text-5xl'>
                Built For <span className='font-bold text-[#1bbfbf]'>Growth</span>. For <span className='font-bold text-[#1bbfbf]'>You</span>.
            </h2>
            <div className='flex flex-col md:flex-row items-center justify-center p-6 md:p-24 text-center gap-8 md:gap-16 flex-wrap'>
                <Card className="card-format w-full max-w-xs md:max-w-sm">
                    <CardHeader className='flex flex-col justify-center items-center'>
                        <FontAwesomeIcon icon={faBolt} beat className='icon-format text-amber-300'/>
                        <CardTitle className='text-2xl font-bold '>Instant Clips</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='font-extralight'>One clip can open you up to <span className='font-bold text-[#1bbfbf]'>millions of viewers</span>. Do not hold back.
                        </p>
                    </CardContent>
                </Card>

                <Card className="card-format w-full max-w-xs md:max-w-sm">
                    <CardHeader className='flex flex-col justify-center items-center'>
                        <FontAwesomeIcon icon={faHardDrive} beat className='icon-format text-green-400'/>
                        <CardTitle className='text-2xl font-bold '>Unlimited Storage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='font-extralight'>Worried about storage? All your clips will be held by <span className='font-bold'>Twitch</span>.
                        </p>
                    </CardContent>
                </Card>

                <Card className="card-format w-full max-w-xs md:max-w-sm">
                    <CardHeader className='flex flex-col justify-center items-center'>
                        <FontAwesomeIcon icon={faGauge} beat className='icon-format text-fuchsia-500'/>
                        <CardTitle className='text-2xl font-bold '>Keep your Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='font-extralight'>We don't take up much resources. Enjoy your game without worrying about performance.
                        </p>
                    </CardContent>
                </Card>

                <Card className="card-format w-full max-w-xs md:max-w-sm">
                    <CardHeader className='flex flex-col justify-center items-center'>
                        <FontAwesomeIcon icon={faFaceSmileBeam} beat className='icon-format text-amber-300 transition-shadow hover:drop-shadow-3xl'/>
                        <CardTitle className='text-2xl font-bold '>Zero Fluff</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='font-extralight'>No BS watermarks, no ads and no spam. <span className='font-bold text-[#1bbfbf]'>Just you and your clips.</span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
