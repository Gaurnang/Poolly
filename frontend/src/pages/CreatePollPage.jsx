import { useState, useRef } from 'react';
import {
  CheckCircle, Star, MessageSquare, Image, ToggleLeft,
  Plus, Trash2, Upload, Sparkles, ArrowLeft, ChevronRight, Zap
} from 'lucide-react';
import { createPoll, getUser } from '../utils/api';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const POLL_TYPES = [
  {
    value: 'single-choice', label: 'Single Choice', icon: CheckCircle,
    desc: 'Let users pick one from multiple options',
    gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    glow: 'rgba(124,58,237,0.35)',
    badge: '#a78bfa',
  },
  {
    value: 'yes/no', label: 'Yes / No', icon: ToggleLeft,
    desc: 'Simple binary choice — yes or no',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16,185,129,0.35)',
    badge: '#6ee7b7',
  },
  {
    value: 'rating', label: 'Star Rating', icon: Star,
    desc: 'Rate something on a 1–5 star scale',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glow: 'rgba(245,158,11,0.35)',
    badge: '#fcd34d',
  },
  {
    value: 'open-ended', label: 'Open Ended', icon: MessageSquare,
    desc: 'Collect free-text responses from users',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
    glow: 'rgba(236,72,153,0.35)',
    badge: '#f9a8d4',
  },
];

const defaultOptions = (type) => {
  if (type === 'yes/no') return [{ optionText: 'Yes' }, { optionText: 'No' }];
  if (type === 'single-choice') return [{ optionText: '' }, { optionText: '' }];
  return [];
};

const cardStyle = {
  background: 'rgba(15, 22, 45, 0.8)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  backdropFilter: 'blur(20px)',
};

export default function CreatePollPage() {
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const [step, setStep] = useState(1);
  const [pollType, setPollType] = useState('');
  const [selectedTypeData, setSelectedTypeData] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const selectType = (typeData) => {
    setPollType(typeData.value);
    setSelectedTypeData(typeData);
    setOptions(defaultOptions(typeData.value));
    setStep(2);
  };

  const addOption = () => {
    if (options.length >= 8) return toast.error('Max 8 options allowed');
    setOptions([...options, { optionText: '' }]);
  };

  const removeOption = (idx) => {
    if (options.length <= 2) return toast.error('Min 2 options required');
    setOptions(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx, field, val) => {
    setOptions(options.map((o, i) => i === idx ? { ...o, [field]: val } : o));
  };

  const validate = () => {
    if (!question.trim()) { toast.error('Please enter a question'); return false; }
    if (pollType !== 'open-ended' && pollType !== 'rating') {
      for (let i = 0; i < options.length; i++) {
        if (!options[i].optionText.trim()) {
          toast.error(`Option ${i + 1} cannot be empty`); return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { question: question.trim(), type: pollType };
      if (!['open-ended', 'rating'].includes(pollType)) payload.options = options;
      await createPoll(payload);
      const userRes = await getUser();
      updateUser(userRes.data.user);
      toast.success('Poll published! 🎉');
      navigate('/my-polls');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create poll');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fade-up" style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#8899b8', transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e8edf8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#8899b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <ArrowLeft size={17} />
          </button>
        )}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '99px', padding: '3px 10px',
              }}
            >
              <Zap size={11} color="#a78bfa" />
              <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Step {step} of 2
              </span>
            </div>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e8edf8', letterSpacing: '-0.02em' }}>
            {step === 1 ? 'Choose Poll Type' : 'Configure Your Poll'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#8899b8', marginTop: '4px' }}>
            {step === 1
              ? 'Select a format that best fits your question'
              : `Setting up a ${selectedTypeData?.label} poll`}
          </p>
        </div>
      </div>

      {/* Step progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
        {[1, 2].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '30px', height: '30px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8125rem', fontWeight: 700,
                background: s === step
                  ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                  : s < step
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255,255,255,0.06)',
                color: s <= step ? '#fff' : '#4d607e',
                boxShadow: s === step ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {s < step ? '✓' : s}
            </div>
            {s < 2 && (
              <div
                style={{
                  height: '2px', width: '48px', borderRadius: '99px',
                  background: step > s
                    ? 'linear-gradient(90deg, #7c3aed, #06b6d4)'
                    : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.3s ease',
                }}
              />
            )}
          </div>
        ))}
        <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#4d607e' }}>
          {step === 2 && selectedTypeData?.label}
        </span>
      </div>

      {/* Step 1: Type selection */}
      {step === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {POLL_TYPES.map((typeData) => {
            const { value, label, icon: Icon, desc, gradient, glow, badge } = typeData;
            return (
              <button
                key={value}
                id={`type-${value}`}
                onClick={() => selectType(typeData)}
                style={{
                  ...cardStyle,
                  padding: '20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${glow}`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 14px ${glow}`,
                    }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  <ChevronRight size={16} style={{ color: '#4d607e', marginTop: '4px' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#e8edf8', marginBottom: '4px' }}>{label}</p>
                  <p style={{ fontSize: '0.8125rem', color: '#8899b8', lineHeight: 1.5 }}>{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: Configure poll */}
      {step === 2 && (
        <div style={{ ...cardStyle, padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Question textarea */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#c4cfe4', marginBottom: '10px' }}>
              Your Question <span style={{ color: '#f87171' }}>*</span>
            </label>
            <textarea
              id="poll-question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What would you like to ask your audience?"
              rows={3}
              maxLength={300}
              className="input-field"
              style={{ width: '100%', borderRadius: '10px', padding: '12px 14px', resize: 'none', fontSize: '0.9375rem', lineHeight: 1.5 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontSize: '0.7rem', color: '#4d607e' }}>Be specific and clear</span>
              <span style={{ fontSize: '0.7rem', color: question.length > 250 ? '#f59e0b' : '#4d607e' }}>{question.length}/300</span>
            </div>
          </div>

          {/* Options (for applicable types) */}
          {!['open-ended', 'rating'].includes(pollType) && (
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#c4cfe4', marginBottom: '12px' }}>
                Options
                <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: '#4d607e', fontWeight: 400 }}>
                  {options.length}/8
                </span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {options.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        id={`option-${idx}`}
                        type="text"
                        value={opt.optionText}
                        onChange={e => updateOption(idx, 'optionText', e.target.value)}
                        placeholder={pollType === 'yes/no' ? opt.optionText : `Option ${idx + 1}`}
                        readOnly={pollType === 'yes/no'}
                        className="input-field"
                        style={{
                          width: '100%', borderRadius: '10px', padding: '11px 14px',
                          opacity: pollType === 'yes/no' ? 0.7 : 1,
                          cursor: pollType === 'yes/no' ? 'not-allowed' : 'text',
                        }}
                      />
                    </div>
                    {pollType !== 'yes/no' && (
                      <button
                        onClick={() => removeOption(idx)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '9px',
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: '#f87171', flexShrink: 0, transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.35)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.15)'; }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollType !== 'yes/no' && (
                <button
                  id="add-option"
                  onClick={addOption}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginTop: '10px', padding: '9px 16px', borderRadius: '10px',
                    background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
                    color: '#a78bfa', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
                >
                  <Plus size={15} />
                  Add Option
                </button>
              )}
            </div>
          )}

          {/* Rating preview */}
          {pollType === 'rating' && (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '16px', borderRadius: '12px',
                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ fontSize: '1.5rem', color: '#f59e0b' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#8899b8' }}>
                Users will rate your poll on a 1-5 star scale
              </p>
            </div>
          )}

          {/* Open-ended preview */}
          {pollType === 'open-ended' && (
            <div
              style={{
                padding: '16px', borderRadius: '12px',
                background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>💬</span>
              <p style={{ fontSize: '0.875rem', color: '#8899b8' }}>
                Users will type their free-text response to your question
              </p>
            </div>
          )}

          {/* Submit button */}
          <button
            id="create-poll-submit"
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontSize: '0.9375rem', fontWeight: 700 }}
          >
            {submitting ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                Publishing...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Publish Poll
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
