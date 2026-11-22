import { WeatherCard } from "@/components/WeatherCard";

export const metadata = {
  title: "Weather Forecast | AgriAssist SMS",
};

export default function WeatherPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <WeatherCard />
    </div>
  );
}
