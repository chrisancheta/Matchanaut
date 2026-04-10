import { LineItem } from '../types';

export const VERSION_A_ITEMS: LineItem[] = [
  { item: 'SaaS Platform License', quantity: 1, unitPrice: 12000, total: 12000, description: 'Annual core platform fee' },
  { item: 'User Seats - Pro', quantity: 50, unitPrice: 45, total: 2250, description: 'Standard professional users' },
  { item: 'Storage Add-on (TB)', quantity: 2, unitPrice: 500, total: 1000, description: 'Cloud storage expansion' },
  { item: 'Implementation Fee', quantity: 1, unitPrice: 5000, total: 5000, description: 'One-time setup' }
];

export const VERSION_B_ITEMS: LineItem[] = [
  { item: 'SaaS Platform License', quantity: 1, unitPrice: 13500, total: 13500, description: 'Annual core platform fee (Updated)' },
  { item: 'User Seats - Pro', quantity: 65, unitPrice: 42, total: 2730, description: 'Standard professional users (Volume discount)' },
  { item: 'Storage Add-on (TB)', quantity: 5, unitPrice: 450, total: 2250, description: 'Cloud storage expansion' },
  { item: 'Premium Support', quantity: 1, unitPrice: 2400, total: 2400, description: '24/7 Priority support' }
];

export const VENDOR_A_ITEMS: LineItem[] = [
  { item: 'Enterprise CRM License', quantity: 1, unitPrice: 45000, total: 45000, description: 'Vendor Alpha Core CRM' },
  { item: 'API Integration Pack', quantity: 1, unitPrice: 8500, total: 8500, description: 'Standard API connectors' },
  { item: 'Training Workshop', quantity: 3, unitPrice: 1500, total: 4500, description: 'On-site training sessions' }
];

export const VENDOR_B_ITEMS: LineItem[] = [
  { item: 'CRM Suite Enterprise', quantity: 1, unitPrice: 42000, total: 42000, description: 'Vendor Beta CRM Solution' },
  { item: 'Advanced Integration Suite', quantity: 1, unitPrice: 12000, total: 12000, description: 'Full custom API suite' },
  { item: 'Training & Onboarding', quantity: 1, unitPrice: 3500, total: 3500, description: 'Comprehensive digital training' },
  { item: 'Data Migration Service', quantity: 1, unitPrice: 5000, total: 5000, description: 'Legacy data transfer' }
];
