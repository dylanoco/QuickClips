






import CarouselComponent from "./CarouselComponent";
export function Quotes() {
    return (
        <section className="flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 bg-blue-400/10 m-4 sm:m-8 md:m-10 rounded-2xl md:rounded-4xl shadow-lg">
            <h2 className="font-bold text-center p-2 sm:p-4 text-shadow-lg text-shadow-gray-400/10 text-2xl sm:text-3xl md:text-4xl">
                We <span className="text-[#1bbfbf]">Listened</span>
            </h2>
            <CarouselComponent />
        </section>
    );
}