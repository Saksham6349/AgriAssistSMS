import { PestDiseaseIdentification } from "@/components/PestDiseaseIdentification";

export const metadata = {
  title: "Crop Diagnosis | AgriAssist SMS",
};

export default function DiagnosisPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <PestDiseaseIdentification />
    </div>
  );
}
