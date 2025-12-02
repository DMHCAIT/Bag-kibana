// Shared order and customer store for admin panel
// Uses global memory to persist between API calls in the same deployment

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  items: OrderItem[];
  created_at: string;
  shipping_address: string;
  payment_method: 'razorpay' | 'cod';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  phone?: string;
  role: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

// Global store for orders and customers
declare global {
  var ordersStore: Order[] | undefined;
  var customersStore: Customer[] | undefined;
}

// Initialize global stores
if (!global.ordersStore) {
  global.ordersStore = [];
}
if (!global.customersStore) {
  global.customersStore = [];
}

const ordersStore = global.ordersStore;
const customersStore = global.customersStore;

// ==================== ORDER FUNCTIONS ====================

export function getAllOrders(): Order[] {
  return [...ordersStore];
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.find(o => o.id === id);
}

export function getOrdersByStatus(status: string): Order[] {
  if (status === 'all') return getAllOrders();
  return ordersStore.filter(o => o.order_status === status);
}

export function getOrdersByUserId(userId: string): Order[] {
  return ordersStore.filter(o => o.user_id === userId);
}

export function searchOrders(query: string): Order[] {
  const lowerQuery = query.toLowerCase();
  return ordersStore.filter(o => 
    (o.customer_name?.toLowerCase() || '').includes(lowerQuery) ||
    (o.customer_email?.toLowerCase() || '').includes(lowerQuery) ||
    (o.id?.toLowerCase() || '').includes(lowerQuery)
  );
}

export function createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Order {
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Date.now().toString().slice(-6)}`,
    created_at: new Date().toISOString(),
  };
  
  ordersStore.unshift(newOrder); // Add to beginning
  
  // Update customer data
  updateCustomerFromOrder(newOrder);
  
  return newOrder;
}

export function updateOrder(id: string, data: Partial<Order>): Order | null {
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) return null;
  
  ordersStore[index] = {
    ...ordersStore[index],
    ...data,
    id, // Ensure ID doesn't change
  };
  
  return ordersStore[index];
}

export function deleteOrder(id: string): boolean {
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) return false;
  
  ordersStore.splice(index, 1);
  return true;
}

// ==================== CUSTOMER FUNCTIONS ====================

export function getAllCustomers(): Customer[] {
  return [...customersStore];
}

export function getCustomerById(id: string): Customer | undefined {
  return customersStore.find(c => c.id === id);
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return customersStore.find(c => c.email === email);
}

export function searchCustomers(query: string): Customer[] {
  const lowerQuery = query.toLowerCase();
  return customersStore.filter(c => 
    (c.full_name?.toLowerCase() || '').includes(lowerQuery) ||
    (c.email?.toLowerCase() || '').includes(lowerQuery)
  );
}

export function updateCustomerFromOrder(order: Order): Customer {
  const existingIndex = customersStore.findIndex(c => c.email === order.customer_email);
  
  if (existingIndex >= 0) {
    // Update existing customer
    const customer = customersStore[existingIndex];
    customer.order_count = (customer.order_count || 0) + 1;
    customer.total_spent = (customer.total_spent || 0) + (order.total || 0);
    return customer;
  } else {
    // Create new customer
    const newCustomer: Customer = {
      id: `CUST-${Date.now().toString().slice(-6)}`,
      email: order.customer_email,
      full_name: order.customer_name,
      phone: order.customer_phone,
      role: 'customer',
      created_at: new Date().toISOString(),
      order_count: 1,
      total_spent: order.total || 0,
    };
    
    customersStore.push(newCustomer);
    return newCustomer;
  }
}

// ==================== STATS FUNCTIONS ====================

export function getOrderStats() {
  const total = ordersStore.length;
  const pending = ordersStore.filter(o => o.order_status === 'pending').length;
  const confirmed = ordersStore.filter(o => o.order_status === 'confirmed').length;
  const processing = ordersStore.filter(o => o.order_status === 'processing').length;
  const shipped = ordersStore.filter(o => o.order_status === 'shipped').length;
  const delivered = ordersStore.filter(o => o.order_status === 'delivered').length;
  const cancelled = ordersStore.filter(o => o.order_status === 'cancelled').length;
  
  const totalRevenue = ordersStore
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  
  return {
    total,
    pending,
    confirmed,
    processing,
    shipped,
    delivered,
    cancelled,
    totalRevenue,
  };
}

export function getCustomerStats() {
  const total = customersStore.length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newCustomers = customersStore.filter(c => {
    const date = new Date(c.created_at);
    return date >= thirtyDaysAgo;
  }).length;
  
  const activeCustomers = customersStore.filter(c => (c.order_count || 0) > 0).length;
  
  const totalSpent = customersStore.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  
  return {
    total,
    newCustomers,
    activeCustomers,
    totalSpent,
  };
}

