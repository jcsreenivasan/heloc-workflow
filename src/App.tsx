import { useCallback } from 'react';
import { useFunnel } from './hooks/useFunnel';
import { FunnelLayout } from './components/funnel/FunnelLayout';
import { StepLoanPurpose } from './components/funnel/steps/StepLoanPurpose';
import { StepPropertyType } from './components/funnel/steps/StepPropertyType';
import { StepResidencyType } from './components/funnel/steps/StepResidencyType';
import { StepTimeline } from './components/funnel/steps/StepTimeline';
import { StepLocation } from './components/funnel/steps/StepLocation';
import { StepFinancials } from './components/funnel/steps/StepFinancials';
import { StepCreditScore } from './components/funnel/steps/StepCreditScore';
import { StepMilitary } from './components/funnel/steps/StepMilitary';
import { LeadCapture } from './components/funnel/LeadCapture';
import { LoadingScreen } from './components/funnel/LoadingScreen';
import { RatesDisplay } from './components/funnel/RatesDisplay';

function App() {
  const {
    currentStep,
    direction,
    data,
    updateData,
    goNext,
    goBack,
    progress,
    currentQuestionIndex,
    isQuestionStep,
    canGoBack,
  } = useFunnel();

  const autoAdvance = useCallback((updater: () => void) => {
    updater();
    setTimeout(goNext, 150);
  }, [goNext]);

  const renderStep = () => {
    switch (currentStep) {
      case 'loan-purpose':
        return (
          <StepLoanPurpose
            data={data}
            onSelect={value => autoAdvance(() => updateData({ loanPurpose: value }))}
          />
        );
      case 'property-type':
        return (
          <StepPropertyType
            data={data}
            onSelect={value => autoAdvance(() => updateData({ propertyType: value }))}
          />
        );
      case 'residency-type':
        return (
          <StepResidencyType
            data={data}
            onSelect={value => autoAdvance(() => updateData({ residencyType: value }))}
          />
        );
      case 'timeline':
        return (
          <StepTimeline
            data={data}
            onSelect={value => autoAdvance(() => updateData({ timeline: value }))}
          />
        );
      case 'location':
        return (
          <StepLocation
            data={data}
            onChange={updateData}
            onNext={goNext}
          />
        );
      case 'financials':
        return (
          <StepFinancials
            data={data}
            onChange={updateData}
            onNext={goNext}
          />
        );
      case 'credit-score':
        return (
          <StepCreditScore
            data={data}
            onChange={updateData}
            onNext={goNext}
          />
        );
      case 'military':
        return (
          <StepMilitary
            data={data}
            onSelect={value => autoAdvance(() => updateData({ military: value }))}
          />
        );
      case 'lead-capture':
        return (
          <LeadCapture
            data={data}
            onChange={updateData}
            onSubmit={goNext}
          />
        );
      case 'loading':
        return <LoadingScreen onComplete={goNext} />;
      case 'rates':
        return <RatesDisplay data={data} />;
      default:
        return null;
    }
  };

  return (
    <FunnelLayout
      currentStep={currentStep}
      currentQuestionIndex={currentQuestionIndex}
      isQuestionStep={isQuestionStep}
      canGoBack={canGoBack}
      onBack={goBack}
      direction={direction}
      progress={progress}
    >
      {renderStep()}
    </FunnelLayout>
  );
}

export default App;
