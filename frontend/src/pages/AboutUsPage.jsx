import React from 'react';
import FeaturesBar from '../components/FeaturesBar';
import { 
  ArrowRight, TargetIcon, EyeIcon, DiamondIcon,
  UsersMetricIcon, BagMetricIcon, GlobeMetricIcon, AwardMetricIcon,
  LinkedinIcon, TwitterIcon, MailIcon 
} from '../components/Icons';

export default function AboutUsPage({ onNavigate }) {
  const teamMembers = [
    {
      name: 'Daniel Okafor',
      role: 'CEO & Founder',
      img: '/images/team-daniel.png'
    },
    {
      name: 'Amara Johnson',
      role: 'Head of Operations',
      img: '/images/team-amara.png'
    },
    {
      name: 'David Mensah',
      role: 'Head of Marketing',
      img: '/images/team-david.png'
    },
    {
      name: 'Chioma Adeyemi',
      role: 'Customer Experience Lead',
      img: '/images/team-chioma.png'
    }
  ];

  return (
    <div className="page-wrapper about-us-page">
      {/* HERO SECTION */}
      <section className="about-hero-section">
        <div className="about-hero-content">
          <div className="about-hero-text">
            <span className="about-pill-label">About Us</span>
            <h1 className="about-hero-heading">
              More than a store,<br />
              we're your <span className="highlight-yellow">partner.</span>
            </h1>
            <p className="about-hero-desc">
              At UNIMART, we believe shopping should be simple, affordable, and enjoyable. 
              We bring you high-quality products from trusted brands, all in one place.
            </p>
            <button className="btn-primary" onClick={() => onNavigate('shop')}>
              Shop Now <ArrowRight />
            </button>
          </div>

          <div className="about-hero-img-col">
            <div className="about-hero-glow"></div>
            <img 
              src="/images/about-hero.png" 
              alt="UniMart Partnership" 
              className="about-hero-img" 
            />
          </div>
        </div>
      </section>

      {/* OUR STORY CARD */}
      <section className="about-story-section">
        <div className="about-story-card">
          <div className="about-story-text-col">
            <h2 className="story-heading">Our <span className="highlight-yellow">Story</span></h2>
            <div className="story-divider"></div>
            <p className="story-p">
              UNIMART was founded with a simple goal: to provide everyone with access to the best 
              products at unbeatable prices.
            </p>
            <p className="story-p">
              From the latest electronics to everyday essentials, we are committed to delivering 
              quality, value, and exceptional service every step of the way.
            </p>
          </div>

          <div className="about-story-img-col">
            <img 
              src="/images/about-story-cart.png" 
              alt="Our Story - UniMart Shopping Experience" 
              className="story-cart-img" 
            />
          </div>
        </div>
      </section>

      {/* MISSION, VISION & VALUES */}
      <section className="mission-values-section">
        <h2 className="mission-section-title">
          Our <span className="highlight-yellow">Mission, Vision & Values</span>
        </h2>

        <div className="mission-cards-grid">
          <div className="mission-card">
            <div className="mission-card-icon">
              <TargetIcon />
            </div>
            <h3 className="mission-card-title">Our Mission</h3>
            <p className="mission-card-desc">
              To make online shopping easy, affordable, and accessible for everyone.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-card-icon">
              <EyeIcon />
            </div>
            <h3 className="mission-card-title">Our Vision</h3>
            <p className="mission-card-desc">
              To become the most trusted online marketplace that enriches lives globally.
            </p>
          </div>

          <div className="mission-card">
            <div className="mission-card-icon">
              <DiamondIcon />
            </div>
            <h3 className="mission-card-title">Our Values</h3>
            <p className="mission-card-desc">
              We value quality, integrity, customer satisfaction, and continuous improvement.
            </p>
          </div>
        </div>
      </section>

      {/* KEY METRICS BAR */}
      <section className="about-metrics-section">
        <div className="about-metrics-card">
          <div className="metric-item">
            <div className="metric-icon"><UsersMetricIcon /></div>
            <div className="metric-details">
              <h3 className="metric-num">50K+</h3>
              <p className="metric-label">Happy Customers</p>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><BagMetricIcon /></div>
            <div className="metric-details">
              <h3 className="metric-num">10K+</h3>
              <p className="metric-label">Products</p>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><GlobeMetricIcon /></div>
            <div className="metric-details">
              <h3 className="metric-num">50+</h3>
              <p className="metric-label">Countries Served</p>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-icon"><AwardMetricIcon /></div>
            <div className="metric-details">
              <h3 className="metric-num">99%</h3>
              <p className="metric-label">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR TEAM */}
      <section className="about-team-section">
        <div className="team-header-center">
          <h2 className="team-title">Our <span className="highlight-yellow">Team</span></h2>
          <p className="team-subtitle">
            Passionate people working behind the scenes to bring you the best shopping experience.
          </p>
        </div>

        <div className="team-members-grid">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-card">
              <div className="team-avatar-wrap">
                <img src={member.img} alt={member.name} className="team-avatar-img" />
              </div>
              <h3 className="team-member-name">{member.name}</h3>
              <p className="team-member-role">{member.role}</p>

              <div className="team-social-links">
                <a href="#linkedin" className="team-social-btn" aria-label="LinkedIn">
                  <LinkedinIcon />
                </a>
                <a href="#twitter" className="team-social-btn" aria-label="Twitter">
                  <TwitterIcon />
                </a>
                <a href="#email" className="team-social-btn" aria-label="Email">
                  <MailIcon />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FeaturesBar />
    </div>
  );
}
