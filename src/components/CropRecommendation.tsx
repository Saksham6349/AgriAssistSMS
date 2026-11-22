"use client";

import React, { useState, useTransition, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sprout,
  Send,
  Loader2,
  Droplets,
  Thermometer,
  CloudRain,
  Cpu,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  FlaskConical,
  Layers,
  Calendar,
  Leaf,
  Printer,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { sendSms } from "@/ai/flows/send-sms";
import {
  SoilAndClimateInput,
  MLRecommendationResult,
  REGIONAL_SOIL_PRESETS,
  predictOptimalCrops,
} from "@/lib/ml/crop-recommender";
import { getCropRecommendationAction } from "@/app/actions/crop-recommendation";
import {
  recommendFertilizer,
  FertilizerRecommendationResult,
} from "@/lib/ml/fertilizer-recommender";
import { getFertilizerRecommendation } from "@/app/actions/fertilizer-recommendation";

export function CropRecommendation() {
  const pathname = usePathname();
  const { registeredFarmer, addSmsToHistory } = useAppContext();
  const activeFarmer = registeredFarmer;

  const { toast } = useToast();
  const [isPredicting, startPredictTransition] = useTransition();
  const [isSmsPending, startSmsTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"crop" | "fertilizer">("crop");

  // Form State initialized to standard North/Central India Alluvial values
  const [soilData, setSoilData] = useState<SoilAndClimateInput>({
    nitrogen: 78,
    phosphorus: 48,
    potassium: 40,
    temperature: 24,
    humidity: 75,
    ph: 6.5,
    rainfall: 180,
  });

  const [activePreset, setActivePreset] = useState<string>("alluvial");
  const [result, setResult] = useState<MLRecommendationResult | null>(() => {
    return predictOptimalCrops({
      nitrogen: 78,
      phosphorus: 48,
      potassium: 40,
      temperature: 24,
      humidity: 75,
      ph: 6.5,
      rainfall: 180,
    });
  });

  // Fertilizer recommendation state
  const [fertilizerResult, setFertilizerResult] = useState<FertilizerRecommendationResult>(() => {
    return recommendFertilizer({
      crop: "Rice",
      soilType: "Loamy",
      nitrogen: 78,
      phosphorus: 48,
      potassium: 40,
      moisture: 50,
      temperature: 24,
      humidity: 75,
    });
  });

  const applyPreset = (presetId: string) => {
    const preset = REGIONAL_SOIL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setActivePreset(presetId);
    const updated = {
      ...soilData,
      nitrogen: preset.values.nitrogen,
      phosphorus: preset.values.phosphorus,
      potassium: preset.values.potassium,
      ph: preset.values.ph,
    };
    setSoilData(updated);

    // Update both crop and fertilizer models instantly
    const newCropResult = predictOptimalCrops(updated);
    setResult(newCropResult);
    setFertilizerResult(
      recommendFertilizer({
        crop: newCropResult.primaryRecommendation.crop,
        soilType: preset.name.includes("Black") ? "Black" : preset.name.includes("Red") ? "Red" : "Loamy",
        nitrogen: updated.nitrogen,
        phosphorus: updated.phosphorus,
        potassium: updated.potassium,
        moisture: 45,
      })
    );

    toast({
      title: `${preset.name} Loaded`,
      description: `Preset values applied for ${preset.region}.`,
    });
  };

  const handlePredict = () => {
    startPredictTransition(async () => {
      const mlOutput = await getCropRecommendationAction(soilData);
      setResult(mlOutput);

      const fertOutput = await getFertilizerRecommendation({
        crop: mlOutput.primaryRecommendation.crop,
        soilType: "Loamy",
        nitrogen: soilData.nitrogen,
        phosphorus: soilData.phosphorus,
        potassium: soilData.potassium,
        moisture: 45,
        temperature: soilData.temperature,
        humidity: soilData.humidity,
      });
      setFertilizerResult(fertOutput);

      toast({
        title: "ML Prediction Complete",
        description: `Top crop: ${mlOutput.primaryRecommendation.crop} (${mlOutput.primaryRecommendation.confidence}%). Fertilizer: ${fertOutput.primaryFertilizer}`,
      });
    });
  };

  const handleSendCropSms = () => {
    if (!activeFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer first to dispatch SMS recommendations.",
      });
      return;
    }

    if (!result) return;

    startSmsTransition(async () => {
      try {
        const top = result.primaryRecommendation;
        const smsMsg = `AgriAssist ML: Best crop for your soil is ${top.crop} (${top.confidence}% match). Season: ${top.season.split(" ")[0]}. Tip: ${top.advisoryTip.slice(0, 50)}...`.slice(0, 157);

        await sendSms({
          to: activeFarmer.phone,
          message: smsMsg,
        });

        addSmsToHistory({
          to: activeFarmer.phone,
          message: smsMsg,
          type: "Advisory",
        });

        toast({
          title: "SMS Sent Successfully!",
          description: `Crop recommendation sent to ${activeFarmer.name} (${activeFarmer.phone}).`,
        });
      } catch (err: any) {
        console.error("SMS failed:", err);
        toast({
          variant: "destructive",
          title: "SMS Dispatch Failed",
          description: err?.message || "Could not deliver SMS.",
        });
      }
    });
  };

  const handleSendFertilizerSms = () => {
    if (!activeFarmer) {
      toast({
        variant: "destructive",
        title: "No Farmer Registered",
        description: "Please register a farmer first to dispatch SMS recommendations.",
      });
      return;
    }

    startSmsTransition(async () => {
      try {
        const smsMsg = fertilizerResult.smsSummary;
        await sendSms({
          to: activeFarmer.phone,
          message: smsMsg,
        });

        addSmsToHistory({
          to: activeFarmer.phone,
          message: smsMsg,
          type: "Advisory",
        });

        toast({
          title: "Fertilizer SMS Dispatched!",
          description: `Prescription sent to ${activeFarmer.name} (${activeFarmer.phone}).`,
        });
      } catch (err: any) {
        console.error("SMS failed:", err);
        toast({
          variant: "destructive",
          title: "SMS Dispatch Failed",
          description: err?.message || "Could not deliver SMS.",
        });
      }
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sprout className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Kaggle ML Soil & Crop Intelligence
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Random Forest Crop Model (99.55% accuracy) & Fertilizer Precision Engine (100% test accuracy).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-2 text-xs font-semibold print:hidden"
          >
            <Printer className="w-3.5 h-3.5 text-primary" />
            <span>Print Soil Health Card (PDF)</span>
          </Button>

          <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border-primary/20 w-fit">
            <Cpu className="w-4 h-4" />
            <span>Dual ML Engine: Active</span>
          </Badge>
        </div>
      </div>

      {/* Regional Presets Quick Selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Regional Soil Presets
          </CardTitle>
          <CardDescription>
            Click a major Indian agro-climatic soil zone to auto-fill representative N-P-K and pH benchmarks:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {REGIONAL_SOIL_PRESETS.map((p) => (
              <Button
                key={p.id}
                type="button"
                variant={activePreset === p.id ? "default" : "outline"}
                size="sm"
                onClick={() => applyPreset(p.id)}
                className="text-xs md:text-sm"
              >
                {p.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Parameters Form (Left) & ML Predictions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sliders & Controls */}
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Soil & Environmental Parameters
            </CardTitle>
            <CardDescription>
              Adjust soil nutrients (from Soil Health Card) and climate metrics.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Nitrogen */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="nitrogen" className="font-medium">
                  Nitrogen (N)
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.nitrogen} mg/kg
                </span>
              </div>
              <Slider
                id="nitrogen"
                min={0}
                max={140}
                step={1}
                value={[soilData.nitrogen]}
                onValueChange={([val]) => {
                  setActivePreset("");
                  setSoilData((prev) => ({ ...prev, nitrogen: val }));
                }}
              />
            </div>

            {/* Phosphorus */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="phosphorus" className="font-medium">
                  Phosphorus (P)
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.phosphorus} mg/kg
                </span>
              </div>
              <Slider
                id="phosphorus"
                min={5}
                max={145}
                step={1}
                value={[soilData.phosphorus]}
                onValueChange={([val]) => {
                  setActivePreset("");
                  setSoilData((prev) => ({ ...prev, phosphorus: val }));
                }}
              />
            </div>

            {/* Potassium */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="potassium" className="font-medium">
                  Potassium (K)
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.potassium} mg/kg
                </span>
              </div>
              <Slider
                id="potassium"
                min={5}
                max={205}
                step={1}
                value={[soilData.potassium]}
                onValueChange={([val]) => {
                  setActivePreset("");
                  setSoilData((prev) => ({ ...prev, potassium: val }));
                }}
              />
            </div>

            {/* Soil pH */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="ph" className="font-medium">
                  Soil pH Level
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.ph} ({soilData.ph < 6 ? "Acidic" : soilData.ph > 7.5 ? "Alkaline" : "Neutral"})
                </span>
              </div>
              <Slider
                id="ph"
                min={3.5}
                max={9.5}
                step={0.1}
                value={[soilData.ph]}
                onValueChange={([val]) => {
                  setActivePreset("");
                  setSoilData((prev) => ({ ...prev, ph: Number(val.toFixed(1)) }));
                }}
              />
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="temp" className="font-medium flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-amber-600" /> Temperature
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.temperature}°C
                </span>
              </div>
              <Slider
                id="temp"
                min={10}
                max={45}
                step={1}
                value={[soilData.temperature]}
                onValueChange={([val]) => setSoilData((prev) => ({ ...prev, temperature: val }))}
              />
            </div>

            {/* Relative Humidity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="humidity" className="font-medium flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" /> Humidity
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.humidity}%
                </span>
              </div>
              <Slider
                id="humidity"
                min={15}
                max={100}
                step={1}
                value={[soilData.humidity]}
                onValueChange={([val]) => setSoilData((prev) => ({ ...prev, humidity: val }))}
              />
            </div>

            {/* Rainfall */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <Label htmlFor="rainfall" className="font-medium flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-600" /> Expected Rainfall
                </Label>
                <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded">
                  {soilData.rainfall} mm
                </span>
              </div>
              <Slider
                id="rainfall"
                min={20}
                max={300}
                step={5}
                value={[soilData.rainfall]}
                onValueChange={([val]) => setSoilData((prev) => ({ ...prev, rainfall: val }))}
              />
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button
              className="w-full gap-2"
              onClick={handlePredict}
              disabled={isPredicting}
              size="lg"
            >
              {isPredicting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Kaggle ML Predictions...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Run Dual ML Analysis</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Right Column: Model Output Cards */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs: Crop Recommendation vs Fertilizer Prescription */}
          <div className="flex border-b border-border gap-2">
            <button
              onClick={() => setActiveTab("crop")}
              className={`pb-2.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === "crop"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sprout className="w-4 h-4" />
              <span>Crop Recommendation (ML 99.55%)</span>
            </button>
            <button
              onClick={() => setActiveTab("fertilizer")}
              className={`pb-2.5 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === "fertilizer"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Fertilizer Prescription (ML 100%)</span>
            </button>
          </div>

          {activeTab === "crop" && result && (
            <>
              {/* Primary Recommendation Card */}
              <Card className="border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge className="bg-primary hover:bg-primary/90 text-white">
                      Top ML Match
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">
                      Inference Time: {result.modelMetadata.inferenceTimeMs}ms
                    </span>
                  </div>
                  <CardTitle className="text-3xl font-extrabold text-foreground mt-2 flex items-baseline gap-3">
                    <span>{result.primaryRecommendation.crop}</span>
                    <span className="text-xl font-normal text-muted-foreground">
                      ({result.primaryRecommendation.hindiName})
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base text-foreground/80">
                    Match Confidence: <strong className="text-primary text-lg">{result.primaryRecommendation.confidence}%</strong>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Grid of Key Crop Properties */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/60 rounded-lg">
                      <span className="text-xs text-muted-foreground block">Season</span>
                      <strong className="text-sm font-semibold">{result.primaryRecommendation.season.split(" ")[0]}</strong>
                    </div>
                    <div className="p-3 bg-muted/60 rounded-lg">
                      <span className="text-xs text-muted-foreground block">Water Need</span>
                      <strong className="text-sm font-semibold">{result.primaryRecommendation.waterRequirement}</strong>
                    </div>
                    <div className="p-3 bg-muted/60 rounded-lg">
                      <span className="text-xs text-muted-foreground block">Duration</span>
                      <strong className="text-sm font-semibold">{result.primaryRecommendation.growthDuration}</strong>
                    </div>
                    <div className="p-3 bg-muted/60 rounded-lg">
                      <span className="text-xs text-muted-foreground block">Ideal Soil</span>
                      <strong className="text-xs font-semibold truncate block" title={result.primaryRecommendation.soilTypeSuitability}>
                        {result.primaryRecommendation.soilTypeSuitability.split(",")[0]}
                      </strong>
                    </div>
                  </div>

                  {/* Advisory Tip */}
                  <Alert className="bg-primary/5 border-primary/20">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <AlertTitle className="text-sm font-semibold">Agronomic Advisory</AlertTitle>
                    <AlertDescription className="text-xs md:text-sm text-foreground/90 mt-1">
                      {result.primaryRecommendation.advisoryTip}
                    </AlertDescription>
                  </Alert>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-4">
                  <div className="text-xs text-muted-foreground">
                    {activeFarmer ? (
                      <span>Ready to notify <strong>{activeFarmer.name}</strong> ({activeFarmer.phone})</span>
                    ) : (
                      <span>Register a farmer to dispatch SMS notifications</span>
                    )}
                  </div>
                  <Button
                    onClick={handleSendCropSms}
                    disabled={isSmsPending || !activeFarmer}
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                  >
                    {isSmsPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Send Crop SMS</span>
                  </Button>
                </CardFooter>
              </Card>

              {/* Alternative Crops Ranking */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Alternative Viable Crops Ranking
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Multiclass softmax distribution across ICAR agricultural crop candidates:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.topCrops.map((c, idx) => (
                    <div key={c.crop} className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-foreground">{c.crop}</span>
                          <span className="text-xs text-muted-foreground">({c.hindiName})</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary">
                          {c.confidence}%
                        </span>
                      </div>
                      <Progress value={c.confidence} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "fertilizer" && fertilizerResult && (
            <>
              {/* Fertilizer Prescription Card */}
              <Card className="border-primary/40 bg-card shadow-md">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge className="bg-emerald-600 text-white font-semibold">
                      ML Fertilizer Prescription (100% Accuracy)
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      Target Crop: <strong>{fertilizerResult.crop}</strong>
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-black text-foreground mt-2">
                    {fertilizerResult.primaryFertilizer}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Soil Health Status: <strong className="text-primary">{fertilizerResult.soilHealthStatus}</strong> (Confidence: {fertilizerResult.confidence}%)
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-5 space-y-5">
                  {/* Nutrient Deficit Indicators */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Soil Nutrient Balance (kg/acre target)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {fertilizerResult.deficits.map((d) => (
                        <div key={d.nutrient} className="p-3 rounded-lg border bg-muted/30 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold">{d.nutrient}</span>
                            <span className={`font-bold ${
                              d.status === "Deficient" ? "text-amber-600" : "text-emerald-600"
                            }`}>
                              {d.status}
                            </span>
                          </div>
                          <p className="text-lg font-mono font-bold">
                            {d.current} <span className="text-xs font-normal text-muted-foreground">/ {d.required}</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Deficit: <strong>{d.deficit} kg/acre</strong>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Field Application Dosage Plan */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" /> Recommended Field Dosage (Bags / Acre)
                    </h4>
                    <div className="space-y-2.5">
                      {fertilizerResult.dosagePlan.map((plan) => (
                        <div key={plan.fertilizerName} className="p-3.5 rounded-lg border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <p className="font-bold text-sm text-foreground">{plan.fertilizerName}</p>
                            <p className="text-xs text-muted-foreground">{plan.method}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="px-2.5 py-1 rounded bg-primary/10 text-primary font-mono font-bold text-sm">
                              {plan.bags50kg} bags ({plan.recommendedKgPerAcre} kg)
                            </span>
                            <p className="text-[10px] text-muted-foreground mt-1">{plan.applicationStage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Organic Alternatives */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Biofertilizer & Organic Alternatives
                    </h4>
                    <div className="space-y-2">
                      {fertilizerResult.organicAlternatives.map((org) => (
                        <div key={org.name} className="p-3 rounded-lg border bg-emerald-500/5 border-emerald-500/20 text-xs flex justify-between items-center gap-3">
                          <div>
                            <p className="font-bold text-foreground">{org.name}</p>
                            <p className="text-muted-foreground">{org.benefit}</p>
                          </div>
                          <span className="shrink-0 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                            {org.dosageKgPerAcre} kg/ac
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS Preview */}
                  <div className="p-3 rounded-lg border bg-muted/40 space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-primary" />
                      SMS Summary ({fertilizerResult.smsSummary.length}/160 chars)
                    </p>
                    <p className="text-xs font-mono bg-background p-2.5 rounded border text-foreground">
                      {fertilizerResult.smsSummary}
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {activeFarmer ? `Target farmer: ${activeFarmer.name} (${activeFarmer.phone})` : "Register a farmer to enable SMS."}
                  </p>
                  <Button
                    onClick={handleSendFertilizerSms}
                    disabled={isSmsPending || !activeFarmer}
                    size="sm"
                    className="gap-2 w-full sm:w-auto bg-primary text-primary-foreground font-semibold"
                  >
                    {isSmsPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>Dispatch Fertilizer SMS</span>
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
