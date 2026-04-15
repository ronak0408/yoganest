import React, { useState, useEffect, useRef } from 'react';
import PostureFeedback from '../components/posture/PostureFeedback';

const FEEDBACK_MESSAGES = [
  { text: '✅ Great posture! Keep it up!', type: 'success' },
  { text: '⚠️ Adjust your back — straighten your spine', type: 'warning' },
  { text: '⚠️ Lower your shoulders', type: 'warning' },
  { text: '✅ Perfect alignment!', type: 'success' },
  { text: '⚠️ Bend your knees slightly', type: 'warning' },
  { text: '✅ Excellent form!', type: 'success' },
  { text: '⚠️ Keep your core engaged', type: 'warning' },
];

const TIPS = [
  'Keep your spine neutral throughout each pose.',
  'Breathe deeply and evenly — never hold your breath.',
  'Engage your core to protect your lower back.',
  'Move slowly and mindfully between positions.',
  'Listen to your body and never push through pain.',
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PostureTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [feedbackIndex, setFeedbackIndex] = useState(0);
  const [score, setScore] = useState(72);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        const nextIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.length);
        setFeedbackIndex(nextIndex);
        setScore((prev) => {
          const isGood = FEEDBACK_MESSAGES[nextIndex].type === 'success';
          const delta = isGood ? Math.floor(Math.random() * 3) : -Math.floor(Math.random() * 2);
          return Math.min(100, Math.max(30, prev + delta));
        });
      }, 3000);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, [isTracking]);

  const handleToggle = () => {
    if (!isTracking) {
      setElapsed(0);
      setScore(72);
      setFeedbackIndex(0);
    }
    setIsTracking((v) => !v);
  };

  const currentFeedback = FEEDBACK_MESSAGES[feedbackIndex];
  const scoreColor = score >= 80 ? 'text-green-600 dark:text-green-400' : score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  const scoreBarColor = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-secondary-900 dark:text-white mb-2">Posture Tracker</h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Get real-time posture feedback during your yoga sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Camera feed */}
        <div className="lg:col-span-2 space-y-5">
          {/* Simulated feed */}
          <div className="card overflow-hidden">
            <div className="relative bg-secondary-900 aspect-video flex items-center justify-center">
              {isTracking ? (
                <>
                  {/* Animated silhouette */}
                  <svg viewBox="0 0 200 300" className="h-48 text-secondary-400 opacity-50 animate-pulse-slow" fill="currentColor">
                    <circle cx="100" cy="40" r="25" />
                    <rect x="75" y="70" width="50" height="90" rx="10" />
                    <rect x="40" y="75" width="30" height="70" rx="8" />
                    <rect x="130" y="75" width="30" height="70" rx="8" />
                    <rect x="78" y="160" width="22" height="90" rx="8" />
                    <rect x="102" y="160" width="22" height="90" rx="8" />
                  </svg>
                  <div className="absolute top-3 left-3 flex items-center space-x-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>LIVE</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 text-white text-sm px-3 py-1 rounded-lg">
                    {formatTime(elapsed)}
                  </div>
                </>
              ) : (
                <div className="text-center text-secondary-500 p-10">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Camera feed will appear here</p>
                  <p className="text-xs mt-1 opacity-70">Click "Start Tracking" to begin</p>
                </div>
              )}
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-secondary-500 dark:text-secondary-400">
                {isTracking ? `Session time: ${formatTime(elapsed)}` : 'Ready to start'}
              </div>
              <button
                onClick={handleToggle}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isTracking
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
            </div>
          </div>

          {/* Feedback */}
          {isTracking && (
            <div className="space-y-3 animate-slide-up">
              <h3 className="font-bold text-secondary-900 dark:text-white">Real-Time Feedback</h3>
              <PostureFeedback message={currentFeedback.text} type={currentFeedback.type} />
            </div>
          )}

          {/* Tips */}
          <div className="card p-5">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-3">Practice Tips</h3>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                  <span className="text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Score sidebar */}
        <div className="space-y-5">
          <div className="card p-5 text-center">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-4">Posture Score</h3>
            <div className={`text-6xl font-extrabold ${scoreColor}`}>{score}</div>
            <div className="text-secondary-400 dark:text-secondary-500 text-sm mb-4">/100</div>
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3">
              <div
                className={`${scoreBarColor} h-3 rounded-full transition-all duration-700`}
                style={{ width: `${score}%` }}
              />
            </div>
            <p className="text-secondary-500 dark:text-secondary-400 text-xs mt-3">
              {score >= 80 ? 'Excellent form! 🌟' : score >= 60 ? 'Good — minor adjustments needed 👍' : 'Needs improvement ⚠️'}
            </p>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-secondary-900 dark:text-white mb-3">Session Stats</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-secondary-500 dark:text-secondary-400">Duration</dt>
                <dd className="font-semibold text-secondary-900 dark:text-white">{formatTime(elapsed)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500 dark:text-secondary-400">Status</dt>
                <dd>
                  <span className={`font-semibold ${isTracking ? 'text-green-600 dark:text-green-400' : 'text-secondary-500'}`}>
                    {isTracking ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-500 dark:text-secondary-400">Current Posture</dt>
                <dd className={`font-semibold ${scoreColor}`}>
                  {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <p className="text-sm text-secondary-700 dark:text-secondary-300">
              <strong>Note:</strong> This is a simulated posture tracker. Real implementation would use your device camera and computer vision to analyze posture in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
