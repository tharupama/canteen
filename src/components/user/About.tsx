import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-section">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-content">
          <h1>
            <span className="hero-emoji" role="img" aria-label="canteen">🏫</span>
            About University Canteen
          </h1>
          <p className="hero-subtitle">Serving the campus community since 2017</p>
        </div>
      </div>

      <div className="about-container">
        <div className="about-header">
          <h2>About University Canteen</h2>
          {/* <p className="about-tagline">Serving Quality Food Since 1995</p> */}
        </div>

        <div className="about-intro">
          <p>
            Welcome to the University Canteen, your trusted partner for delicious and affordable meals on campus. 
            We have been serving the university community for over 6 years, providing nutritious food options 
            that fuel academic excellence.
          </p>
        </div>

        <div className="about-features">
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Quality Food</h3>
            <p>Fresh ingredients sourced daily from trusted local suppliers. All meals prepared with care and attention to hygiene standards.</p>
          </div>
        </div>

        {/* Features */}
        <div className="features-section">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">We're committed to excellence in campus dining</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon" role="img" aria-label="Quality Food">🍽️</span>
              </div>
              <h3>Quality Food</h3>
              <p>Fresh ingredients sourced daily from trusted local suppliers. All meals prepared with care and attention to hygiene standards.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon" role="img" aria-label="Affordable Prices">💰</span>
              </div>
              <h3>Affordable Prices</h3>
              <p>Student-friendly pricing with special discounts for bulk orders. We believe good food shouldn't break the bank.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon" role="img" aria-label="Quick Service">⚡</span>
              </div>
              <h3>Quick Service</h3>
              <p>Fast preparation and serving times to fit your busy academic schedule. Order ahead through our app to save time.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <span className="feature-icon" role="img" aria-label="Healthy Options">🌱</span>
              </div>
              <h3>Healthy Options</h3>
              <p>Variety of nutritious meals including vegetarian and balanced diet options to keep you healthy and energized.</p>
            </div>
          </div>
{/* 
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Healthy Options</h3>
            <p>Variety of nutritious meals including vegetarian and balanced diet options to keep you healthy and energized.</p>
          </div> */}
        </div>

        {/* Stats */}
        <section className="stats-section">
          <div className="section-header">
            <h2 className="section-title">By The Numbers</h2>
            <p className="section-subtitle">Our impact on campus dining</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years of Service</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Daily Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Menu Items</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Expert Chefs</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <div className="section-header">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon" role="img" aria-label="Quality First">✔️</div>
              <div className="value-content">
                <h4>Quality First</h4>
                <p>We never compromise on the quality of ingredients or preparation methods.</p>
              </div>
            </div>
            
            <div className="value-item">
              <div className="value-icon" role="img" aria-label="Customer Satisfaction">✔️</div>
              <div className="value-content">
                <h4>Customer Satisfaction</h4>
                <p>Your feedback drives our continuous improvement and menu innovation.</p>
              </div>
            </div>
            
            <div className="value-item">
              <div className="value-icon" role="img" aria-label="Hygiene & Safety">✔️</div>
              <div className="value-content">
                <h4>Hygiene & Safety</h4>
                <p>Strict adherence to food safety protocols and cleanliness standards.</p>
              </div>
            </div>
            
            <div className="value-item">
              <div className="value-icon" role="img" aria-label="Community Focus">✔️</div>
              <div className="value-content">
                <h4>Community Focus</h4>
                <p>Supporting local suppliers and contributing to campus life.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="team-section">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Meet Our Team</h2>
              <span className="team-icon" role="img" aria-label="team">👨‍🍳</span>
            </div>
            
            <div className="team-description">
              <p>
                Our dedicated team of chefs, servers, and support staff work tirelessly to ensure 
                you have the best dining experience. With decades of combined experience, they bring 
                passion and expertise to every meal served.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Join Our Community</h2>
            <p className="cta-text">
              Follow us on social media for daily specials, new menu items, and exclusive offers!
            </p>
            
            <div className="social-links">
              <a href="https://www.facebook.com/" className="social-link" aria-label="Facebook">
                <span className="social-icon" role="img" aria-label="Facebook">📘</span>
                <span className="social-text">Facebook</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span className="social-icon" role="img" aria-label="Instagram">📸</span>
                <span className="social-text">Instagram</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span className="social-icon" role="img" aria-label="Twitter">🐦</span>
                <span className="social-text">Twitter</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;