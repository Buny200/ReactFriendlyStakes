import React from "react";
import "../../css/questionsAnswers.css"; 

function QuestionsAnswers() {
  return (
    <div className="questions-answers">
      <h2>Questions & Answers</h2>
      <p>Welcome to FriendlyStakes Questions & Answers section!</p>
      <p>Feel free to ask any questions regarding our betting platform.</p>

      <div className="question">
        <h3>How do I create a bet?</h3>
        <p>
          To create a bet, navigate to the "Create Bet" page and fill out the
          necessary information such as the bet title, description, and
          parameters. Once completed, submit the form, and your bet will be
          created.
        </p>
      </div>

      <div className="question">
        <h3>Can I participate in multiple bets simultaneously?</h3>
        <p>
          Yes, you can participate in multiple bets at the same time. Keep track
          of your ongoing bets in the "My Bets" section of your profile.
        </p>
      </div>

      <div className="question">
        <h3>How are winnings distributed?</h3>
        <p>
          Winnings are distributed based on the outcome of the bet and the
          amount wagered by each participant. Once the bet concludes, winnings
          are automatically credited to the accounts of the winning
          participants.
        </p>
      </div>

      
    </div>
  );
}

export default QuestionsAnswers;
