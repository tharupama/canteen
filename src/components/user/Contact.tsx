import React from "react";
import "./Contact.css";

const Contact: React.FC = () => {
  return (
    <div className="contact-section">
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p className="contact-subtitle">
          Have a question? Get in touch with us
        </p>

        {/* Contact Info */}
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">📍</div>
            <h3>Location</h3>
            <p>University Canteen, Main Building</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📞</div>
            <h3>Phone</h3>
            <p>+94 77 123 4567</p>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📧</div>
            <h3>Email</h3>
            <p>canteen@university.lk</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h3>Send a Message</h3>
          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We'll get back to you soon.");
            }}
          >
            <div className="form-group">
              <input type="text" required placeholder="Your Name" />
            </div>
            <div className="form-group">
              <input type="email" required placeholder="Your Email" />
            </div>
            <div className="form-group">
              <textarea rows={4} required placeholder="Your Message"></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
