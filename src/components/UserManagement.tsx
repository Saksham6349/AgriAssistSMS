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
import { UserPlus, Sprout, MapPin, Globe, CheckCircle } from "lucide-react";

export function UserManagement() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    crop: 'Wheat',
    language: 'English',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'crop' | 'language') => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', location: '', crop: 'Wheat', language: 'English' });
    }, 3000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
                <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
                <CardTitle>Farmer Registration</CardTitle>
                <CardDescription>
                Register or update farmer preferences.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {submitted ? (
          <div className="flex flex-col items-center justify-center h-full text-center bg-muted/50 p-6 rounded-lg">
            <CheckCircle className="w-16 h-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Registration Successful!</h3>
            <p className="text-muted-foreground text-sm">The farmer's preferences have been saved.</p>
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
                  <SelectItem value="Wheat">Wheat</SelectItem>
                  <SelectItem value="Rice">Rice</SelectItem>
                  <SelectItem value="Corn">Corn</SelectItem>
                  <SelectItem value="Potatoes">Potatoes</SelectItem>
                  <SelectItem value="Soybeans">Soybeans</SelectItem>
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
