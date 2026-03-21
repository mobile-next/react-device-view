import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { DeviceView } from '../src';
import { JsonRpcClient } from '../src/rpc/JsonRpcClient';

type DeviceInfo = {
  id: string;
  name: string;
  platform: string;
  state: string;
  model: string;
  provider?: { type: string; sessionId?: string };
};

function ConnectForm({ onConnect }: { onConnect: (serverUrl: string, token: string) => void }) {
  const [serverUrl, setServerUrl] = useState('wss://api.mobilenexthq.com/ws');
  const [token, setToken] = useState('');

  return (
    <div style={{ maxWidth: '500px', margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Device View</h1>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '32px' }}>Connect to a server to view your devices.</p>

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

function DeviceList({ serverUrl, token, onSelectDevice }: {
  serverUrl: string;
  token: string;
  onSelectDevice: (deviceId: string) => void;
}) {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = () => {
    setLoading(true);
    setError(null);

    const client = new JsonRpcClient(serverUrl, undefined, token);
    client.sendJsonRpcRequest<{ devices: DeviceInfo[] }>('devices.list', {})
      .then((result) => {
        const online = (result.devices || []).filter(d => d.state === 'online');
        setDevices(online);
      })
      .catch(err => setError(err.message))
      .finally(() => {
        setLoading(false);
        client.disconnect();
      });
  };

  useEffect(() => {
    fetchDevices();
  }, [serverUrl, token]);

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px' }}>Your Devices</h2>
        <button
          onClick={fetchDevices}
          style={{
            padding: '6px 14px', borderRadius: '6px', border: '1px solid #333',
            background: 'none', color: '#aaa', fontSize: '13px', cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      {loading && <p style={{ color: '#888' }}>Loading devices...</p>}
      {error && <p style={{ color: '#e5484d' }}>Error: {error}</p>}

      {!loading && !error && devices.length === 0 && (
        <p style={{ color: '#888' }}>No devices online. Allocate a device first.</p>
      )}

      {devices.map(device => (
        <button
          key={device.id}
          onClick={() => onSelectDevice(device.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: '14px 16px', marginBottom: '8px', borderRadius: '8px',
            border: '1px solid #333', background: '#1a1a1a', color: '#e0e0e0',
            cursor: 'pointer', textAlign: 'left', fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '20px' }}>{device.platform === 'ios' ? '🍎' : '🤖'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500 }}>{device.name}</div>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
              {device.platform} &middot; {device.model} &middot; {device.id.slice(0, 8)}...
            </div>
          </div>
          <span style={{ color: '#30a46c', fontSize: '12px' }}>{device.state}</span>
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

  if (!serverUrl || !token) {
    return <ConnectForm onConnect={handleConnect} />;
  }

  if (!deviceId) {
    return (
      <DeviceList
        serverUrl={serverUrl}
        token={token}
        onSelectDevice={setDeviceId}
      />
    );
  }

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
