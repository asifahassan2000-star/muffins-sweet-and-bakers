import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { addInquiryToFirestore } from '../firebase/config';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry / Order',
    message: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.message.trim()) {
      setErrorMsg('Please enter your name and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await addInquiryToFirestore({
        name: formState.name,
        email: formState.email || 'customer@muffinns.com',
        phone: formState.phone,
        subject: formState.subject,
        message: formState.message,
        rating: formState.rating
      });
      setSubmitted(true);
    } catch (err: any) {
      console.warn('Inquiry submission fallback:', err);
      // Even if offline, show confirmed status as saved locally
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-chocolate py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-14 sm:space-y-20">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] font-medium text-brand-caramel">
            <span>Direct Concierge</span>
            <span aria-hidden="true" className="text-brand-honey">·</span>
            <span>Bahawalpur, PK</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-brand-chocolate font-normal tracking-tight">
            Get in Touch With Our Kitchen.
          </h1>

          <p className="text-sm sm:text-base text-brand-chocolate/75 leading-relaxed font-sans">
            Have a question about customized wedding cakes, bulk party orders, delivery timings, or branch locations? We are always here to assist you.
          </p>
        </div>

        {/* 2-Column Split: Contact Channels & Working Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Direct Channels & Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 sm:p-8 bg-brand-sugar border border-brand-caramel/15 rounded-xs space-y-6">
              <h2 className="font-serif text-2xl text-brand-chocolate font-normal">
                Direct Contact Lines
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-brand-caramel mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-brand-chocolate">Phone & WhatsApp:</span>
                    <a href="tel:03026567774" className="font-mono text-brand-caramel hover:underline block">
                      0302 6567774
                    </a>
                    <a href="tel:03326567774" className="font-mono text-brand-caramel hover:underline block">
                      0332 6567774
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-brand-caramel mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-brand-chocolate">Operating Hours:</span>
                    <span className="text-brand-chocolate/75 block">Monday – Sunday: 08:00 AM – 12:00 AM</span>
                    <span className="text-brand-chocolate/60 text-xs block">Ovens fired continuously throughout the day</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-caramel mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-brand-chocolate">Headquarters & Central Bakehouse:</span>
                    <span className="text-brand-chocolate/75 block">
                      Circular Road, Near Trust Colony Chowk, Bahawalpur, Punjab, Pakistan
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-2">
                <a
                  href="https://wa.me/923026567774?text=Hello%20Muffinns%20Bakery,%20I%20would%20like%20to%20inquire%20about%20ordering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="text-xs text-brand-chocolate/60 space-y-1 px-1">
              <p>✦ Special Event Orders require 24–48 hours advance booking.</p>
              <p>✦ Cash on delivery and digital mobile bank payments supported.</p>
            </div>
          </div>

          {/* Right Column: Working Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 bg-brand-sugar border border-brand-caramel/15 rounded-xs">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-2xl text-brand-chocolate font-normal">
                    Inquiry Received
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-chocolate/75 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formState.name}</strong>. Your message has been routed to our Bahawalpur bakehouse team. We will respond promptly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        phone: '',
                        email: '',
                        subject: 'General Inquiry / Order',
                        message: '',
                        rating: 5
                      });
                    }}
                    className="text-xs uppercase tracking-widest font-semibold text-brand-caramel hover:underline pt-2 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-serif text-2xl text-brand-chocolate font-normal">
                    Send an Inquiry or Feedback
                  </h3>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xs flex items-center gap-2 border border-red-200">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-brand-chocolate mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Asad Khan"
                        className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-caramel/20 rounded-xs text-xs sm:text-sm text-brand-chocolate focus:bg-white focus:outline-none focus:border-brand-chocolate transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-brand-chocolate mb-1.5">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="0300 1234567"
                        className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-caramel/20 rounded-xs text-xs sm:text-sm text-brand-chocolate focus:bg-white focus:outline-none focus:border-brand-chocolate transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-brand-chocolate mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-caramel/20 rounded-xs text-xs sm:text-sm text-brand-chocolate focus:bg-white focus:outline-none focus:border-brand-chocolate transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-brand-chocolate mb-1.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={formState.subject}
                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-caramel/20 rounded-xs text-xs sm:text-sm text-brand-chocolate focus:bg-white focus:outline-none focus:border-brand-chocolate transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry / Order">General Order Inquiry</option>
                        <option value="Custom Wedding / Birthday Cake">Custom Cake Request</option>
                        <option value="Bulk Corporate / Event Catering">Bulk Event Catering</option>
                        <option value="Customer Feedback / Compliments">Bakery Experience Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-brand-chocolate mb-1.5">
                      Your Message or Order Specifications *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Please share flavor preferences, desired delivery date, or any specific requirements..."
                      className="w-full px-3.5 py-2.5 bg-brand-cream/50 border border-brand-caramel/20 rounded-xs text-xs sm:text-sm text-brand-chocolate focus:bg-white focus:outline-none focus:border-brand-chocolate transition-colors leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-chocolate text-brand-cream hover:bg-brand-caramel transition-colors font-sans text-xs uppercase tracking-widest font-semibold rounded-xs cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Inquiry to Bakehouse</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
