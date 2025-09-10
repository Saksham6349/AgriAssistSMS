
"use client";

import { useState, useMemo, FC, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { TrendingUp, Leaf, Apple, Carrot, ArrowUp, ArrowDown, ChevronsUpDown, Loader2, Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sendSms } from "@/ai/flows/send-sms";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useTranslation } from "@/hooks/useTranslation";

type CropData = {
  cropKey: string;
  price: number;
  change: number;
  icon: FC<React.ComponentProps<"svg">>;
};

const mockMarketData: CropData[] = [
  { cropKey: "wheat", price: 2275, change: 1.5, icon: Leaf },
  { cropKey: "rice", price: 3100, change: -0.8, icon: Leaf },
  { cropKey: "corn", price: 2150, change: 2.1, icon: Leaf },
  { cropKey: "soybeans", price: 4800, change: 0.5, icon: Leaf },
  { cropKey: "cotton", price: 7200, change: -1.2, icon: Leaf },
  { cropKey: "sugarcane", price: 350, change: 3.0, icon: Leaf },
  { cropKey: "potatoes", price: 1800, change: 1.8, icon: Carrot },
  { cropKey: "onions", price: 2500, change: -2.5, icon: Carrot },
  { cropKey: "tomatoes", price: 2000, change: 4.2, icon: Carrot },
  { cropKey: "apples", price: 8500, change: 0.9, icon: Apple },
  { cropKey: "bananas", price: 1500, change: 1.1, icon: Apple },
  { cropKey: "barley", price: 1900, change: -0.5, icon: Leaf },
  { cropKey: "chickpeas", price: 5200, change: 2.3, icon: Leaf },
  { cropKey: "coffee", price: 10500, change: -1.8, icon: Leaf },
  { cropKey: "grapes", price: 6000, change: 3.5, icon: Apple },
  { cropKey: "jute", price: 4500, change: 0.2, icon: Leaf },
  { cropKey: "lentils", price: 6800, change: -0.9, icon: Leaf },
  { cropKey: "mangoes", price: 7500, change: 5.0, icon: Apple },
  { cropKey: "millet", price: 2800, change: 1.2, icon: Leaf },
  { cropKey: "tea", price: 12000, change: -2.1, icon: Leaf },
];

type SortKey = "cropKey" | "price" | "change" | null;
type SortDirection = "asc" | "desc";

export function MarketPrices() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const { t } = useTranslation();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("cropKey");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { toast } = useToast();

  const sortedData = useMemo(() => {
    if (!sortKey) return mockMarketData;
    
    const sorted = [...mockMarketData].sort((a, b) => {
      const aValue = sortKey === 'cropKey' ? t(`market.crops.${a.cropKey}`) : a[sortKey];
      const bValue = sortKey === 'cropKey' ? t(`market.crops.${b.cropKey}`) : b[sortKey];

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });

    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [sortKey, sortDirection, t]);

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

  const handleSendSms = () => {
    if (!registeredFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer before sending an SMS.",
      });
      return;
    }

    const primaryCropData = mockMarketData.find(c => c.cropKey.toLowerCase() === registeredFarmer.crop.toLowerCase());
    const secondaryCropData = mockMarketData.find(c => c.cropKey.toLowerCase() === registeredFarmer.secondaryCrop.toLowerCase());
    
    let message = `${t('market.smsTitle')}: `;
    if (primaryCropData) {
      const cropName = t(`market.crops.${primaryCropData.cropKey}`);
      message += `${cropName} @ ${primaryCropData.price}. `;
    }
    if (secondaryCropData) {
      const cropName = t(`market.crops.${secondaryCropData.cropKey}`);
      message += `${cropName} @ ${secondaryCropData.price}.`;
    }

    if (!primaryCropData && !secondaryCropData) {
        toast({
            variant: "destructive",
            title: "No Price Data",
            description: "No market price data found for the farmer's registered crops.",
        });
        return;
    }
    
    message = message.substring(0, 160);

    setSmsStatus(null);
    startSmsTransition(async () => {
      try {
        const res = await sendSms({ to: registeredFarmer.phone, message });
        setSmsStatus(res.status);
        addSmsToHistory({
          to: registeredFarmer.phone,
          message: message,
          type: 'Advisory',
        });
        toast({
            title: "SMS Sent!",
            description: `Market prices sent to ${registeredFarmer.name} at ${registeredFarmer.phone}`,
        });
      } catch (error) {
        console.error("SMS sending failed", error);
        setSmsStatus("Failed to send SMS.");
        toast({
            variant: "destructive",
            title: "SMS Error",
            description: "Could not send the SMS. Please try again.",
        });
      }
    });
  };


  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('market.title')}</CardTitle>
            <CardDescription>
              {t('market.description')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('cropKey')} className="px-0 hover:bg-transparent">
                  {t('market.crop')} {getSortIcon('cropKey')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('price')} className="px-0 hover:bg-transparent">
                  {t('market.price')} {getSortIcon('price')}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => handleSort('change')} className="px-0 hover:bg-transparent">
                  {t('market.change')} {getSortIcon('change')}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow key={item.cropKey}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-muted-foreground" />
                        <span>{t(`market.crops.${item.cropKey}`)}</span>
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
        {smsStatus && !isSmsPending && (
            <Alert className="mt-4">
                <Send className="w-4 h-4" />
                <AlertTitle>SMS Status</AlertTitle>
                <AlertDescription className="text-xs whitespace-pre-wrap break-words">
                    {smsStatus} for farmer {registeredFarmer?.name}.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSendSms} disabled={!registeredFarmer || isSmsPending} className="w-full" variant="secondary" size="sm">
            {isSmsPending ? <><Loader2 className="animate-spin" /> {t('market.sending')}</> : <><Send /> {t('market.sendSms')}</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
