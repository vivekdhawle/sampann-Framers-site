/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import "./App.css";

function MainPage() {
  const [showMenu, setShowMenu] = useState(false);
  const hideMenuTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = () => {
      setShowMenu(true);
      if (hideMenuTimeout.current) {
        clearTimeout(hideMenuTimeout.current);
      }
      hideMenuTimeout.current = setTimeout(() => {
        setShowMenu(false);
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(hideMenuTimeout.current);
    };
  }, []);

  // Navigation Handlers
  const goToPage = (path) => navigate(`/iframe/${path}`);

  return (
    <div className="min-h-screen w-full bg-gray-800 flex flex-col items-center pt-8">
      {/* Google Translate Widget */}
      <div id="google_translate_element"></div>

      {/* Main Content */}
      <div className="w-full flex flex-wrap justify-center items-center mt-5 p-6 gap-6">
        {[
          { title: "Search Page", path: "searchPage" },
          { title: "Community Page", path: "community" },
          { title: "Vendors Page", path: "vendorsPage" },
          { title: "User Page", path: "userPage" },
        ].map(({ title, path }) => (
          <div
            key={path}
            className="relative flex flex-col items-center h-[66vh] w-screen sm:w-1/2 md:w-1/3 lg:w-1/4 max-w-xs bg-gray-900 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {/* Navigation Button */}
            <button
              onClick={() => goToPage(path)}
              className="w-full bg-indigo-600 text-white py-2 rounded-t-lg shadow-md hover:bg-indigo-700 transition-colors duration-200"
              aria-label={`Go to ${title}`}
            >
              Go to {title}
            </button>

            {/* iFrame Container */}
            <iframe
              src={`/iframe/${path}`}
              className="h-full w-full bg-gray-700 rounded-b-lg"
              title={title}
              style={{ border: "none" }}
              loading="lazy"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainPage;
