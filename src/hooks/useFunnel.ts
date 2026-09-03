import { useState, useCallback } from 'react';
import type { FunnelData, FunnelStep } from '../types/funnel';
import {
  STEP_ORDER,
  STEP_ORDER_WITH_PURPOSE,
  QUESTION_STEPS,
  QUESTION_STEPS_WITH_PURPOSE,
} from '../types/funnel';

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

export function useFunnel(initialPurpose?: 'purchase' | 'refinance') {
  const [currentStep, setCurrentStep] = useState<FunnelStep>('property-type');
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [data, setData] = useState<FunnelData>(() => ({
    ...DEFAULT_DATA,
    loanPurpose: initialPurpose ?? null,
  }));
  // true = opened via landing page buttons (loan purpose pre-selected, step 1 skipped)
  const [purposePreselected, setPurposePreselected] = useState(true);

  const stepOrder = purposePreselected ? STEP_ORDER_WITH_PURPOSE : STEP_ORDER;
  const questionSteps = purposePreselected ? QUESTION_STEPS_WITH_PURPOSE : QUESTION_STEPS;

  const updateData = useCallback((updates: Partial<FunnelData>) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  // Called by landing page buttons — pre-sets purpose and starts at property-type
  const openWithPurpose = useCallback((purpose: 'purchase' | 'refinance') => {
    setData({ ...DEFAULT_DATA, loanPurpose: purpose });
    setPurposePreselected(true);
    setCurrentStep('property-type');
    setDirection('forward');
  }, []);

  const reset = useCallback(() => {
    setData(DEFAULT_DATA);
    setPurposePreselected(true);
    setCurrentStep('property-type');
    setDirection('forward');
  }, []);

  const goNext = useCallback(() => {
    setDirection('forward');
    setCurrentStep(prev => {
      const idx = stepOrder.indexOf(prev);
      if (idx < stepOrder.length - 1) return stepOrder[idx + 1];
      return prev;
    });
  }, [stepOrder]);

  const goBack = useCallback(() => {
    setDirection('backward');
    setCurrentStep(prev => {
      const idx = stepOrder.indexOf(prev);
      if (idx > 0) return stepOrder[idx - 1];
      return prev;
    });
  }, [stepOrder]);

  const currentQuestionIndex = questionSteps.indexOf(currentStep);
  const isQuestionStep = currentQuestionIndex >= 0;
  const totalQuestions = questionSteps.length;

  const canGoBack = stepOrder.indexOf(currentStep) > 0
    && currentStep !== 'loading'
    && currentStep !== 'rates';

  return {
    currentStep,
    direction,
    data,
    updateData,
    openWithPurpose,
    reset,
    goNext,
    goBack,
    currentQuestionIndex,
    isQuestionStep,
    totalQuestions,
    canGoBack,
  };
}
