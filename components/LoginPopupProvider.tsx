"use client";

import { useState, useEffect } from "react";
import LoginPopup from "@/components/LoginPopup";

export default function LoginPopupProvider() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    // Show popup after a short delay when page loads
    const timer = setTimeout(() => {
      // Check if user has already seen the popup in this session
      const hasSeenPopup = sessionStorage.getItem("hasSeenLoginPopup");
      if (!hasSeenPopup) {
        setShowLoginPopup(true);
      }
    }, 1000); // Show after 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    // Mark that user has seen the popup in this session
    sessionStorage.setItem("hasSeenLoginPopup", "true");
  };

  return (
    <LoginPopup 
      isOpen={showLoginPopup} 
      onClose={handleClosePopup} 
    />
  );
}