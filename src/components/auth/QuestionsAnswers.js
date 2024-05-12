import React from "react";
import "../../css/questionsAnswers.css"; 

const QuestionsAnswers = ({ language }) => {
  return (
    <div className="questions-answers">
      <h2>{language === 'es' ? "Preguntas y Respuestas" : "Questions & Answers"}</h2>
      <p>{language === 'es' ? "¡Bienvenido a la sección de Preguntas y Respuestas de FriendlyStakes!" : "Welcome to FriendlyStakes Questions & Answers section!"}</p>
      <p>{language === 'es' ? "No dudes en hacer cualquier pregunta relacionada con nuestra plataforma de apuestas." : "Feel free to ask any questions regarding our betting platform."}</p>

      <div className="question">
        <h3>{language === 'es' ? "¿Cómo puedo crear una apuesta?" : "How do I create a bet?"}</h3>
        <p>
          {language === 'es' ? "Para crear una apuesta, dirígete a la página 'Crear Apuesta' y completa la información necesaria como el título de la apuesta, la descripción y los parámetros. Una vez completado, envía el formulario y tu apuesta será creada." : "To create a bet, navigate to the 'Create Bet' page and fill out the necessary information such as the bet title, description, and parameters. Once completed, submit the form, and your bet will be created."}
        </p>
      </div>

      <div className="question">
        <h3>{language === 'es' ? "¿Puedo participar en múltiples apuestas simultáneamente?" : "Can I participate in multiple bets simultaneously?"}</h3>
        <p>
          {language === 'es' ? "Sí, puedes participar en múltiples apuestas al mismo tiempo. Haz un seguimiento de tus apuestas en curso en la sección 'Mis Apuestas' de tu perfil." : "Yes, you can participate in multiple bets at the same time. Keep track of your ongoing bets in the 'My Bets' section of your profile."}
        </p>
      </div>

      <div className="question">
        <h3>{language === 'es' ? "¿Cómo se distribuyen las ganancias?" : "How are winnings distributed?"}</h3>
        <p>
          {language === 'es' ? "Las ganancias se distribuyen en función del resultado de la apuesta y la cantidad apostada por cada participante. Una vez que la apuesta concluye, las ganancias se acreditan automáticamente en las cuentas de los participantes ganadores." : "Winnings are distributed based on the outcome of the bet and the amount wagered by each participant. Once the bet concludes, winnings are automatically credited to the accounts of the winning participants."}
        </p>
      </div>
    </div>
  );
}

export default QuestionsAnswers;
