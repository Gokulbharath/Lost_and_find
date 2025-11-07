import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { useToast } from '../components/Toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) { setError('Email is required'); return false; }
    if (!email.includes('@')) { setError('Please enter a valid email'); return false; }
    setError(''); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setLoading(true);
    try {
      const { error: err } = await resetPassword(email);
      if (err) {
        showToast(err.message || 'Failed to send reset email', 'error');
      } else {
        setSubmitted(true);
        showToast('Password reset link sent to your email!', 'success');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-colors duration-300 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <form className="form" style={{ pointerEvents: 'none' }}>
            <div className="title">
              Check Your Email<br />
              <span>Password reset link sent</span>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1em', marginBottom: '2em' }}>
              <Mail className="input-icon" style={{ width: '3em', height: '3em', margin: '0 auto', color: '#4ade80' }} />
            </div>
            <p style={{ color: '#d3d3d3', textAlign: 'center', fontSize: '0.9em', marginBottom: '2em' }}>
              We've sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Link to="/login" className="button-confirm" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', pointerEvents: 'auto' }}>
              <ArrowLeft style={{ width: '1em', height: '1em' }} />
              Back to Login
            </Link>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className="form">
          <p id="heading">Forgot Password?</p>

          <div className={`field ${error ? 'error' : ''}`}>
            <Mail className="input-icon" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
            />
          </div>
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="button-confirm" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <Link to="/login" className="button3" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em' }}>
            <ArrowLeft style={{ width: '1em', height: '1em' }} />
            Back to Login
          </Link>
        </form>
      </div>
      <Footer />
    </div>
  );
}


