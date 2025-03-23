import { useState } from 'react';
import { login, logout } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [phnNo, setPhnNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('phnNo', phnNo);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Ensures cookies/tokens are sent
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! Status: ${response.status}`);
      }

      if (result.message === 'user logged in') {
        const userData = {
          _id: result.data?.user?._id || '',
          phnNo: phnNo,
        };
        dispatch(logout());
        dispatch(login({ userData }));
        navigate('/iframe/userUi');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Login</h1>

        {/* Display error message */}
        {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="phnNo" className="text-gray-300">
            Phone Number:
          </label>
          <input
            type="text"
            id="phnNo"
            name="phnNo"
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-green-400 outline-none"
            value={phnNo}
            onChange={(e) => setPhnNo(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="password" className="text-gray-300">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white focus:border-green-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          className={`w-full text-xl bg-green-500 text-white py-2 px-6 rounded-lg transition-transform transform ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600 hover:scale-105'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
