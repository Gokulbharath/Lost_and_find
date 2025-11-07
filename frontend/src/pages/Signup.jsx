import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../components/Toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: '',
  });

  const validateForm = () => {
    const newErrors = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', agreeToTerms: '' };
    let isValid = true;
    if (!formData.fullName.trim()) { newErrors.fullName = 'Full name is required'; isValid = false; }
    if (!formData.email) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!formData.email.includes('@')) { newErrors.email = 'Please enter a valid email'; isValid = false; }
    if (!formData.password) { newErrors.password = 'Password is required'; isValid = false; }
    else if (formData.password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; isValid = false; }
    if (!formData.confirmPassword) { newErrors.confirmPassword = 'Please confirm your password'; isValid = false; }
    else if (formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Passwords do not match'; isValid = false; }
    if (!formData.agreeToTerms) { newErrors.agreeToTerms = 'You must agree to the terms and conditions'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    console.log("jsp --- ", formData.email);

  const obj = { email: formData.email, password: formData.password, full_name: formData.fullName, phone: formData.phone || null };

    try {
      const { error } = await signUp(obj);
      if (error) {
        showToast(error.message || 'Failed to create account', 'error');
      } else {
        showToast('Account created successfully!', 'success');
        navigate('/');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="form">
          <div className="title">
            Join the Network,<br />
            <span>create your account</span>
          </div>

          <div className={`field ${errors.fullName ? 'error' : ''}`}>
            <User className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              className="input-field"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </div>
          {errors.fullName && <div className="error-message">{errors.fullName}</div>}

          <div className={`field ${errors.email ? 'error' : ''}`}>
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}

          <div className={`field ${errors.phone ? 'error' : ''}`}>
            <Phone className="input-icon" />
            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              name="phone"
              className="input-field"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          {errors.phone && <div className="error-message">{errors.phone}</div>}

          <div className={`field ${errors.password ? 'error' : ''}`} style={{ position: 'relative' }}>
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#d3d3d3'
              }}
            >
              {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
          {errors.password && <div className="error-message">{errors.password}</div>}

          <div className={`field ${errors.confirmPassword ? 'error' : ''}`} style={{ position: 'relative' }}>
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              name="confirmPassword"
              className="input-field"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              style={{ paddingRight: '40px' }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '15px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#d3d3d3'
              }}
            >
              {showConfirmPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}

          <div className="checkbox-field">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
            />
            <label>
              I agree to the{' '}
              <a href="#">Terms & Conditions</a>
            </label>
          </div>
          {errors.agreeToTerms && <div className="error-message">{errors.agreeToTerms}</div>}

          <button type="submit" className="button-confirm" disabled={loading}>
            {loading ? 'Creating account...' : "Let's go →"}
          </button>

          <div className="link-text">
            Already have an account?{' '}
            <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}


