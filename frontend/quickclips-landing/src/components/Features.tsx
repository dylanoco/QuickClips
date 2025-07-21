import '../styles/Features.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt,faFaceSmileBeam,faGauge,faHardDrive } from "@fortawesome/free-solid-svg-icons";

export function Features() {
    return (
        <section className='bg-[#0f1319] p-12'>
            <h2 className='font-bold text-center p-8 text-shadow-lg text-shadow-gray-400/10 text-4xl md:text-5xl '>
                <span className='font-bold text-6xl '>Why Streamers Choose QuickClips</span>.
            </h2>
            <p className='flex justify-center pt-4 text-lg text-gray-500'>
                Designed specifically for content creators who need reliable, fast clip creation without the hassle.
            </p>
            <div className='flex flex-row flex-wrap justify-center items-center gap-4 p-8'>
                <div className='flex flex-col flex-wrap justify-center items-center gap-4 p-8 '>

                    <Card className="card-format">
                        <CardHeader className='card-header-format'>
                            <FontAwesomeIcon icon={faBolt} beat className='icon-format icon-bg'/>
                            <CardTitle className='text-xl font-bold p-0 m-0 '>Instant Clips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='font-extralight'>One clip can open you up to <span className='font-bold text-[#1bbfbf]'>millions of viewers</span>. Do not hold back.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="card-format">
                        <CardHeader className='card-header-format'>
                            <FontAwesomeIcon icon={faHardDrive} beat className='icon-format icon-bg'/>
                            <CardTitle className='text-xl font-bold p-0 m-0'>Unlimited Storage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='font-extralight'>Worried about storage? All your clips will be held by <span className='font-bold'>Twitch</span>.
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <div className='flex flex-col flex-wrap justify-center items-center gap-4 p-8'>
                    <Card className="card-format">
                        <CardHeader className='card-header-format'>
                                <FontAwesomeIcon icon={faGauge} beat className='icon-format icon-bg'/>
                            <CardTitle className='text-xl font-bold p-0 m-0'>Keep your Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='font-extralight'>We don't take up much resources. Enjoy your game without worrying about performance.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="card-format">
                        <CardHeader className='card-header-format'>
                            <FontAwesomeIcon icon={faFaceSmileBeam} beat className='icon-format icon-bg'/>
                            <CardTitle className='text-xl font-bold p-0 m-0'>Zero Fluff</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='font-extralight'>No BS watermarks, no ads and no spam. <span className='font-bold text-[#1bbfbf]'>Just you and your clips.</span>
                            </p>
                        </CardContent>
                    </Card>
                    </div>
                </div>
        </section>
    );
}
