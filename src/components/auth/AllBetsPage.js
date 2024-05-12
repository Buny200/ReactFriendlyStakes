import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/AllBetsPage.css";

const AllBetsPage = ({ language }) => {
  const [bets, setBets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBet, setSelectedBet] = useState(null); 
  const [showPopup, setShowPopup] = useState(false); 
  const betsPerPage = 10;

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/bets");
        setBets(response.data);
        const totalBets = response.data.length;
        const totalPages = Math.ceil(totalBets / betsPerPage);
        if(totalBets = 0){
          setTotalPages('1');
        }else  setTotalPages(totalPages);

      } catch (error) {
        console.error("Error fetching bets:", error);
      }
    };
    fetchBets();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBetClick = async (betId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/bets/${betId}`);
      setSelectedBet(response.data);
      setShowPopup(true); 
    } catch (error) {
      console.error("Error fetching bet details:", error);
    }
  };


  const handlePopupClose = () => {
    setShowPopup(false);
  };

  const firstBetIndex = (currentPage - 1) * betsPerPage;
  const lastBetIndex = Math.min(firstBetIndex + betsPerPage, bets.length);
  const currentBets = bets.slice(firstBetIndex, lastBetIndex);


  return (
    <div>
      <h2 className="title">{language === 'es' ? "Todas las Apuestas Activas" : "All Active Bets"}</h2>
      <ul className="bet-list">
        {currentBets.map((bet) => (
          <li key={bet.betId} className="bet-item" onClick={() => handleBetClick(bet.betId)}>
            <div className="bet-info">
              <div className="bet-title">
                <span className="title-prefix">{language === 'es' ? "Título de la apuesta: " : "Bet Title: "}</span>
                {bet.title}
              </div>
              <div className="bet-details">
                <p>{language === 'es' ? "Creador" : "Creator"}: {bet.creatorId.nickname}</p>
                <p>{language === 'es' ? "Fecha de inicio" : "Start Date"}: {new Date(bet.startDate).toLocaleDateString()}</p>
                <p>{language === 'es' ? "Cantidad de la apuesta" : "Bet Amount"}: {bet.betAmount}</p>
                <p>{language === 'es' ? "Número de participantes" : "Participants Number"}: {bet.participantsNumber}</p>
                <p>{language === 'es' ? "Estado" : "Status"}: {bet.status}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span className="pagination-info">
          {language === 'es' ? "Página" : "Page"} {currentPage} {language === 'es' ? "de" : "of"} {totalPages}
        </span>
        <button
          className="pagination-arrow"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
      {showPopup && selectedBet && (
        <div className="popup" onClick={handlePopupClose}>
          <div className="popup-inner" onClick={(e) => e.stopPropagation()}>
            <h2>{language === 'es' ? "Detalles de la Apuesta" : "Bet Details"}</h2>
            <p>{language === 'es' ? "Título" : "Title"}: {selectedBet.title}</p>
            <p>{language === 'es' ? "Creador" : "Creator"}: {selectedBet.creator.nickname}</p>
            <p>{language === 'es' ? "Fecha de inicio" : "Start Date"}: {new Date(selectedBet.startDate).toLocaleString()}</p>
            <p>{language === 'es' ? "Cantidad de la apuesta" : "Bet Amount"}: {selectedBet.betAmount}</p>
            <p>{language === 'es' ? "Número de participantes" : "Participants Number"}: {selectedBet.participantsNumber}</p>
            <p>{language === 'es' ? "Estado" : "Status"}: {selectedBet.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBetsPage;
