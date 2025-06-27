import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { auth } from '../services/api';
import { LoginCredentials } from '../types';
import { AxiosError } from 'axios';

const schema = yup.object({
  username: yup.string().required('Username or email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
}).required();

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginCredentials>({
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
    try {
      const response = await auth.login(data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Welcome back! 🎉');
      const defaultPath = response.data.user.role === 'admin' ? '/routes/dashboard' : '/routes/feed';
      setTimeout(() => {
        window.location.href = defaultPath;
      }, 1000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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
              Welcome to <span className="brand-highlight">CREDKarma</span>
            </h1>
            <p className="auth-welcome-subtitle">
              Track your behaviors, earn rewards, and build your karma score.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <div className="feature-icon"><i className="fas fa-check-circle"></i></div>
                <p>Track positive behaviors</p>
              </div>
              <div className="auth-feature">
                <div className="feature-icon"><i className="fas fa-bullseye"></i></div>
                <p>Earn exclusive rewards</p>
              </div>
              <div className="auth-feature">
                <div className="feature-icon"><i className="fas fa-chart-line"></i></div>
                <p>Build your karma score</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="auth-right-panel">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Sign in to your account</h2>
              <p className="auth-form-subtitle">
                Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form-modern">
              <div className="form-group-modern">
                <label className="form-label" htmlFor="username">
                  Username or Email
                </label>
                <div className="input-with-icon">
                  <i className="fas fa-user input-icon-left"></i>
                  <input
                    id="username"
                    type="text"
                    {...register('username')}
                    className={`form-input with-icon ${errors.username ? 'input-error' : ''}`}
                    placeholder="Enter your username or email"
                    autoComplete="username"
                  />
                </div>
                {errors.username && (
                  <span className="error-message">{errors.username.message}</span>
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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

              <button 
                type="submit" 
                className="submit-button-modern"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ClipLoader size={18} color="#fff" />
                ) : (
                  <>
                    Sign in
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

export default Login;