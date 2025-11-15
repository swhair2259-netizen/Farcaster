import React, { useState } from "react";
import "./ContactUs.css";

export function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app you'd POST to an API endpoint here.
    console.log("Contact form submitted", { name, email, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p className="contact-lead">Have questions or want to collaborate? Send us a message.</p>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          </label>

          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </label>

          <label>
            Message
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" required />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Send Message</button>
            {submitted && <span className="submitted-note">Thanks — we'll be in touch!</span>}
          </div>
        </form>

        <aside className="contact-aside">
          <div className="contact-info">
            <h3>Connect with us</h3>
            <p>Follow or message us on social for updates and quick replies.</p>

            <ul className="social-list">
              <li>
                <a href="https://www.facebook.com/lynxnow" target="_blank" rel="noopener noreferrer">
                  Facebook — Lynx Now
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/lynxnow" target="_blank" rel="noopener noreferrer">
                  Instagram — @lynxnow
                </a>
              </li>
              <li>
                <a href="https://x.com/lynxnow" target="_blank" rel="noopener noreferrer">
                  X — @lynxnow
                </a>
              </li>
            </ul>

            <div className="support-hours">
              <h4>Support Hours</h4>
              <p>Mon–Fri: 9am — 6pm (local time)</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ContactUs;
