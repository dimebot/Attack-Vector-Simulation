import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [challenge, setChallenge] = useState(null);

  // Fetch the status of the challenge on component mount
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
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">Attack Vector Simulation</h1>
      </header>

      <main className="px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome to Attack Vector Simulation</h2>
        <div className="flex justify-center">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg max-w-md">
            <h3 className="text-lg font-semibold text-blue-400">Instance 1: Website Comments</h3>
            <p className="text-sm text-gray-300 mt-2 mb-4">
              Important information does persist if the source isn't updated properly.
            </p>

            {!challenge ? (
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
                onClick={startChallenge}
              >
                Start Instance
              </button>
            ) : (
              <div>
                <p className="text-green-400 mb-2 break-words">
                  Machine running at: <span className="font-mono">{challenge.accessUrl}</span>
                </p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
                  onClick={stopChallenge}
                >
                  Stop Instance
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
