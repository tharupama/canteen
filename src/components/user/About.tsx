import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-section">
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

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>Student-friendly pricing with special discounts for bulk orders. We believe good food shouldn't break the bank.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Quick Service</h3>
            <p>Fast preparation and serving times to fit your busy academic schedule. Order ahead through our app to save time.</p>
          </div>
{/* 
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Healthy Options</h3>
            <p>Variety of nutritious meals including vegetarian and balanced diet options to keep you healthy and energized.</p>
          </div> */}
        </div>

        <div className="mission-vision">
          <div className="mission">
            <h3>Our Mission</h3>
            <p>
              To provide the university community with affordable, nutritious, and delicious meals 
              in a clean and welcoming environment, while maintaining the highest standards of 
              food safety and customer service.
            </p>
          </div>

          <div className="vision">
            <h3>Our Vision</h3>
            <p>
              To be the preferred dining destination on campus, known for our quality, variety, 
              and commitment to student satisfaction. We strive to create a space where students 
              can enjoy great food and build lasting memories.
            </p>
          </div>
        </div>

        <div className="stats-section">
          <h3>By the Numbers</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Years of Service</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Daily Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Menu Items</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15</div>
              <div className="stat-label">Expert Chefs</div>
            </div>
          </div>
        </div>

        <div className="values-section">
          <h3>Our Values</h3>
          <div className="values-list">
            <div className="value-item">
              <span className="value-icon">✓</span>
              <div>
                <h4>Quality First</h4>
                <p>We never compromise on the quality of ingredients or preparation methods.</p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-icon">✓</span>
              <div>
                <h4>Customer Satisfaction</h4>
                <p>Your feedback drives our continuous improvement and menu innovation.</p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-icon">✓</span>
              <div>
                <h4>Hygiene & Safety</h4>
                <p>Strict adherence to food safety protocols and cleanliness standards.</p>
              </div>
            </div>
            <div className="value-item">
              <span className="value-icon">✓</span>
              <div>
                <h4>Community Focus</h4>
                <p>Supporting local suppliers and contributing to campus life.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="team-section">
          <h3>Meet Our Team</h3>
          <p className="team-intro">
            Our dedicated team of chefs, servers, and support staff work tirelessly to ensure 
            you have the best dining experience. With decades of combined experience, they bring 
            passion and expertise to every meal served.
          </p>
        </div>

        <div className="cta-section">
          <h3>Join Our Community</h3>
          <p>Follow us on social media for daily specials, new menu items, and exclusive offers!</p>
          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Twitter</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;