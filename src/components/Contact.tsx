import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Mail, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useTheme } from './ThemeContext'; // Assumes you have a ThemeContext for theme toggling

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const { theme } = useTheme(); // Assuming a useTheme hook provides the current theme

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      await emailjs.sendForm(
        'service_zcrxkhe', // Replace with your Service ID
        'template_ugetazi', // Replace with your Template ID
        formRef.current,
        'DM2QBzgf-kjLqNupS' // Replace with your Public Key
      );

      setSubmitStatus({
        type: 'success',
        message: "Message sent successfully! I'll get back to you soon.",
      });
      formRef.current.reset();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send the message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`py-20 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}
      id="contact"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12 text-center"
        >
          Let's Connect
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
            <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
              I'm always excited to collaborate on innovative projects that combine healthcare and technology. Whether
              you have a project in mind or just want to connect, feel free to reach out!
            </p>
            <div className="space-y-4">
              <a
                href="https://github.com/arthist03"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 ${
                  theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                } transition-colors`}
              >
                <Github className="w-6 h-6" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/arthkadiya"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 ${
                  theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                } transition-colors`}
              >
                <Linkedin className="w-6 h-6" />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:arthpk09@gmail.com"
                className={`flex items-center space-x-3 ${
                  theme === 'dark' ? 'text-gray-300 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'
                } transition-colors`}
              >
                <Mail className="w-6 h-6" />
                <span>Email</span>
              </a>
            </div>
          </motion.div>
          <motion.form
            ref={formRef}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="user_name"
                className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}
              >
                Name
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                className={`w-full px-4 py-2 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-400'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="user_email"
                className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}
              >
                Email
              </label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                className={`w-full px-4 py-2 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-400'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className={`w-full px-4 py-2 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-200 border-gray-400'
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
              />
            </div>
            {submitStatus.type && (
              <div
                className={`text-sm ${submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'} ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 ${
                theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>Send Message</span>
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
