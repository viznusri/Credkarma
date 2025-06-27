import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { auth } from '../services/api';
import { RegisterData } from '../types';
import { AxiosError } from 'axios';

const schema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  role: yup.string().required('Role is required').oneOf(['user', 'admin'] as const, 'Please select a valid role') as yup.StringSchema<'user' | 'admin'>
}).required();

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterData>({
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions to continue');
      return;
    }
    
    try {
      const response = await auth.register(data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome to CREDKarma! 🚀');
      const defaultPath = response.data.user.role === 'admin' ? '/routes/dashboard' : '/routes/feed';
      setTimeout(() => {
        window.location.href = defaultPath;
      }, 1000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  React.useEffect(() => {
    // Create animated particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = Math.random() * 10 + 10 + 's';
      particle.style.animationDelay = Math.random() * 5 + 's';
      document.querySelector('.particles')?.appendChild(particle);
      
      setTimeout(() => particle.remove(), 20000);
    };
    
    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="auth-page-modern">
      <div className="particles"></div>
      <div className="auth-split-container">
        <div className="auth-left-panel">
          <div className="auth-welcome-content">
            <h1 className="auth-welcome-title">
              Join <span className="brand-highlight">CREDKarma</span>
            </h1>
            <p className="auth-welcome-subtitle">
              Start your journey to better behaviors and amazing rewards.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <div className="feature-icon"><i className="fas fa-rocket"></i></div>
                <p>Quick sign-up process</p>
              </div>
              <div className="auth-feature">
                <div className="feature-icon"><i className="fas fa-shield-alt"></i></div>
                <p>Secure and private</p>
              </div>
              <div className="auth-feature">
                <div className="feature-icon"><i className="fas fa-gift"></i></div>
                <p>Instant rewards access</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="auth-right-panel">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Create your account</h2>
              <p className="auth-form-subtitle">
                Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form-modern">
              <div className="form-group-modern">
                <label className="form-label" htmlFor="username">
                  Username
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-user input-icon-left"></i>
                  <input
                    id="username"
                    type="text"
                    {...register('username')}
                    className={`form-input with-icon ${errors.username ? 'input-error' : ''}`}
                    placeholder="Choose a username"
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <span className="error-message">{errors.username.message}</span>
                )}
              </div>

              <div className="form-group-modern">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope input-icon-left"></i>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`form-input with-icon ${errors.email ? 'input-error' : ''}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              <div className="form-group-modern">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-lock input-icon-left"></i>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`form-input with-icon ${errors.password ? 'input-error' : ''}`}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password.message}</span>
                )}
              </div>

              <div className="form-group-modern">
                <label className="form-label" htmlFor="role">
                  Account Type
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-user-tag input-icon-left"></i>
                  <select
                    id="role"
                    {...register('role')}
                    className={`form-input with-icon ${errors.role ? 'input-error' : ''}`}
                    defaultValue=""
                  >
                    <option value="" disabled>Select account type</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {errors.role && (
                  <span className="error-message">{errors.role.message}</span>
                )}
              </div>

              <div className="checkbox-group-modern">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom">
                    <i className="fas fa-check"></i>
                  </span>
                  <span className="checkbox-text">
                    I agree to the <Link to="/terms" className="terms-link">Terms and Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </span>
                </label>
                {!acceptedTerms && isSubmitting && (
                  <span className="error-message">You must accept the terms and conditions</span>
                )}
              </div>

              <button 
                type="submit" 
                className="submit-button-modern"
                disabled={isSubmitting || !acceptedTerms}
              >
                {isSubmitting ? (
                  <ClipLoader size={18} color="#fff" />
                ) : (
                  <>
                    Create account
                    <i className="fas fa-arrow-right button-icon"></i>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;