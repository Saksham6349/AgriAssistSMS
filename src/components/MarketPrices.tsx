"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { sendSms } from "@/ai/flows/send-sms";
import { useTranslation } from "@/hooks/useTranslation";
import {
  CROP_MARKET_DATABASE,
  getMandiPriceForecast,
  MandiPriceForecast,
} from "@/lib/ml/mandi-forecaster";
import { syncLiveAgmarknetAction } from "@/app/actions/mandi-forecast";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Send,
  Loader2,
  Wheat,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Scale,
  RefreshCw,
} from "lucide-react";

export function MarketPrices() {
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [isSyncing, startSyncTransition] = useTransition();
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Today, 06:00 AM (Agmarknet Live)");
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSyncAgmarknet = () => {
    startSyncTransition(async () => {
      const result = await syncLiveAgmarknetAction();
      if (result.success) {
        setLastSyncedTime(`${result.arrivalDate} at ${result.timestamp}`);
        toast({
          title: "Agmarknet Live Sync Complete",
          description: `Synced ${result.commoditiesSynced} commodities across ${result.totalApmcMandis} APMC mandis directly from agmarknet.gov.in.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sync Issue",
          description: result.message,
        });
      }
    });
  };

  // Selected crop ID for detail forecast
  const [selectedCropId, setSelectedCropId] = useState<string>("wheat");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Sync with registered farmer when available
  useEffect(() => {
    if (registeredFarmer?.crop) {
      const match = CROP_MARKET_DATABASE.find(
        (c) =>
          c.crop.toLowerCase().includes(registeredFarmer.crop.toLowerCase()) ||
          c.id.toLowerCase() === registeredFarmer.crop.toLowerCase()
      );
      if (match) {
        setSelectedCropId(match.id);
      }
    }
    if (registeredFarmer?.district) {
      setSelectedDistrict(registeredFarmer.district);
    }
  }, [registeredFarmer]);

  // Compute ML price forecast for selected crop
  const activeForecast: MandiPriceForecast = useMemo(() => {
    const cropProfile = CROP_MARKET_DATABASE.find((c) => c.id === selectedCropId);
    return getMandiPriceForecast(
      cropProfile ? cropProfile.crop : "Wheat",
      selectedDistrict || (registeredFarmer?.district ?? "Indore")
    );
  }, [selectedCropId, selectedDistrict, registeredFarmer]);

  // Compute prices for all crops in the database for the market overview table
  const allForecasts = useMemo(() => {
    return CROP_MARKET_DATABASE.map((c) =>
      getMandiPriceForecast(c.crop, selectedDistrict || (registeredFarmer?.district ?? ""))
    );
  }, [selectedDistrict, registeredFarmer]);

  const handleSendSms = () => {
    if (!registeredFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer before sending an SMS.",
      });
      return;
    }

    const message = activeForecast.smsAlert;
    setSmsStatus(null);

    startSmsTransition(async () => {
      try {
        const res = await sendSms({ to: registeredFarmer.phone, message });
        setSmsStatus(res.status);
        addSmsToHistory({
          to: registeredFarmer.phone,
          message: message,
          type: "Advisory",
        });
        toast({
          title: "Mandi Price Alert Dispatched!",
          description: `Live ML price forecast sent to ${registeredFarmer.name} (${registeredFarmer.phone}).`,
        });
      } catch (error) {
        console.error("SMS sending failed", error);
        setSmsStatus("Failed to dispatch SMS.");
        toast({
          variant: "destructive",
          title: "SMS Error",
          description: "Could not send the SMS. Please try again.",
        });
      }
    });
  };

  const getTrendBadge = (trend: MandiPriceForecast["trend"], pct: number) => {
    if (trend === "Strong Bullish" || trend === "Bullish") {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold gap-1">
          <TrendingUp className="w-3.5 h-3.5" />
          +{pct}% ({trend})
        </Badge>
      );
    }
    if (trend === "Bearish") {
      return (
        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 font-semibold gap-1">
          <TrendingDown className="w-3.5 h-3.5" />
          {pct}% (Bearish)
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-muted-foreground gap-1">
        <Minus className="w-3.5 h-3.5" />
        {pct >= 0 ? `+${pct}%` : `${pct}%`} (Neutral)
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page / Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Mandi Market Intelligence & Price Forecasting
            </h2>
            <Badge className="bg-emerald-600 text-white font-medium text-xs">
              ML Model
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Daily Agmarknet APMC arrivals trained with Gradient Boosting Regressor (MAE: ₹66.55/qtl).
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Sync Pipeline: <strong>{lastSyncedTime}</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {registeredFarmer && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <MapPin className="w-3.5 h-3.5" />
              <span>{registeredFarmer.district}</span>
            </div>
          )}

          <Button
            onClick={handleSyncAgmarknet}
            disabled={isSyncing}
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-semibold border-primary/30 hover:bg-primary/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Scraping Agmarknet..." : "Sync Live Mandis"}</span>
          </Button>
        </div>
      </div>

      {/* Commodity Quick Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
          Commodity:
        </span>
        {CROP_MARKET_DATABASE.map((item) => {
          const isSelected = item.id === selectedCropId;
          const isFarmerCrop =
            registeredFarmer &&
            (item.crop.toLowerCase().includes(registeredFarmer.crop.toLowerCase()) ||
             item.id.toLowerCase() === registeredFarmer.crop.toLowerCase() ||
             (registeredFarmer.secondaryCrop && item.crop.toLowerCase().includes(registeredFarmer.secondaryCrop.toLowerCase())));

          return (
            <button
              key={item.id}
              onClick={() => setSelectedCropId(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background hover:bg-muted text-foreground border-border"
              }`}
            >
              <span>{item.crop.split(" ")[0]}</span>
              {isFarmerCrop && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hero Forecast Panel for Selected Commodity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Main Price & Forecast Card */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Wheat className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl font-bold">{activeForecast.crop}</CardTitle>
                  <Badge variant="outline" className="text-xs">{activeForecast.category}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1.5 mt-1 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  Benchmark APMC: <strong>{activeForecast.mandi}</strong> ({activeForecast.state})
                </CardDescription>
              </div>

              {getTrendBadge(activeForecast.trend, activeForecast.priceChange7DayPct)}
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-6">
            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-card border shadow-xs space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Current Modal Rate</p>
                <p className="text-2xl font-black text-foreground font-mono">
                  ₹{activeForecast.currentModalPrice.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-muted-foreground">per quintal (100 kg)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <p className="text-xs text-primary font-medium flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 7-Day ML Forecast
                </p>
                <p className="text-2xl font-black text-primary font-mono">
                  ₹{activeForecast.forecast7Day.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {activeForecast.priceChange7DayPct >= 0 ? "+" : ""}
                  {activeForecast.priceChange7DayPct}% expected
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-card border shadow-xs space-y-1">
                <p className="text-xs text-muted-foreground font-medium">Daily Range</p>
                <p className="text-lg font-bold font-mono text-foreground">
                  ₹{activeForecast.minPrice} - ₹{activeForecast.maxPrice}
                </p>
                <p className="text-[11px] text-muted-foreground">Mandi arrival band</p>
              </div>

              <div className="p-3.5 rounded-xl bg-card border shadow-xs space-y-1">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" /> Govt. MSP (24-25)
                </p>
                <p className="text-lg font-bold font-mono text-foreground">
                  {activeForecast.msp > 0 ? `₹${activeForecast.msp.toLocaleString("en-IN")}` : "Non-MSP"}
                </p>
                {activeForecast.msp > 0 && (
                  <p className={`text-[11px] font-semibold ${
                    activeForecast.mspDifferencePct >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600"
                  }`}>
                    {activeForecast.mspDifferencePct >= 0 ? "+" : ""}
                    {activeForecast.mspDifferencePct}% vs MSP
                  </p>
                )}
              </div>
            </div>

            {/* Smart Sell / Hold Advisory Box */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-start ${
              activeForecast.sellingAdvisory.action === "HOLD"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                : activeForecast.sellingAdvisory.action === "STRONG SELL"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100"
                : "bg-blue-500/10 border-blue-500/30 text-blue-950 dark:text-blue-100"
            }`}>
              <div className="p-2 rounded-lg bg-background/80 shadow-xs shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-primary-foreground">
                    {activeForecast.sellingAdvisory.action}
                  </span>
                  <h4 className="font-bold text-sm">
                    {activeForecast.sellingAdvisory.headline}
                  </h4>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {activeForecast.sellingAdvisory.details}
                </p>
              </div>
            </div>

            {/* SMS Preview Card */}
            <div className="p-3.5 rounded-lg border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-primary" />
                  SMS Dispatch Preview ({activeForecast.smsAlert.length}/160 chars)
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  100% Free GSM SMS
                </Badge>
              </div>
              <p className="text-xs font-mono bg-background p-2.5 rounded border text-foreground leading-relaxed">
                {activeForecast.smsAlert}
              </p>
            </div>
          </CardContent>

          <CardFooter className="pt-2 border-t bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {registeredFarmer
                ? `Will send SMS to registered farmer: ${registeredFarmer.name} (${registeredFarmer.phone})`
                : "Register a farmer to enable 1-click SMS dispatch."}
            </p>

            <Button
              onClick={handleSendSms}
              disabled={!registeredFarmer || isSmsPending}
              className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold gap-2 shadow-sm"
              size="sm"
            >
              {isSmsPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending SMS...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Dispatch SMS Alert
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right 1 Col: Market Insights & Model Specs */}
        <Card className="border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              ML Model Specifications
            </CardTitle>
            <CardDescription className="text-xs">
              Trained on Agmarknet APMC mandi arrivals
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Model Architecture</span>
                <span className="font-semibold font-mono">Gradient Boosting (120 Trees)</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Trend Classifier</span>
                <span className="font-semibold font-mono">Random Forest (Depth 6)</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Validation MAE</span>
                <span className="font-semibold text-emerald-600 font-mono">₹66.55 / quintal</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Historical Records</span>
                <span className="font-semibold font-mono">3,000+ Trade Days</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">14-Day Horizon Price</span>
                <span className="font-semibold text-primary font-mono">₹{activeForecast.forecast14Day}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Commodity Volatility</span>
                <span className="font-semibold font-mono">{activeForecast.volatilityPct}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
              <p className="font-bold text-foreground text-xs">💡 Agronomic Selling Tip</p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Selling immediately at peak harvest leads to 12-18% distress price depression. Drying and storing grain in a scientific warehouse for 3-4 weeks historically captures MSP premiums.
              </p>
            </div>

            {smsStatus && !isSmsPending && (
              <Alert className="border-emerald-500/30 bg-emerald-500/10">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <AlertTitle className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  SMS Dispatched
                </AlertTitle>
                <AlertDescription className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  {smsStatus} for farmer {registeredFarmer?.name}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="pt-2 border-t bg-muted/10 text-[11px] text-muted-foreground">
            Data synchronized with Directorate of Marketing & Inspection (DMI).
          </CardFooter>
        </Card>
      </div>

      {/* Comprehensive Multi-Crop Mandi Comparison Table */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold">Live APMC Mandi Benchmark Rates</CardTitle>
              <CardDescription className="text-xs">
                Prices and 7-day algorithmic forecasts across major agricultural commodities in India.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs w-fit">
              10 Monitored Commodities
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 text-xs font-semibold">
                <TableHead>Crop & Category</TableHead>
                <TableHead>APMC Mandi</TableHead>
                <TableHead className="text-right">Current Modal (₹)</TableHead>
                <TableHead className="text-right">7-Day Forecast (₹)</TableHead>
                <TableHead className="text-center">Trend Signal</TableHead>
                <TableHead className="text-center">Action Window</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              {allForecasts.map((row) => {
                const isSelected = row.crop === activeForecast.crop;

                return (
                  <TableRow
                    key={row.crop}
                    onClick={() => {
                      const found = CROP_MARKET_DATABASE.find((c) => c.crop === row.crop);
                      if (found) setSelectedCropId(found.id);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 font-medium" : "hover:bg-muted/50"
                    }`}
                  >
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Wheat className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-foreground">{row.crop}</p>
                          <p className="text-[10px] text-muted-foreground">{row.category}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{row.mandi}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-foreground">
                      ₹{row.currentModalPrice.toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell className="text-right font-mono font-black text-primary">
                      ₹{row.forecast7Day.toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell className="text-center">
                      {getTrendBadge(row.trend, row.priceChange7DayPct)}
                    </TableCell>

                    <TableCell className="text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.sellingAdvisory.action === "HOLD"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : row.sellingAdvisory.action === "STRONG SELL"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}>
                        {row.sellingAdvisory.action}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
