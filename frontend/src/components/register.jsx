import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [phnNo, setPhnNo] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      // Registration API Call
      const response = await fetch("http://localhost:8000/api/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phnNo, password }),
      });

      const result = await response.json();
      console.log("Registration Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      setMessage({ text: "Registration successful! Logging you in...", type: "success" });

      // Auto-login after successful registration
      const loginResp = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phnNo, password }),
      });

      const loginResult = await loginResp.json();
      console.log("Login API Response:", loginResult);

      if (!loginResp.ok || loginResult.message !== "user logged in") {
        throw new Error(loginResult.message || "Login failed after registration.");
      }

      // Dispatch login action
      const userData = {
        _id: loginResult.data.user._id,
        username,
        phnNo,
        password,
      };
      dispatch(login({ userData }));

      // Navigate to user dashboard
      navigate("/iframe/userUi");
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: error.message, type: "error" });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md">
        {message.text && (
          <div className={`text-center mb-4 ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-white">Register</h1>

          <div className="flex flex-col gap-4 mb-4">
            <label htmlFor="phnNo" className="text-gray-300">Phone Number:</label>
            <input
              type="text"
              id="phnNo"
              className="px-3 py-2 border-2 border-gray-600 rounded-lg bg-gray-700 text-white focus:border-green-400 outline-none"
              value={phnNo}
              onChange={(e) => setPhnNo(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-4 mb-4">
            <label htmlFor="username" className="text-gray-300">Username:</label>
            <input
              type="text"
              id="username"
              className="px-3 py-2 border-2 border-gray-600 rounded-lg bg-gray-700 text-white focus:border-green-400 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <label htmlFor="password" className="text-gray-300">Password:</label>
            <input
              type="password"
              id="password"
              className="px-3 py-2 border-2 border-gray-600 rounded-lg bg-gray-700 text-white focus:border-green-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full text-xl bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
