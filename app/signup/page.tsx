"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft, User, Mail, Phone, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const { signUpWithOTP, requestOTP } = useAuth();
  
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.phone.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      setError("Please enter a valid 10-digit Indian mobile number");
      return false;
    }
    
    return true;
  };

  const validateOTP = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return false;
    }
    return true;
  };
  
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestOTP(formData.phone.replace(/\s/g, ""));
      
      if (result.success) {
        setStep('otp');
        setCountdown(30);
      } else {
        setError(result.error || "Failed to send OTP");
      }
    } catch (error) {
      setError("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await signUpWithOTP(
        formData.name,
        formData.email,
        formData.phone.replace(/\s/g, ""),
        formData.otp
      );
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/account");
        }, 2000);
      } else {
        setError(result.error || "Failed to verify OTP");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    const result = await requestOTP(formData.phone.replace(/\s/g, ""));
    setLoading(false);

    if (result.success) {
      setCountdown(30);
      setError(null);
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-wide">
                {step === 'details' ? 'Create Account' : 'Verify OTP'}
              </CardTitle>
              <CardDescription>
                {step === 'details' 
                  ? 'Join KIBANA and start shopping' 
                  : `Enter the 6-digit OTP sent to +91 ${formData.phone}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-600 mb-2">Account Created Successfully!</h3>
                    <p className="text-gray-600">Redirecting to your account...</p>
                  </div>
                </div>
              ) : step === 'details' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +91
                      </span>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        className="rounded-l-none"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500">You'll use this number to sign in with OTP</p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full uppercase tracking-wider bg-black text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep('details')}
                      className="p-0 h-auto"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP</Label>
                    <Input
                      id="otp"
                      name="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                      disabled={loading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full uppercase tracking-wider bg-black text-white hover:bg-gray-800"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Didn't receive the OTP?
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      className="text-black hover:bg-gray-100"
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                    </Button>
                  </div>
                </form>
              )}

              {!success && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link 
                      href="/signin" 
                      className="text-black hover:underline font-medium"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}