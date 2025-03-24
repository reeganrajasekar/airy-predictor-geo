
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  RefreshCw, 
  MapPin,
  Clock,
  Wind
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AirQualityData, getAqiCategory, getAqiDescription } from '@/utils/airQualityUtils';

interface AirQualityCardProps {
  data: AirQualityData | null;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ 
  data, 
  isLoading = false, 
  onRefresh 
}) => {
  if (isLoading) {
    return (
      <Card className="glass-card animate-pulse-slow shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
            <div className="h-28 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
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
            <p className="text-lg font-medium text-muted-foreground">No air quality data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`aqi-card shadow-lg aqi-${data.category}`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 rounded-full font-medium border-2">
              Air Quality Index
            </Badge>
            <Badge 
              className="px-3 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: `rgb(var(--aqi-${data.category}))` }}
            >
              {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
            </Badge>
          </div>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onRefresh}
              className="h-8 w-8 rounded-full hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-baseline">
            <h3 className="text-5xl font-bold">{data.aqi}</h3>
            <span className="ml-2 text-sm font-medium text-muted-foreground">AQI</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {getAqiDescription(data.category)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {data.location.city}, {data.location.country}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(data.time.local).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Dominant Pollutant</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Info className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    The pollutant with the highest concentration relative to its air quality standard.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-3">
            <Wind className="h-5 w-5 text-primary" />
            <div>
              <span className="font-medium">{data.dominantPollutant}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {data.pollutants.find(p => p.name === data.dominantPollutant)?.value} 
                {data.pollutants.find(p => p.name === data.dominantPollutant)?.unit}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium mb-3">Pollutants</h4>
          <div className="grid grid-cols-3 gap-2">
            {data.pollutants.map((pollutant) => (
              <TooltipProvider key={pollutant.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-center p-2 rounded-md bg-white/30 dark:bg-slate-800/30 hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors cursor-default">
                      <div className="font-medium">{pollutant.name}</div>
                      <div className="text-sm">
                        {pollutant.value} {pollutant.unit}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{pollutant.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
