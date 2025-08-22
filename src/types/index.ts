export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  imageUrl?: string;
}

export interface OrderItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'in-progress' | 'ready' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  orderNumber: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}