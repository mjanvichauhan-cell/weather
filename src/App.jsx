import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [wDetails, setWdata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = (event) => {
    event.preventDefault();
    if (city.trim() === "") {
      setError("Please enter a city name");
      return;
    }
    setLoading(true);
    setError("");

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=97bd1280787bd220f6da5977276e0648&units=metric`
    )
      .then((res) => res.json())
      .then((finalRes) => {
        console.log(finalRes);
        if (finalRes.cod !== 200) {
          setWdata(null);
          setError(finalRes.message);
        } else {
          setWdata(finalRes);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Something went wrong");
        setLoading(false);
      });

    setCity("");
  };

  const getTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toUTCString().slice(17, 22);
  };

  const getCurrentTime = () => {
    if (!wDetails) return "";
    const now = new Date();
    const localTime = new Date(
      now.getTime() + wDetails.timezone * 1000
    );
    return localTime.toUTCString().slice(17, 22);
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex justify-center items-center px-4 py-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/45"></div>
      <div className="relative z-10 w-full max-w-[520px]">
        <div className="text-center text-white mb-7">
          <p className="uppercase tracking-[5px] text-sm text-white/70">
            Weather App
          </p>
          <h1 className="text-5xl font-bold mt-2">
            Weather Now
          </h1>
          <p className="text-white/80 mt-2">
            Know your weather, wherever you are 🌍
          </p>
        </div>
        <form
          onSubmit={getData}
          className="flex gap-2 p-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl"
        >
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="flex-1 h-12 px-4 rounded-xl bg-white/90 text-gray-800 outline-none placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-6 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition cursor-pointer"
          >
            Search
          </button>
        </form>
        {error && (
          <div className="mt-4 p-4 bg-red-500/90 text-white rounded-xl text-center">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mt-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-10 text-center text-white">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">
              Getting weather data...
            </p>
          </div>
        )}
        {!isLoading && wDetails && (
          <div className="mt-6 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden text-white">
            <div className="text-center pt-7">
              <h2 className="text-3xl font-bold">
                {wDetails.name}
                <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded-full">
                  {wDetails.sys.country}
                </span>
              </h2>
              <div className="flex justify-center items-center gap-6 mt-4">
                <p className="text-white/80">
                  {getCurrentDate()}
                </p>
                <p className="text-2xl font-light tracking-wider">
                  {getCurrentTime()}
                </p>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="flex items-center justify-center">
                <img
                  src={`https://openweathermap.org/img/wn/${wDetails.weather[0].icon}@2x.png`}
                  alt={wDetails.weather[0].description}
                  className="w-30 h-30"
                />
                <h3 className="text-7xl font-bold">
                  {Math.round(wDetails.main.temp)}°
                </h3>
              </div>
              <p className="text-xl capitalize text-white/90">
                {wDetails.weather[0].description}
              </p>
            </div>
            <div className="flex justify-center items-center gap-8 mt-6">
              <div className="text-center">
                <p className="text-sm text-white/60 mt-2">
                  🌅 Sunrise
                </p>
                <p className="font-bold text-lg">
                  {getTime(
                    wDetails.sys.sunrise,
                    wDetails.timezone
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-white/60 mt-2">
                  🌇 Sunset
                </p>
                <p className="font-bold text-lg">
                  {getTime(
                    wDetails.sys.sunset,
                    wDetails.timezone
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-6 mt-3">
              <div className="bg-white/15 rounded-2xl p-4 text-center">
                <p className="text-2xl">
                  🌡️
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Feels Like
                </p>
                <p className="font-bold text-xl">
                  {Math.round(wDetails.main.feels_like)}°C
                </p>
              </div>
              <div className="bg-white/15 rounded-2xl p-4 text-center">
                <p className="text-2xl">
                  💧
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Humidity
                </p>
                <p className="font-bold text-xl">
                  {wDetails.main.humidity}%
                </p>
              </div>
              <div className="bg-white/15 rounded-2xl p-4 text-center">
                <p className="text-2xl">
                  💨
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Wind
                </p>
                <p className="font-bold text-xl">
                  {wDetails.wind.speed} m/s
                </p>
              </div>
              <div className="bg-white/15 rounded-2xl p-4 text-center">
                <p className="text-2xl">
                  ☁️
                </p>
                <p className="text-sm text-white/60 mt-1">
                  Clouds
                </p>
                <p className="font-bold text-xl">
                  {wDetails.clouds.all}%
                </p>
              </div>
            </div>
          </div>
        )}
        {!isLoading && !wDetails && !error && (
          <div className="mt-6 p-10 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 text-center text-white">
            <div className="text-7xl">
              ☁️
            </div>
            <h2 className="text-2xl font-bold mt-4">
              Search for a city
            </h2>
            <p className="text-white/70 mt-2">
              Get live weather, temperature and time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

