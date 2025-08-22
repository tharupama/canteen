import React from 'react';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <div className="contact-section">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p className="contact-subtitle">We're here to help with your orders and inquiries</p>
        
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <h3>Location</h3>
            <p>University Canteen</p>
            <p>Ground Floor, Main Building</p>
            <p>University Campus</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Phone</h3>
            <p>+94 11 234 5678</p>
            <p>+94 77 123 4567</p>
            <p className="contact-hours">Mon-Fri: 7:00 AM - 6:00 PM</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>Email</h3>
            <p>canteen@university.lk</p>
            <p>orders@unicanteen.lk</p>
            <p className="contact-response">We respond within 24 hours</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">⏰</div>
            <h3>Operating Hours</h3>
            <p><strong>Monday - Friday:</strong></p>
            <p>7:00 AM - 6:00 PM</p>
            <p><strong>Saturday:</strong></p>
            <p>8:00 AM - 2:00 PM</p>
            <p><strong>Sunday:</strong> Closed</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h3>Send us a Message</h3>
          <form className="contact-form" onSubmit={(e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
          }}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input type="text" required placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" required placeholder="your.email@example.com" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Subject</label>
              <select required>
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="feedback">Feedback</option>
                <option value="complaint">Complaint</option>
                <option value="suggestion">Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows={5} 
                required 
                placeholder="Type your message here..."
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        <div className="emergency-contact">
          <h3>🚨 For Urgent Matters</h3>
          <p>If you have an urgent issue with your order, please call us directly at:</p>
          <p className="emergency-number">+94 77 123 4567</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;