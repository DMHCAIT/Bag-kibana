"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Phone, Loader2, ArrowLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

function GoogleSignInButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const redirectTo = searchParams.get('redirect') || '/account';

  // Check if Google OAuth is configured
  const isGoogleConfigured = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
    !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID');

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      
      try {
        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Create user with real Google data
        const googleUser = {
          id: `GOOGLE-${userInfo.sub}`,
          email: userInfo.email,
          name: userInfo.name,
          phone: '',
          createdAt: new Date().toISOString(),
          picture: userInfo.picture || '',
        };

        localStorage.setItem('kibana_user', JSON.stringify(googleUser));
        
        setLoading(false);
        router.push(redirectTo);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setLoading(false);
      }
    },
    onError: () => {
      console.error('Google login failed');
      setLoading(false);
    },
  });

  // Don't render if Google OAuth is not configured
  if (!isGoogleConfigured) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => googleLogin()}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </>
      )}
    </Button>
  );
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithOTP, requestOTP, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    otp: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const redirectTo = searchParams.get('redirect') || '/account';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.phone) {
      newErrors.phone = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'Enter a valid 6-digit OTP';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone()) return;

    setLoading(true);
    setErrors({});

    const result = await requestOTP(formData.phone.replace(/\s/g, ''));

    setLoading(false);

    if (result.success) {
      setStep('otp');
      setOtpSent(true);
      setCountdown(30); // 30 seconds countdown
    } else {
      setErrors({ general: result.error || 'Failed to send OTP' });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) return;

    setLoading(true);
    setErrors({});

    const result = await signInWithOTP(formData.phone.replace(/\s/g, ''), formData.otp);

    setLoading(false);

    if (result.success) {
      router.push(redirectTo);
    } else {
      setErrors({ general: result.error || 'Invalid OTP' });
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    const result = await requestOTP(formData.phone.replace(/\s/g, ''));
    setLoading(false);

    if (result.success) {
      setCountdown(30);
      setErrors({});
    } else {
      setErrors({ general: result.error || 'Failed to resend OTP' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-wide">
                {step === 'phone' ? 'Welcome to KIBANA' : 'Verify OTP'}
              </CardTitle>
              <CardDescription>
                {step === 'phone' 
                  ? 'Sign in or create account with your mobile number' 
                  : `Enter the 6-digit OTP sent to +91 ${formData.phone}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'phone' ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  {searchParams.get('message') && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-600">
                        {searchParams.get('message')}
                      </p>
                    </div>
                  )}

                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

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
                        className={`rounded-l-none ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                        disabled={loading}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-red-600">{errors.phone}</p>
                    )}
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

                  {/* Divider - Only show if Google OAuth is configured */}
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
                   !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID') && (
                    <>
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      {/* Google Sign In */}
                      <GoogleSignInButton />
                    </>
                  )}

                  {/* Info text */}
                  <p className="text-xs text-center text-gray-500 mt-4">
                    New user? No problem! An account will be created automatically with your first login.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setStep('phone')}
                      className="p-0 h-auto"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  </div>

                  {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
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
                      className={`text-center text-lg tracking-widest ${errors.otp ? 'border-red-300 focus:border-red-500' : ''}`}
                      disabled={loading}
                    />
                    {errors.otp && (
                      <p className="text-sm text-red-600">{errors.otp}</p>
                    )}
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
                      'Verify & Sign In'
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
            </CardContent>
          </Card>
        </div>
      </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }>
        <SignInForm />
      </Suspense>
      <Footer />
    </>
  );
}

