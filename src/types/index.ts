// User related types
export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'pharmacist' | 'manager' | 'storekeeper';
  name: string;
  email: string;
  active: boolean;
  lastLogin?: string;
}

// Medicine and Inventory types
export interface Medicine {
  id: string;
  name: string;
  barcode: string;
  genericName: string;
  manufacturer: string;
  category: string;
  dosageForm: string;
  strength: string;
  price: number;
  reorderLevel: number;
  stock: number;
  batchNumber: string;
  expiryDate: string;
  location: string;
  supplier: string;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: PrescriptionItem[];
  total: number;
  paymentStatus: 'pending' | 'completed';
  dispensedBy?: string;
  notes?: string;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  prescriptionId?: string;
  date: string;
  items: SaleItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  customerName: string;
  soldBy: string;
  status: 'completed' | 'refunded';
}

export interface SaleItem {
  medicineId: string;
  quantity: number;
  price: number;
  subtotal: number;
  batchNumber: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  phone: string;
  active: boolean;
}

export interface StockAdjustment {
  id: string;
  medicineId: string;
  type: 'addition' | 'reduction' | 'expiry' | 'damage';
  quantity: number;
  reason: string;
  date: string;
  adjustedBy: string;
  batchNumber: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// Dashboard Analytics
export interface DashboardStats {
  totalSales: number;
  lowStockItems: number;
  expiringItems: number;
  pendingPrescriptions: number;
  todaysSales: number;
  monthlyRevenue: number;
  topSellingMedicines: {
    medicineName: string;
    quantity: number;
    revenue: number;
  }[];
}

// Role-based permissions
export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface RolePermissions {
  [key: string]: Permission[];
}