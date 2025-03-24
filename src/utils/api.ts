
import { AirQualityData, WeatherData, generateMockAirQualityData, generateMockWeatherData } from './airQualityUtils';

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
 * Fetches weather data for the given coordinates
 * This is a mock implementation
 */
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demonstration purposes, we're generating mock data
  // based on the latitude and longitude to make it more consistent
  const seed = Math.abs(Math.floor((latitude + longitude) * 10)) % 100;
  return generateMockWeatherData(seed);
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
