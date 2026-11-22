import { SmsHistory } from "@/components/SmsHistory";

export const metadata = {
  title: "SMS History | Farmer Portal",
};

export default function FarmerHistoryPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <SmsHistory />
    </div>
  );
}
