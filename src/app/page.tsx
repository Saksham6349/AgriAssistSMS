
"use client";

import { UserManagement } from '@/components/UserManagement';

export default function Home() {
  return (
        <main className="flex-grow container mx-auto p-4 md:p-8">
            <div className="prose prose-sm max-w-none mb-8">
              <p>
                <strong>Farming</strong>, also known as <strong>agriculture</strong>, is the practice of cultivating land, raising crops, and often rearing animals (livestock) for various purposes, primarily for food, but also for fiber, fuel, and other raw materials. 
              </p>
              <p>Here's a breakdown of what that means:</p>
              <ol>
                <li>
                  <strong>Cultivation of Land:</strong> This involves preparing the soil, planting seeds, tending to the growing plants (watering, weeding, fertilizing), and harvesting the crops.
                </li>
                <li>
                  <strong>Raising Crops:</strong> These can include grains and other produce.
                </li>
              </ol>
            </div>
            <div className="text-left mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                Farming Dashboard
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Register farmers and send them real-time alerts.
              </p>
            </div>
            <div className="grid grid-cols-1">
                <div className="lg:col-span-1">
                    <UserManagement />
                </div>
            </div>
        </main>
  );
}
