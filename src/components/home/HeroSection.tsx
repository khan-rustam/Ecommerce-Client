import React from "react";
import { Link } from "react-router-dom";
import { useBrandColors } from '../../contexts/BrandColorContext';

interface HeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage: string;
}

const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
    <span className="block w-1.5 h-6 bg-white rounded-full mb-1 opacity-70"></span>
    <span className="text-xs text-white opacity-80">Scroll</span>
  </div>
);

const HeroSection: React.FC<HeroProps> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundImage,
}) => {
  const { colors } = useBrandColors();
  return (
    <div
      className="relative h-[60vh] md:h-[80vh] overflow-hidden bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundColor: colors.background }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

      <div className="relative z-10 w-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="w-full md:w-2/3 lg:w-1/2 text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fade-in-up">
              {title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="inline-block mr-2 animate-hero-text"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-2xl mb-10 opacity-90 max-w-lg animate-fade-in-up delay-300">
              {subtitle}
            </p>
            <Link
              to={buttonLink}
              style={{ background: colors.primary, color: '#fff' }}
              className="inline-block font-bold py-3 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105 animate-fade-in-up delay-500"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
      <ScrollIndicator />
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .animate-hero-text {
          animation: fade-in-up 0.7s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default HeroSection;
