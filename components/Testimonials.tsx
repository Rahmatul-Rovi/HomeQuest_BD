"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Farhana Akter",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    text: "Found a 2-bedroom flat within 3 days. The owner was already verified so I felt safe booking a visit.",
    avatar: "https://i.pravatar.cc/150?img=32",  
  },
  {
    name: "Tanvir Hasan",
    location: "Mirpur, Dhaka",
    rating: 5,
    text: "No more dealing with brokers. I messaged the owner directly and everything was sorted in a day.",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Nusrat Jahan",
    location: "Mohammadpur, Dhaka",
    rating: 4,
    text: "The map search made it so easy to find a mess close to my university. Saved me hours of walking around.",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Rafiul Islam",
    location: "Uttara, Dhaka",
    rating: 5,
    text: "Listed my flat for sale here and got genuine buyers within a week. Very smooth experience overall.",
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    name: "Sadia Rahman",
    location: "Banani, Dhaka",
    rating: 5,
    text: "As a bachelor, finding a place that actually allows bachelors was always hard. The filter here is a lifesaver.",
    avatar: "https://i.pravatar.cc/150?img=45",
  },
  {
    name: "Imran Kabir",
    location: "Bashundhara, Dhaka",
    rating: 4,
    text: "Scheduling a visit through the app instead of calling back and forth was really convenient.",
    avatar: "https://i.pravatar.cc/150?img=51",
  },
  {
    name: "Mahmuda Sultana",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    text: "I reported a suspicious listing and the admin team took it down within hours. Felt genuinely safe using this.",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    name: "Shakil Ahmed",
    location: "Khilgaon, Dhaka",
    rating: 5,
    text: "The listing photos and details matched exactly what I saw during the visit. No surprises at all.",
    avatar: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Tania Ferdous",
    location: "Baridhara, Dhaka",
    rating: 4,
    text: "Wishlist feature let me save a few flats and compare them later with my roommate. Very handy.",
    avatar: "https://i.pravatar.cc/150?img=48",
  },
  {
    name: "Nayeem Chowdhury",
    location: "Gulshan, Dhaka",
    rating: 5,
    text: "Been checking new listings weekly. The notification alert for my preferred area works perfectly.",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Helper function to calculate index for Previous, Current, and Next cards
  const getCardIndex = (offset: number) => {
    return (activeIndex + offset + reviews.length) % reviews.length;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-emerald-50/20 to-white overflow-hidden">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="inline-block px-4 py-1.5 mb-3 text-xs font-semibold tracking-wider text-emerald-700 uppercase bg-emerald-100/80 rounded-full">
          Tenant Reviews
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          What Our Tenants Say
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base">
          Trusted by thousands of tenants and owners across Dhaka
        </p>
      </div>

      {/* 3-Card Carousel Container */}
      <div className="max-w-6xl mx-auto relative px-2 sm:px-10">
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 cursor-pointer"
          aria-label="Previous review"
        >
          <ChevronLeft size={24} />
        </button>
         <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 cursor-pointer"
          aria-label="Next review"
        >
          <ChevronRight size={24} />
        </button>

        {/* Cards Wrapper */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-6 min-h-[380px]">
          {[-1, 0, 1].map((offset) => {
            const itemIndex = getCardIndex(offset);
            const review = reviews[itemIndex];
            const isCenter = offset === 0;

            return (
              <div
                key={`${itemIndex}-${offset}`}
                onClick={() => {
                  if (offset === -1) prevSlide();
                  if (offset === 1) nextSlide();
                }}
                className={`transition-all duration-500 ease-in-out cursor-pointer rounded-3xl p-6 sm:p-8 border relative ${
                  isCenter
                    ? "z-20 bg-white border-emerald-100 shadow-2xl shadow-emerald-950/10 scale-100 opacity-100 blur-0 w-full max-w-[420px] sm:max-w-[500px]"
                    : "z-10 bg-gray-50/80 border-gray-200/60 shadow-sm scale-90 sm:scale-95 opacity-40 blur-[2px] hidden md:block w-full max-w-[340px] hover:opacity-60"
                }`}
              >
                <Quote
                  size={40}
                  className={`absolute top-6 right-6 pointer-events-none ${
                    isCenter ? "text-emerald-100" : "text-gray-200"
                  }`}
                />

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>

                {/* Review Message */}
                <p
                  className={`leading-relaxed mb-6 font-medium ${
                    isCenter
                      ? "text-gray-700 text-base sm:text-lg min-h-[80px]"
                      : "text-gray-500 text-sm line-clamp-3 min-h-[60px]"
                  }`}
                >
                  &quot;{review.text}&quot;
                </p>

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className={`rounded-full object-cover border-2 shadow-sm ${
                      isCenter
                        ? "w-12 h-12 border-emerald-500"
                        : "w-10 h-10 border-gray-300"
                    }`}
                  />
                  <div>
                    <h3
                      className={`font-bold ${
                        isCenter ? "text-gray-900 text-base" : "text-gray-700 text-sm"
                      }`}
                    >
                      {review.name}
                    </h3>
                    <p className="text-xs text-emerald-600 font-medium">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots Pagination */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === index
                  ? "w-8 h-2.5 bg-emerald-600"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

