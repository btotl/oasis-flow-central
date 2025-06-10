
import { useState } from 'react';

interface PasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const PasswordModal = ({ onSuccess, onClose }: PasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'manager123') {
      onSuccess();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="neo-card p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Manager Access Required</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter manager password"
            className="neo-input w-full mb-4"
          />
          {error && (
            <p className="text-red-500 font-bold mb-4">{error}</p>
          )}
          <div className="flex gap-3">
            <button
              type="submit"
              className="neo-button-primary flex-1"
            >
              Access Manager Dashboard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="neo-button flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
