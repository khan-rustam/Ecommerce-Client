import React, { useState } from 'react';

const SecurityPage = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('Rustam@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [username, setUsername] = useState('Rustam');

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
      <form className="space-y-8">
        <div>
          <h3 className="font-semibold mb-2">Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded px-3 py-2 mb-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded px-3 py-2 mb-2"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button type="button" className="bg-orange-600 text-white px-4 py-2 rounded" onClick={() => alert('Change password not implemented')}>Change Password</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Change Email</h3>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 mb-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="button" className="bg-orange-600 text-white px-4 py-2 rounded" onClick={() => alert('Change email not implemented')}>Change Email</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Change Phone Number</h3>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mb-2"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button type="button" className="bg-orange-600 text-white px-4 py-2 rounded" onClick={() => alert('Change phone not implemented')}>Change Phone</button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Change Username</h3>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mb-2"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <button type="button" className="bg-orange-600 text-white px-4 py-2 rounded" onClick={() => alert('Change username not implemented')}>Change Username</button>
        </div>
      </form>
    </div>
  );
};
export default SecurityPage; 