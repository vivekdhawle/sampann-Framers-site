import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../App.css";
function UserPage() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/iframe/userUi", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn) return null; // Prevents UI flickering during redirect

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        <div className="mt-10 font-bold text-white text-center">
          <button
            onClick={() => navigate("/iframe/userPage/loginPage")}
            className="text-green-500 hover:underline transition duration-300 ease-in-out"
          >
            Login
          </button>
          {" / "}
          <button
            onClick={() => navigate("/iframe/userPage/registerPage")}
            className="text-green-500 hover:underline transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
        <Outlet /> {/* Render nested routes */}
      </div>
    </div>
  );
}

export default UserPage;
