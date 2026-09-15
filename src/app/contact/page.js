'use client';

import { useState } from 'react';

const contactEmail = 'usmangulzar005@gmail.com';

export default function Contact() {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const submission = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
    };
    if (!submission.name || !submission.email || !submission.message) {
      setStatus('Please enter your name, email, and message.');
      return;
    }
    setSubmitting(true);
    setStatus('Submitting your message…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to submit your message. Please try again.');
      form.reset();
      setStatus('Thank you. Your message has been submitted.');
    } catch (error) {
      setStatus(error instanceof Error && error.message !== 'Failed to fetch' ? error.message : 'Unable to connect. Please try again. Your message is still in the form.');
    } finally {
      setSubmitting(false);
    }
  }
  return <div className="container">
    <section className="page-header"><h1 className="page-title">Get in touch</h1><p className="page-desc">Have a project in mind or a work opportunity? Tell me a little about it.</p></section>
    <div className="bento-grid">
      <section className="bento-box col-span-7" aria-labelledby="form-title">
        <h2 id="form-title">Tell me about your project</h2>
        <p className="contact-form-intro" id="form-help">Share a few details about your project or enquiry.</p>
        <form className="contact-form" onSubmit={handleSubmit} aria-describedby="form-help" aria-busy={submitting}>
          <div className="contact-field"><label htmlFor="contact-name">Name <span>(required)</span></label><input id="contact-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name"/></div>
          <div className="contact-field"><label htmlFor="contact-email">Email <span>(required)</span></label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></div>
          <div className="contact-field"><label htmlFor="contact-message">Message <span>(required)</span></label><textarea id="contact-message" name="message" required maxLength={2000} rows={6} placeholder="What would you like to build or improve?"/></div>
          <button className="primary-action" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit message'} <span aria-hidden="true">→</span></button>
          <p className="contact-form-status" role="status" aria-live="polite">{status}</p>
        </form>
      </section>
      <section className="bento-box col-span-5" aria-labelledby="contact-details-title">
        <h2 id="contact-details-title">Contact details</h2>
        <div className="contact-links" style={{marginTop:24}}>
          <div><p>Email</p><a href={`mailto:${contactEmail}`}>{contactEmail} ↗</a></div>
          <div><p>Phone</p><a href="tel:+923170106423">+92 317 010 6423</a></div>
          <div><p>Elsewhere</p><a href="https://linkedin.com/in/usmangulzar005" target="_blank" rel="noreferrer">LinkedIn ↗</a><br/><a href="https://github.com/MuhammadUsmanGulzar" target="_blank" rel="noreferrer">GitHub ↗</a></div>
          <p className="muted">Based in Karachi, Pakistan.</p>
        </div>
      </section>
    </div>
  </div>;
}

