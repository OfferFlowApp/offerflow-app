"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard } from 'lucide-react';

export default function SubscriptionSettings() {
  // Placeholder state and logic
  const currentPlan = "Pro Plan";
  const nextBillingDate = "November 30, 2024";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline">Current Plan: {currentPlan}</CardTitle>
          <CardDescription>Next billing date: {nextBillingDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> Unlimited Offer Sheets</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> Custom Branding</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> PDF Export</li>
            <li className="flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-accent" /> Priority Support</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button variant="outline">Change Plan</Button>
          <Button variant="destructive">Cancel Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline">Billing Information</CardTitle>
          <CardDescription>Manage your payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="font-medium">Visa ending in **** 1234</p>
              <p className="text-sm text-muted-foreground">Expires 12/2025</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Update Payment Method</Button>
        </CardFooter>
      </Card>
       <p className="text-sm text-muted-foreground text-center">
        Subscription and billing features are currently placeholders.
      </p>
    </div>
  );
}
