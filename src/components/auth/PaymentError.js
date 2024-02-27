import React from 'react';
import "../../css/PaymentError.css";

const PaymentErrorPage = () => {
  return (
    <div className="payment-error-container">
      <h2>Error de pago</h2>
      <p>Ha ocurrido un error durante el proceso de pago. Por favor, inténtalo de nuevo más tarde.</p>
    </div>
  );
};

export default PaymentErrorPage;
