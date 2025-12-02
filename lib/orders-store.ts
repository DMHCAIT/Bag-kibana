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

// Use a more robust global store pattern for Next.js
const globalForOrders = globalThis as unknown as {
  ordersStore: Order[] | undefined;
  customersStore: Customer[] | undefined;
};

// Initialize stores if they don't exist
if (!globalForOrders.ordersStore) {
  globalForOrders.ordersStore = [];
  console.log('[Orders Store] Initialized empty orders store');
}
if (!globalForOrders.customersStore) {
  globalForOrders.customersStore = [];
  console.log('[Orders Store] Initialized empty customers store');
}

// Get references to the stores
const ordersStore = globalForOrders.ordersStore;
const customersStore = globalForOrders.customersStore;

// ==================== ORDER FUNCTIONS ====================

export function getAllOrders(): Order[] {
  console.log(`[Orders Store] Getting all orders. Count: ${ordersStore.length}`);
  return [...ordersStore];
}

export function getOrderById(id: string): Order | undefined {
  const order = ordersStore.find(o => o.id === id);
  console.log(`[Orders Store] Getting order by ID: ${id}. Found: ${!!order}`);
  return order;
}

export function getOrdersByStatus(status: string): Order[] {
  if (status === 'all') return getAllOrders();
  const orders = ordersStore.filter(o => o.order_status === status);
  console.log(`[Orders Store] Getting orders by status: ${status}. Count: ${orders.length}`);
  return orders;
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
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  
  const newOrder: Order = {
    id: orderId,
    user_id: orderData.user_id || null,
    customer_name: orderData.customer_name || 'Unknown Customer',
    customer_email: orderData.customer_email || '',
    customer_phone: orderData.customer_phone || '',
    order_status: orderData.order_status || 'pending',
    payment_status: orderData.payment_status || 'pending',
    total: orderData.total || 0,
    items: orderData.items || [],
    shipping_address: orderData.shipping_address || '',
    payment_method: orderData.payment_method || 'cod',
    razorpay_order_id: orderData.razorpay_order_id,
    razorpay_payment_id: orderData.razorpay_payment_id,
    created_at: new Date().toISOString(),
  };
  
  // Add to store
  ordersStore.unshift(newOrder);
  
  console.log(`[Orders Store] Created order: ${orderId}. Payment method: ${newOrder.payment_method}. Total orders: ${ordersStore.length}`);
  
  // Update customer data
  updateCustomerFromOrder(newOrder);
  
  return newOrder;
}

export function updateOrder(id: string, data: Partial<Order>): Order | null {
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) {
    console.log(`[Orders Store] Order not found for update: ${id}`);
    return null;
  }
  
  ordersStore[index] = {
    ...ordersStore[index],
    ...data,
    id, // Ensure ID doesn't change
  };
  
  console.log(`[Orders Store] Updated order: ${id}`);
  return ordersStore[index];
}

export function deleteOrder(id: string): boolean {
  const index = ordersStore.findIndex(o => o.id === id);
  if (index === -1) return false;
  
  ordersStore.splice(index, 1);
  console.log(`[Orders Store] Deleted order: ${id}. Total orders: ${ordersStore.length}`);
  return true;
}

// ==================== CUSTOMER FUNCTIONS ====================

export function getAllCustomers(): Customer[] {
  console.log(`[Orders Store] Getting all customers. Count: ${customersStore.length}`);
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
  if (!order.customer_email) {
    console.log('[Orders Store] No customer email, skipping customer update');
    return {} as Customer;
  }
  
  const existingIndex = customersStore.findIndex(c => c.email === order.customer_email);
  
  if (existingIndex >= 0) {
    // Update existing customer
    const customer = customersStore[existingIndex];
    customer.order_count = (customer.order_count || 0) + 1;
    customer.total_spent = (customer.total_spent || 0) + (order.total || 0);
    console.log(`[Orders Store] Updated customer: ${customer.email}. Orders: ${customer.order_count}, Spent: ${customer.total_spent}`);
    return customer;
  } else {
    // Create new customer
    const newCustomer: Customer = {
      id: `CUST-${Date.now().toString().slice(-6)}`,
      email: order.customer_email,
      full_name: order.customer_name || 'Unknown',
      phone: order.customer_phone,
      role: 'customer',
      created_at: new Date().toISOString(),
      order_count: 1,
      total_spent: order.total || 0,
    };
    
    customersStore.push(newCustomer);
    console.log(`[Orders Store] Created customer: ${newCustomer.email}. Total customers: ${customersStore.length}`);
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
  
  // Count COD vs Razorpay
  const codOrders = ordersStore.filter(o => o.payment_method === 'cod').length;
  const razorpayOrders = ordersStore.filter(o => o.payment_method === 'razorpay').length;
  
  const totalRevenue = ordersStore
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  
  // Include COD orders in pending revenue
  const pendingRevenue = ordersStore
    .filter(o => o.payment_status === 'pending')
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
    pendingRevenue,
    codOrders,
    razorpayOrders,
  };
}

export function getCustomerStats() {
  const total = customersStore.length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const newCustomers = customersStore.filter(c => {
    if (!c.created_at) return false;
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

// ==================== DEBUG FUNCTIONS ====================

export function getStoreDebugInfo() {
  return {
    ordersCount: ordersStore.length,
    customersCount: customersStore.length,
    recentOrders: ordersStore.slice(0, 5).map(o => ({
      id: o.id,
      customer: o.customer_name,
      total: o.total,
      method: o.payment_method,
      status: o.order_status,
      created: o.created_at,
    })),
    recentCustomers: customersStore.slice(0, 5).map(c => ({
      id: c.id,
      name: c.full_name,
      email: c.email,
      orders: c.order_count,
      spent: c.total_spent,
    })),
  };
}
