// components/AdminSyncButton.tsx
'use client';

import React, { useState } from 'react';

interface AdminSyncButtonProps {
  targetUserId: string;
}

export default function AdminSyncButton() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const targetUserId = '693a85f216a8418a9bc8dcad';
  const handleSync = () => {
    setStatus('sending');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);

    socket.onopen = () => {
      // Send the signal to the server switchboard
      socket.send(
        JSON.stringify({
          type: 'SEND_SIGNAL',
          targetUserId: targetUserId,
        })
      );

      console.log(`[Admin] Signal sent to ${targetUserId}`);

      // Close the temporary connection
      socket.close();
      setStatus('success');

      // Reset button after 2 seconds
      setTimeout(() => setStatus('idle'), 2000);
    };

    socket.onerror = err => {
      console.error('Failed to send sync signal', err);
      setStatus('idle');
    };
  };

  return (
    <button
      onClick={handleSync}
      disabled={status === 'sending'}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        status === 'success'
          ? 'bg-green-500 text-white'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {status === 'sending' && 'Sending...'}
      {status === 'success' && 'User Signaled!'}
      {status === 'idle' && `Sync User Session`}
    </button>
  );
}
