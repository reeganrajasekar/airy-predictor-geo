
import { AirQualityData, WeatherData, generateMockAirQualityData } from './airQualityUtils';

// Weather API key (in a real application, this should be stored in environment variables)
const WEATHER_API_KEY = "YOUR_WEATHER_API_KEY"; // Replace with your actual API key

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
 * Fetches weather data for the given coordinates using Weather.com API
 */
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    // The Weather Company API endpoint (IBM Weather)
    const apiUrl = `https://api.weather.com/v3/wx/observations/current?geocode=${latitude},${longitude}&units=m&language=en-US&format=json&apiKey=${WEATHER_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the Weather.com API response to our WeatherData format
    return {
      temperature: data.temperature,
      condition: data.wxPhraseLong || "Unknown",
      icon: mapWeatherIconToApp(data.iconCode),
      humidity: data.relativeHumidity,
      windSpeed: data.windSpeed,
      location: {
        name: data.city || "Unknown"
      }
    };
  } catch (error) {
    console.error("Error fetching weather data from Weather.com API:", error);
    
    // Fallback to mock data if the API request fails
    const seed = Math.abs(Math.floor((latitude + longitude) * 10)) % 100;
    return generateMockWeatherData(seed);
  }
};

/**
 * Maps Weather.com API icon codes to our application's icon names
 */
const mapWeatherIconToApp = (iconCode: number): string => {
  // Weather.com icon code mapping to our app's icons
  // Reference: https://docs.google.com/document/d/1_Svb4RqF6F6V_R0U7e6bfecnKDhG2RJvZO8QZyJO0t4/edit#
  if (iconCode <= 4) return 'sun'; // Clear, Sunny
  if (iconCode <= 11) return 'cloud-sun'; // Partly Cloudy
  if (iconCode <= 26) return 'cloud'; // Cloudy
  if (iconCode <= 39) return 'cloud-rain'; // Rain
  if (iconCode <= 42) return 'cloud-lightning'; // Thunderstorms
  if (iconCode <= 56) return 'cloud-snow'; // Snow
  return 'cloud'; // Default
};

/**
 * Helper function to generate mock weather data
 * This is used as a fallback if the Weather.com API request fails
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
    const forecastDate = new Date();
    forecastDate.setDate(today.getDate() + i);
    
    const dailySeed = (baseSeed + i) % 100; // Different seed for each day but consistent for same location
    const mockData = generateMockAirQualityData("Forecast", "", dailySeed);
    mockData.location.city = ""; // Clear location for forecast data
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock locations for demonstration
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
