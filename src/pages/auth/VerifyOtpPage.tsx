import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^\d{6}$/, 'OTP must be exactly 6 digits')
});

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyOtp, tempEmail, setTempEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!tempEmail) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tempEmail, navigate]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (values: { otp: string }, { setSubmitting, setFieldError }: any) => {
    try {
      setIsLoading(true);
      await verifyOtp(tempEmail!, values.otp);
      toast.success('Email verified successfully! Welcome to NutriCare.');
      navigate('/', { replace: true });
    } catch (error: any) {
      const errorMessage = error.message || 'Verification failed';
      
      if (errorMessage.includes('Invalid or expired OTP')) {
        setFieldError('otp', 'Invalid or expired verification code');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      // Call the resend OTP API endpoint
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: tempEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setTimeLeft(300);
      setCanResend(false);
      toast.success('New verification code sent to your email');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit verification code to<br />
              <span className="font-medium text-gray-900">{tempEmail}</span>
            </p>
          </div>

          <Formik
            initialValues={{ otp: '' }}
            validationSchema={OtpSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <Field
                    id="otp"
                    name="otp"
                    type="text"
                    maxLength={6}
                    className={`w-full px-3 py-2 border ${
                      errors.otp && touched.otp ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                    placeholder="Enter 6-digit code"
                    disabled={isLoading}
                  />
                  <ErrorMessage name="otp" component="p" className="mt-1 text-sm text-red-500" />
                </div>

                <div className="text-center text-sm text-gray-600">
                  {timeLeft > 0 ? (
                    <p>Code expires in {formatTime(timeLeft)}</p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isLoading}
                      className="text-teal-600 hover:text-teal-800 font-medium disabled:opacity-50"
                    >
                      Resend verification code
                    </button>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setTempEmail('')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;