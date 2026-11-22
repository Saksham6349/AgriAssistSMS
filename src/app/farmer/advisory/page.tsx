import { AdvisoryAlerts } from "@/components/AdvisoryAlerts";

export const metadata = {
  title: "Advisory Alerts | Farmer Portal",
};

export default function FarmerAdvisoryPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <AdvisoryAlerts />
    </div>
  );
}
