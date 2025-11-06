
import { WeatherCard } from "@/components/WeatherCard";

export default function FarmerWeatherPage() {
    return (
        <div 
            className="w-full bg-no-repeat bg-cover bg-center min-h-[calc(100vh-4rem)] py-12 md:py-24 px-4" 
            style={{backgroundImage: "url('https://picsum.photos/seed/green-farm/1920/1080')"}}
            data-ai-hint="sky clouds"
        >
             <div className="bg-black/40 backdrop-blur-sm">
                <div className="container mx-auto">
                    <div className="max-w-4xl mx-auto py-12">
                        <WeatherCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
