'use client'

import React from 'react'

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <div className="relative pt-1 pb-6">
        {/* Ligne de progression (centrée verticalement avec les cercles) */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-ovh-gray-200" aria-hidden="true">
          <div
            className="h-full bg-ovh-primary transition-all duration-500 origin-left"
            style={{ 
              width: steps.length > 1 
                ? `${(currentStep / (steps.length - 1)) * 100}%` 
                : '0%' 
            }}
          />
        </div>

        {/* Étapes : layout horizontal fixe */}
        <div className="relative flex flex-nowrap justify-between gap-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <div 
                key={`${index}-${step}`} 
                className="flex flex-col items-center flex-1 min-w-0"
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10
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
                <span
                  className={`
                    mt-2 text-xs font-medium text-center truncate w-full
                    ${isCurrent ? 'text-ovh-primary' : 'text-ovh-gray-500'}
                  `}
                  title={step}
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
