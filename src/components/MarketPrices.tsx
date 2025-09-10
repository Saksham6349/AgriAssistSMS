
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

const mockMarketData = [
  { crop: "Wheat", price: "2,275", change: "+1.5%", trend: "up" },
  { crop: "Rice", price: "3,100", change: "-0.8%", trend: "down" },
  { crop: "Corn", price: "2,150", change: "+2.1%", trend: "up" },
  { crop: "Soybeans", price: "4,800", change: "+0.5%", trend: "up" },
  { crop: "Cotton", price: "7,200", change: "-1.2%", trend: "down" },
  { crop: "Sugarcane", price: "350", change: "+3.0%", trend: "up" },
  { crop: "Potatoes", price: "1,800", change: "+1.8%", trend: "up" },
  { crop: "Onions", price: "2,500", change: "-2.5%", trend: "down" },
  { crop: "Tomatoes", price: "2,000", change: "+4.2%", trend: "up" },
  { crop: "Apples", price: "8,500", change: "+0.9%", trend: "up" },
];

export function MarketPrices() {
  const { registeredFarmer } = useAppContext();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>Market Prices</CardTitle>
            <CardDescription>
              Live mandi rates for key crops in {registeredFarmer?.location || "your area"}. Prices per quintal.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Crop</TableHead>
              <TableHead className="text-right">Price (INR)</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMarketData.map((item) => (
              <TableRow key={item.crop}>
                <TableCell className="font-medium">{item.crop}</TableCell>
                <TableCell className="text-right font-mono">{item.price}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={item.trend === "up" ? "default" : "destructive"}
                    className="bg-opacity-20 text-opacity-100"
                  >
                    {item.change}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
