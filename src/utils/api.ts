
import { AirQualityData, WeatherData, generateMockAirQualityData } from './airQualityUtils';

// OpenWeather API key (in a real application, this should be stored in environment variables)
const OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Replace with your actual API key

/**
 * Fetches air quality data for the given coordinates
 * This is a mock implementation
 */
export const fetchAirQualityData = async (
  latitude: number,
  longitude: number,
  city: string = "Unknown",
  country: string = "Unknown"
): Promise<AirQualityData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demonstration purposes, we're generating mock data
  // based on the latitude and longitude to make it more consistent
  const seed = Math.abs(Math.floor((latitude + longitude) * 10)) % 100;
  return generateMockAirQualityData(city, country, seed);
};

/**
 * Fetches weather data for the given coordinates using OpenWeather API
 */
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    // OpenWeather API endpoint
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the OpenWeather API response to our WeatherData format
    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: mapOpenWeatherIconToApp(data.weather[0].icon),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      location: {
        name: data.name
      }
    };
  } catch (error) {
    console.error("Error fetching weather data from OpenWeather API:", error);
    
    // Fallback to mock data if the API request fails
    const seed = Math.abs(Math.floor((latitude + longitude) * 10)) % 100;
    return generateMockWeatherData(seed);
  }
};

/**
 * Maps OpenWeather API icon codes to our application's icon names
 * OpenWeather icon codes reference: https://openweathermap.org/weather-conditions
 */
const mapOpenWeatherIconToApp = (iconCode: string): string => {
  // First two characters determine the weather condition
  const condition = iconCode.substring(0, 2);
  
  switch (condition) {
    case '01': // Clear sky
      return 'sun';
    case '02': // Few clouds
    case '03': // Scattered clouds
      return 'cloud-sun';
    case '04': // Broken clouds, overcast clouds
      return 'cloud';
    case '09': // Shower rain
    case '10': // Rain
      return 'cloud-rain';
    case '11': // Thunderstorm
      return 'cloud-lightning';
    case '13': // Snow
      return 'cloud-snow';
    case '50': // Mist, fog
      return 'cloud';
    default:
      return 'cloud';
  }
};

/**
 * Helper function to generate mock weather data
 * This is used as a fallback if the OpenWeather API request fails
 */
export const generateMockWeatherData = (seed: number): WeatherData => {
  // Same implementation as before to ensure backwards compatibility
  const conditions = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain", "Thunderstorm", "Snow"];
  const icons = ["sun", "cloud-sun", "cloud", "cloud-rain", "cloud-rain", "cloud-lightning", "cloud-snow"];
  
  const conditionIndex = seed % conditions.length;
  
  return {
    temperature: Math.floor(10 + (seed % 25)), // Temperature between 10-35°C
    condition: conditions[conditionIndex],
    icon: icons[conditionIndex],
    humidity: Math.floor(30 + (seed % 60)), // Humidity between 30-90%
    windSpeed: Math.floor(5 + (seed % 20)), // Wind speed between 5-25 km/h
    location: {
      name: "Weather Location"
    }
  };
};

/**
 * Fetches air quality forecast for the next days
 * This is a mock implementation
 */
export const fetchAirQualityForecast = async (
  latitude: number,
  longitude: number,
  days: number = 5
): Promise<AirQualityData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock forecast data
  const forecast: AirQualityData[] = [];
  const today = new Date();
  const baseSeed = Math.abs(Math.floor((latitude + longitude) * 10)) % 100;
  
  for (let i = 0; i < days; i++) {
    // Create a proper Date object for the forecast day
    const forecastDate = new Date();
    forecastDate.setDate(today.getDate() + i);
    
    const dailySeed = (baseSeed + i) % 100; // Different seed for each day but consistent for same location
    const mockData = generateMockAirQualityData("Forecast", "", dailySeed);
    mockData.location.city = ""; // Clear location for forecast data
    
    // Ensure we set valid date strings
    mockData.time.local = forecastDate.toLocaleString();
    mockData.time.utc = forecastDate.toISOString();
    
    forecast.push(mockData);
  }
  
  return forecast;
};

/**
 * Searches for a location by query string
 * This is a mock implementation
 */
export const searchLocation = async (
  query: string
): Promise<{ latitude: number; longitude: number; city: string; country: string }[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock locations database with more Indian cities
  const mockLocations = [
    { latitude: 40.7128, longitude: -74.0060, city: "New York", country: "United States" },
    { latitude: 51.5074, longitude: 0.1278, city: "London", country: "United Kingdom" },
    { latitude: 35.6762, longitude: 139.6503, city: "Tokyo", country: "Japan" },
    { latitude: 48.8566, longitude: 2.3522, city: "Paris", country: "France" },
    { latitude: 37.7749, longitude: -122.4194, city: "San Francisco", country: "United States" },
    { latitude: 19.4326, longitude: -99.1332, city: "Mexico City", country: "Mexico" },
    { latitude: 55.7558, longitude: 37.6173, city: "Moscow", country: "Russia" },
    { latitude: -33.8688, longitude: 151.2093, city: "Sydney", country: "Australia" },
    { latitude: 31.2304, longitude: 121.4737, city: "Shanghai", country: "China" },
    { latitude: -22.9068, longitude: -43.1729, city: "Rio de Janeiro", country: "Brazil" },
    // Indian cities
    { latitude: 13.0827, longitude: 80.2707, city: "Chennai", country: "India" },
    { latitude: 28.6139, longitude: 77.2090, city: "Delhi", country: "India" },
    { latitude: 19.0760, longitude: 72.8777, city: "Mumbai", country: "India" },
    { latitude: 22.5726, longitude: 88.3639, city: "Kolkata", country: "India" },
    { latitude: 17.3850, longitude: 78.4867, city: "Hyderabad", country: "India" },
    { latitude: 12.9716, longitude: 77.5946, city: "Bangalore", country: "India" },
    { latitude: 23.0225, longitude: 72.5714, city: "Ahmedabad", country: "India" },
    { latitude: 26.9124, longitude: 75.7873, city: "Jaipur", country: "India" },
  ];
  
  if (!query.trim()) {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase();
  return mockLocations.filter(location => 
    location.city.toLowerCase().includes(lowercaseQuery) || 
    location.country.toLowerCase().includes(lowercaseQuery)
  );
};
