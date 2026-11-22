import { MarketPrices } from "@/components/MarketPrices";

export const metadata = {
  title: "Market Mandi Prices | Farmer Portal",
};

export default function FarmerMarketPricesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 md:p-8 max-w-5xl mx-auto">
      <MarketPrices />
    </div>
  );
}
