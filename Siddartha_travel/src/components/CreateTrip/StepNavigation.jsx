import React from 'react';
import PropTypes from 'prop-types';

const StepNavigation = ({ steps, currentStep, onStepChange }) => {
  // Custom timeline positions
  const stepPositions = [10, 30, 50, 70, 100];

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className="relative flex">
        {/* Progress line in the background */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0"></div>
        
        {/* Active progress line aligned with custom positions */}
        <div
          className="absolute top-4 left-0 h-1 bg-blue-600 z-10 transition-all duration-300"
          style={{
            width: `${stepPositions[currentStep]}%`
          }}
        ></div>

        {/* Step circles and labels */}
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center z-20 cursor-pointer"
            onClick={() => onStepChange(index)}
          >
            {/* Step circle */}
            <div
              className={`rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all duration-200 ${
                index <= currentStep
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400 hover:border-blue-400 hover:text-blue-500'
              }`}
            >
              {index + 1}
            </div>
            
            {/* Step label */}
            <div
              className={`mt-2 text-xs text-center ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-blue-500'
              }`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

StepNavigation.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
  onStepChange: PropTypes.func.isRequired,
};

export default StepNavigation;