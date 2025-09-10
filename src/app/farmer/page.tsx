import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function FarmerPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle>Farmer Portal</CardTitle>
                    <CardDescription>This is a placeholder for the farmer-facing application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This section is under construction. Features for farmers will be added here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
