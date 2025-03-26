
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  Sun, 
  CloudSun,
  Droplets,
  Wind,
  Thermometer
} from 'lucide-react';
import { WeatherData } from '@/utils/airQualityUtils';

interface WeatherCardProps {
  data: WeatherData | null;
  isLoading?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, isLoading = false }) => {
  const getWeatherIcon = (iconName: string) => {
    switch(iconName) {
      case 'sun':
        return <Sun className="h-10 w-10 text-amber-500" />;
      case 'cloud-sun':
        return <CloudSun className="h-10 w-10 text-amber-400" />;
      case 'cloud':
        return <Cloud className="h-10 w-10 text-gray-400" />;
      case 'cloud-rain':
        return <CloudRain className="h-10 w-10 text-blue-400" />;
      case 'cloud-lightning':
        return <CloudLightning className="h-10 w-10 text-purple-400" />;
      case 'cloud-snow':
        return <CloudSnow className="h-10 w-10 text-blue-200" />;
      default:
        return <Cloud className="h-10 w-10 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse-slow shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Add check for null data
  if (!data) {
    return (
      <Card className="glass-card shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium text-muted-foreground">No weather data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
        
        <div className="flex items-center space-x-4 mb-6">
          {getWeatherIcon(data.icon)}
          <div>
            <div className="text-3xl font-bold">{data.temperature}°C</div>
            <div className="text-muted-foreground">{data.condition}</div>
            {data.location?.name && (
              <div className="text-sm text-muted-foreground">{data.location.name}</div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/30 dark:bg-slate-800/30">
            <Droplets className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="font-medium">{data.humidity}%</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/30 dark:bg-slate-800/30">
            <Wind className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-sm text-muted-foreground">Wind Speed</div>
              <div className="font-medium">{data.windSpeed} km/h</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
