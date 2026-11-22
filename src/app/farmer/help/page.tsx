import { HelpCenter } from "@/components/HelpCenter";

export const metadata = {
  title: "Help Center | Farmer Portal",
};

export default function FarmerHelpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <HelpCenter />
    </div>
  );
}
