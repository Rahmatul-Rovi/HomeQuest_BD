"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Farhana Akter",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    text: "Found a 2-bedroom flat within 3 days. The owner was already verified so I felt safe booking a visit.",
    avatar: "https://i.pravatar.cc/150?img=47",
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
    avatar: "https://i.pravatar.cc/150?img=32",
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

