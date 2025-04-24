import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [challenge, setChallenge] = useState(null);
  const [flag, setFlag] = useState('');
  const [flagMessage, setFlagMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.running) {
          setChallenge({
            containerId: data.containerId,
            accessUrl: data.accessUrl,
          });
        }
      });
  }, []);

  const startChallenge = async () => {
    const res = await fetch('/api/start-challenge', {
      method: 'POST',
    });
    const data = await res.json();
    setChallenge({
      containerId: data.containerId,
      accessUrl: data.accessUrl,
    });
  };

  const stopChallenge = async () => {
    if (!challenge) return;
    await fetch('/api/stop-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ containerId: challenge.containerId }),
    });
    setChallenge(null);
    setFlag('');
    setFlagMessage('');
    setIsCorrect(false);
  };

  const submitFlag = async () => {
    const res = await fetch('/api/submit-flag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag }),
    });
    const data = await res.json();
    setFlagMessage(data.message);
    setIsCorrect(data.message.includes('Correct'));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white text-base">
      <header className="flex justify-between items-center px-8 py-5 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold">Attack Vector Simulation</h1>
      </header>

      <main className="px-6 py-10">
        <h2 className="text-4xl font-bold text-center mb-10">Welcome</h2>
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold text-blue-400">Instance 1: Website Comments</h3>
            <p className="text-base text-gray-300 mt-3 mb-5">
              Important information does persist if the source isn't updated properly.
            </p>

            {!challenge ? (
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded"
                onClick={startChallenge}
              >
                Start Instance
              </button>
            ) : (
              <div>
                <p className="text-green-400 mb-3 break-words">
                  Machine running at: <span className="font-mono">{challenge.accessUrl}</span>
                </p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded mb-5"
                  onClick={stopChallenge}
                >
                  Stop Instance
                </button>
              </div>
            )}

            <div className="mt-6">
              <input
                type="text"
                placeholder="flag{...}"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="p-3 rounded text-black w-full mb-3"
              />
              <button
                onClick={submitFlag}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded"
              >
                Submit Flag
              </button>
              {flagMessage && (
                <div className="mt-3 text-base text-yellow-400">
                  <p>{flagMessage}</p>
                  {isCorrect && (
                    <a
                      href="https://owasp.org/www-project-top-ten/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline block mt-3"
                    >
                      View Mitigation Techniques on OWASP
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
