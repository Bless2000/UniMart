import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, SendIcon } from '../components/Icons';
import {
  useOrderStore,
  sendMessage,
  agreePrice,
  formatMoney
} from '../data/orderStore';
import { findCatalogItem } from '../data/catalog';
import { formatDateTime } from '../utils/format';

export default function ChatPage({ params, buyerName, onNavigate, triggerToast }) {
  const { conversations } = useOrderStore();
  const myConversations = conversations.filter((c) => c.buyer === buyerName);
  const [selectedId, setSelectedId] = useState(params?.conversationId || myConversations[0]?.id || null);
  const [draft, setDraft] = useState('');
  const [priceDraft, setPriceDraft] = useState('');

  const selected = myConversations.find((c) => c.id === selectedId) || myConversations[0];
  const listing = selected ? findCatalogItem(selected.listingId) : null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !selected) return;
    sendMessage(selected.id, draft);
    setDraft('');
  };

  const handleAgree = (e) => {
    e.preventDefault();
    if (!selected) return;
    const value = Number(priceDraft);
    if (!value || value <= 0) {
      triggerToast('Enter a valid agreed price.');
      return;
    }
    agreePrice(selected.id, value);
    setPriceDraft('');
    triggerToast(`Agreed price set at ${formatMoney(value)}.`);
  };

  const handleOrderAtAgreedPrice = () => {
    if (!listing || !selected.agreedPrice) return;
    onNavigate('checkout', null, {
      mode: 'direct',
      items: [{ ...listing, qty: 1 }],
      agreedPrice: selected.agreedPrice
    });
  };

  return (
    <div className="page-wrapper chat-page">
      <div className="shop-breadcrumbs">
        <button className="crumb-link" onClick={() => onNavigate('home')}>Home</button>
        <span className="crumb-sep">&gt;</span>
        <span className="crumb-current">Messages</span>
      </div>

      <button className="detail-back-btn" onClick={() => onNavigate('orders')}>
        <ChevronLeft /> My Orders
      </button>

      <div className="page-heading-row">
        <div>
          <h1 className="page-heading">
            Seller <span className="highlight-yellow">Chat</span>
          </h1>
          <p className="page-subheading">
            Negotiate in chat, agree a price, then order at the amount you settled on.
          </p>
        </div>
      </div>

      {myConversations.length === 0 ? (
        <div className="favourites-empty">
          <div className="favourites-empty-icon">💬</div>
          <h3>No conversations yet</h3>
          <p>Open any listing and tap “Chat Seller” to start negotiating.</p>
          <button className="btn-primary" onClick={() => onNavigate('shop')}>Browse Listings</button>
        </div>
      ) : (
        <div className="chat-layout">
          <aside className="chat-list">
            {myConversations.map((conversation) => {
              const item = findCatalogItem(conversation.listingId);
              const last = conversation.messages[conversation.messages.length - 1];
              return (
                <button
                  key={conversation.id}
                  className={`chat-list-item ${conversation.id === selected?.id ? 'active' : ''}`}
                  onClick={() => setSelectedId(conversation.id)}
                >
                  <span className="detail-avatar">{conversation.seller.charAt(0)}</span>
                  <span className="chat-list-copy">
                    <strong>{conversation.seller}</strong>
                    <span>{item?.name || 'Listing removed'}</span>
                    <em>{last ? last.text : 'No messages yet'}</em>
                  </span>
                </button>
              );
            })}
          </aside>

          {selected && (
            <section className="chat-thread">
              <header className="chat-thread-head">
                <div>
                  <strong>{selected.seller}</strong>
                  <span>{listing?.name || 'Listing removed'}</span>
                </div>
                {listing && (
                  <button
                    className="btn-ghost"
                    onClick={() => onNavigate('product', null, { productId: listing.id })}
                  >
                    View listing <ArrowRight />
                  </button>
                )}
              </header>

              <div className="chat-messages">
                {selected.messages.length === 0 && (
                  <p className="chat-empty">Say hello and ask about the item or service.</p>
                )}
                {selected.messages.map((message) => (
                  <div key={message.id} className={`chat-bubble ${message.from}`}>
                    <span>{message.text}</span>
                    <time>{formatDateTime(message.at)}</time>
                  </div>
                ))}
              </div>

              <div className="chat-agree-bar">
                <div className="chat-agreed">
                  {selected.agreedPrice ? (
                    <>
                      <span>Agreed price</span>
                      <strong>{formatMoney(selected.agreedPrice)}</strong>
                    </>
                  ) : (
                    <span>No price agreed yet</span>
                  )}
                </div>

                <form className="chat-agree-form" onSubmit={handleAgree}>
                  <input
                    className="auth-input"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Agreed price (GH₵)"
                    value={priceDraft}
                    onChange={(e) => setPriceDraft(e.target.value)}
                  />
                  <button type="submit" className="btn-outline">Set Price</button>
                </form>

                <button
                  className="btn-primary"
                  disabled={!selected.agreedPrice || !listing}
                  onClick={handleOrderAtAgreedPrice}
                >
                  Order at {selected.agreedPrice ? formatMoney(selected.agreedPrice) : 'agreed price'}
                </button>
              </div>

              <form className="chat-input-bar" onSubmit={handleSend}>
                <input
                  className="auth-input"
                  placeholder="Write a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="btn-primary chat-send-btn">
                  <SendIcon /> Send
                </button>
              </form>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
