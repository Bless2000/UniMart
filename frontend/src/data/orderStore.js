// Local order store for the UniMart order lifecycle UI.
// The Express order/dispute/chat controllers are not implemented yet, so every
// screen reads and writes here (persisted to localStorage) until the API lands.
import { useSyncExternalStore } from 'react';
import { findCatalogItem } from './catalog';

const STORAGE_KEY = 'unimart_orders_v1';
const DAY = 24 * 60 * 60 * 1000;

export const DISPUTE_WINDOW_DAYS = 10;
export const AUTO_CONFIRM_DAYS = 3;

export const statusMeta = {
  pending_payment: { label: 'Pending Payment', tone: 'warning' },
  paid: { label: 'Paid', tone: 'info' },
  cod_pending: { label: 'Cash on Delivery', tone: 'info' },
  processing: { label: 'Processing', tone: 'info' },
  out_for_delivery: { label: 'Out for Delivery', tone: 'warning' },
  delivered: { label: 'Delivered', tone: 'success' },
  completed: { label: 'Completed', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'muted' },
  disputed: { label: 'Disputed', tone: 'danger' },
  resolved_buyer: { label: "Resolved — Buyer's Favour", tone: 'success' },
  resolved_seller: { label: "Resolved — Seller's Favour", tone: 'muted' }
};

export const paymentMeta = {
  pending: 'Awaiting Paystack payment',
  paid: 'Paid via Paystack',
  cod_pending: 'Cash due on delivery',
  cod_collected: 'Cash collected',
  refunded: 'Refunded to buyer'
};

export const disputeReasons = [
  { id: 'scam', label: 'Suspected scam' },
  { id: 'faulty', label: 'Faulty or damaged product' },
  { id: 'not_as_described', label: 'Item significantly different from listing' },
  { id: 'services_not_rendered', label: 'Service not rendered as described' },
  { id: 'other', label: 'Other' }
];

export const formatMoney = (value) => `GH₵${Number(value || 0).toFixed(2)}`;

const now = Date.now();

const makeItem = (id, qty = 1, priceOverride = null) => {
  const source = findCatalogItem(id);
  if (!source) return null;
  const price = priceOverride ?? source.numericPrice;
  return {
    id: source.id,
    name: source.name,
    price,
    qty,
    img: source.img || null,
    emoji: source.emoji || null,
    unit: source.unit || null
  };
};

const order = ({
  id,
  buyer = 'blessed01',
  seller,
  items,
  paymentMethod = 'paystack',
  paymentStatus,
  status,
  createdAt,
  history,
  deliveredAt = null,
  dispute = null,
  deliveryType = 'delivery',
  deliveryAddress = 'Unity Hall, Block B, Room 214'
}) => {
  const cleanItems = items.map(([itemId, qty, price]) => makeItem(itemId, qty, price)).filter(Boolean);
  const subtotal = cleanItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = deliveryType === 'pickup' || subtotal >= 50 ? 0 : 10;
  return {
    id,
    buyer,
    seller,
    items: cleanItems,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    paymentMethod,
    paymentStatus: paymentStatus || (paymentMethod === 'cod' ? 'cod_pending' : 'pending'),
    status,
    deliveryType,
    deliveryAddress,
    createdAt,
    history,
    deliveredAt,
    dispute
  };
};

const seed = () => ({
  orders: [
    order({
      id: 'UM-2041',
      seller: 'Kofi Mensah',
      items: [[6, 1]],
      status: 'out_for_delivery',
      paymentStatus: 'paid',
      createdAt: now - 2 * DAY,
      history: [
        { status: 'pending_payment', at: now - 2 * DAY },
        { status: 'paid', at: now - 2 * DAY + 12 * 60000 },
        { status: 'processing', at: now - 2 * DAY + 3 * 3600000 },
        { status: 'out_for_delivery', at: now - 6 * 3600000 }
      ]
    }),
    order({
      id: 'UM-2040',
      seller: 'Ama Serwaa',
      items: [[2, 1], [12, 1]],
      status: 'delivered',
      paymentStatus: 'paid',
      createdAt: now - 9 * DAY,
      deliveredAt: now - 4 * DAY,
      history: [
        { status: 'pending_payment', at: now - 9 * DAY },
        { status: 'paid', at: now - 9 * DAY + 5 * 60000 },
        { status: 'processing', at: now - 8 * DAY },
        { status: 'out_for_delivery', at: now - 5 * DAY },
        { status: 'delivered', at: now - 4 * DAY }
      ]
    }),
    order({
      id: 'UM-2039',
      seller: 'Akosua Frimpong',
      items: [[102, 1]],
      paymentMethod: 'cod',
      status: 'processing',
      createdAt: now - 1 * DAY,
      history: [
        { status: 'cod_pending', at: now - 1 * DAY },
        { status: 'processing', at: now - 1 * DAY + 3600000 }
      ]
    }),
    order({
      id: 'UM-2038',
      seller: 'Daniel Osei',
      items: [[10, 1]],
      status: 'pending_payment',
      paymentStatus: 'pending',
      createdAt: now - 40 * 60000,
      history: [{ status: 'pending_payment', at: now - 40 * 60000 }]
    }),
    order({
      id: 'UM-2037',
      seller: 'Nana Adjei',
      items: [[7, 1], [11, 1]],
      paymentMethod: 'cod',
      status: 'completed',
      paymentStatus: 'cod_collected',
      createdAt: now - 20 * DAY,
      deliveredAt: now - 15 * DAY,
      history: [
        { status: 'cod_pending', at: now - 20 * DAY },
        { status: 'processing', at: now - 20 * DAY + 3600000 },
        { status: 'out_for_delivery', at: now - 16 * DAY },
        { status: 'delivered', at: now - 15 * DAY },
        { status: 'completed', at: now - 5 * DAY }
      ]
    }),
    order({
      id: 'UM-2036',
      seller: 'Yaw Boateng',
      items: [[3, 1]],
      status: 'disputed',
      paymentStatus: 'paid',
      createdAt: now - 12 * DAY,
      deliveredAt: now - 5 * DAY,
      history: [
        { status: 'pending_payment', at: now - 12 * DAY },
        { status: 'paid', at: now - 12 * DAY + 4 * 60000 },
        { status: 'processing', at: now - 11 * DAY },
        { status: 'out_for_delivery', at: now - 7 * DAY },
        { status: 'delivered', at: now - 5 * DAY },
        { status: 'disputed', at: now - 4 * DAY }
      ],
      dispute: {
        reason: 'faulty',
        note: 'The sole separated from the shoe after one wear. Photos sent in chat.',
        raisedAt: now - 4 * DAY,
        outcome: null,
        resolvedAt: null
      }
    }),
    order({
      id: 'UM-2050',
      buyer: 'kwame12',
      seller: 'Kofi Mensah',
      items: [[9, 1]],
      status: 'paid',
      paymentStatus: 'paid',
      createdAt: now - 5 * 3600000,
      history: [
        { status: 'pending_payment', at: now - 5 * 3600000 },
        { status: 'paid', at: now - 4 * 3600000 }
      ]
    }),
    order({
      id: 'UM-2051',
      buyer: 'adjoa',
      seller: 'Kofi Mensah',
      items: [[1, 1]],
      paymentMethod: 'cod',
      status: 'processing',
      createdAt: now - 8 * 3600000,
      history: [
        { status: 'cod_pending', at: now - 8 * 3600000 },
        { status: 'processing', at: now - 7 * 3600000 }
      ]
    }),
    order({
      id: 'UM-2044',
      buyer: 'ama21',
      seller: 'Kofi Mensah',
      items: [[106, 1]],
      status: 'resolved_buyer',
      paymentStatus: 'refunded',
      createdAt: now - 25 * DAY,
      deliveredAt: now - 18 * DAY,
      history: [
        { status: 'pending_payment', at: now - 25 * DAY },
        { status: 'paid', at: now - 25 * DAY + 60000 },
        { status: 'processing', at: now - 24 * DAY },
        { status: 'out_for_delivery', at: now - 20 * DAY },
        { status: 'delivered', at: now - 18 * DAY },
        { status: 'disputed', at: now - 17 * DAY },
        { status: 'resolved_buyer', at: now - 14 * DAY }
      ],
      dispute: {
        reason: 'services_not_rendered',
        note: 'Photographer did not show up for the booked graduation shoot.',
        raisedAt: now - 17 * DAY,
        outcome: 'buyer',
        resolvedAt: now - 14 * DAY
      }
    })
  ],
  notifications: [
    {
      id: 'n1',
      audience: ['buyer'],
      orderId: 'UM-2041',
      title: 'Order out for delivery',
      body: 'Kofi Mensah has dispatched your iPhone 14 Pro Max. Confirm receipt when it arrives.',
      at: now - 6 * 3600000,
      read: false
    },
    {
      id: 'n2',
      audience: ['buyer'],
      orderId: 'UM-2040',
      title: 'Dispute window closing soon',
      body: 'You have 6 days left to raise an issue on UM-2040.',
      at: now - 3 * DAY,
      read: false
    },
    {
      id: 'n3',
      audience: ['seller'],
      orderId: 'UM-2050',
      title: 'New paid order',
      body: 'Payment confirmed for UM-2050. Start preparing the Sony Alpha a7 III Camera.',
      at: now - 4 * 3600000,
      read: false
    }
  ],
  conversations: [
    {
      id: 'c1',
      listingId: 6,
      seller: 'Kofi Mensah',
      buyer: 'blessed01',
      createdAt: now - 3 * DAY,
      agreedPrice: null,
      messages: [
        { id: 'm1', from: 'buyer', text: 'Hi Kofi, is the iPhone still available?', at: now - 3 * DAY },
        { id: 'm2', from: 'seller', text: 'Yes it is. It comes with the box and charger.', at: now - 3 * DAY + 120000 },
        { id: 'm3', from: 'buyer', text: 'Would you take GH₵900 for it?', at: now - 3 * DAY + 300000 },
        { id: 'm4', from: 'seller', text: 'I can do GH₵950 if you pick it up on campus.', at: now - 3 * DAY + 420000 }
      ]
    },
    {
      id: 'c2',
      listingId: 102,
      seller: 'Akosua Frimpong',
      buyer: 'blessed01',
      createdAt: now - 1 * DAY,
      agreedPrice: null,
      messages: [
        { id: 'm1', from: 'buyer', text: 'Do you have a slot this Saturday for knotless braids?', at: now - 1 * DAY },
        { id: 'm2', from: 'seller', text: 'Yes, 10am works. Bring your own hair or I can add it for GH₵40.', at: now - 1 * DAY + 900000 }
      ]
    }
  ]
});

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Ignore corrupt storage and fall back to the demo data.
  }
  return seed();
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private mode; the UI keeps working in memory.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(next) {
  state = next;
  persist();
  emit();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return state;
}

export function useOrderStore() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

const withOrder = (orderId, updater) =>
  commit({
    ...state,
    orders: state.orders.map((o) => (o.id === orderId ? updater(o) : o))
  });

const addNotification = (notifications, entry) => [
  { id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, read: false, at: Date.now(), ...entry },
  ...notifications
];

const pushStatus = (o, status, extra = {}) => ({
  ...o,
  ...extra,
  status,
  history: [...o.history, { status, at: Date.now() }]
});

export function markPaid(orderId) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.status !== 'pending_payment') return;
  commit({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId ? pushStatus(o, 'paid', { paymentStatus: 'paid' }) : o
    ),
    notifications: addNotification(state.notifications, {
      audience: ['seller'],
      orderId,
      title: 'Payment confirmed',
      body: `Paystack confirmed payment for ${orderId}. You can start processing.`
    })
  });
}

export function startProcessing(orderId) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || !['paid', 'cod_pending'].includes(target.status)) return;
  commit({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? pushStatus(o, 'processing', {
            paymentStatus: o.paymentMethod === 'cod' ? 'cod_pending' : o.paymentStatus
          })
        : o
    ),
    notifications: addNotification(state.notifications, {
      audience: ['buyer'],
      orderId,
      title: 'Seller is preparing your order',
      body: `${target.seller} has acknowledged ${orderId}.`
    })
  });
}

export function markOutForDelivery(orderId) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.status !== 'processing') return;
  commit({
    ...state,
    orders: state.orders.map((o) => (o.id === orderId ? pushStatus(o, 'out_for_delivery') : o)),
    notifications: addNotification(state.notifications, {
      audience: ['buyer'],
      orderId,
      title: 'Order out for delivery',
      body: `${target.seller} has dispatched ${orderId}. Confirm receipt when it arrives.`
    })
  });
}

export function confirmReceipt(orderId) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.status !== 'out_for_delivery') return;
  commit({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? pushStatus(o, 'delivered', {
            deliveredAt: Date.now(),
            paymentStatus: o.paymentMethod === 'cod' ? 'cod_collected' : o.paymentStatus
          })
        : o
    ),
    notifications: addNotification(state.notifications, {
      audience: ['seller'],
      orderId,
      title: 'Buyer confirmed receipt',
      body: `${orderId} is delivered. The 10-day dispute window is now open.`
    })
  });
}

export function markCashCollected(orderId) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.paymentMethod !== 'cod' || target.status !== 'out_for_delivery') return;
  commit({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? pushStatus(o, 'delivered', { deliveredAt: Date.now(), paymentStatus: 'cod_collected' })
        : o
    ),
    notifications: addNotification(state.notifications, {
      audience: ['buyer'],
      orderId,
      title: 'Cash collected on delivery',
      body: `${target.seller} marked ${orderId} as delivered and paid. Confirm receipt to close it.`
    })
  });
}

export function cancelOrder(orderId) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || !['pending_payment', 'paid', 'cod_pending', 'processing'].includes(target.status)) return;
  commit({
    ...state,
    orders: state.orders.map((o) => (o.id === orderId ? pushStatus(o, 'cancelled') : o)),
    notifications: addNotification(state.notifications, {
      audience: ['seller'],
      orderId,
      title: 'Order cancelled',
      body: `The buyer cancelled ${orderId}.`
    })
  });
}

export function raiseDispute(orderId, { reason, note }) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.status !== 'delivered') return;
  commit({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? pushStatus(o, 'disputed', {
            dispute: { reason, note, raisedAt: Date.now(), outcome: null, resolvedAt: null }
          })
        : o
    ),
    notifications: [
      ...addNotification(state.notifications, {
        audience: ['buyer'],
        orderId,
        title: 'Dispute raised',
        body: `Your dispute for ${orderId} is with an administrator. The transaction is frozen.`
      }),
      ...addNotification(state.notifications, {
        audience: ['seller'],
        orderId,
        title: 'Buyer opened a dispute',
        body: `${orderId} is frozen while an administrator reviews it.`
      })
    ]
  });
}

export function resolveDispute(orderId, outcome) {
  const target = state.orders.find((o) => o.id === orderId);
  if (!target || target.status !== 'disputed') return;
  const nextStatus = outcome === 'buyer' ? 'resolved_buyer' : 'resolved_seller';
  commit({
    ...state,
    orders: state.orders.map((o) =>
      o.id === orderId
        ? pushStatus(o, nextStatus, {
            paymentStatus: outcome === 'buyer' ? 'refunded' : o.paymentStatus,
            dispute: { ...o.dispute, outcome, resolvedAt: Date.now() }
          })
        : o
    ),
    notifications: [
      ...addNotification(state.notifications, {
        audience: ['buyer'],
        orderId,
        title: outcome === 'buyer' ? 'Dispute resolved in your favour' : 'Dispute closed',
        body:
          outcome === 'buyer'
            ? `A refund has been issued for ${orderId}.`
            : `${orderId} was closed in the seller's favour.`
      }),
      ...addNotification(state.notifications, {
        audience: ['seller'],
        orderId,
        title: outcome === 'buyer' ? 'Dispute resolved against you' : 'Dispute dismissed',
        body: `${orderId} was resolved by an administrator.`
      })
    ]
  });
}

export function placeOrders({ items, paymentMethod, deliveryType, deliveryAddress, buyerName, agreedPrice }) {
  const grouped = new Map();
  items.forEach((item) => {
    const key = item.seller || 'UniMart Campus Store';
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  });

  const createdAt = Date.now();
  const created = [];

  grouped.forEach((groupItems, seller) => {
    const cleanItems = groupItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: groupItems.length === 1 && agreedPrice ? agreedPrice : item.numericPrice,
      qty: item.qty || 1,
      img: item.img || null,
      emoji: item.emoji || null,
      unit: item.unit || null
    }));

    const subtotal = cleanItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const deliveryFee = deliveryType === 'pickup' || subtotal >= 50 ? 0 : 10;
    const initialStatus = paymentMethod === 'cod' ? 'cod_pending' : 'pending_payment';

    created.push({
      id: `UM-${Math.floor(2060 + Math.random() * 900)}`,
      buyer: buyerName || 'guest',
      seller,
      items: cleanItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'pending',
      status: initialStatus,
      deliveryType,
      deliveryAddress: deliveryType === 'pickup' ? 'Campus pickup point' : deliveryAddress,
      createdAt,
      history: [{ status: initialStatus, at: createdAt }],
      deliveredAt: null,
      dispute: null
    });
  });

  commit({
    ...state,
    orders: [...created, ...state.orders],
    notifications: addNotification(state.notifications, {
      audience: ['buyer'],
      orderId: created[0]?.id,
      title: 'Order placed',
      body:
        created.length > 1
          ? `${created.length} orders were created — one per seller.`
          : `${created[0]?.id} was created. ${
              paymentMethod === 'cod' ? 'Pay cash when it arrives.' : 'Complete payment to notify the seller.'
            }`
    })
  });

  return created;
}

export function markNotificationsRead() {
  commit({
    ...state,
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  });
}

export function markNotificationRead(id) {
  commit({
    ...state,
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  });
}

export function startConversation(listingId, buyerName) {
  const listing = findCatalogItem(listingId);
  const existing = state.conversations.find(
    (c) => c.listingId === listingId && c.buyer === (buyerName || 'blessed01')
  );
  if (existing) return existing.id;

  const id = `c-${Date.now()}`;
  commit({
    ...state,
    conversations: [
      {
        id,
        listingId,
        seller: listing?.seller || 'UniMart Campus Store',
        buyer: buyerName || 'blessed01',
        createdAt: Date.now(),
        agreedPrice: null,
        messages: []
      },
      ...state.conversations
    ]
  });
  return id;
}

export function sendMessage(conversationId, text, from = 'buyer') {
  const trimmed = text.trim();
  if (!trimmed) return;
  commit({
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            messages: [
              ...c.messages,
              { id: `m-${Date.now()}`, from, text: trimmed, at: Date.now() }
            ]
          }
        : c
    )
  });
}

export function agreePrice(conversationId, price) {
  const value = Number(price);
  if (!value || value <= 0) return;
  commit({
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === conversationId
        ? {
            ...c,
            agreedPrice: value,
            messages: [
              ...c.messages,
              {
                id: `m-${Date.now()}`,
                from: 'system',
                text: `Price agreed at ${formatMoney(value)}. Order at this amount when you are ready.`,
                at: Date.now()
              }
            ]
          }
        : c
    )
  });
}

// Auto-confirm delivery after 3 days without a buyer response, and close the
// order once the 10-day dispute window passes with no dispute.
function reconcile() {
  const t = Date.now();
  let changed = false;

  const orders = state.orders.map((o) => {
    if (o.status === 'out_for_delivery') {
      const dispatched = o.history.filter((h) => h.status === 'out_for_delivery').pop();
      if (dispatched && t - dispatched.at > AUTO_CONFIRM_DAYS * DAY) {
        changed = true;
        return {
          ...o,
          status: 'delivered',
          deliveredAt: dispatched.at + AUTO_CONFIRM_DAYS * DAY,
          paymentStatus: o.paymentMethod === 'cod' ? 'cod_collected' : o.paymentStatus,
          history: [
            ...o.history,
            { status: 'delivered', at: dispatched.at + AUTO_CONFIRM_DAYS * DAY, auto: true }
          ]
        };
      }
    }

    if (o.status === 'delivered' && o.deliveredAt && t - o.deliveredAt > DISPUTE_WINDOW_DAYS * DAY) {
      changed = true;
      return {
        ...o,
        status: 'completed',
        history: [...o.history, { status: 'completed', at: o.deliveredAt + DISPUTE_WINDOW_DAYS * DAY }]
      };
    }

    return o;
  });

  if (changed) commit({ ...state, orders });
}

reconcile();

export function disputeDaysLeft(o) {
  if (!o.deliveredAt) return null;
  const elapsed = Math.floor((Date.now() - o.deliveredAt) / DAY);
  return Math.max(0, DISPUTE_WINDOW_DAYS - elapsed);
}

export function canDispute(o) {
  return o.status === 'delivered' && (disputeDaysLeft(o) ?? 0) > 0;
}

export function canCancel(o) {
  return ['pending_payment', 'paid', 'cod_pending', 'processing'].includes(o.status);
}

export function getBuyerOrders(orders, buyer) {
  return orders.filter((o) => o.buyer === buyer);
}

export function getSellerOrders(orders, seller) {
  return orders.filter((o) => o.seller === seller);
}
