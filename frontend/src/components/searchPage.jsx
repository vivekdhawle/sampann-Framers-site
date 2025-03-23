import { useEffect, useState } from "react";

function SearchPage() {
  const [plantName, setPlantName] = useState("");
  const [plantData, setPlantData] = useState([]);
  const [soilData, setSoilData] = useState([]);
  const [remediesData, setRemediesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataFetched, setDataFetched] = useState(false);

  const getPlant = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDataFetched(false);

    try {
      const url = `http://localhost:8000/api/v1/plants/getplant?plantName=${plantName}`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError(`No plant data found for "${plantName}". Not available in backend.`);
        } else {
          throw new Error(`Something went wrong while fetching plant data: ${response.status}`);
        }
        return;
      }

      const result = await response.json();
      console.log(result.data.plant);
      setPlantData(result.data.plant);
      setDataFetched(true);
    } catch (error) {
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSoil = async () => {
    try {
      const url = `http://localhost:8000/api/v1/soil/getsoil`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Something went wrong while fetching soil data: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.data.soil);
      setSoilData(result.data.soil);
    } catch (error) {
      console.log(error);
    }
  };

  const getRemedies = async () => {
    try {
      const url = `http://localhost:8000/api/v1/remedies/getremedies`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Something went wrong while fetching remedies data: ${response.status}`);
      }

      const result = await response.json();
      console.log(result.data.remedies);
      setRemediesData(result.data.remedies);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSoil();
    getRemedies();
  }, []);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <form onSubmit={getPlant} className="mb-4">
        <input
          type="text"
          value={plantName}
          placeholder="Enter plant name"
          className="border-2 p-2 rounded-lg bg-gray-800 text-white"
          onChange={(e) => setPlantName(e.target.value)}
        />
        <button type="submit" className="ml-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-300">{error}</p>}

      {!loading && dataFetched && plantData.length === 0 && (
        <p>No plant data found for "{plantName}".</p>
      )}

      {/* Display plant data in iframe mode */}
      <div className="md:hidden  ">
        {plantData.length > 0 && (
          <div className="max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Plant Details</h2>
            {plantData.map((plant) => (
              <div key={plant._id} className="border-b-2 border-gray-300 mb-4 pb-4">
                <p><strong>Name:</strong> {plant.plantName}</p>
                <p><strong>Information:</strong> {plant.information}</p>
                <p><strong>Pesticide Quantity:</strong> {plant.pesticideQuantity}</p>
                <p><strong>Side Effects on Soil Fertility:</strong> {plant.sideEffectsOnSoilFertility}</p>
                <p><strong>Best Way to Grow:</strong> {plant.bestWayToGrow.sowingMethods}, Depth: {plant.bestWayToGrow.depth}</p>
                <p><strong>Weather Conditions:</strong></p>
                <ul>
                  <li><strong>Temperature:</strong> {plant.weatherConditions.temperature}</li>
                  <li><strong>Growing Seasons:</strong> {plant.weatherConditions.growingSeasons}</li>
                  <li><strong>Humidity:</strong> {plant.weatherConditions.humidity}</li>
                  <li><strong>Rainfall Required:</strong> {plant.weatherConditions.rainfallRequired}</li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display cards in full view */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {/* Plant Card */}
        <div className="p-4 bg-white text-black border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Plant Details</h2>
          {plantData.length > 0 ? (
            <div>
              {plantData.map((plant) => (
                <div key={plant._id} className="border-b-2 border-gray-300 mb-2 pb-2">
                  <p><strong>Name:</strong> {plant.plantName}</p>
                  <p><strong>Information:</strong> {plant.information}</p>
                  <p><strong>Pesticide Quantity:</strong> {plant.pesticideQuantity}</p>
                  <p><strong>Side Effects on Soil Fertility:</strong> {plant.sideEffectsOnSoilFertility}</p>
                  <p><strong>Best Way to Grow:</strong> {plant.bestWayToGrow.sowingMethods}, Depth: {plant.bestWayToGrow.depth}</p>
                  <p><strong>Weather Conditions:</strong></p>
                  <ul>
                    <li><strong>Temperature:</strong> {plant.weatherConditions.temperature}</li>
                    <li><strong>Growing Seasons:</strong> {plant.weatherConditions.growingSeasons}</li>
                    <li><strong>Humidity:</strong> {plant.weatherConditions.humidity}</li>
                    <li><strong>Rainfall Required:</strong> {plant.weatherConditions.rainfallRequired}</li>
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No plant data available.</p>
          )}
        </div>

        {/* Remedies Card */}
        <div className="p-4 bg-white text-black border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Remedies</h2>
          {remediesData.length > 0 ? (
            <div>
              {remediesData.map((remedy) => (
                <div key={remedy._id} className="border-b-2 border-gray-300 mb-2 pb-2">
                  <p><strong>Method:</strong> {remedy.remedieName}</p>
                  <p><strong>Description:</strong> {remedy.remedieDescription}</p>
                  <p><strong>Cost:</strong> {remedy.methodCost}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No remedies data available.</p>
          )}
        </div>

        {/* Soil Card */}
        <div className="p-4 bg-white text-black border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Soil Improvement</h2>
          {soilData.length > 0 ? (
            <div>
              {soilData.map((soil) => (
                <div key={soil._id} className="border-b-2 border-gray-300 mb-2 pb-2">
                  <p><strong>Method:</strong> {soil.methodToImproveSoilFertility}</p>
                  <p><strong>Description:</strong> {soil.methodDescription}</p>
                  <p><strong>Cost:</strong> {soil.methodCost}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No soil data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;