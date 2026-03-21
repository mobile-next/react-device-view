import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { DeviceView } from '../src';
import { JsonRpcClient } from '../src/rpc/JsonRpcClient';

type SessionInfo = {
  sessionId: string;
  device: {
    deviceId: string;
    platform: string;
    type: string;
    name: string;
    osVersion: string;
  };
  createdAt: string;
  releasedAt?: string;
};

function ConnectForm({ onConnect }: { onConnect: (serverUrl: string, token: string) => void }) {
  const [serverUrl, setServerUrl] = useState('wss://api.mobilenexthq.com/ws');
  const [token, setToken] = useState('');

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Device View</h1>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Connect to a server to view available sessions.</p>

      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#aaa' }}>
        Server URL
      </label>
      <input
        type="text"
        value={serverUrl}
        onChange={(e) => setServerUrl(e.target.value)}
        style={{
          width: '100%', padding: '10px 12px', borderRadius: '8px',
          border: '1px solid #333', background: '#1a1a1a', color: '#e0e0e0',
          fontSize: '14px', marginBottom: '16px', outline: 'none',
        }}
      />

      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#aaa' }}>
        API Token (mob_...)
      </label>
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="mob_XXXX..."
        style={{
          width: '100%', padding: '10px 12px', borderRadius: '8px',
          border: '1px solid #333', background: '#1a1a1a', color: '#e0e0e0',
          fontSize: '14px', marginBottom: '24px', outline: 'none',
        }}
      />

      <button
        onClick={() => onConnect(serverUrl, token)}
        disabled={!serverUrl || !token}
        style={{
          padding: '10px 24px', borderRadius: '8px', border: 'none',
          background: !serverUrl || !token ? '#333' : '#00cc6f', color: '#fff',
          fontSize: '14px', fontWeight: 600, cursor: !serverUrl || !token ? 'not-allowed' : 'pointer',
        }}
      >
        Connect
      </button>
    </div>
  );
}

function SessionList({ serverUrl, token, onSelectDevice }: {
  serverUrl: string;
  token: string;
  onSelectDevice: (deviceId: string) => void;
}) {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(serverUrl);
    const protocol = (url.protocol === 'wss:' || url.protocol === 'https:') ? 'https:' : 'http:';
    const apiUrl = `${protocol}//${url.host}/api/v1/sessions`;

    fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const active = (data.sessions || []).filter((s: SessionInfo) => !s.releasedAt);
        setSessions(active);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [serverUrl, token]);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px' }}>Active Sessions</h2>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '6px 14px', borderRadius: '6px', border: '1px solid #333',
            background: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      {loading && <p style={{ color: '#888' }}>Loading sessions...</p>}
      {error && <p style={{ color: '#e5484d' }}>Error: {error}</p>}

      {!loading && !error && sessions.length === 0 && (
        <p style={{ color: '#888' }}>No active sessions. Allocate a device first.</p>
      )}

      {sessions.map(session => (
        <button
          key={session.sessionId}
          onClick={() => onSelectDevice(session.device.deviceId)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: '14px 16px', marginBottom: '8px', borderRadius: '8px',
            border: '1px solid #333', background: '#1a1a1a', color: '#e0e0e0',
            cursor: 'pointer', textAlign: 'left', fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{session.device.platform === 'ios' ? '🍎' : '🤖'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>{session.device.name}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
              {session.device.platform} {session.device.osVersion} &middot; {session.device.deviceId.slice(0, 8)}...
            </div>
          </div>
          <span style={{ color: '#30a46c', fontSize: '12px' }}>Active</span>
        </button>
      ))}
    </div>
  );
}

function App() {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const handleConnect = (url: string, tok: string) => {
    setServerUrl(url);
    setToken(tok);
  };

  // Not connected yet — show connect form
  if (!serverUrl || !token) {
    return <ConnectForm onConnect={handleConnect} />;
  }

  // Connected but no device selected — show session list
  if (!deviceId) {
    return (
      <SessionList
        serverUrl={serverUrl}
        token={token}
        onSelectDevice={setDeviceId}
      />
    );
  }

  // Device selected — show DeviceView
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', padding: '8px 16px',
        borderBottom: '1px solid #333', background: '#1a1a1a',
      }}>
        <button
          onClick={() => setDeviceId(null)}
          style={{
            padding: '6px 14px', borderRadius: '6px', border: '1px solid #333',
            background: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer',
            marginRight: '12px',
          }}
        >
          ← Back
        </button>
        <span style={{ fontSize: '13px', color: '#888', fontFamily: 'monospace' }}>
          {deviceId}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <DeviceView
          serverUrl={serverUrl}
          token={token}
          deviceId={deviceId}
          onError={(err) => console.error('DeviceView error:', err)}
          onConnected={() => console.log('DeviceView connected')}
          onDisconnected={() => console.log('DeviceView disconnected')}
        />
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
