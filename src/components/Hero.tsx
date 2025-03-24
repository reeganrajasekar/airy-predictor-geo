
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onRequestLocation: () => void;
}

const Hero: React.FC<HeroProps> = ({ onRequestLocation }) => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2320202F' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 animate-fade-in">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Air Quality Insights
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight animate-fade-in-up delay-100">
            Breathe with <span className="text-primary">Confidence</span><br />
            Know Your Air Quality
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
            Get real-time air quality predictions and forecasts based on your location. 
            Monitor pollutants, check weather conditions, and make informed decisions for your health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Button
              size="lg"
              onClick={onRequestLocation}
              className="group relative overflow-hidden rounded-full px-8 py-6 shadow-md transition-all duration-300 hover:shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get My Location
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80 opacity-100 transition-opacity"></span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-6 border-2 transition-all duration-300 hover:bg-secondary"
            >
              Explore Air Quality Index
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/80 to-transparent z-0"></div>
    </section>
  );
};

export default Hero;
