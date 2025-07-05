import type { JSX } from "react";

interface ShortsVideoProps {
  videoID: string;
}
export function ShortsVideo({videoID} : ShortsVideoProps): JSX.Element {
    return (
<iframe
    className="rounded-lg shadow-lg transition-transform hover:scale-105 duration-500 ease-in-out"
    width="315"
    height="560"
    src={videoID}
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
    allowFullScreen
></iframe>
    );
}   