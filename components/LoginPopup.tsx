"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'mobile' | 'otp' | 'profile'>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobile
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP sent to:", `+91${mobile}`);
        setOtpSent(true);
        setStep('otp');
        setCountdown(30); // 30 seconds countdown
        
        // Show success message
        alert(`OTP sent successfully to +91${mobile}`);
        
        // In development mode, show the OTP if returned by API
        if (data.otp && process.env.NODE_ENV === 'development') {
          console.log('Dev OTP:', data.otp);
        }
      } else {
        console.error("Error sending OTP:", data.error);
        alert(data.error || "Error sending OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobile,
          otp: otp
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("OTP verified successfully for:", `+91${mobile}`);
        
        // Store user data in localStorage
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userMobile', mobile);
        localStorage.setItem('userPhone', data.phone);
        localStorage.setItem('isNewUser', data.isNewUser.toString());
        
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        // Check if this is a new user and needs profile completion
        setIsNewUser(data.isNewUser);
        
        if (data.isNewUser && !data.user?.full_name) {
          // New user - show profile completion step
          setStep('profile');
          setIsLoading(false);
          return;
        }

        // Existing user or profile already complete
        if (data.isNewUser) {
          alert("Welcome to Kibana! Your account has been created successfully. Enjoy 30% off your first order!");
        } else {
          alert("Welcome back to Kibana!");
        }
        
        onClose();
        
        // Optionally refresh the page to update login state
        window.location.reload();
      } else {
        console.error("Error verifying OTP:", data.error);
        alert(data.error || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobile,
          full_name: fullName,
          email: email || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Profile completed for:", `+91${mobile}`);
        
        // Update localStorage with complete user data
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
        }

        alert("Welcome to Kibana! Your profile has been completed. Enjoy 30% off your first order!");
        onClose();
        
        // Refresh to update login state
        window.location.reload();
      } else {
        console.error("Error completing profile:", data.error);
        alert(data.error || "Error saving profile. Please try again.");
      }
    } catch (error) {
      console.error("Error completing profile:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim().length >= 2) {
      completeProfile();
    }
  };

  const resendOTP = () => {
    if (countdown === 0) {
      sendOTP();
    }
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10) {
      sendOTP();
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyOTP();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif tracking-[0.15em] mb-4 text-black">KIBANA</h2>
          <h3 className="text-xl font-medium mb-2">
            {step === 'mobile' && 'Join Kibana'}
            {step === 'otp' && 'Verify Your Number'}
            {step === 'profile' && 'Complete Your Profile'}
          </h3>
          <p className="text-gray-600">
            {step === 'mobile' && 'Get 30% off your first order.'} 
            {step === 'otp' && `We sent OTP to +91${mobile}`}
            {step === 'profile' && 'Just a few more details to get started.'}
          </p>
        </div>

        {step === 'mobile' ? (
          <>
            {/* Mobile Number Form */}
            <form onSubmit={handleMobileSubmit} className="space-y-6">
              <div className="flex">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-3 rounded-l-lg border border-r-0">
                  <span className="text-lg">🇮🇳</span>
                  <span className="font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  placeholder="Enter Your Number"
                  maxLength={10}
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={mobile.length !== 10 || isLoading}
                className="w-full bg-black text-white py-4 rounded-lg uppercase tracking-wider text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'SENDING OTP...' : 'SEND OTP'}
              </button>
            </form>
          </>
        ) : step === 'otp' ? (
          <>
            {/* OTP Form */}
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg text-center tracking-widest"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={otp.length !== 6 || isLoading}
                className="w-full bg-black text-white py-4 rounded-lg uppercase tracking-wider text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'VERIFYING...' : 'VERIFY OTP'}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-4">
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {countdown}s
                </p>
              ) : (
                <button
                  onClick={resendOTP}
                  className="text-sm text-black font-medium hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            {/* Back Button */}
            <button
              onClick={() => {setStep('mobile'); setOtp(''); setOtpSent(false);}}
              className="w-full mt-4 text-sm text-gray-600 hover:text-black transition-colors"
            >
              ← Change mobile number
            </button>
          </>
        ) : (
          <>
            {/* Profile Completion Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  placeholder="Full Name *"
                  required
                  disabled={isLoading}
                  minLength={2}
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                  placeholder="Email (Optional)"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={fullName.trim().length < 2 || isLoading}
                className="w-full bg-black text-white py-4 rounded-lg uppercase tracking-wider text-sm font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'SAVING...' : 'COMPLETE PROFILE'}
              </button>
            </form>

            {/* Skip Option */}
            <button
              onClick={() => {
                alert("Welcome to Kibana! Enjoy 30% off your first order!");
                onClose();
                window.location.reload();
              }}
              className="w-full mt-4 text-sm text-gray-600 hover:text-black transition-colors"
            >
              Skip for now
            </button>
          </>
        )}

        {/* Terms */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our Terms & Conditions
          </p>
        </div>
      </div>
    </div>
  );
}