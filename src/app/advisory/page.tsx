
import { AdvisoryAlerts } from "@/components/AdvisoryAlerts";

export default function AdvisoryPage() {
    return (
        <div 
            className="w-full bg-no-repeat bg-cover bg-center min-h-[calc(100vh-4rem)] py-12 md:py-24 px-4" 
            style={{backgroundImage: "url('https://picsum.photos/seed/advisory-bg/1920/1080')"}}
            data-ai-hint="farm field"
        >
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-2xl">
                    <AdvisoryAlerts />
                </div>
            </div>
        </div>
    );
}
