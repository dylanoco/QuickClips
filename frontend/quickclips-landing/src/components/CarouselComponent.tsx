
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel"

import QuoteCard from './QuoteCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReddit } from "@fortawesome/free-brands-svg-icons";

const Q1 = "I've been begging my viewers for years to clip funny moments, but I tell them \"no pressure, only if you're close to your keyboard.\" & no one clips!!";
const Q2 = "I watch all my VODs at 1.5x speed, no video, audio only, earbud in my ear while I work my normal 9-5 job. If something I hear genuinely makes me laugh I’ll pause, rewind a bit, back to normal speed, and I’ll watch the video.";
const RedditIcon = <FontAwesomeIcon className="text-orange-500/100" icon={faReddit} />;
const TwitchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg"  width="24px"className='fill-[#9146FF]' role="img" viewBox="0 0 24 24"><title>Twitch</title><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
);

function CarouselComponent() {
    return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      orientation="horizontal"
      className="w-full h-full flex flex-col items-center justify-center">
      <CarouselContent className="-mt-1 h-[220px] sm:h-[200px]">
            <CarouselItem className="p-2 basis-full sm:basis-1/2">
              <QuoteCard quote= {Q1} source="Reddit"  sourceIcon= {RedditIcon}/>
            </CarouselItem>
            <CarouselItem className="p-2 basis-full sm:basis-1/2">
              <QuoteCard quote={Q2} source="Reddit" sourceIcon= {RedditIcon} />
            </CarouselItem>
            <CarouselItem className="p-2 basis-full sm:basis-1/2">
              <QuoteCard quote="I love QuickClips! It makes clipping so easy!" source="Twitch User" iconImage = {TwitchIcon} />
            </CarouselItem>
      </CarouselContent>
      <CarouselNext />
    </Carousel>
    );
}

export default CarouselComponent;
