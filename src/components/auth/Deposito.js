import React, { useState } from 'react';
import axios from 'axios';
import "../../css/Deposito.css";

const Deposito = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [currency] = useState('EUR');
  const [description] = useState('FriendlyStakes Payment');
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
      setError('Error al procesar el pago. Por favor, inténtelo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
  };

  return (
    <div className="deposito-container">
      <h2>Depósito</h2>
      <form className="deposito-form">
      <div className="amount-options">
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount(5)}>5€</button>
      </div>
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount(10)}>10€</button>
      </div>
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount(15)}>15€</button>
      </div>
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount(20)}>20€</button>
      </div>
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount(50)}>50€</button>
      </div>
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount(100)}>100€</button>
      </div>
      <div className="amount-option">
        <button type="button" onClick={() => setSelectedAmount('other')}>Otro</button>
      </div>
    </div>
        <div className="selected-amount-display">
          Cantidad seleccionada: {selectedAmount !== 'other' ? `${selectedAmount} ${currency}` : `${customAmount} ${currency}`}
        </div>
        {selectedAmount === 'other' && (
          <div className="form-group">
            <label htmlFor="custom-amount">Ingrese la cantidad:</label>
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
          {loading ? 'Procesando...' : 'Pagar con PayPal'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Deposito;
