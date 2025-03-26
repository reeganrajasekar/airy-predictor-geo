import React, { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import AirQualityCard from '@/components/AirQualityCard';
import WeatherCard from '@/components/WeatherCard';
import PollutantChart from '@/components/PollutantChart';
import SearchLocation from '@/components/SearchLocation';
import Hero from '@/components/Hero';
import LoadingState from '@/components/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, MapPin, AlertCircle, Wind } from 'lucide-react';
import { 
  getCurrentPosition, 
  getLocationFromCoordinates, 
  isGeolocationAvailable 
} from '@/utils/geolocation';
import { 
  fetchAirQualityData, 
  fetchWeatherData, 
  fetchAirQualityForecast 
} from '@/utils/api';
import { 
  AirQualityData, 
  WeatherData,
  getAqiCategory, 
} from '@/utils/airQualityUtils';

const Index = () => {
  // State for coordinates and location information
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [location, setLocation] = useState<{ city: string; country: string }>({ city: '', country: '' });
  
  // State for data
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<AirQualityData[] | null>(null);
  
  // Loading states
  const [isAirQualityLoading, setIsAirQualityLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isForecastLoading, setIsForecastLoading] = useState(false);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  
  // Error state
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Check if user has already viewed the introductory content
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Function to fetch user's location
  const fetchUserLocation = useCallback(async () => {
    if (!isGeolocationAvailable()) {
      setLocationError("Geolocation is not available in your browser.");
      toast({
        title: "Geolocation Unavailable",
        description: "Your browser doesn't support geolocation. Try searching for a location instead.",
        variant: "destructive"
      });
      return;
    }
    
    setIsRequestingLocation(true);
    setLocationError(null);
    
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Get city and country information
      const locationInfo = await getLocationFromCoordinates(latitude, longitude);
      
      setCoordinates({ latitude, longitude });
      setLocation(locationInfo);
      setHasInteracted(true);
      
      toast({
        title: "Location Detected",
        description: `Your location: ${locationInfo.city}, ${locationInfo.country}`,
      });
    } catch (error) {
      console.error("Error getting user location:", error);
      setLocationError("Could not access your location. Please ensure location permissions are enabled.");
      toast({
        title: "Location Error",
        description: "Could not access your location. Please ensure location permissions are enabled.",
        variant: "destructive"
      });
    } finally {
      setIsRequestingLocation(false);
    }
  }, []);
  
  // Function to fetch all data based on coordinates
  const fetchAllData = useCallback(async () => {
    if (!coordinates) return;
    
    // Fetch air quality data
    setIsAirQualityLoading(true);
    try {
      const aqi = await fetchAirQualityData(
        coordinates.latitude,
        coordinates.longitude,
        location.city,
        location.country
      );
      setAirQualityData(aqi);
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      toast({
        title: "Data Error",
        description: "Could not fetch air quality data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAirQualityLoading(false);
    }
    
    // Fetch weather data
    setIsWeatherLoading(true);
    try {
      const weather = await fetchWeatherData(
        coordinates.latitude,
        coordinates.longitude
      );
      setWeatherData(weather);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setIsWeatherLoading(false);
    }
    
    // Fetch forecast data
    setIsForecastLoading(true);
    try {
      const forecast = await fetchAirQualityForecast(
        coordinates.latitude,
        coordinates.longitude
      );
      setForecastData(forecast);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setIsForecastLoading(false);
    }
  }, [coordinates, location]);
  
  // Function to handle when a location is selected from search
  const handleLocationSelect = (latitude: number, longitude: number, city: string, country: string) => {
    setCoordinates({ latitude, longitude });
    setLocation({ city, country });
    setHasInteracted(true);
    
    toast({
      title: "Location Selected",
      description: `Selected location: ${city}, ${country}`,
    });
  };
  
  // Refresh air quality data
  const refreshAirQualityData = async () => {
    if (!coordinates) return;
    
    setIsAirQualityLoading(true);
    try {
      const aqi = await fetchAirQualityData(
        coordinates.latitude,
        coordinates.longitude,
        location.city,
        location.country
      );
      setAirQualityData(aqi);
      
      toast({
        title: "Data Refreshed",
        description: "Air quality data has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing air quality data:", error);
      toast({
        title: "Refresh Error",
        description: "Could not refresh air quality data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAirQualityLoading(false);
    }
  };
  
  // Fetch data when coordinates change
  useEffect(() => {
    if (coordinates) {
      fetchAllData();
    }
  }, [coordinates, fetchAllData]);
  
  // If user hasn't interacted, show the hero content
  if (!hasInteracted) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wind className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">AirInsight</h1>
            </div>
          </div>
        </header>
        
        <main className="flex-1">
          <Hero onRequestLocation={fetchUserLocation} />
          
          <div className="container mx-auto px-4 pb-16">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Find Air Quality by Location</h2>
              <div className="max-w-xl mx-auto">
                <SearchLocation onLocationSelect={handleLocationSelect} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="glass-card shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Geolocation Detection</h3>
                  <p className="text-center text-muted-foreground">
                    Automatically detect your location to get real-time air quality data specific to your area.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AQI Monitoring</h3>
                  <p className="text-center text-muted-foreground">
                    Check real-time Air Quality Index (AQI) and understand the health implications of current air conditions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="glass-card shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Air Quality Forecasts</h3>
                  <p className="text-center text-muted-foreground">
                    Access predictive forecasts to plan your activities based on expected air quality conditions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground text-sm">
              AirInsight provides air quality data for informational purposes.
            </p>
          </div>
        </footer>
      </div>
    );
  }
  
  // Main application view after interaction
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Wind className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">AirInsight</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {coordinates && location.city && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {location.city}, {location.country}
                </span>
              </div>
            )}
            <SearchLocation onLocationSelect={handleLocationSelect} />
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={fetchUserLocation}
              disabled={isRequestingLocation}
            >
              {isRequestingLocation ? "Detecting..." : "My Location"}
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {locationError && (
          <div className="mb-8 glass-card bg-destructive/10 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{locationError}</p>
          </div>
        )}
        
        {!coordinates ? (
          <LoadingState message="Waiting for location information..." />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2 animate-fade-in-up delay-0">
                <AirQualityCard 
                  data={airQualityData} 
                  isLoading={isAirQualityLoading}
                  onRefresh={refreshAirQualityData}
                />
              </div>
              
              <div className="animate-fade-in-up delay-100">
                <WeatherCard 
                  data={weatherData} 
                  isLoading={isWeatherLoading}
                />
              </div>
            </div>
            
            <div className="animate-fade-in-up delay-200">
              <PollutantChart 
                pollutants={airQualityData?.pollutants || []} 
                isLoading={isAirQualityLoading}
              />
            </div>
            
            {forecastData && (
              <div className="mt-10 animate-fade-in-up delay-300">
                <h2 className="text-2xl font-bold mb-6">Air Quality Forecast</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecastData.map((day, index) => {
                    const forecastDate = new Date(day.time.utc);
                    const isValidDate = !isNaN(forecastDate.getTime());
                    
                    return (
                      <Card 
                        key={index} 
                        className={`aqi-card shadow-md aqi-${day.category} animate-fade-in delay-${index * 100}`}
                      >
                        <CardContent className="p-4">
                          <div className="text-center mb-2">
                            <div className="font-medium">
                              {isValidDate 
                                ? forecastDate.toLocaleDateString(undefined, { weekday: 'short' }) 
                                : `Day ${index + 1}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {isValidDate 
                                ? forecastDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) 
                                : ''}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <div className="text-3xl font-bold mb-1">{day.aqi}</div>
                            <div className="px-2 py-1 rounded-full text-xs font-medium" 
                              style={{ backgroundColor: `rgb(var(--aqi-${day.category}))`, color: 'white' }}>
                              {day.category.charAt(0).toUpperCase() + day.category.slice(1)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="py-6 border-t mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground text-sm">
            AirInsight provides air quality data for informational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
