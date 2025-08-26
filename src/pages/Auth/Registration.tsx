import React, { useState, useEffect } from 'react';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, Link2,
  TrendingUp, Check, CheckCircle2, AlertCircle
} from 'lucide-react';
import { authService } from '../../services/auth';
import { Link, useNavigate } from 'react-router-dom';


export const Registration: React.FC = () => {
  const [accountType, setAccountType] = useState<'END_USER' | 'CREATOR'>('END_USER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const validatePassword = (pwd: string) => {
    const errors = [];
    if (pwd.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(pwd)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(pwd)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    return errors;
  };

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true); // Don't show error if confirm password is empty
    }
  }, [password, confirmPassword]);

  const handleSubmit = async () => {
    setError('');

    if (!firstName.trim()) {
      setError('First name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    // Validate password requirements
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('. '));
      return;
    }

    if (!confirmPassword || !passwordsMatch) {
      setError('Please ensure passwords match');
      return;
    }

    try {
      setIsLoading(true);

      const formData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        countryCode: '91',
        phone: phone.trim() || undefined,
        password,
        confirmPassword,
        userType: accountType,
      };

      console.log('Registration attempt:', formData);

      // Call the auth service
      const response = await authService.register(formData);

      if (response.success) {
        console.log('Registration successful:', response);
        // Handle successful registration
        setTimeout(() => {
          navigate("/login");
        }, 500)

        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setAccountType('END_USER');

      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-[34px] font-bold"
            style={{ color: '#1F54B0' }}
          >
            Create Account
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {/* User Type Selection */}
          <div>
            <h3 className="text-[20px] font-medium text-[#1F54B0] mb-4">
              Choose your account type
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <label className="relative block">
                <input
                  type="radio"
                  name="accountType"
                  value="END_USER"
                  checked={accountType === 'END_USER'}
                  onChange={() => setAccountType('END_USER')}
                  className="sr-only peer"
                />
                <div className="relative p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-md peer-checked:border-blue-500 peer-checked:bg-gradient-to-br peer-checked:from-blue-50 peer-checked:to-cyan-50 peer-checked:shadow-lg group">
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 opacity-0 peer-checked:opacity-100 transition-all duration-200" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Link2 className="w-7 h-7 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Personal Link Hub
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Perfect for individuals who want one memorable link for all their social profiles
                      </p>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Check className="w-3 h-3 text-blue-500" />
                          <span>One link for all your social profiles</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Check className="w-3 h-3 text-blue-500" />
                          <span>Basic click tracking</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative block">
                <input
                  type="radio"
                  name="accountType"
                  value="CREATOR"
                  checked={accountType === 'CREATOR'}
                  onChange={() => setAccountType('CREATOR')}
                  className="sr-only peer"
                />
                <div className="relative p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-md peer-checked:border-blue-500 peer-checked:bg-gradient-to-br peer-checked:from-purple-50 peer-checked:to-blue-50 peer-checked:shadow-lg group">
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 opacity-0 peer-checked:opacity-100 transition-all duration-200" />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-7 h-7 text-purple-600" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        Creator & Business
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        For influencers, creators & businesses who monetize their audience
                      </p>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Check className="w-3 h-3 text-purple-500" />
                          <span>Advanced analytics & insights</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Check className="w-3 h-3 text-purple-500" />
                          <span>Priority support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[20px] font-medium mb-1"
                style={{ color: '#1F54B0' }}
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  style={{ borderColor: '#1F54B0' }}
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-[20px] font-medium mb-1"
                style={{ color: '#1F54B0' }}
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  style={{ borderColor: '#1F54B0' }}
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[20px] font-medium mb-1"
              style={{ color: '#1F54B0' }}
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Mail className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                style={{ borderColor: '#1F54B0' }}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-[20px] font-medium mb-1"
              style={{ color: '#1F54B0' }}
            >
              Phone Number <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="appearance-none block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                style={{ borderColor: '#1F54B0' }}
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[20px] font-medium mb-1"
                style={{ color: '#1F54B0' }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="appearance-none block w-full pl-10 pr-10 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  style={{ borderColor: '#1F54B0' }}
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[20px] font-medium mb-1"
                style={{ color: '#1F54B0' }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`appearance-none block w-full pl-10 pr-10 py-3 border placeholder-gray-500 text-gray-900 rounded-md 
                   focus:outline-none focus:ring-2 sm:text-sm ${confirmPassword && !passwordsMatch
                      ? 'border-red-500 focus:ring-red-500'
                      : confirmPassword && passwordsMatch
                        ? ''
                        : 'focus:ring-blue-500'
                    }`}
                  style={{
                    borderColor: confirmPassword
                      ? (passwordsMatch ? '' : '#ef4444')
                      : '#1F54B0'
                  }}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Match Feedback */}
              {confirmPassword && !passwordsMatch && (
                <div className="mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Passwords not match</span>
                </div>
              )}

            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="button"
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-[20px] font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              style={{ backgroundColor: '#1F54B0' }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium hover:underline"
              style={{ color: '#1F54B0' }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};