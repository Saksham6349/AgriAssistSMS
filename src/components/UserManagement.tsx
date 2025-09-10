
"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
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
import { UserPlus, UserCheck, FilePenLine, Loader2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

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

export function UserManagement() {
  const { registeredFarmer, setRegisteredFarmer, isLoaded } = useAppContext();
  const [formData, setFormData] = useState<FarmerData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
      if (isLoaded) {
          if (registeredFarmer) {
              setFormData(registeredFarmer);
              if (registeredFarmer.idProof) {
                  setImagePreview(registeredFarmer.idProof);
              }
          } else {
              setFormData(initialFormData);
              setImagePreview(null);
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          variant: "destructive",
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setFormData(prev => ({ ...prev, idProof: dataUri }));
        setImagePreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, idProof: undefined }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.idProof) {
      toast({
        variant: "destructive",
        title: "ID Proof Required",
        description: "Please upload a government ID proof to register.",
      });
      return;
    }
    setRegisteredFarmer(formData);
  };

  const handleReset = () => {
    setRegisteredFarmer(null);
    setImagePreview(null);
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
              {registeredFarmer.idProof && (
                <div>
                  <p className="text-sm font-medium mb-2">Government ID:</p>
                  <Image src={registeredFarmer.idProof} alt="ID Proof" width={200} height={120} className="rounded-md object-cover border" />
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
              <label htmlFor="id-proof-upload" className="text-sm font-medium">Government ID Proof</label>
              <div
                className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center cursor-pointer hover:bg-accent hover:border-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                  <input
                    type="file"
                    id="id-proof-upload"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                  />
                  {imagePreview ? (
                     <div className="relative group w-fit mx-auto">
                        <Image
                            src={imagePreview}
                            alt="ID preview"
                            width={200}
                            height={120}
                            className="rounded-md mx-auto max-h-32 w-auto object-contain"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <p className="font-semibold">Click to upload ID</p>
                        <p className="text-xs">PNG, JPG, or WEBP (max 4MB)</p>
                    </div>
                  )}
              </div>
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
            <Button type="submit" className="w-full">
              <UserPlus /> Register Farmer
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

    