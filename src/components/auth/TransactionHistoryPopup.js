import React from "react";
import "../../css/TransactionHistoryPopup.css"; 

const TransactionHistoryPopup = ({ transactionHistory, onClose, language }) => {
  return (
    <div className="transaction-history-popup-container">
      <div className="transaction-history-popup-content">
        <h3>{language === "es" ? "Historial de Transacciones" : "Transaction History"}</h3>
        <table className="transaction-history-table">
          <thead>
            <tr>
              <th>ID Transacción</th>
              <th>{language === "es" ? "Fecha" : "Date"}</th>
              <th>{language === "es" ? "Cantidad" : "Amount"}</th>
              <th>{language === "es" ? "Tipo" : "Type"}</th>
              <th>{language === "es" ? "Estado" : "Status"}</th>
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
        <button className="transaction-history-close-btn" onClick={onClose}>{language === "es" ? "Cerrar" : "Close"}</button>
      </div>
    </div>
  );
};

export default TransactionHistoryPopup;
