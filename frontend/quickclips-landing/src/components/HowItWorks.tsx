import '../styles/HowItWorks.css';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog,faKeyboard,faClapperboard, faDownload} from "@fortawesome/free-solid-svg-icons";


export function HowItWorks() {
    return (
        <section className='bg-[#13171f] w-full p-12'>
            <h2 className='font-bold text-center p-8 text-shadow-lg text-shadow-gray-400/10 text-4xl md:text-5xl '>
                <span className='font-bold text-6xl '>How QuickClips Works</span>.
            </h2>
            <p className='flex justify-center pt-4 text-lg text-gray-500'>
                A simple, effective way to create clips from your streams.
            </p>


            <div className='flex flex-row justify-center gap-8 p-8 w-full flex-wrap'>

                <div className='relative p-4'>
                    <span className='h-number-format'>
                        <p>1</p>
                    </span>
                    <Card className="h-card-format">
                        <CardHeader className='h-card-header-format'>
                            <FontAwesomeIcon icon={faDownload} beat className='h-icon-format icon-bg text-center'/>
                            <span className='font-bold'>Download & Install</span>
                        </CardHeader>
                        <CardContent className='text-center'>
                            <p className='font-extralight'>Get QuickClips and install it on your Windows PC. Setup takes less than a minute.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className='relative p-4'>
                    <span className='h-number-format'>
                        <p>2</p>
                    </span>
                    <Card className="h-card-format">
                        <CardHeader className='h-card-header-format'>
                            <FontAwesomeIcon icon={faCog} className='h-icon-format icon-bg text-center'/>
                            <span className='font-bold'>Configure</span>
                        </CardHeader>
                        <CardContent className='text-center'>
                            <p className='font-extralight'>Connect your Twitch account and customize your hotkey preferences. Default is Ctrl + Alt + J.</p>
                        </CardContent>
                    </Card >
                </div>
                <div className='relative p-4'>
                    <span className='h-number-format'>
                        <p>3</p>
                    </span>
                    <Card className="h-card-format">
                        <CardHeader className='h-card-header-format'>
                            <FontAwesomeIcon icon={faKeyboard} className='h-icon-format icon-bg text-center'/>
                            <span className='font-bold'>Press Your Hotkey</span>
                        </CardHeader>
                        <CardContent className='text-center'>
                            <p className='font-extralight'>While streaming, press your hotkey when something amazing happens. QuickClips handles the rest.</p>
                        </CardContent>
                    </Card>
                </div>
                <div className='relative p-4'>
                    <span className='h-number-format'>
                        <p>4</p>
                    </span>
                    <Card className="h-card-format">
                        <CardHeader className='h-card-header-format'>
                            <FontAwesomeIcon icon={faClapperboard} className='h-icon-format icon-bg text-center'/>
                            <span className='font-bold'>Clip Created</span>
                        </CardHeader>
                        <CardContent className='text-center'>
                            <p className='font-extralight'>Your clip is instantly created and saved to your Twitch account. Share it with your community!</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}