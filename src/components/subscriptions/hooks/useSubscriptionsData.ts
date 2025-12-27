import { useState, useEffect } from "react";
import { Subscription, SubscriptionFormItem } from "../types";
import { Customer } from "../../customers/types";

// Mock data for customers (to be used in dropdown)
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Alliance High School Group',
    contactPerson: 'James Mwangi',
    phone: '+254 722 123 456',
    email: 'james.mwangi@alliancehigh.ac.ke',
    schoolsCount: 3,
    status: 'active'
  },
  {
    id: '2',
    name: 'Brookhouse Schools Kenya',
    contactPerson: 'Sarah Njeri',
    phone: '+254 733 987 654',
    email: 'sarah.njeri@brookhouse.ac.ke',
    schoolsCount: 2,
    status: 'active'
  },
  {
    id: '3',
    name: 'Starehe Boys Centre',
    contactPerson: 'John Odhiambo',
    phone: '+254 722 345 678',
    email: 'john.odhiambo@starehe.ac.ke',
    schoolsCount: 1,
    status: 'active'
  },
  {
    id: '4',
    name: 'Kenya High School',
    contactPerson: 'Mary Wambui',
    phone: '+254 733 456 789',
    email: 'mary.wambui@kenyahigh.ac.ke',
    schoolsCount: 1,
    status: 'active'
  },
  {
    id: '5',
    name: "Mang'u High School",
    contactPerson: 'Peter Kamau',
    phone: '+254 722 567 890',
    email: 'peter.kamau@mangu.ac.ke',
    schoolsCount: 1,
    status: 'active'
  }
];

// Mock subscriptions data
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Alliance High School Group',
    fromStudents: 1,
    toStudents: 500,
    pricePerTerm: 50000,
    status: 'active'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Brookhouse Schools Kenya',
    fromStudents: 1,
    toStudents: 1000,
    pricePerTerm: 85000,
    status: 'active'
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Starehe Boys Centre',
    fromStudents: 1,
    toStudents: 750,
    pricePerTerm: 65000,
    status: 'cancelled'
  },
  {
    id: '4',
    customerId: '4',
    customerName: 'Kenya High School',
    fromStudents: 1,
    toStudents: 300,
    pricePerTerm: 35000,
    status: 'active'
  },
  {
    id: '5',
    customerId: '5',
    customerName: "Mang'u High School",
    fromStudents: 500,
    toStudents: 1500,
    pricePerTerm: 120000,
    status: 'active'
  }
];

export const useSubscriptionsData = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setSubscriptions(mockSubscriptions);
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  }, []);

  // Check for duplicate subscription
  const isDuplicateSubscription = (subscriptionData: SubscriptionFormItem, currentId?: string) => {
    return subscriptions.some(subscription => 
      subscription.customerId === subscriptionData.customerId &&
      subscription.fromStudents === subscriptionData.fromStudents &&
      subscription.toStudents === subscriptionData.toStudents &&
      subscription.pricePerTerm === subscriptionData.pricePerTerm &&
      (currentId ? subscription.id !== currentId : true)
    );
  };

  // Add subscription
  const addSubscription = (subscriptionData: SubscriptionFormItem) => {
    const customer = customers.find(c => c.id === subscriptionData.customerId);
    if (!customer) return null;

    // Check for duplicates
    if (isDuplicateSubscription(subscriptionData)) {
      throw new Error(`A subscription with the same details already exists for ${customer.name}.`);
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      customerId: subscriptionData.customerId,
      customerName: customer.name,
      fromStudents: subscriptionData.fromStudents,
      toStudents: subscriptionData.toStudents,
      pricePerTerm: subscriptionData.pricePerTerm,
      status: subscriptionData.status
    };
    
    setSubscriptions(prev => [...prev, newSubscription]);
    return newSubscription;
  };

  // Update subscription
  const updateSubscription = (subscription: Subscription, data: SubscriptionFormItem) => {
    // If the customer ID changed, we need to update the customer name
    let customerName = subscription.customerName;
    if (subscription.customerId !== data.customerId) {
      const customer = customers.find(c => c.id === data.customerId);
      if (customer) {
        customerName = customer.name;
      }
    }

    // Check for duplicates, excluding the current subscription being edited
    if (isDuplicateSubscription(data, subscription.id)) {
      throw new Error(`A subscription with the same details already exists for ${customerName}.`);
    }

    setSubscriptions(prev => 
      prev.map(s => {
        if (s.id === subscription.id) {
          return { 
            ...s,
            customerId: data.customerId,
            customerName,
            fromStudents: data.fromStudents,
            toStudents: data.toStudents,
            pricePerTerm: data.pricePerTerm,
            status: data.status
          };
        }
        return s;
      })
    );
    return true;
  };

  // Delete subscription
  const deleteSubscription = (subscription: Subscription) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subscription.id));
  };

  // Get customer options for dropdown
  const getCustomerOptions = () => {
    return customers.map(customer => ({
      value: customer.id,
      label: customer.name
    }));
  };

  return {
    subscriptions,
    loading,
    customers,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getCustomerOptions,
    isDuplicateSubscription
  };
};