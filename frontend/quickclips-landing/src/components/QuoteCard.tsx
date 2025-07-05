
import { Card, CardContent } from "@/components/ui/card"

import { faQuoteLeft} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { JSX } from "react";

interface QuoteCardProps {
    quote: string;
    source?: string;
    sourceIcon?: React.ReactNode;
    iconImage?: React.ReactNode;
}
export default function QuoteCard({quote, source, sourceIcon, iconImage} : QuoteCardProps): JSX.Element {
    return (
        <Card className="shadow-lg backdrop-blur-md rounded-4xl ">
            <CardContent>
                { /* Quotations Image, baseline, white, slightly lower opacity */}
                <FontAwesomeIcon className="text-2xl" icon={faQuoteLeft} />
                <div className="flex flex-col items-center text-center">
                    <p className="p-2 text-md font-thin italic">{quote}</p>
                </div>
                { /* Reddit Icon and 'Reddit' Text, end, slightly lower opacity*/}
                <div className="flex justify-end items-center opacity-20">
                        {sourceIcon}
                        {iconImage}
                    <p className="pl-2">{source}</p>
                </div>
            </CardContent>
        </Card>
    );
}