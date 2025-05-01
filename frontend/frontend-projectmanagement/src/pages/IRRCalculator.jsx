import React, { useState } from 'react';
import '../style/IRRCalculator.css'; // Ensure this import is correct

function calculateIRR(cashFlows) {
  let irr = 0.1; // Initial guess
  let maxIterations = 1000;
  let accuracy = 0.0001;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    for (let j = 0; j < cashFlows.length; j++) {
      npv += cashFlows[j] / Math.pow(1 + irr, j);
    }
    if (Math.abs(npv) < accuracy) {
      return irr;
    }
    irr = irr - npv / calculateDerivative(cashFlows, irr);
  }
  return irr;
}

function calculateDerivative(cashFlows, irr) {
  let derivative = 0;
  for (let j = 1; j < cashFlows.length; j++) {
    derivative -= j * cashFlows[j] / Math.pow(1 + irr, j + 1);
  }
  return derivative;
}

function IRRCalculator() {
  const [cashFlows, setCashFlows] = useState([]);
  const [currentCashFlow, setCurrentCashFlow] = useState('');
  const [irr, setIrr] = useState(null);

  const addCashFlow = () => {
    if (currentCashFlow !== '') {
      setCashFlows([...cashFlows, parseFloat(currentCashFlow)]);
      setCurrentCashFlow('');
    }
  };

  const handleCalculate = (e) => {
    e.preventDefault(); // Prevent form submission
    const result = calculateIRR(cashFlows);
    setIrr(result);
  };

  return (
    <div className="irr-calculator">
      <h2>IRR Calculator</h2>
      <form onSubmit={handleCalculate}>
        <div className="input-section">
          <input
            type="number"
            value={currentCashFlow}
            onChange={(e) => setCurrentCashFlow(e.target.value)}
            placeholder="Enter cash flow"
          />
          <button type="button" onClick={addCashFlow}>Add Cash Flow</button>
        </div>
        <div className="cash-flows">
          {cashFlows.map((cf, index) => (
            <div key={index}>Year {index}: ${cf}</div>
          ))}
        </div>
        <button type="submit">Calculate IRR</button>
      </form>
      {irr !== null && (
        <div className="result">
          The Internal Rate of Return (IRR) for the provided cash flows is {(irr * 100).toFixed(2)}%.
        </div>
      )}
    </div>
  );
}

export default IRRCalculator;
