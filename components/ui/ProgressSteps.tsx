'use client'

import React from 'react'

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-ovh-gray-200">
          <div
            className="absolute top-0 left-0 h-full bg-ovh-primary transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep
            const isPending = index > currentStep

            return (
              <div key={step} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    font-semibold text-sm transition-all duration-300
                    ${isCompleted 
                      ? 'bg-ovh-primary text-white' 
                      : isCurrent 
                        ? 'bg-ovh-primary text-white ring-4 ring-ovh-primary/20' 
                        : 'bg-ovh-gray-200 text-ovh-gray-500'}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                    mt-2 text-xs font-medium text-center max-w-[80px]
                    ${isCurrent ? 'text-ovh-primary' : 'text-ovh-gray-500'}
                  `}
                >
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
