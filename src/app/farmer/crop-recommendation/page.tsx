import { CropRecommendation } from "@/components/CropRecommendation";

export const metadata = {
  title: "Farmer Crop Recommendation (ML) | AgriAssist SMS",
  description: "Machine Learning model for soil nutrient and climate-based crop recommendation.",
};

export default function FarmerCropRecommendationPage() {
  return <CropRecommendation />;
}
