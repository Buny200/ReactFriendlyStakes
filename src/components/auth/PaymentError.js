import React from 'react';
import "../../css/PaymentError.css";

const PaymentErrorPage = ({ language }) => {
  return (
    <div className="payment-error-container">
      <h2>{language === 'es' ? 'Error de pago' : 'Payment error'}</h2>
      <p>{language === 'es' ? 'Ha ocurrido un error durante el proceso de pago. Por favor, inténtalo de nuevo más tarde.' : 'An error occurred during the payment process. Please try again later.'}</p>
    </div>
  );
};

export default PaymentErrorPage;
