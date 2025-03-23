import { useEffect, useState } from "react";
import "../App.css";

function VendorsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sellerInfo, setSellerInfo] = useState(null);
  const [isSellerPanelOpen, setIsSellerPanelOpen] = useState(false);

  // Fetch all products
  const seeAllProducts = async (query = "") => {
    try {
      const url = query
        ? `http://localhost:8000/api/v1/vendors/allproducts?search=${encodeURIComponent(query)}`
        : "http://localhost:8000/api/v1/vendors/allproducts";

      const response = await fetch(url, { credentials: "include" });

      if (!response.ok) {
        throw new Error(`Something went wrong: ${response.statusText}`);
      }

      const result = await response.json();
      setProducts(result.data.products);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    seeAllProducts(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    seeAllProducts(searchQuery);
  };

  // Fetch seller details when Buy button is clicked
  const handleBuyClick = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/vendors/buyproduct?productId=${productId}`,
        { credentials: "include" }
      );

      if (!response.ok) {
        throw new Error(`Error fetching seller info: ${response.statusText}`);
      }

      const result = await response.json();
      setSellerInfo(result.data.product);
      setIsSellerPanelOpen(true); // Open seller panel
    } catch (error) {
      console.error(error);
      setSellerInfo(null);
      setIsSellerPanelOpen(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 flex flex-col items-center relative">
      {error && <p className="text-red-500 text-lg mb-4">Error: {error}</p>}

      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Vendors</h1>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="mb-6 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search products..."
            className="p-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Products Grid */}
        {products.length === 0 ? (
          <p className="text-center text-lg">No products available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col h-full">
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
                  <p className="text-sm text-gray-300 mb-2 flex-grow">{product.productDescription}</p>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg font-bold">${product.productPrize}</p>
                    <button
                      onClick={() => handleBuyClick(product._id)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Seller Info Panel */}
      {isSellerPanelOpen && sellerInfo && (
        <div className="fixed top-0 right-0 w-80 h-full bg-gray-800 text-white shadow-lg transform transition-transform translate-x-0 p-6 flex flex-col">
          <button
            onClick={() => setIsSellerPanelOpen(false)}
            className="self-end text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
          <h3 className="text-2xl font-bold mb-4">Seller Information</h3>
          <p className="text-lg"><span className="font-semibold">Username:</span> {sellerInfo.username}</p>
          <p className="text-lg"><span className="font-semibold">Phone:</span> {sellerInfo.phnNo}</p>
          <p className="text-lg"><span className="font-semibold">Contact via:</span> WhatsApp / Call</p>
        </div>
      )}
      
    </div>
  );
}

export default VendorsPage;
