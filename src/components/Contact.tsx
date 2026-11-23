import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useTheme } from "./ThemeContext";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await emailjs.sendForm(
        "service_zcrxkhe",
        "template_ugetazi",
        formRef.current,
        "DM2QBzgf-kjLqNupS"
      );

      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      formRef.current.reset();
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send the message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="py-24 bg-[#fbfaf5] dark:bg-[#0d0e12] border-t-3 border-slate-900 dark:border-slate-800 transition-colors duration-500"
      id="contact"
    >
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            [CONTACT]
          </span>
          <h2 className="text-4xl font-display font-black text-slate-900 dark:text-white uppercase mt-2">
            Let's Connect
          </h2>
          <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Information Side (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <h3 className="text-2xl font-display font-black text-slate-900 dark:text-white uppercase">
              Get in Touch
            </h3>
            <p className="text-slate-800 dark:text-gray-250 text-sm font-semibold leading-relaxed">
              Open to discussions regarding clinical engineering, research collaborations, medical device development, or technical roles. Send a message below or connect directly via email and LinkedIn.
            </p>
            
            <div className="pt-4 space-y-4">
              {[
                { 
                  name: "GitHub", 
                  href: "https://github.com/arthist03", 
                  icon: Github,
                },
                { 
                  name: "LinkedIn", 
                  href: "https://linkedin.com/in/arthkadiya", 
                  icon: Linkedin,
                },
                { 
                  name: "Email", 
                  href: "mailto:arthpk09@gmail.com", 
                  icon: Mail,
                }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3.5 text-slate-900 dark:text-white hover:underline decoration-2 font-mono-code text-sm font-bold uppercase tracking-wider group"
                >
                  <div className="p-2.5 rounded-lg border-2 border-slate-900 dark:border-white bg-white dark:bg-gray-800 text-slate-900 dark:text-white shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_0px_#0f172a] dark:group-hover:shadow-[1px_1px_0px_0px_#ffffff] transition-all">
                    <social.icon className="w-5 h-5 shrink-0" />
                  </div>
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Form Side (Span 3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="neobrutal-card p-5 sm:p-8 bg-white dark:bg-[#16171d] lg:col-span-3 w-full"
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="hidden">
                <input type="hidden" name="to_name" value="Arth Kadiya" />
              </div>

              <div>
                <label
                  htmlFor="user_name"
                  className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                >
                  [Name]
                </label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border-3 border-slate-900 dark:border-white text-sm font-semibold transition-all focus:outline-none bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:focus:shadow-[1.5px_1.5px_0px_0px_#ffffff]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="user_email"
                  className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                >
                  [Email]
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-lg border-3 border-slate-900 dark:border-white text-sm font-semibold transition-all focus:outline-none bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:focus:shadow-[1.5px_1.5px_0px_0px_#ffffff]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-mono-code font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                >
                  [Message]
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Let me know what you'd like to collaborate on..."
                  className="w-full px-4 py-3 rounded-lg border-3 border-slate-900 dark:border-white text-sm font-semibold transition-all focus:outline-none bg-white dark:bg-gray-900 text-slate-900 dark:text-white shadow-[3px_3px_0px_0px_#0f172a] dark:shadow-[3px_3px_0px_0px_#ffffff] focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1.5px_1.5px_0px_0px_#0f172a] dark:focus:shadow-[1.5px_1.5px_0px_0px_#ffffff]"
                  required
                />
              </div>

              {submitStatus.type && (
                <div
                  className={`text-xs font-mono-code font-bold p-3 rounded-lg border-2 ${
                    submitStatus.type === "success"
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-red-100 border-red-500 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-lg bg-yellow-200 dark:bg-yellow-400 text-slate-900 hover:bg-yellow-350 dark:hover:bg-yellow-500 border-3 border-slate-900 dark:border-white font-bold text-xs font-mono-code uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_#0f172a] dark:shadow-[4px_4px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_#0f172a] dark:hover:shadow-[3px_3px_0px_0px_#ffffff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_0px_#0f172a] dark:active:shadow-[1px_1px_0px_0px_#ffffff] flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                ) : (
                  <Send className="w-4 h-4 shrink-0" />
                )}
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;