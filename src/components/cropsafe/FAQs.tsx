import { ChevronDown } from "lucide-react";
import React from "react";
import { faqs } from "src/constants";

function FAQs() {
  return (
    <div className="faq-section p-4 md:p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="bg-white p-4 rounded-lg shadow-md group"
          >
            <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-gray-700">
              <span className="pr-6 flex-1">{faq.q}</span>
              <ChevronDown className="h-5 w-5 flex-shrink-0 text-green-600 transform group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <p className="mt-2 text-gray-600 whitespace-normal break-words">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FAQs;
