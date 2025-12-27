export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  fromStudents: number;
  toStudents: number;
  pricePerTerm: number;
  status: 'active' | 'cancelled';
}

export interface SubscriptionFormItem {
  customerId: string;
  fromStudents: number;
  toStudents: number;
  pricePerTerm: number;
  status: 'active' | 'cancelled';
}

export interface SubscriptionRange {
  from: number;
  to: number;
}