"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  title: string;
  text: string;
  image: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Nayana Singh",
    title: "Three - some bag for a reason!",
    text: "This threesome bag was super comfortable and convenient. Roomy and lightweight and nothing happened to the bag even in the rain.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 4,
  },
  {
    id: 2,
    name: "Anushree Sardesi",
    title: "Three Ways to Carry",
    text: "I've been carrying this bag all day, and can convert from backpack to sling to a tote and its super lightweight !",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
  {
    id: 3,
    name: "Prerna Agrawal",
    title: "Wedding favourite",
    text: "A tiny bag with surprisingly generous space. Wore it to a wedding, and the compliments haven't stopped, this has become my new favourite !!",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=150&h=150&q=80",
    rating: 5,
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title mb-4">REVIEW PART</h2>
        <p className="subtitle text-center mb-12">WHAT ARE OUR CUSTOMERS SAYING?</p>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-300 ${
                  index === currentIndex ? "ring-2 ring-black scale-105" : "opacity-70"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                    <Image
                      src={review.image}
                      alt={review.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-base mb-1">{review.name}</h3>
                    <p className="text-sm font-poppins text-gray-600 mb-2">{review.title}</p>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "fill-black text-black"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm font-poppins text-gray-700 leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevReview}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-black w-8" : "bg-gray-300"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextReview}
              className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-colors duration-300"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
