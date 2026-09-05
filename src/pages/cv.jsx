import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';

// ⚠️  Replace these with your own EmailJS credentials from https://emailjs.com
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

const STATUS = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

export default function CV() {
  const formRef = useRef(null);
  const [status, setStatus] = useState(STATUS.IDLE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(STATUS.LOADING);

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus(STATUS.SUCCESS);
      formRef.current.reset();
    } catch (err) {
      console.error(err);
      setStatus(STATUS.ERROR);
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <main className="cv-main">
        <div className="cv-card">
          <div className="cv-card-header">
            <span className="cv-icon">📄</span>
            <h1 className="cv-title">Request my CV</h1>
            <p className="cv-subtitle">
              Drop your email below and I'll send it over once I've reviewed your request.
            </p>
          </div>

          {status === STATUS.SUCCESS ? (
            <div className="cv-success">
              <span className="cv-success-icon">✅</span>
              <h3>Request received!</h3>
              <p>I'll review it and get back to you soon. Thanks for reaching out.</p>
            </div>
          ) : (
            <form ref={formRef} className="cv-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="from_name">Your Name</label>
                <input
                  id="from_name"
                  type="text"
                  name="from_name"
                  placeholder="Jane Smith"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reply_to">Your Email</label>
                <input
                  id="reply_to"
                  type="email"
                  name="reply_to"
                  placeholder="jane@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Reason for Request <span className="optional">(optional)</span></label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="I'm recruiting for a product design role at..."
                />
              </div>

              {status === STATUS.ERROR && (
                <p className="cv-error">Something went wrong. Please try again or email me directly.</p>
              )}

              <button
                type="submit"
                className="cv-submit-btn"
                disabled={status === STATUS.LOADING}
              >
                {status === STATUS.LOADING ? 'Sending…' : 'Send Request →'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
