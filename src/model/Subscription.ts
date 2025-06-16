
export type Subscription = {
  id: string;
  userId: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SubscriptionDTO = {
  name: string;
  price: number;
  currency: string;
  billingCycle: BillingCycle;
  nextBillingDate: string;  // Fecha en formato ISO string
  isActive?: boolean;
}

export type BillingCycle = "monthly" | "yearly" | "weekly";
