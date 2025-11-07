import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../components/Toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const patternUrl = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    if (!email) { newErrors.email = 'Email is required'; isValid = false; }
    else if (!email.includes('@')) { newErrors.email = 'Please enter a valid email'; isValid = false; }
    if (!password) { newErrors.password = 'Password is required'; isValid = false; }
    else if (password.length < 6) { newErrors.password = 'Password must be at least 6 characters'; isValid = false; }
    setErrors(newErrors); return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { error, user } = await signIn(email, password);
      if (error) {
        showToast(error.message || 'Invalid email or password', 'error');
      } else {
        showToast('Login successful!', 'success');
        if (user?.isAdmin) navigate('/admin'); else navigate('/');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="form">
          <p id="heading">Login</p>

          <div className={`field ${errors.email ? 'error' : ''}`}>
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}

          <div className={`field ${errors.password ? 'error' : ''}`} style={{ position: 'relative' }}>
            <Lock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="btn">
            <button type="submit" className="button1" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <Link to="/signup" className="button2" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Sign Up
            </Link>
          </div>

          <Link to="/forgot-password" className="button3" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Forgot Password
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
}


