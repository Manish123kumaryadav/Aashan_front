const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://asanway.up.railway.app/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('aashanway-token');
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body && !isFormData && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || `API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return payload;
}

function normalizeProduct(item) {
  const rawMode = String(item.mode || item.type || 'old').toLowerCase();
  const condition = String(item.condition || '').toLowerCase();
  const type = ['rent', 'rental'].includes(rawMode) ? 'rental' : rawMode === 'new' || (rawMode === 'sell' && ['new', 'brand new'].includes(condition)) ? 'new' : 'old';
  let image = item.image || '';
  let imagePaths = Array.isArray(item.imagePaths) ? item.imagePaths : [];
  if (typeof image === 'string' && image.trim().startsWith('[')) {
    try { imagePaths = JSON.parse(image); image = imagePaths[0] || ''; } catch { /* retain original API value */ }
  }
  if (!imagePaths.length && image) imagePaths = [image];
  const storageImagePaths = imagePaths.filter(Boolean).slice(0, 5);
  const absoluteImage = (path) => path?.startsWith('/') ? `https://asanway.up.railway.app${path}` : path;
  imagePaths = imagePaths.filter(Boolean).slice(0, 5).map(absoluteImage);
  image = absoluteImage(imagePaths[0] || image);
  return {
    ...item,
    id: String(item.id),
    type,
    badge: type === 'new' ? 'NEW' : 'LIKE NEW',
    rentalRate: type === 'rental' ? Number(item.price || 0) : Number(item.rentalRate || 0),
    price: type === 'rental' ? 0 : Number(item.price || 0),
    stock: Number(item.stock || 1),
    image,
    imagePaths,
    storageImagePaths,
    status: item.status || 'approved',
    seller: item.sellerName || item.seller || 'Aashanway seller',
    createdAt: item.createdAt || item.postedAt || '',
  };
}

function listingPayload(product) {
  return {
    title: product.title,
    category: product.category,
    mode: product.type === 'rental' ? 'rent' : 'sell',
    condition: product.type === 'new' ? 'new' : product.type === 'old' && ['new', 'brand new'].includes(String(product.condition).toLowerCase()) ? 'old' : product.condition,
    price: product.type === 'rental' ? Number(product.rentalRate) : Number(product.price),
    rentUnit: product.type === 'rental' ? 'day' : undefined,
    location: product.location,
    description: product.description,
    image: (product.storageImagePaths || product.imagePaths)?.[0] || product.image,
    imagePaths: (product.storageImagePaths || product.imagePaths)?.slice(0, 5),
  };
}

export const authService = {
  login: (email, password) => request('/login', { method: 'POST', body: { email, password } }),
  register: (data) => request('/user', { method: 'POST', body: data }),
};

export const productService = {
  async getAll() { const response = await request('/listings'); return (response.data || []).map(normalizeProduct); },
  async getById(id) { const response = await request(`/listings/${id}`); return normalizeProduct(response.data); },
};

export const dashboardService = {
  async list() { const response = await request('/listings/manage'); return (response.data || []).map(normalizeProduct); },
  async create(product) { const response = await request('/listings', { method: 'POST', body: listingPayload(product) }); return normalizeProduct(response.data); },
  async update(id, product) { const response = await request(`/listings/${id}`, { method: 'PUT', body: listingPayload(product) }); return normalizeProduct(response.data); },
  remove: (id) => request(`/listings/${id}`, { method: 'DELETE' }),
  async review(id, status, rejectionReason = '') { const response = await request(`/listings/${id}/status`, { method: 'PUT', body: { status, rejectionReason } }); return normalizeProduct(response.data); },
};

export const mediaService = {
  async uploadProduct(file) {
    const body = new FormData(); body.append('file', file);
    const response = await request('/media/upload/product', { method: 'POST', body });
    return response.data.url || response.data.relativePath;
  },
};

export const locationService = {
  async reverse(latitude, longitude) {
    const response = await request(`/location/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
    return response.data;
  },
};

export const paymentService = {
  async createRazorpayOrder(items, deliveryAddress) {
    const response = await request('/payments/razorpay/order', { method: 'POST', body: { items: items.map((item) => ({ listingId: item.id, quantity: item.quantity })), deliveryAddress } });
    return response.data;
  },
  async verifyRazorpayPayment(payment) {
    const response = await request('/payments/verify', { method: 'POST', body: payment });
    return response.data;
  },
};

export const orderService = {
  async list() { const response = await request('/orders'); return response.data || []; },
  async track(id) { const response = await request(`/orders/${id}/track`); return response.data; },
};

export const chatService = {
  async openForListing(listingId) { const response = await request(`/chat/listings/${listingId}`, { method: 'POST' }); return response.data; },
  async conversations() { const response = await request('/chat/conversations'); return response.data || []; },
  async messages(conversationId) { const response = await request(`/chat/conversations/${conversationId}/messages`); return response.data || []; },
  async send(conversationId, text) { const response = await request(`/chat/conversations/${conversationId}/messages`, { method: 'POST', body: { text } }); return response.data; },
};

export { API_BASE_URL, request };
