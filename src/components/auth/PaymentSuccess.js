import React from 'react';
import "../../css/PaymentSuccess.css";

const PaymentSuccess = ({ language }) => {
  return (
    <div className="success-container">
      <h2>{language === 'es' ? '¡Pago exitoso!' : 'Payment successful!'}</h2>
      <p>{language === 'es' ? 'Tu pago ha sido procesado exitosamente.' : 'Your payment has been processed successfully.'}</p>
    </div>
  );
};

export default PaymentSuccess;
