import React from 'react';
import { Dumbbell, Zap, Target, Flame } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-orange-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-red-500 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute bottom-32 left-32 w-16 h-16 border border-yellow-500 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-48 right-20 w-20 h-20 border border-orange-400 rounded-full animate-pulse delay-700"></div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col justify-center px-12 relative z-10 w-full">
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-2xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="ml-4 text-3xl font-bold text-white">FitForge</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Transform Your Body,
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Forge Your Future
            </span>
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Join thousands of fitness enthusiasts who are crushing their goals with our 
            comprehensive training platform. Your journey to greatness starts here.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <Zap className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-gray-300 text-sm">High-Intensity Workouts</span>
            </div>
            <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <Target className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-gray-300 text-sm">Goal Tracking</span>
            </div>
            <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700">
              <Flame className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-gray-300 text-sm">Burn Calories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-2xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="ml-4 text-2xl font-bold text-white">FitForge</h1>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400">{subtitle}</p>
          </div>

          {/* Form Container */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};