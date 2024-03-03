import React from "react";
import "../../css/TransactionHistoryPopup.css"; 

const TransactionHistoryPopup = ({ transactionHistory, onClose }) => {
  return (
    <div className="transaction-history-popup">
      <div className="popup-content">
        <h3>Historial de Transacciones</h3>
        <table>
          <thead>
            <tr>
              <th>ID Transacción</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Tipo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
          {transactionHistory.map((transaction, index) => (
              <tr key={index + 1}>
                <td>{index + 1}</td>
                <td>{transaction.transactionDate}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.transactionType}</td>
                <td>{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default TransactionHistoryPopup;
