import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, BarChart3, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { loginUser } from '../utils/api';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

const FEATURES = [
  'Create 5 types of interactive polls',
  'Real-time vote results & analytics',
  'Bookmark & organize your favorites',
  'Manage and close your polls anytime',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.user);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#080b14' }}>
      {/* Ambient orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* Left decorative panel */}
      <div
        className="hidden lg:flex flex-col justify-between relative overflow-hidden"
        style={{ width: '48%', padding: '60px 64px' }}
      >
        {/* Subtle mesh gradient */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.1) 0%, transparent 50%)',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(124,58,237,0.4)',
            }}
          >
            <BarChart3 size={22} color="white" />
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

        {/* Hero content */}
        <div className="relative z-10">
          <div
            className="float"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: '99px',
              padding: '6px 14px',
              marginBottom: '24px',
            }}
          >
            <Sparkles size={14} color="#a78bfa" />
            <span style={{ fontSize: '0.8125rem', color: '#a78bfa', fontWeight: 600 }}>Community Polling Platform</span>
          </div>

          <h2
            style={{
              fontSize: '2.75rem',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#e8edf8',
              marginBottom: '16px',
            }}
          >
            Create & Share<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              Polls Instantly
            </span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#8899b8', lineHeight: 1.7, marginBottom: '36px', maxWidth: '380px' }}>
            Build interactive polls, gather community opinions, and get real-time insights from your audience.
          </p>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div
                  style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle size={12} color="#10b981" />
                </div>
                <span style={{ fontSize: '0.875rem', color: '#8899b8' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="relative z-10">
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '-6px' }}>
              {['#7c3aed','#2563eb','#06b6d4'].map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c}, ${c}88)`,
                    border: '2px solid #080b14',
                    marginLeft: i > 0 ? '-8px' : 0,
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#8899b8' }}>
              <span style={{ color: '#e8edf8', fontWeight: 700 }}>2,400+</span> polls created by our community
            </p>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div
        className="flex-1 flex items-center justify-center relative z-10"
        style={{ padding: '40px 32px' }}
      >
        <div className="w-full fade-up" style={{ maxWidth: '420px' }}>
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <BarChart3 size={18} color="white" />
            </div>
            <span className="gradient-text" style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>Poolly</span>
          </div>

          {/* Form card */}
          <div
            style={{
              background: 'rgba(15, 22, 45, 0.8)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: '36px',
              backdropFilter: 'blur(30px)',
            }}
          >
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                Welcome back
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#8899b8' }}>Sign in to your Poolly account</p>
            </div>

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#c4cfe4', marginBottom: '8px' }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4d607e' }} />
                  <input
                    id="login-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
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
                  <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4d607e' }} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
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
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      color: '#4d607e', background: 'none', border: 'none', cursor: 'pointer',
                      padding: '4px', transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#8899b8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#4d607e'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '5px' }}>{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  paddingTop: '13px',
                  paddingBottom: '13px',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  marginTop: '4px',
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)', margin: '24px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8899b8' }}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
                onMouseLeave={e => e.currentTarget.style.color = '#a78bfa'}
              >
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
