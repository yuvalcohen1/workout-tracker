import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../types/auth';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  // Password validation function
  const validatePassword = (value: string) => {
    const requirements = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[@$!%*?&]/.test(value),
    };

    const failedRequirements = [];
    if (!requirements.length) failedRequirements.push('at least 8 characters');
    if (!requirements.uppercase) failedRequirements.push('one uppercase letter');
    if (!requirements.lowercase) failedRequirements.push('one lowercase letter');
    if (!requirements.number) failedRequirements.push('one number');
    if (!requirements.special) failedRequirements.push('one special character (@$!%*?&)');

    if (failedRequirements.length > 0) {
      return `Password must contain ${failedRequirements.join(', ')}`;
    }
    return true;
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setApiError(null);
      await registerUser(data.email, data.password);
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error) {
      const apiError = error as ApiError;
      
      // Handle validation errors from backend
      if (apiError.details && apiError.details.length > 0) {
        const errorMessages = apiError.details.map(detail => detail.message).join('. ');
        setApiError(errorMessages);
      } else {
        setApiError(apiError.message || 'Registration failed. Please try again.');
      }
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    switch (score) {
      case 0:
      case 1:
        return { strength: 20, label: 'Very Weak', color: 'bg-red-500' };
      case 2:
        return { strength: 40, label: 'Weak', color: 'bg-orange-500' };
      case 3:
        return { strength: 60, label: 'Fair', color: 'bg-yellow-500' };
      case 4:
        return { strength: 80, label: 'Good', color: 'bg-blue-500' };
      case 5:
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
      default:
        return { strength: 0, label: '', color: '' };
    }
  };

  const passwordStrength = getPasswordStrength(password || '');

  return (
    <AuthLayout
      title="Join FitForge"
      subtitle="Create your account and start your transformation"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* API Error Display */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-medium">Registration Failed</p>
              <p className="text-red-300 text-sm mt-1">{apiError}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Please enter a valid email address',
            },
          })}
        />

        {/* Password Field */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              icon={<Lock className="w-5 h-5" />}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                validate: validatePassword,
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Password Strength:</span>
                <span className={`text-sm font-medium ${
                  passwordStrength.strength >= 80 ? 'text-green-400' : 
                  passwordStrength.strength >= 60 ? 'text-blue-400' :
                  passwordStrength.strength >= 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            icon={<Lock className="w-5 h-5" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            className="mt-1 h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 bg-gray-700 rounded"
            {...register('agreeToTerms', {
              required: 'You must agree to the terms and conditions',
            })}
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
            I agree to the{' '}
            <Link to="/terms" className="text-orange-400 hover:text-orange-300 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-orange-400 hover:text-orange-300 underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-400 mt-1">
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Register Button */}
        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create Account
        </Button>

        {/* Benefits Section */}
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
            What you'll get:
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
              Personalized workout plans
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
              Progress tracking and analytics
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
              Expert fitness guidance
            </li>
            <li className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
              Community support and challenges
            </li>
          </ul>
        </div>

        {/* Sign In Link */}
        <div className="text-center pt-6 border-t border-gray-700">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-orange-400 hover:text-orange-300 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};