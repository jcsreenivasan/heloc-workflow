import { useState, useCallback } from 'react';
import type { FunnelData, FunnelStep } from '../types/funnel';
import { STEP_ORDER, QUESTION_STEPS } from '../types/funnel';

const DEFAULT_DATA: FunnelData = {
  loanPurpose: null,
  propertyType: null,
  residencyType: null,
  timeline: null,
  state: '',
  zip: '',
  propertyValue: 450000,
  downPayment: 90000,
  creditScore: 700,
  military: null,
  lead: { name: '', email: '', phone: '' },
};

export function useFunnel() {
  const [currentStep, setCurrentStep] = useState<FunnelStep>('loan-purpose');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [data, setData] = useState<FunnelData>(DEFAULT_DATA);

  const updateData = useCallback((updates: Partial<FunnelData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const goNext = useCallback(() => {
    setDirection('forward');
    setCurrentStep(prev => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx < STEP_ORDER.length - 1) {
        return STEP_ORDER[idx + 1];
      }
      return prev;
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection('backward');
    setCurrentStep(prev => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx > 0) {
        return STEP_ORDER[idx - 1];
      }
      return prev;
    });
  }, []);

  const goToStep = useCallback((step: FunnelStep) => {
    const currentIdx = STEP_ORDER.indexOf(currentStep);
    const targetIdx = STEP_ORDER.indexOf(step);
    setDirection(targetIdx > currentIdx ? 'forward' : 'backward');
    setCurrentStep(step);
  }, [currentStep]);

  const currentQuestionIndex = QUESTION_STEPS.indexOf(currentStep);
  const isQuestionStep = currentQuestionIndex >= 0;
  const totalQuestions = QUESTION_STEPS.length;
  const progress = isQuestionStep
    ? ((currentQuestionIndex + 1) / totalQuestions) * 100
    : currentStep === 'lead-capture' ? 100
    : currentStep === 'loading' || currentStep === 'rates' ? 100
    : 0;

  const canGoBack = STEP_ORDER.indexOf(currentStep) > 0
    && currentStep !== 'loading'
    && currentStep !== 'rates';

  return {
    currentStep,
    direction,
    data,
    updateData,
    goNext,
    goBack,
    goToStep,
    progress,
    currentQuestionIndex,
    isQuestionStep,
    totalQuestions,
    canGoBack,
  };
}
