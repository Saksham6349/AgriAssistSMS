
"use client";

import { useState, useMemo, FC, useTransition, useEffect } from "react";
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
import { TrendingUp, Leaf, Loader2, Send, Wheat, MapPin } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendSms } from "@/ai/flows/send-sms";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useTranslation } from "@/hooks/useTranslation";
import { getMarketPrices, MarketPriceOutput } from "@/ai/tools/agri-tools";
import { Skeleton } from "./ui/skeleton";

type SortKey = "name" | "price" | "change" | null;
type SortDirection = "asc" | "desc";

export function MarketPrices() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [isDataLoading, startDataLoadingTransition] = useTransition();
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketPriceOutput[]>([]);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (registeredFarmer?.district) {
      startDataLoadingTransition(async () => {
        setMarketData([]);
        setSmsStatus(null);
        try {
          const cropsToFetch = [registeredFarmer.crop, registeredFarmer.secondaryCrop].filter(Boolean);
          const pricePromises = cropsToFetch.map(crop => 
            getMarketPrices({ crop, location: registeredFarmer.district })
          );
          const results = await Promise.all(pricePromises);
          
          // Filter out results that indicate no data was found
          const validResults = results.filter(res => res.found);
          setMarketData(validResults);

          if (validResults.length === 0) {
            toast({
              variant: "default",
              title: "No Price Data Available",
              description: `Could not find market price data for the registered crops in ${registeredFarmer.district}.`,
            });
          }

        } catch (error) {
          console.error("Failed to fetch market prices:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch market price data. Please try again later.",
          });
        }
      });
    } else {
        setMarketData([]);
    }
  }, [registeredFarmer, toast]);

  const handleSendSms = () => {
    if (!registeredFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer before sending an SMS.",
      });
      return;
    }

    if (marketData.length === 0) {
        toast({
            variant: "destructive",
            title: "No Price Data",
            description: "No market price data available to send.",
        });
        return;
    }
    
    let message = `${t('market.smsTitle', 'Market Prices (INR/quintal)')}: `;
    marketData.forEach(item => {
        const cropName = t(`market.crops.${item.crop.toLowerCase()}`, item.crop);
        message += `${cropName} @ ${item.modalPrice}. `;
    });
    
    message = message.trim().substring(0, 160);

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
            <CardTitle>{t('market.title', 'Market Prices')}</CardTitle>
            <CardDescription>
              {registeredFarmer 
                ? `${t('market.showingFor', 'Showing prices for')} ${registeredFarmer.district}`
                : t('market.description', 'Live mandi rates for key crops in your area. Prices per quintal.')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('market.crop', 'Crop')}</TableHead>
              <TableHead>{t('market.location', 'Market Location')}</TableHead>
              <TableHead className="text-right">{t('market.minPrice', 'Min Price (INR)')}</TableHead>
              <TableHead className="text-right">{t('market.modalPrice', 'Modal Price (INR)')}</TableHead>
              <TableHead className="text-right">{t('market.maxPrice', 'Max Price (INR)')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isDataLoading ? (
                [...Array(2)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : marketData.length > 0 ? (
                marketData.map((item) => (
                    <TableRow key={`${item.crop}-${item.location}`}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Wheat className="w-5 h-5 text-muted-foreground" />
                                <span>{t(`market.crops.${item.crop.toLowerCase()}`, item.crop)}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                <span>{item.location}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{item.minPrice?.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right font-mono font-bold text-primary">{item.modalPrice?.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-right font-mono">{item.maxPrice?.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {registeredFarmer ? 'No price data found for registered crops in this area.' : 'Please register a farmer to see market prices.'}
                    </TableCell>
                </TableRow>
            )}
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
        <Button onClick={handleSendSms} disabled={!registeredFarmer || isSmsPending || isDataLoading || marketData.length === 0} className="w-full" variant="secondary" size="sm">
            {isSmsPending ? <><Loader2 className="animate-spin" /> {t('market.sending', 'Sending...')}</> : <><Send /> {t('market.sendSms', 'Send as SMS')}</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
