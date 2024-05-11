import React, { useState } from 'react';
import axios from 'axios';
import "../../css/Deposito.css";

const Deposito = ({ language }) => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [currency] = useState(language === 'es' ? 'EUR' : 'USD');
  const [description] = useState(language === 'es' ? 'Pago de FriendlyStakes' : 'FriendlyStakes Payment');
  const [intent] = useState('sale');
  const [method ] = useState('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeposit = async () => {
    setLoading(true);
    setError('');

    try {
      const amountToDeposit = selectedAmount !== 'other' ? selectedAmount : customAmount;
      const userId = window.sessionStorage.getItem("USER_ID");
      const response = await axios.post(`http://localhost:8080/pay/user/${userId}`, {
        price: amountToDeposit,
        currency,
        description,
        intent,
        method
      });
      
      window.location.href = response.data;
    } catch (error) {
      setError(language === 'es' ? 'Error al procesar el pago. Por favor, inténtelo de nuevo más tarde.' : 'An error occurred while processing the payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  return (
    <div className="deposito-container">
      <h2>{language === 'es' ? 'Depósito' : 'Deposit'}</h2>
      <form className="deposito-form">
        <div className="amount-options">
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount(5)}>5{currency}</button>
          </div>
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount(10)}>10{currency}</button>
          </div>
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount(15)}>15{currency}</button>
          </div>
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount(20)}>20{currency}</button>
          </div>
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount(50)}>50{currency}</button>
          </div>
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount(100)}>100{currency}</button>
          </div>
          <div className="amount-option">
            <button type="button" onClick={() => setSelectedAmount('other')}>{language === 'es' ? 'Otro' : 'Other'}</button>
          </div>
        </div>
        <div className="selected-amount-display">
          {language === 'es' ? 'Cantidad seleccionada:' : 'Selected amount:'} {selectedAmount !== 'other' ? `${selectedAmount} ${currency}` : `${customAmount} ${currency}`}
        </div>
        {selectedAmount === 'other' && (
          <div className="form-group">
            <label htmlFor="custom-amount">{language === 'es' ? 'Ingrese la cantidad:' : 'Enter the amount:'}</label>
            <input
              type="number"
              id="custom-amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              required
            />
          </div>
        )}
        <button type="button" onClick={handleDeposit} disabled={loading}>
          {loading ? (language === 'es' ? 'Procesando...' : 'Processing...') : (language === 'es' ? 'Pagar con PayPal' : 'Pay with PayPal')}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Deposito;
