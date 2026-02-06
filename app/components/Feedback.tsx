'use client';

import { feedbacks } from '@/constants';
import { useState, useEffect } from 'react';

const Feedback = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % (feedbacks.length * 320));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const displayedFeedbacks = [...feedbacks, ...feedbacks];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="w-full py-12 px-4 md:px-8">
      <div className="text-center pb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-blue-800 mb-4">
          What Our Patients Say
        </h2>
        <p className="text-sm sm:text-lg max-w-2xl mx-auto">
          Real stories from real people who&apos;ve experienced exceptional healthcare with us. 
          Join thousands of satisfied patients who trust us with their wellbeing.
        </p>
      </div>

      {/* Marquee Slider */}
      <div className="w-full overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
          }}
        >
          {displayedFeedbacks.map((feedback, index) => (
            <div
              key={index}
              className="shrink-0 w-full sm:w-90 bg-gray-100 rounded-xl p-6 shadow-md"
            >
              <div className="pb-4">
                {renderStars(feedback.rating)}
              </div>
              <p className=" text-base text-gray-700 leading-relaxed pb-6 ">
                &ldquo;{feedback.testimony}&rdquo;
              </p>
              <div className="pt-4 border-t border-gray-300">
                <span className="font-semibold text-gray-900">{feedback.userName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedback;