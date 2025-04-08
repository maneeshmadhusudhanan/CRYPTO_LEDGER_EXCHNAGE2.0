import React, { useState } from "react";

const Support = () => {
  const [activeTab, setActiveTab] = useState("faq");
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const faqs = [
    {
      question: "How do I connect my wallet?",
      answer:
        "Click the 'Connect Wallet' button in the top right corner and follow the prompts from your wallet provider (MetaMask, etc.).",
    },
    {
      question: "What is the minimum deposit amount?",
      answer: "The minimum deposit amount is 0.1 CLX tokens.",
    },
    {
      question: "How long do transactions take?",
      answer:
        "Most transactions are processed within 1-2 minutes on the blockchain.",
    },
    {
      question: "What are the trading fees?",
      answer:
        "Trading fees are 0.5% per trade, which is used to maintain the platform and provide liquidity.",
    },
    {
      question: "How do I withdraw my funds?",
      answer:
        "Go to the Withdraw section, enter the amount you want to withdraw, and confirm the transaction in your wallet.",
    },
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.subject) {
      errors.subject = "Subject is required";
    }
    if (!formData.message) {
      errors.message = "Message is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically send the form data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSubmitStatus("success");
      setFormData({ email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Support Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Support Center</h1>
        <p className="text-gray-400">
          Get help with your trading and account management
        </p>
      </div>

      {/* Support Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === "faq"
              ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
              : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            activeTab === "contact"
              ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
              : "bg-white/5 text-gray-400 hover:text-white"
          }`}
        >
          Contact Support
        </button>
      </div>

      {/* FAQ Section */}
      {activeTab === "faq" && (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Contact Support Section */}
      {activeTab === "contact" && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Contact Support</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  formErrors.email ? "border-red-500" : "border-white/10"
                } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400`}
                placeholder="Enter your email"
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  formErrors.subject ? "border-red-500" : "border-white/10"
                } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400`}
                placeholder="Enter subject"
              />
              {formErrors.subject && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.subject}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  formErrors.message ? "border-red-500" : "border-white/10"
                } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400`}
                placeholder="Enter your message"
              ></textarea>
              {formErrors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {submitStatus === "success" && (
              <p className="text-green-400 text-center">
                Message sent successfully!
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-red-400 text-center">
                Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>
      )}

      {/* Additional Support Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <svg
            className="w-8 h-8 text-primary-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">
            Email Support
          </h3>
          <p className="text-gray-400">support@cryptoledger.com</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <svg
            className="w-8 h-8 text-primary-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
          <p className="text-gray-400">Available 24/7</p>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <svg
            className="w-8 h-8 text-primary-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">
            Documentation
          </h3>
          <p className="text-gray-400">User guides & tutorials</p>
        </div>
      </div>
    </div>
  );
};

export default Support;
