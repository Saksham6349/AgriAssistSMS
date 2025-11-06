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
import { UserPlus, UserCheck, FilePenLine, Loader2, Upload, X, ShieldCheck, ShieldAlert, BadgeCheck, FileText, User, Phone, MapPin, Leaf, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { verifyId, VerifyIdOutput } from "@/ai/flows/verify-id";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Progress } from "./ui/progress";
import { useTranslation } from "@/hooks/useTranslation";

// This type is for the app's context (the active farmer)
export type FarmerData = {
  name: string;
  phone: string;
  village: string;
  district: string;
  crop: string;
  secondaryCrop: string;
  language: string;
  idProof?: string;
};

// This type is for the Firestore document
type FarmerRegistrationDoc = {
    name: string;
    phone: string;
    village: string;
    district: string;
    crop: string;
    secondaryCrop: string;
    language: string;
    createdAt: Timestamp;
};

const initialFormData: FarmerData = {
    name: '',
    phone: '',
    village: '',
    district: '',
    crop: '',
    secondaryCrop: '',
    language: 'English', // Default language
    idProof: '',
};

type VerificationStatus = 'unverified' | 'pending' | 'success' | 'failed';
type FilePreview = { url: string; type: 'image' } | { name: string; type: 'pdf' };

export function UserManagement() {
  const { registeredFarmer, setRegisteredFarmer, isLoaded } = useAppContext();
  const [formData, setFormData] = useState<FarmerData>(initialFormData);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [isVerifyPending, startVerifyTransition] = useTransition();
  const [isRegisterPending, startRegisterTransition] = useTransition();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('unverified');
  const [verificationResult, setVerificationResult] = useState<VerifyIdOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
      if (isLoaded) {
          if (registeredFarmer) {
              setFormData(registeredFarmer);
              if (registeredFarmer.idProof) {
                  if (registeredFarmer.idProof.startsWith('data:image')) {
                      setFilePreview({ url: registeredFarmer.idProof, type: 'image' });
                  } else if (registeredFarmer.idProof.startsWith('data:application/pdf')) {
                      setFilePreview({ name: 'id_proof.pdf', type: 'pdf' });
                  }
                  setVerificationStatus('success');
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

  async function registerFarmerInFirestore(data: FarmerData) {
    if (!db) {
      console.error("Firestore is not initialized. Check your Firebase config.");
      throw new Error("Firestore is not connected.");
    }
    try {
      const docData: FarmerRegistrationDoc = {
        name: data.name,
        phone: data.phone,
        village: data.village,
        district: data.district,
        crop: data.crop,
        secondaryCrop: data.secondaryCrop,
        language: data.language,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "farmerregs"), docData);
      console.log("✅ Farmer registered successfully in Firestore with ID: ", docRef.id);
    } catch (e) {
      console.error("❌ Error registering farmer:", e);
      throw e; // Re-throw to be caught by the caller
    }
  }

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

    startRegisterTransition(async () => {
        try {
            // Save every new farmer to the `farmerregs` collection
            await registerFarmerInFirestore(formData);
            
            // Set this newly registered farmer as the "active" one for the UI
            setRegisteredFarmer(formData);

            toast({
                title: "Farmer Registered!",
                description: `${formData.name} is now ready to receive alerts.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: "Could not save farmer data to the database. Please check console for errors.",
            });
        }
    });
  };

  const handleReset = () => {
    setRegisteredFarmer(null);
  };

  const isFormValid =
    formData.name &&
    formData.phone &&
    formData.village &&
    formData.district &&
    formData.crop &&
    verificationStatus === 'success';


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
                <CardTitle>{registeredFarmer ? t('userManagement.currentFarmer') : t('userManagement.registration')}</CardTitle>
                <CardDescription>
                {registeredFarmer ? t('userManagement.ready') : t('userManagement.registerPrompt')}
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {registeredFarmer ? (
          <div className="flex flex-col justify-center h-full space-y-4 bg-muted/50 p-6 rounded-lg">
             <div className="space-y-2">
                <h3 className="text-lg font-semibold">{registeredFarmer.name}</h3>
                <p className="text-sm text-muted-foreground">{registeredFarmer.village}, {registeredFarmer.district} | {registeredFarmer.phone}</p>
             </div>
              {registeredFarmer.idProof && filePreview?.type === 'image' && (
                <div>
                  <p className="text-sm font-medium mb-2">{t('userManagement.idProof')}</p>
                  <div className="relative w-fit">
                    <Image src={(filePreview as {url: string}).url} alt="ID Proof" width={200} height={120} className="rounded-md object-cover border" />
                    <BadgeCheck className="absolute -top-2 -right-2 h-7 w-7 text-white bg-green-600 rounded-full p-1" />
                  </div>
                </div>
              )}
             <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{t('userManagement.primaryCrop')} {registeredFarmer.crop}</Badge>
                {registeredFarmer.secondaryCrop && <Badge variant="secondary">{t('userManagement.secondaryCrop')} {registeredFarmer.secondaryCrop}</Badge>}
                <Badge variant="secondary">{t('userManagement.language')} {registeredFarmer.language}</Badge>
             </div>
             <Button onClick={handleReset} className="w-full mt-4 !-mb-2" variant="outline">
                <FilePenLine /> {t('userManagement.registerAnother')}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">{t('userManagement.farmerName')}</label>
                <div className="relative flex items-center">
                    <User className="absolute left-3 w-5 h-5 text-muted-foreground" />
                    <Input id="name" name="name" placeholder={t('userManagement.farmerNamePlaceholder')} value={formData.name} onChange={handleChange} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">{t('userManagement.phone')}</label>
                <div className="relative flex items-center">
                    <Phone className="absolute left-3 w-5 h-5 text-muted-foreground" />
                    <Input id="phone" name="phone" type="tel" placeholder={t('userManagement.phonePlaceholder')} value={formData.phone} onChange={handleChange} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="village" className="text-sm font-medium">{t('userManagement.location')}</label>
                <div className="relative flex items-center">
                    <MapPin className="absolute left-3 w-5 h-5 text-muted-foreground" />
                    <Input id="village" name="village" placeholder={t('userManagement.locationPlaceholder')} value={formData.village} onChange={handleChange} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="district" className="text-sm font-medium">District</label>
                <div className="relative flex items-center">
                    <Globe className="absolute left-3 w-5 h-5 text-muted-foreground" />
                    <Input id="district" name="district" placeholder={t('userManagement.districtPlaceholder')} value={formData.district} onChange={handleChange} required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="language-select" className="text-sm font-medium">{t('userManagement.preferredLanguage')}</label>
                <Select name="language" value={formData.language} onValueChange={handleSelectChange('language')}>
                  <SelectTrigger id="language-select">
                    <SelectValue placeholder={t('userManagement.selectLanguage')} />
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
                <label htmlFor="crop-select" className="text-sm font-medium">{t('userManagement.primaryCropLabel')}</label>
                <Select name="crop" value={formData.crop} onValueChange={handleSelectChange('crop')} required>
                  <SelectTrigger id="crop-select">
                    <SelectValue placeholder={t('userManagement.selectCrop')} />
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
                <label htmlFor="secondary-crop-select" className="text-sm font-medium">{t('userManagement.secondaryCropLabel')}</label>
                <Select name="secondaryCrop" value={formData.secondaryCrop} onValueChange={handleSelectChange('secondaryCrop')}>
                  <SelectTrigger id="secondary-crop-select">
                    <SelectValue placeholder={t('userManagement.selectSecondaryCrop')} />
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
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <label htmlFor="id-proof-upload" className="text-sm font-medium">{t('userManagement.govIdProof')}</label>
              <div
                className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:bg-accent/20 hover:border-primary transition-colors"
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
                        <p className="font-semibold">{t('userManagement.uploadId')}</p>
                        <p className="text-xs">{t('userManagement.idTypes')}</p>
                        <p className="text-xs">{t('userManagement.fileTypes')}</p>
                    </div>
                  )}
              </div>
              
              {filePreview && (
                  <div className="space-y-2">
                    <Button type="button" onClick={handleVerify} disabled={isVerifyPending || verificationStatus === 'success'} className="w-full">
                        {isVerifyPending && <><Loader2 className="animate-spin" /> {t('userManagement.verifying')}</>}
                        {verificationStatus === 'unverified' && <><ShieldCheck /> {t('userManagement.verifyId')}</>}
                        {verificationStatus === 'pending' && <><Loader2 className="animate-spin" /> {t('userManagement.verifying')}</>}
                        {verificationStatus === 'success' && <><BadgeCheck /> {t('userManagement.idVerified')}</>}
                        {verificationStatus === 'failed' && <><ShieldAlert /> {t('userManagement.verificationFailed')}</>}
                    </Button>
                    {verificationResult && (
                      <div className="space-y-2">
                        {verificationStatus === 'failed' && (
                          <Alert variant="destructive">
                              <ShieldAlert className="h-4 w-4" />
                              <AlertTitle>Verification Failed</AlertTitle>
                              <AlertDescription>{verificationResult.reason}</AlertDescription>
                          </Alert>
                        )}
                        {verificationStatus === 'success' && verificationResult.confidenceScore && (
                           <div className="space-y-1">
                               <div className="flex justify-between text-xs text-muted-foreground">
                                   <span>Confidence</span>
                                   <span>{(verificationResult.confidenceScore * 100).toFixed(0)}%</span>
                               </div>
                               <Progress value={verificationResult.confidenceScore * 100} className="h-2" />
                           </div>
                        )}
                      </div>
                    )}
                  </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={!isFormValid || isRegisterPending}>
              {isRegisterPending ? <Loader2 className="animate-spin" /> : <UserPlus />}
              {t('userManagement.registerFarmer')}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
