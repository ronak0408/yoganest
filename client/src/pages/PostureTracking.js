import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const POSTURE_MESSAGES = [
  { text: 'Good posture! Keep it up', type: 'success', icon: '✅' },
  { text: 'Adjust your back — keep spine straight', type: 'warning', icon: '⚠️' },
  { text: 'Lower your shoulders', type: 'info', icon: 'ℹ️' },
  { text: 'Great alignment!', type: 'success', icon: '🎉' },
  { text: 'Engage your core muscles', type: 'info', icon: 'ℹ️' },
  { text: 'Tilt your chin down slightly', type: 'warning', icon: '⚠️' },
  { text: 'Perfect form — excellent work!', type: 'success', icon: '🌟' },
  { text: 'Relax your neck tension', type: 'warning', icon: '⚠️' },
];

const POSE_GUIDES = [
  {
    name: 'Mountain Pose (Tadasana)',
    steps: [
      'Stand with feet hip-width apart',
      'Ground all four corners of feet into floor',
      'Engage thighs, lift kneecaps slightly',
      'Elongate your spine upward',
      'Roll shoulders back and down',
      'Arms at sides, palms facing forward',
    ],
  },
  {
    name: "Warrior I (Virabhadrasana I)",
    steps: [
      'Step left foot back about 3-4 feet',
      'Turn left foot out 45 degrees',
      'Bend right knee over ankle',
      'Square hips toward front',
      'Raise arms overhead, palms facing',
      'Gaze forward or slightly up',
    ],
  },
  {
    name: 'Downward Dog (Adho Mukha Svanasana)',
    steps: [
      'Start on hands and knees',
      'Tuck toes and lift hips up and back',
      'Straighten arms and legs (soft knees ok)',
      'Press hands firmly into mat',
      'Let head hang between upper arms',
      'Hold for 5 breaths',
    ],
  },
  {
    name: "Child's Pose (Balasana)",
    steps: [
      'Kneel with big toes touching',
      'Sit back on heels',
      'Fold forward, arms extended',
      'Rest forehead on mat',
      'Breathe deeply into back body',
      'Hold as long as comfortable',
    ],
  },
  {
    name: 'Tree Pose (Vrksasana)',
    steps: [
      'Stand on right foot',
      'Place left foot on inner right thigh',
      'Find a focal point (drishti) ahead',
      'Bring palms together at heart',
      'Engage core for balance',
      'Breathe steadily for 30 seconds',
    ],
  },
];

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PostureTracking() {
  const [isActive, setIsActive] = useState(false);
  const [cameraState, setCameraState] = useState('idle'); // idle | loading | active
  const [timer, setTimer] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(POSTURE_MESSAGES[0]);
  const [accuracy, setAccuracy] = useState(0);
  const [selectedPose, setSelectedPose] = useState(0);
  const [messageQueue, setMessageQueue] = useState([]);

  const timerRef = useRef(null);
  const messageRef = useRef(null);
  const accuracyRef = useRef(null);

  const stopSession = useCallback(() => {
    setIsActive(false);
    clearInterval(timerRef.current);
    clearInterval(messageRef.current);
    clearInterval(accuracyRef.current);
  }, []);

  const startSession = useCallback(() => {
    setCameraState('loading');
    setTimeout(() => {
      setCameraState('active');
      setIsActive(true);
      setTimer(0);
      setAccuracy(40);
      setMessageQueue([]);

      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);

      messageRef.current = setInterval(() => {
        const msg = POSTURE_MESSAGES[Math.floor(Math.random() * POSTURE_MESSAGES.length)];
        setCurrentMessage(msg);
        setMessageQueue((prev) => [msg, ...prev].slice(0, 4));
      }, 3500);

      accuracyRef.current = setInterval(() => {
        setAccuracy((prev) => {
          const delta = (Math.random() - 0.4) * 15;
          return Math.min(100, Math.max(0, Math.round(prev + delta)));
        });
      }, 2000);
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(messageRef.current);
      clearInterval(accuracyRef.current);
    };
  }, []);

  const handleToggle = () => {
    if (isActive || cameraState === 'loading') {
      stopSession();
      setCameraState('idle');
    } else {
      startSession();
    }
  };

  const accuracyColor =
    accuracy >= 75 ? 'bg-green-500' : accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  const accuracyLabel =
    accuracy >= 75 ? 'Excellent' : accuracy >= 50 ? 'Good' : 'Needs Work';

  const messageColors = {
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-200',
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📸 Posture <span className="text-green-600 dark:text-green-400">Tracking</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time posture analysis to help you maintain perfect alignment during practice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Camera View */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center border border-gray-700 shadow-xl">
            {cameraState === 'idle' && (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-lg font-medium text-gray-300">Camera Inactive</p>
                <p className="text-sm text-gray-500 mt-1">Press Start Camera to begin</p>
              </div>
            )}

            {cameraState === 'loading' && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-4 border-green-700 border-t-green-400 animate-spin mx-auto mb-4" />
                <p className="text-green-400 font-medium">Activating camera...</p>
                <p className="text-gray-500 text-sm mt-1">Setting up pose detection</p>
              </div>
            )}

            {cameraState === 'active' && (
              <>
                {/* Simulated camera view */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
                  {/* Grid overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(#00ff00 1px, transparent 1px), linear-gradient(90deg, #00ff00 1px, transparent 1px)',
                      backgroundSize: '50px 50px'
                    }}
                  />
                  {/* Pose skeleton simulation */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-40 h-64 opacity-60">
                      {/* Head */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-green-400" />
                      {/* Body */}
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-20 bg-green-400" />
                      {/* Arms */}
                      <div className="absolute top-12 left-0 w-20 h-0.5 bg-green-400 -rotate-12" />
                      <div className="absolute top-12 right-0 w-20 h-0.5 bg-green-400 rotate-12" />
                      {/* Legs */}
                      <div className="absolute bottom-0 left-1/4 w-0.5 h-24 bg-green-400 rotate-6" />
                      <div className="absolute bottom-0 right-1/4 w-0.5 h-24 bg-green-400 -rotate-6" />
                      {/* Joints */}
                      {[
                        { top: '10px', left: 'calc(50% - 4px)' },
                        { top: '30px', left: 'calc(50% - 4px)' },
                        { top: '50px', left: '0px' },
                        { top: '50px', right: '0px' },
                        { bottom: '80px', left: 'calc(25% - 4px)' },
                        { bottom: '80px', right: 'calc(25% - 4px)' },
                      ].map((style, i) => (
                        <div key={i} className="absolute w-2 h-2 rounded-full bg-green-400 shadow-glow" style={style} />
                      ))}
                    </div>
                  </div>

                  {/* Bounding box */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-72 border-2 border-green-400 opacity-50 rounded-lg" />
                </div>

                {/* Live indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-xs font-medium">LIVE</span>
                </div>

                {/* Timer overlay */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-white text-sm font-mono font-bold">{formatTime(timer)}</span>
                </div>

                {/* Accuracy overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-300">Pose Accuracy</span>
                      <span className="text-sm font-bold text-white">{accuracy}% — {accuracyLabel}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${accuracyColor} rounded-full transition-all duration-1000`}
                        style={{ width: `${accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggle}
              disabled={cameraState === 'loading'}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                isActive || cameraState === 'loading'
                  ? 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-70'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {cameraState === 'loading' ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Initializing...
                </>
              ) : isActive ? (
                <>⏹ Stop Session</>
              ) : (
                <>📷 Start Camera</>
              )}
            </button>

            {isActive && (
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                  {formatTime(timer)}
                </span>
              </div>
            )}
          </div>

          {/* Feedback Panel */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>🎯</span> Posture Feedback
            </h3>

            {!isActive ? (
              <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                Start a session to receive real-time posture feedback.
              </p>
            ) : (
              <div className="space-y-2">
                {/* Current message prominent */}
                <div className={`p-3 rounded-xl border text-sm font-medium ${messageColors[currentMessage.type]} transition-all duration-500`}>
                  {currentMessage.icon} {currentMessage.text}
                </div>
                {/* Message history */}
                {messageQueue.slice(1).map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-xs opacity-${70 - i * 20} ${messageColors[msg.type]}`}
                  >
                    {msg.icon} {msg.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-5">
          {/* Pose Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🧘 Select Pose</h3>
            <select
              value={selectedPose}
              onChange={(e) => setSelectedPose(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
            >
              {POSE_GUIDES.map((pose, i) => (
                <option key={i} value={i}>{pose.name}</option>
              ))}
            </select>

            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Instructions:
            </h4>
            <ol className="space-y-2">
              {POSE_GUIDES[selectedPose].steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Session Stats */}
          {isActive && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg animate-fade-in">
              <h3 className="font-semibold mb-4">Session Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/80 text-sm">Duration</span>
                  <span className="font-mono font-bold">{formatTime(timer)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80 text-sm">Pose Accuracy</span>
                  <span className="font-bold">{accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80 text-sm">Current Pose</span>
                  <span className="font-medium text-xs text-right max-w-[120px] truncate">
                    {POSE_GUIDES[selectedPose].name.split('(')[0].trim()}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>0%</span>
                    <span>{accuracyLabel}</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>📌 Note:</strong> This is a simulated posture tracking demo. Full AI-powered 
              posture detection with your webcam will be available in the production version.
            </p>
          </div>

          {/* CTA to modules */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Looking for a specific pose to practice?
            </p>
            <Link
              to="/modules"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors"
            >
              Browse Modules
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
