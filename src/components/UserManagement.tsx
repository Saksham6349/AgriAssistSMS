
"use client";

import { useState } from "react";
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
import { UserPlus, UserCheck, FilePenLine } from "lucide-react";
import { Badge } from "./ui/badge";

type FarmerData = {
  name: string;
  location: string;
  crop: string;
  secondaryCrop: string;
  language: string;
};

const initialFormData = {
    name: '',
    location: '',
    crop: 'Wheat',
    secondaryCrop: 'Corn',
    language: 'English',
};

export function UserManagement() {
  const [registeredFarmer, setRegisteredFarmer] = useState<FarmerData | null>(null);
  const [formData, setFormData] = useState<FarmerData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FarmerData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisteredFarmer(formData);
  };

  const handleReset = () => {
    setRegisteredFarmer(null);
    setFormData(initialFormData);
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
                <p className="text-sm text-muted-foreground">{registeredFarmer.location}</p>
             </div>
             <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Crop: {registeredFarmer.crop}</Badge>
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
              <label htmlFor="language-pref" className="text-sm font-medium">Preferred Language</label>
              <Select name="language" value={formData.language} onValueChange={handleSelectChange('language')}>
                <SelectTrigger id="language-pref">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Swahili">Swahili</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <Button type="submit" className="w-full">
                Register Farmer
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
