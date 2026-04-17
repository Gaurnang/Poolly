import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AtSign, BarChart3, ArrowRight, Zap } from 'lucide-react';
import { registerUser } from '../utils/api';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username) e.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Only letters, numbers, underscores';
    else if (form.username.length < 3) e.username = 'At least 3 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(res.data.user || res.data);
      toast.success('Account created! Welcome to Poolly 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const iconStyle = { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4d607e' };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: '#080b14', padding: '40px 20px' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <div className="w-full relative z-10 fade-up" style={{ maxWidth: '440px' }}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(124,58,237,0.4)',
            }}
          >
            <BarChart3 size={20} color="white" />
          </div>
          <span
            style={{
              fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            Poolly
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(15, 22, 45, 0.85)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '22px',
            padding: '36px',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '26px', textAlign: 'center' }}>
            <div
              className="float"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: '99px', padding: '5px 14px', marginBottom: '14px',
              }}
            >
              <Zap size={12} color="#a78bfa" />
              <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>Free forever</span>
            </div>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em', marginBottom: '6px' }}>
              Create your account
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#8899b8' }}>Join thousands of poll creators today</p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#c4cfe4', marginBottom: '8px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <AtSign size={15} style={iconStyle} />
                <input
                  id="signup-username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter your username"
                  className="input-field"
                  style={{
                    width: '100%', paddingLeft: '40px', paddingRight: '16px',
                    paddingTop: '11px', paddingBottom: '11px', borderRadius: '10px',
                    borderColor: errors.username ? 'rgba(239,68,68,0.5)' : undefined,
                  }}
                />
              </div>
              {errors.username && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#c4cfe4', marginBottom: '8px' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={iconStyle} />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="input-field"
                  style={{
                    width: '100%', paddingLeft: '40px', paddingRight: '16px',
                    paddingTop: '11px', paddingBottom: '11px', borderRadius: '10px',
                    borderColor: errors.email ? 'rgba(239,68,68,0.5)' : undefined,
                  }}
                />
              </div>
              {errors.email && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#c4cfe4', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="input-field"
                  style={{
                    width: '100%', paddingLeft: '40px', paddingRight: '44px',
                    paddingTop: '11px', paddingBottom: '11px', borderRadius: '10px',
                    borderColor: errors.password ? 'rgba(239,68,68,0.5)' : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4d607e', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#c4cfe4', marginBottom: '8px' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={iconStyle} />
                <input
                  id="signup-confirm-password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password"
                  className="input-field"
                  style={{
                    width: '100%', paddingLeft: '40px', paddingRight: '16px',
                    paddingTop: '11px', paddingBottom: '11px', borderRadius: '10px',
                    borderColor: errors.confirmPassword ? 'rgba(239,68,68,0.5)' : undefined,
                  }}
                />
              </div>
              {errors.confirmPassword && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', paddingTop: '13px', paddingBottom: '13px', borderRadius: '10px', fontSize: '0.9375rem', marginTop: '4px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '22px 0' }} />

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8899b8' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
              onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
