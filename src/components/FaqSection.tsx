import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Who is Arth Kadiya and what does he specialize in?',
    answer:
      'Arth Kadiya is an AI/ML and Biomedical Engineer pursuing a joint Masters in Medical Technologies at IIT Jodhpur and AIIMS Jodhpur (2025–2027), specializing in diagnostic machine learning, computer vision, biosignal processing, and medical robotics hardware.',
  },
  {
    question: "What is Arth Kadiya's academic background?",
    answer:
      'He holds a Diploma in Biomedical Engineering from Ganpat University (2019–2022), a B.Tech in Biomedical Engineering from Manipal Institute of Technology (2022–2025), and is currently pursuing a joint Masters in Medical Technologies at IIT Jodhpur and AIIMS Jodhpur (2025–2027).',
  },
  {
    question: 'What industry and clinical experience does Arth Kadiya have?',
    answer:
      'He worked as an AI/ML Engineering Intern at Sudhir Srivastava Innovations Pvt. Ltd. on medical robotics computer vision and simulation (2025), Full Stack Web Developer at IEEE Bombay (2023), and Biomedical Engineering Intern at Wockhardt Hospitals (2023) and Zydus Hospitals (2022).',
  },
  {
    question: 'What tools and frameworks does Arth Kadiya use?',
    answer:
      'His primary stack includes Python, PyTorch, TensorFlow, TensorFlow Lite, OpenCV, MediaPipe, Unity and Vuforia, Kotlin, Firebase, React, Vite, and Tailwind CSS.',
  },
  {
    question: 'Which notable healthcare AI projects has Arth Kadiya built?',
    answer:
      'Notable projects include an AI-Assisted Ophthalmic Care Android app using on-device TensorFlow Lite retinal screening, a Preterm Pregnancy Risk Prediction classifier using Random Forest and SVM, and a real-time touchless hand gesture system with MediaPipe and OpenCV.',
  },
  {
    question: 'How can I contact Arth Kadiya for engineering or research roles?',
    answer:
      'You can reach Arth Kadiya directly via email at arthpk09@gmail.com, connect on LinkedIn (linkedin.com/in/arthkadiya), inspect code on GitHub (github.com/arthist03), or use the contact form below.',
  },
];

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-20 px-4 bg-[#fbfaf5] dark:bg-[#181818] border-t-[3px] border-slate-900 dark:border-neutral-800"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-400">
            [FAQ &amp; QUICK ANSWERS]
          </span>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white uppercase mt-2"
            style={{ textWrap: 'balance' }}
          >
            Common Questions
          </h2>
          <div className="w-16 h-1.5 bg-slate-900 dark:bg-white mx-auto mt-4" />
        </div>

        <dl className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="neobrutal-card bg-white dark:bg-[#1f1f1f] overflow-hidden"
              >
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#272727] transition-colors"
                  >
                    <span style={{ textWrap: 'balance' }}>{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </dt>
                {isOpen && (
                  <dd
                    className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm text-slate-700 dark:text-neutral-300 font-medium leading-relaxed border-t-2 border-slate-100 dark:border-neutral-800"
                    style={{ textWrap: 'pretty' }}
                  >
                    <p className="pt-4">{item.answer}</p>
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default FaqSection;
