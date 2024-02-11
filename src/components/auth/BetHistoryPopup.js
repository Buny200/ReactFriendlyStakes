import React, { useState } from "react";
import "../../css/BetHistoryPopup.css";

const BetHistoryPopup = ({ betHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const betsPerPage = 6;

  const totalPages = Math.ceil(betHistory.betList.length / betsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const firstBetIndex = (currentPage - 1) * betsPerPage;
  const lastBetIndex = Math.min(
    firstBetIndex + betsPerPage,
    betHistory.betList.length
  );
  const currentBets = betHistory.betList.slice(firstBetIndex, lastBetIndex);

  return (
    <div className="bet-history-popup">
      <h3 className="popup-title">
        Historial de Apuestas de {betHistory.nickname}
      </h3>
      <table className="bet-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha de Inicio</th>
            <th>Monto de Apuesta</th>
            <th>Número de Participantes</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentBets.map((bet) => (
            <tr key={bet.betId}>
              <td>{bet.title}</td>
              <td>{bet.startDate}</td>
              <td>${bet.betAmount.toFixed(2)}</td>
              <td>{bet.participantsNumber}</td>
              <td>{bet.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        <span className="pagination-info">
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          Página {currentPage} de {totalPages}
          <button
            className="pagination-arrow"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default BetHistoryPopup;
