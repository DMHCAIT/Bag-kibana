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
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would call your backend API here
      // For demo purposes, we'll simulate success
      console.log("OTP sent to:", `+91${mobile}`);
      setOtpSent(true);
      setStep('otp');
      setCountdown(30); // 30 seconds countdown
      
      // Show user the OTP for demo (remove in production)
      alert(`Demo OTP sent! Use: 123456`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In demo, accept 123456 as valid OTP
      if (otp === "123456") {
        console.log("Login successful for:", `+91${mobile}`);
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userMobile', mobile);
        alert("Welcome to Kibana! You're now logged in.");
        onClose();
      } else {
        alert("Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = () => {
    if (countdown === 0) {
      sendOTP();
    }
  };

  const handleGoogleLogin = () => {
    // In a real app, you would integrate with Google OAuth
    console.log("Google login initiated");
    alert("Google login would be initiated here. For demo, logging you in...");
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userLoginMethod', 'google');
    onClose();
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
            {step === 'mobile' ? 'Join Kibana' : 'Verify Your Number'}
          </h3>
          <p className="text-gray-600">
            {step === 'mobile' 
              ? 'Get 20% off your first order.' 
              : `We sent OTP to +91${mobile}`
            }
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

            {/* Or Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-1 border-gray-300" />
              <span className="px-4 text-sm text-gray-500">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
          </>
        ) : (
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