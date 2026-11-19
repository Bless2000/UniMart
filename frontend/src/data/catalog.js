// Shared catalogue data for UniMart products and campus services.

export const products = [
  {
    id: 1,
    name: 'Smart Watch Series 8',
    price: 'GH₵199.99',
    numericPrice: 199.99,
    originalPrice: 'GH₵249.99',
    rating: 5,
    ratingCount: 128,
    img: '/images/prod-watch.png',
    category: 'electronics',
    brand: 'apple',
    seller: 'Kofi Mensah'
  },
  {
    id: 2,
    name: 'Noise Cancelling Headphones',
    price: 'GH₵129.99',
    numericPrice: 129.99,
    originalPrice: 'GH₵169.99',
    rating: 5,
    ratingCount: 96,
    img: '/images/prod-headphones.png',
    category: 'electronics',
    brand: 'sony',
    seller: 'Ama Serwaa'
  },
  {
    id: 3,
    name: 'Sport Running Shoes',
    price: 'GH₵79.99',
    numericPrice: 79.99,
    originalPrice: 'GH₵99.99',
    rating: 5,
    ratingCount: 152,
    img: '/images/prod-shoes.png',
    category: 'fashion',
    brand: 'nike',
    seller: 'Yaw Boateng'
  },
  {
    id: 4,
    name: 'Travel Backpack',
    price: 'GH₵49.99',
    numericPrice: 49.99,
    originalPrice: 'GH₵69.99',
    rating: 4,
    ratingCount: 88,
    img: '/images/prod-backpack.png',
    category: 'fashion',
    brand: 'adidas',
    seller: 'Ama Serwaa'
  },
  {
    id: 5,
    name: "Men's Hoodie",
    price: 'GH₵39.99',
    numericPrice: 39.99,
    originalPrice: 'GH₵59.99',
    rating: 5,
    ratingCount: 112,
    img: '/images/shop-hoodie.png',
    category: 'fashion',
    brand: 'nike',
    seller: 'Yaw Boateng'
  },
  {
    id: 6,
    name: 'iPhone 14 Pro Max',
    price: 'GH₵999.99',
    numericPrice: 999.99,
    originalPrice: 'GH₵1,099.99',
    rating: 5,
    ratingCount: 76,
    img: '/images/shop-iphone.png',
    category: 'phones',
    brand: 'apple',
    seller: 'Kofi Mensah'
  },
  {
    id: 7,
    name: 'Premium Fragrance Set',
    price: 'GH₵29.99',
    numericPrice: 29.99,
    originalPrice: 'GH₵49.99',
    rating: 4,
    ratingCount: 64,
    img: '/images/shop-fragrance.png',
    category: 'beauty',
    brand: 'other',
    seller: 'Nana Adjei'
  },
  {
    id: 8,
    name: 'Wireless Game Controller',
    price: 'GH₵59.99',
    numericPrice: 59.99,
    originalPrice: 'GH₵79.99',
    rating: 5,
    ratingCount: 97,
    img: '/images/shop-controller.png',
    category: 'gaming',
    brand: 'sony',
    seller: 'Daniel Osei'
  },
  {
    id: 9,
    name: 'Sony Alpha a7 III Camera',
    price: 'GH₵1,299.99',
    numericPrice: 1299.99,
    originalPrice: 'GH₵1,499.99',
    rating: 5,
    ratingCount: 38,
    img: '/images/shop-camera.png',
    category: 'electronics',
    brand: 'sony',
    seller: 'Kofi Mensah'
  },
  {
    id: 10,
    name: 'Wireless Earbuds',
    price: 'GH₵49.99',
    numericPrice: 49.99,
    originalPrice: 'GH₵69.99',
    rating: 4,
    ratingCount: 85,
    img: '/images/shop-earbuds.png',
    category: 'electronics',
    brand: 'samsung',
    seller: 'Daniel Osei'
  },
  {
    id: 11,
    name: 'LED Desk Lamp',
    price: 'GH₵24.99',
    numericPrice: 24.99,
    originalPrice: 'GH₵39.99',
    rating: 4,
    ratingCount: 54,
    img: '/images/shop-lamp.png',
    category: 'home',
    brand: 'other',
    seller: 'Nana Adjei'
  },
  {
    id: 12,
    name: 'Luxury Watch',
    price: 'GH₵149.99',
    numericPrice: 149.99,
    originalPrice: 'GH₵199.99',
    rating: 5,
    ratingCount: 62,
    img: '/images/shop-luxury-watch.png',
    category: 'accessories',
    brand: 'other',
    seller: 'Ama Serwaa'
  }
];

// Services category: things students and staff on campus offer/book.
export const services = [
  {
    id: 101,
    name: 'Tutoring',
    emoji: '📚',
    price: 'GH₵40',
    numericPrice: 40,
    unit: 'per session',
    rating: 5,
    ratingCount: 64,
    category: 'services',
    seller: 'Selorm Atsu',
    description: 'One-on-one help with maths, science, programming and more.'
  },
  {
    id: 102,
    name: 'Hair Braiding',
    emoji: '💇🏾‍♀️',
    price: 'GH₵80',
    numericPrice: 80,
    unit: 'per appointment',
    rating: 5,
    ratingCount: 41,
    category: 'services',
    seller: 'Akosua Frimpong',
    description: 'Cornrows, twists and knotless braids from campus stylists.'
  },
  {
    id: 103,
    name: 'Nails',
    emoji: '💅🏾',
    price: 'GH₵50',
    numericPrice: 50,
    unit: 'per set',
    rating: 4,
    ratingCount: 33,
    category: 'services',
    seller: 'Akosua Frimpong',
    description: 'Manicures, pedicures, gel and acrylic nail sets.'
  },
  {
    id: 104,
    name: 'Tech Support',
    emoji: '💻',
    price: 'GH₵60',
    numericPrice: 60,
    unit: 'per visit',
    rating: 5,
    ratingCount: 52,
    category: 'services',
    seller: 'Daniel Osei',
    description: 'Laptop repairs, software setup, data recovery and virus cleanup.'
  },
  {
    id: 105,
    name: 'Laundry',
    emoji: '🧺',
    price: 'GH₵25',
    numericPrice: 25,
    unit: 'per load',
    rating: 4,
    ratingCount: 29,
    category: 'services',
    seller: 'Selorm Atsu',
    description: 'Wash, dry and fold with same-day pickup on campus.'
  },
  {
    id: 106,
    name: 'Photography',
    emoji: '📸',
    price: 'GH₵150',
    numericPrice: 150,
    unit: 'per shoot',
    rating: 5,
    ratingCount: 18,
    category: 'services',
    seller: 'Kofi Mensah',
    description: 'Graduation, portrait and event shoots with edited photos.'
  }
];

export const catalogItems = [...products, ...services];

export const findCatalogItem = (id) => catalogItems.find((item) => item.id === id);

// Sellers shown in the seller dashboard (demo identities until roles exist).
export const sellers = [
  'Kofi Mensah',
  'Ama Serwaa',
  'Yaw Boateng',
  'Nana Adjei',
  'Daniel Osei',
  'Selorm Atsu',
  'Akosua Frimpong'
];
