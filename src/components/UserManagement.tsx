
"use client";

import React, { useState, useEffect, useRef, ChangeEvent, useTransition } from "react";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, UserCheck, FilePenLine, Loader2, Upload, X, ShieldCheck, ShieldAlert, BadgeCheck, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { verifyId, VerifyIdOutput } from "@/ai/flows/verify-id";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";

export type FarmerData = {
  name: string;
  phone: string;
  location: string;
  crop: string;
  secondaryCrop: string;
  language: string;
  idProof?: string;
};

const initialFormData: FarmerData = {
    name: '',
    phone: '',
    location: '',
    crop: '',
    secondaryCrop: '',
    language: '',
    idProof: '',
};

type VerificationStatus = 'unverified' | 'pending' | 'success' | 'failed';
type FilePreview = { url: string; type: 'image' } | { name: string; type: 'pdf' };

export function UserManagement() {
  const { registeredFarmer, setRegisteredFarmer, isLoaded } = useAppContext();
  const [formData, setFormData] = useState<FarmerData>(initialFormData);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [isVerifyPending, startVerifyTransition] = useTransition();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [verificationResult, setVerificationResult] = useState<VerifyIdOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
      if (isLoaded) {
          if (registeredFarmer) {
              setFormData(registeredFarmer);
              if (registeredFarmer.idProof) {
                  if (registeredFarmer.idProof.startsWith('data:image')) {
                      setFilePreview({ url: registeredFarmer.idProof, type: 'image' });
                  }
                  setVerificationStatus('success'); // Assume stored farmer is verified
              }
          } else {
              setFormData(initialFormData);
              setFilePreview(null);
              setVerificationStatus('unverified');
          }
      }
  }, [registeredFarmer, isLoaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FarmerData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setFormData(prev => ({ ...prev, idProof: dataUri }));
        if (file.type.startsWith('image/')) {
            setFilePreview({ url: dataUri, type: 'image' });
        } else if (file.type === 'application/pdf') {
            setFilePreview({ name: file.name, type: 'pdf' });
        }
        setVerificationStatus('unverified');
        setVerificationResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setFormData(prev => ({ ...prev, idProof: undefined }));
    setFilePreview(null);
    setVerificationStatus('unverified');
    setVerificationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleVerify = () => {
    if (!formData.idProof) {
        toast({ variant: "destructive", title: "No ID", description: "Please upload an ID to verify." });
        return;
    }
    setVerificationResult(null);
    setVerificationStatus('pending');
    startVerifyTransition(async () => {
        try {
            const result = await verifyId({ photoDataUri: formData.idProof! });
            setVerificationResult(result);
            if (result.isIdCard) {
                setVerificationStatus('success');
                if (result.extractedName) {
                    setFormData(prev => ({...prev, name: result.extractedName!}));
                }
                toast({ title: "Verification Successful", description: result.reason });
            } else {
                setVerificationStatus('failed');
                toast({ variant: "destructive", title: "Verification Failed", description: result.reason });
            }
        } catch (error) {
            console.error("Verification failed:", error);
            setVerificationStatus('failed');
            setVerificationResult({ isIdCard: false, reason: 'An unexpected error occurred during verification.' });
            toast({ variant: "destructive", title: "Verification Error", description: "Could not verify the ID. Please try again." });
        }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (verificationStatus !== 'success') {
      toast({
        variant: "destructive",
        title: "ID Not Verified",
        description: "Please verify the government ID proof before registering.",
      });
      return;
    }
    setRegisteredFarmer(formData);
    toast({
        title: "Farmer Registered!",
        description: `${formData.name} is now ready to receive alerts.`,
    })
  };

  const handleReset = () => {
    setRegisteredFarmer(null);
    setFilePreview(null);
    setVerificationStatus('unverified');
    setVerificationResult(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  if (!isLoaded) {
      return (
          <Card className="h-full flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </Card>
      )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
                {registeredFarmer ? <UserCheck className="w-6 h-6 text-primary" /> : <UserPlus className="w-6 h-6 text-primary" />}
            </div>
            <div>
                <CardTitle>{registeredFarmer ? 'Current Farmer' : 'Farmer Registration'}</CardTitle>
                <CardDescription>
                {registeredFarmer ? 'Ready to receive SMS alerts.' : 'Register farmer to send alerts.'}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {registeredFarmer ? (
          <div className="flex flex-col justify-center h-full space-y-4 bg-muted/50 p-6 rounded-lg">
             <div className="space-y-2">
                <h3 className="text-lg font-semibold">{registeredFarmer.name}</h3>
                <p className="text-sm text-muted-foreground">{registeredFarmer.location} | {registeredFarmer.phone}</p>
             </div>
              {registeredFarmer.idProof && filePreview?.type === 'image' && (
                <div>
                  <p className="text-sm font-medium mb-2">Government ID:</p>
                  <div className="relative w-fit">
                    <Image src={(filePreview as {url: string}).url} alt="ID Proof" width={200} height={120} className="rounded-md object-cover border" />
                    <BadgeCheck className="absolute -top-2 -right-2 h-7 w-7 text-white bg-green-600 rounded-full p-1" />
                  </div>
                </div>
              )}
             <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Primary Crop: {registeredFarmer.crop}</Badge>
                {registeredFarmer.secondaryCrop && <Badge variant="secondary">Secondary: {registeredFarmer.secondaryCrop}</Badge>}
                <Badge variant="secondary">Language: {registeredFarmer.language}</Badge>
             </div>
             <Button onClick={handleReset} className="w-full mt-4 !-mb-2" variant="outline">
                <FilePenLine /> Register Another Farmer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Farmer Name</label>
              <Input id="name" name="name" placeholder="e.g., John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" name="phone" type="tel" placeholder="e.g., +1234567890" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location / Village</label>
               <Input id="location" name="location" placeholder="e.g., Springfield" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="crop-select" className="text-sm font-medium">Primary Crop</label>
              <Select name="crop" value={formData.crop} onValueChange={handleSelectChange('crop')}>
                <SelectTrigger id="crop-select">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apples">Apples</SelectItem>
                  <SelectItem value="Bananas">Bananas</SelectItem>
                  <SelectItem value="Barley">Barley</SelectItem>
                  <SelectItem value="Chickpeas">Chickpeas</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Corn">Corn</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Grapes">Grapes</SelectItem>
                  <SelectItem value="Jute">Jute</SelectItem>
                  <SelectItem value="Lentils">Lentils</SelectItem>
                  <SelectItem value="Mangoes">Mangoes</SelectItem>
                  <SelectItem value="Millet">Millet</SelectItem>
                  <SelectItem value="Onions">Onions</SelectItem>
                  <SelectItem value="Potatoes">Potatoes</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Soybeans">Soybeans</SelectItem>
                  <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="Tea">Tea</SelectItem>
                  <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="secondary-crop-select" className="text-sm font-medium">Secondary Crop</label>
              <Select name="secondaryCrop" value={formData.secondaryCrop} onValueChange={handleSelectChange('secondaryCrop')}>
                <SelectTrigger id="secondary-crop-select">
                  <SelectValue placeholder="Select secondary crop" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apples">Apples</SelectItem>
                  <SelectItem value="Bananas">Bananas</SelectItem>
                  <SelectItem value="Barley">Barley</SelectItem>
                  <SelectItem value="Chickpeas">Chickpeas</SelectItem>
                  <SelectItem value="Coffee">Coffee</SelectItem>
                  <SelectItem value="Corn">Corn</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Grapes">Grapes</SelectItem>
                  <SelectItem value="Jute">Jute</SelectItem>
                  <SelectItem value="Lentils">Lentils</SelectItem>
                  <SelectItem value="Mangoes">Mangoes</SelectItem>
                  <SelectItem value="Millet">Millet</SelectItem>
                  <SelectItem value="Onions">Onions</SelectItem>
                  <SelectItem value="Potatoes">Potatoes</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Soybeans">Soybeans</SelectItem>
                  <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                  <SelectItem value="Tea">Tea</SelectItem>
                  <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                  <SelectItem value="Wheat">Wheat</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <label htmlFor="language-select" className="text-sm font-medium">Preferred Language</label>
              <Select name="language" value={formData.language} onValueChange={handleSelectChange('language')}>
                <SelectTrigger id="language-select">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Bengali">Bengali</SelectItem>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Marathi">Marathi</SelectItem>
                  <SelectItem value="Tamil">Tamil</SelectItem>
                  <SelectItem value="Urdu">Urdu</SelectItem>
                  <SelectItem value="Gujarati">Gujarati</SelectItem>
                  <SelectItem value="Kannada">Kannada</SelectItem>
                  <SelectItem value="Punjabi">Punjabi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="id-proof-upload" className="text-sm font-medium">Government ID Proof</label>
              <div
                className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:bg-accent hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                  <input
                    type="file"
                    id="id-proof-upload"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, application/pdf"
                  />
                  {filePreview ? (
                     <div className="relative group w-fit mx-auto">
                        {filePreview.type === 'image' ? (
                            <Image
                                src={filePreview.url}
                                alt="ID preview"
                                width={200}
                                height={120}
                                className="rounded-md mx-auto max-h-32 w-auto object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                                <FileText className="w-12 h-12" />
                                <p className="text-sm font-semibold">{filePreview.name}</p>
                            </div>
                        )}
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <p className="font-semibold">Click to upload ID</p>
                        <p className="text-xs">PNG, JPG, PDF (max 4MB)</p>
                    </div>
                  )}
              </div>
              
              {filePreview && (
                  <div className="space-y-2">
                    <Button type="button" onClick={handleVerify} disabled={isVerifyPending || verificationStatus === 'success'} className="w-full">
                        {isVerifyPending && <><Loader2 className="animate-spin" /> Verifying...</>}
                        {verificationStatus === 'unverified' && <><ShieldCheck /> Verify ID</>}
                        {verificationStatus === 'pending' && <><Loader2 className="animate-spin" /> Verifying...</>}
                        {verificationStatus === 'success' && <><BadgeCheck /> ID Verified</>}
                        {verificationStatus === 'failed' && <><ShieldAlert /> Verification Failed</>}
                    </Button>
                    {verificationStatus === 'failed' && verificationResult && (
                        <Alert variant="destructive">
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>Verification Failed</AlertTitle>
                            <AlertDescription>{verificationResult.reason}</AlertDescription>
                        </Alert>
                    )}
                  </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={verificationStatus !== 'success' || isVerifyPending}>
              <UserPlus /> Register Farmer
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

    