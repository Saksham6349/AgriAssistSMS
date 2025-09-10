
"use client";

import { useState, useMemo, FC } from "react";
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
import { TrendingUp, Leaf, Apple, Carrot, ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type CropData = {
  crop: string;
  price: number;
  change: number;
  icon: FC<React.ComponentProps<"svg">>;
};

const mockMarketData: CropData[] = [
  { crop: "Wheat", price: 2275, change: 1.5, icon: Leaf },
  { crop: "Rice", price: 3100, change: -0.8, icon: Leaf },
  { crop: "Corn", price: 2150, change: 2.1, icon: Leaf },
  { crop: "Soybeans", price: 4800, change: 0.5, icon: Leaf },
  { crop: "Cotton", price: 7200, change: -1.2, icon: Leaf },
  { crop: "Sugarcane", price: 350, change: 3.0, icon: Leaf },
  { crop: "Potatoes", price: 1800, change: 1.8, icon: Carrot },
  { crop: "Onions", price: 2500, change: -2.5, icon: Carrot },
  { crop: "Tomatoes", price: 2000, change: 4.2, icon: Carrot },
  { crop: "Apples", price: 8500, change: 0.9, icon: Apple },
];

type SortKey = keyof CropData | null;
type SortDirection = "asc" | "desc";

export function MarketPrices() {
  const { registeredFarmer } = useAppContext();
  const [sortKey, setSortKey] = useState<SortKey>("crop");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedData = useMemo(() => {
    if (!sortKey) return mockMarketData;
    
    const sorted = [...mockMarketData].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };
  
  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
        return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    if (sortDirection === 'asc') {
        return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };


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
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('crop')} className="px-0 hover:bg-transparent">
                  Crop {getSortIcon('crop')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('price')} className="px-0 hover:bg-transparent">
                  Price (INR) {getSortIcon('price')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('change')} className="px-0 hover:bg-transparent">
                  Change {getSortIcon('change')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.crop}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <span>{item.crop}</span>
                    </div>
                </TableCell>
                <TableCell className="text-right font-mono">{item.price.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={item.change >= 0 ? "default" : "destructive"}
                    className="bg-opacity-20 text-opacity-100 tabular-nums"
                  >
                    <div className="flex items-center gap-1">
                        {item.change >= 0 ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}
                        <span>{item.change > 0 ? '+' : ''}{item.change}%</span>
                    </div>
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
