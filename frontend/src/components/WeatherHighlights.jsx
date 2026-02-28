import { useEffect, useState } from 'react';
import '../style/weatherHighlights.css';

function WeatherHighlights() {
  // const baseUrl = import.meta.env.VITE_WEATHER_URL;
  const baseUrl = `https://weather-backend-001h.onrender.com/api/weather`;

  const [highlights, setHighlights] = useState([
    { id: 'lodwar', type: 'hot', city: 'Lodwar', country: 'Kenya', loading: true },
    { id: 'yakutsk', type: 'cold', city: 'Yakutsk', country: 'Russia', loading: true },
    { id: 'mawsynram', type: 'rainy', city: 'Mawsynram', country: 'India', loading: true },
    { id: 'siberia', type: 'snowy', city: 'Siberia', country: 'Russia', loading: true },
  ]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const updatedHighlights = await Promise.all(
          highlights.map(async (item) => {
            try {
              const response = await fetch(
                `${baseUrl}?city=${encodeURIComponent(item.city)}`
              );

              if (!response.ok) {
                return { ...item, loading: false, error: true };
              }

              const data = await response.json();

              return {
                ...item,
                temperature: `${Math.round(data.temperature)}°C`,
                description: data.description,
                icon: data.icon,
                loading: false,
              };
            } catch (err) {
              return { ...item, loading: false, error: true };
            }
          })
        );

        setHighlights(updatedHighlights);
      } catch (err) {
        console.error('Failed to load weather highlights:', err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <section className="weather-highlights">
      <h2>Weather Highlights</h2>

      <div className="highlight-grid">
        {highlights.map((item) => (
          <div key={item.id} className={`highlight-card ${item.type}`}>
            <h4>
              {item.city}, {item.country}
            </h4>

            {item.loading ? (
              <p>Loading weather...</p>
            ) : item.error ? (
              <p>Weather unavailable</p>
            ) : (
              <>
                {item.icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                    alt={item.description}
                  />
                )}
                <p className="temp">{item.temperature}</p>
                <p>{item.description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeatherHighlights;