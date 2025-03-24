
// Air quality utility functions

export interface Pollutant {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface AirQualityData {
  aqi: number;
  category: AqiCategory;
  dominantPollutant: string;
  pollutants: Pollutant[];
  location: {
    city: string;
    country: string;
  };
  time: {
    local: string;
    utc: string;
  };
}

export type AqiCategory = 
  | "good" 
  | "moderate" 
  | "sensitive" 
  | "unhealthy" 
  | "veryunhealthy" 
  | "hazardous";

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

/**
 * Returns the AQI category based on the AQI value
 */
export const getAqiCategory = (aqi: number): AqiCategory => {
  if (aqi <= 50) return "good";
  if (aqi <= 100) return "moderate";
  if (aqi <= 150) return "sensitive";
  if (aqi <= 200) return "unhealthy";
  if (aqi <= 300) return "veryunhealthy";
  return "hazardous";
};

/**
 * Returns a human-readable description of the AQI category
 */
export const getAqiDescription = (category: AqiCategory): string => {
  switch (category) {
    case "good":
      return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    case "moderate":
      return "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.";
    case "sensitive":
      return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
    case "unhealthy":
      return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    case "veryunhealthy":
      return "Health warnings of emergency conditions. The entire population is more likely to be affected.";
    case "hazardous":
      return "Health alert: everyone may experience more serious health effects.";
    default:
      return "Unknown air quality level.";
  }
};

/**
 * Returns the appropriate color for the AQI category
 */
export const getAqiColor = (category: AqiCategory): string => {
  switch (category) {
    case "good":
      return "#4CAF50";
    case "moderate":
      return "#FFEB3B";
    case "sensitive":
      return "#FF9800";
    case "unhealthy":
      return "#F44336";
    case "veryunhealthy":
      return "#9C27B0";
    case "hazardous":
      return "#7E0023";
    default:
      return "#9E9E9E";
  }
};

/**
 * Returns a description for a pollutant
 */
export const getPollutantDescription = (pollutantName: string): string => {
  switch (pollutantName.toUpperCase()) {
    case "PM2.5":
      return "Fine particulate matter that can penetrate deep into the lungs and bloodstream.";
    case "PM10":
      return "Coarse particulate matter that can cause respiratory issues.";
    case "O3":
    case "OZONE":
      return "Ground-level ozone that can trigger asthma and other respiratory problems.";
    case "NO2":
      return "Nitrogen dioxide that can cause inflammation of the airways.";
    case "SO2":
      return "Sulfur dioxide that can cause irritation to the eyes and respiratory system.";
    case "CO":
      return "Carbon monoxide that reduces oxygen delivery to the body's organs.";
    default:
      return "An air pollutant that can affect health and environment.";
  }
};

/**
 * Generates mock air quality data for demo purposes
 */
export const generateMockAirQualityData = (
  city: string = "Demo City",
  country: string = "Demo Country"
): AirQualityData => {
  const aqi = Math.floor(Math.random() * 300);
  const category = getAqiCategory(aqi);
  
  const pm25Value = Math.floor(Math.random() * 150);
  const pm10Value = Math.floor(Math.random() * 200);
  const o3Value = Math.floor(Math.random() * 150);
  const no2Value = Math.floor(Math.random() * 200);
  const so2Value = Math.floor(Math.random() * 100);
  const coValue = Math.floor(Math.random() * 10000) / 100;
  
  const pollutants: Pollutant[] = [
    {
      name: "PM2.5",
      value: pm25Value,
      unit: "μg/m³",
      description: getPollutantDescription("PM2.5")
    },
    {
      name: "PM10",
      value: pm10Value,
      unit: "μg/m³",
      description: getPollutantDescription("PM10")
    },
    {
      name: "O3",
      value: o3Value,
      unit: "ppb",
      description: getPollutantDescription("O3")
    },
    {
      name: "NO2",
      value: no2Value,
      unit: "ppb",
      description: getPollutantDescription("NO2")
    },
    {
      name: "SO2",
      value: so2Value,
      unit: "ppb",
      description: getPollutantDescription("SO2")
    },
    {
      name: "CO",
      value: coValue,
      unit: "ppm",
      description: getPollutantDescription("CO")
    }
  ];
  
  // Find dominant pollutant (highest percentage of its respective limit)
  const dominantPollutant = pollutants.reduce((highest, current) => {
    // Normalized values (as percentage of threshold where it becomes unhealthy)
    const normalizedValues: Record<string, number> = {
      "PM2.5": current.value / 35,
      "PM10": current.value / 150,
      "O3": current.value / 70,
      "NO2": current.value / 100,
      "SO2": current.value / 75,
      "CO": current.value / 9
    };
    
    const currentNormalized = normalizedValues[current.name] || 0;
    const highestNormalized = normalizedValues[highest.name] || 0;
    
    return currentNormalized > highestNormalized ? current : highest;
  }, pollutants[0]);
  
  return {
    aqi,
    category,
    dominantPollutant: dominantPollutant.name,
    pollutants,
    location: {
      city,
      country
    },
    time: {
      local: new Date().toLocaleString(),
      utc: new Date().toISOString()
    }
  };
};

/**
 * Generates mock weather data for demo purposes
 */
export const generateMockWeatherData = (): WeatherData => {
  const conditions = [
    { condition: "Clear", icon: "sun" },
    { condition: "Partly Cloudy", icon: "cloud-sun" },
    { condition: "Cloudy", icon: "cloud" },
    { condition: "Rain", icon: "cloud-rain" },
    { condition: "Thunderstorm", icon: "cloud-lightning" },
    { condition: "Snow", icon: "cloud-snow" },
    { condition: "Fog", icon: "cloud-fog" }
  ];
  
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temperature: Math.floor(Math.random() * 35) + 5, // 5 to 40 celsius
    humidity: Math.floor(Math.random() * 60) + 20, // 20% to 80%
    windSpeed: Math.floor(Math.random() * 30) + 1, // 1 to 30 km/h
    condition: randomCondition.condition,
    icon: randomCondition.icon
  };
};
