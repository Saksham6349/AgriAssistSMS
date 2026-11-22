import { HelpCenter } from "@/components/HelpCenter";

export const metadata = {
  title: "Help Center | AgriAssist SMS",
};

export default function HelpPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <HelpCenter />
    </div>
  );
}
