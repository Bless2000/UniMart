import React, { useState } from 'react';
import FeaturesBar from '../components/FeaturesBar';
import { 
  PhoneIcon, MailIcon, MapPinIcon, SupportIcon,
  UserIcon, ClockIcon, SendIcon, ChevronDown, ChevronUp 
} from '../components/Icons';

export default function ContactUsPage({ triggerToast }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [openFaq, setOpenFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      triggerToast('Please fill in all required fields.');
      return;
    }
    triggerToast('Thank you! Your message has been sent to UniMart support.');
    setFormData({
      fullName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const toggleFaq = (index) => {
    setOpenFaq(prev => prev === index ? null : index);
  };

  const faqs = [
    {
      q: 'How can I track my order?',
      a: 'Once your order is dispatched, you will receive a tracking link via email and on your UniMart account dashboard under My Orders.'
    },
    {
      q: 'Do you ship internationally?',
      a: 'Currently, UniMart prioritizes campus deliveries and domestic regions. International shipping is available for selected electronics and high-value orders.'
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 30-day return policy and a 10-day buyer protection dispute window after delivery for eligible items in their original packaging.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Paystack (Mobile Money / Ghana Cards), Visa, MasterCard, Apple Pay, Google Pay, and Cash on Delivery (CoD) for campus meetups.'
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard campus delivery takes 1–2 business days. Express same-day pickup is available at designated campus pickup points.'
    },
    {
      q: 'How can I cancel or modify my order?',
      a: 'You can cancel or modify your order from your dashboard before the seller marks it as dispatched. Contact our live support for urgent adjustments.'
    }
  ];

  return (
    <div className="page-wrapper contact-page">
      {/* HERO SECTION */}
      <section className="contact-hero-section">
        <div className="contact-hero-content">
          <div className="contact-hero-text">
            <span className="contact-pill-label">CONTACT US</span>
            <h1 className="contact-hero-heading">
              We're Here to<br />
              <span className="highlight-yellow">Help You!</span>
            </h1>
            <p className="contact-hero-desc">
              Have a question, need support, or just want to say hello? Our team is ready to assist you. 
              Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="contact-hero-img-col">
            <div className="contact-glow-bg"></div>
            <img 
              src="/images/contact-hero.png" 
              alt="UniMart 24/7 Support" 
              className="contact-hero-img" 
            />
          </div>
        </div>
      </section>

      {/* 4 CONTACT CHANNELS */}
      <section className="contact-channels-section">
        <div className="channels-grid">
          <div className="channel-card">
            <div className="channel-icon-circle">
              <PhoneIcon />
            </div>
            <div className="channel-info">
              <h4 className="channel-name">Call Us</h4>
              <p className="channel-val">+1 (234) 567-8900</p>
              <p className="channel-sub">Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>

          <div className="channel-card">
            <div className="channel-icon-circle">
              <MailIcon />
            </div>
            <div className="channel-info">
              <h4 className="channel-name">Email Us</h4>
              <p className="channel-val">support@unimart.com</p>
              <p className="channel-sub">We reply within 24 hours</p>
            </div>
          </div>

          <div className="channel-card">
            <div className="channel-icon-circle">
              <MapPinIcon />
            </div>
            <div className="channel-info">
              <h4 className="channel-name">Visit Us</h4>
              <p className="channel-val">123 Commerce St.,</p>
              <p className="channel-sub">New York, NY 10001, USA</p>
            </div>
          </div>

          <div className="channel-card">
            <div className="channel-icon-circle">
              <SupportIcon />
            </div>
            <div className="channel-info">
              <h4 className="channel-name">Live Chat</h4>
              <p className="channel-val">Chat with our team</p>
              <p className="channel-sub">Mon - Fri: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-COLUMN: SEND MESSAGE FORM & OUR LOCATION */}
      <section className="contact-form-location-section">
        <div className="contact-two-col-grid">
          {/* Form */}
          <div className="contact-form-card">
            <h2 className="form-card-title">Send Us a <span className="highlight-yellow">Message</span></h2>
            <p className="form-card-subtitle">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="contact-inner-form">
              <div className="form-field-group">
                <label className="form-field-label">Full Name</label>
                <div className="input-with-icon">
                  <span className="field-icon"><UserIcon /></span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="contact-text-input"
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Email Address</label>
                <div className="input-with-icon">
                  <span className="field-icon"><MailIcon /></span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="contact-text-input"
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Subject</label>
                <div className="input-with-icon">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="contact-text-input select-input"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order & Delivery Inquiry</option>
                    <option value="dispute">Product Issue & Refund Dispute</option>
                    <option value="partnership">Campus Seller Partnership</option>
                    <option value="general">General Support</option>
                  </select>
                </div>
              </div>

              <div className="form-field-group">
                <label className="form-field-label">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="contact-textarea"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary btn-submit-message">
                <SendIcon /> Send Message
              </button>
            </form>
          </div>

          {/* Location & Map */}
          <div className="contact-location-card">
            <h2 className="form-card-title">Our <span className="highlight-yellow">Location</span></h2>
            <div className="map-view-container">
              <img 
                src="/images/contact-map.png" 
                alt="UniMart Location Map" 
                className="location-map-img" 
              />
            </div>

            <div className="location-details-box">
              <h4 className="office-title">UNIMART Head Office</h4>
              <p className="office-address">
                123 Commerce St., New York, NY 10001, USA
              </p>

              <div className="office-hours-row">
                <ClockIcon />
                <div className="hours-text">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="faq-section">
        <div className="faq-header-center">
          <h2 className="faq-main-title">
            Frequently Asked <span className="highlight-yellow">Questions</span>
          </h2>
          <div className="faq-header-line"></div>
        </div>

        <div className="faq-grid">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-card ${openFaq === idx ? 'expanded' : ''}`}
              onClick={() => toggleFaq(idx)}
            >
              <div className="faq-question-row">
                <h4 className="faq-q-text">{faq.q}</h4>
                <div className="faq-arrow-icon">
                  {openFaq === idx ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>

              {openFaq === idx && (
                <div className="faq-answer-row">
                  <p className="faq-a-text">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <FeaturesBar />
    </div>
  );
}
