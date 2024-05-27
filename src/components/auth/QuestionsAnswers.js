import React from "react";
import "../../css/questionsAnswers.css";

const QuestionsAnswers = ({ language }) => {
  return (
    <div className="questions-answers">
      <h2>
        {language === "es" ? "Preguntas y Respuestas" : "Questions & Answers"}
      </h2>
      <p>
        {language === "es"
          ? "¡Bienvenido a la sección de Preguntas y Respuestas de FriendlyStakes!"
          : "Welcome to FriendlyStakes Questions & Answers section!"}
      </p>

      <div className="question">
        <h3>
          {language === "es"
            ? "¿Cómo puedo crear una apuesta?"
            : "How do I create a bet?"}
        </h3>
        <p>
          {language === "es"
            ? "Para crear una apuesta, dirígete a la 'Crear Apuesta' y completa la información necesaria como el título de la apuesta, la descripción y los parámetros. Una vez completado, envía el formulario y tu apuesta será creada."
            : "To create a bet, navigate to the 'Create Bet' page and fill out the necessary information such as the bet title, description, and parameters. Once completed, submit the form, and your bet will be created."}
        </p>
      </div>

      <div className="question">
        <h3>
          {language === "es"
            ? "¿Puedo participar en múltiples apuestas simultáneamente?"
            : "Can I participate in multiple bets simultaneously?"}
        </h3>
        <p>
          {language === "es"
            ? "Sí, puedes participar en múltiples apuestas al mismo tiempo. Haz un seguimiento de tus apuestas en curso en la sección 'Mis Apuestas' de tu perfil."
            : "Yes, you can participate in multiple bets at the same time. Keep track of your ongoing bets in the 'My Bets' section of your profile."}
        </p>
      </div>

      <div className="question">
        <h3>
          {language === "es"
            ? "¿Cómo se distribuyen las ganancias?"
            : "How are winnings distributed?"}
        </h3>
        <p>
          {language === "es"
            ? "Las ganancias se distribuyen en función del resultado de la apuesta y la cantidad apostada por cada participante. Una vez que la apuesta concluye, las ganancias se acreditan automáticamente en las cuentas de los participantes ganadores."
            : "Winnings are distributed based on the outcome of the bet and the amount wagered by each participant. Once the bet concludes, winnings are automatically credited to the accounts of the winning participants."}
        </p>
      </div>

      <div className="question">
        <h3>
          {language === "es"
            ? "¿Cómo puedo contactar al soporte técnico?"
            : "How can I contact technical support?"}
        </h3>
        <p>
          {language === "es"
            ? "Si necesitas ayuda técnica o tienes alguna pregunta sobre el funcionamiento de la aplicación, puedes usar nuestro chat de asistencia en vivo. Simplemente haz clic en el icono de chat en la esquina inferior derecha de la pantalla para iniciar una conversación con un miembro de nuestro equipo de soporte técnico."
            : "If you need technical assistance or have any questions about the operation of the application, you can use our live support chat. Simply click on the chat icon in the bottom right corner of the screen to start a conversation with a member of our technical support team."}
        </p>
      </div>

      {/* Manual del Usuario */}
      {language === "es" ? (
        <div className="manual-usuario">
          <h2>Manual del Usuario</h2>
          <h3>Descripción General del Sistema</h3>
          <p>
            FriendlyStakes es una plataforma interactiva que permite a los
            usuarios crear y participar en apuestas y desafíos amistosos. La
            aplicación está diseñada para fomentar la competencia sana y el
            entretenimiento, ofreciendo múltiples modalidades de juego y
            apuestas. Los usuarios pueden registrarse, iniciar sesión, gestionar
            su perfil, participar en apuestas personalizadas y tradicionales, y
            utilizar el chat global y de asistencia.
          </p>
          <h3>Registro de Usuario</h3>
          <p>
            Para registrarse en FriendlyStakes, haga clic en el botón
            "Registrarse" en la página de inicio y complete el formulario de
            registro con su información personal. Una vez registrado, puede
            iniciar sesión en su cuenta utilizando su correo electrónico y
            contraseña proporcionados durante el registro.
          </p>
          <h3>Crear y Participar en Apuestas</h3>
          <p>
            Puede crear sus propias apuestas haciendo clic en "Crear Apuesta" y
            siguiendo las instrucciones proporcionadas. Para participar en una
            apuesta existente, simplemente haga clic en la apuesta deseada y
            siga las instrucciones para realizar su predicción y apostar.
          </p>
          <h3>Seguimiento de Apuestas</h3>
          <p>
            El seguimiento de sus apuestas está disponible en la sección "Mis
            Apuestas" de su perfil. Aquí puede ver el estado de sus apuestas
            activas, así como el historial de apuestas anteriores.
          </p>
          <h3>Recuperar Contraseña</h3>
          <p>
            Si olvida su contraseña, puede recuperarla haciendo clic en el
            enlace "¿Olvidó su contraseña?" en la página de inicio de sesión. Se
            le pedirá que ingrese su dirección de correo electrónico y luego
            recibirá instrucciones sobre cómo restablecer su contraseña.
          </p>
          <h3>Cambiar Idioma</h3>
          <p>
            Puede cambiar el idioma de la aplicación en la configuración de su
            perfil. Busque la opción "Idioma" y seleccione su idioma preferido
            de la lista desplegable.
          </p>
          <h3>Editar Perfil</h3>
          <p>
            Para editar su perfil, vaya a la sección "Editar Perfil" en su
            página de perfil. Aquí puede actualizar su información personal,
            incluyendo su nombre, dirección de correo electrónico, contraseña, y
            foto de perfil.
          </p>
          <h3>Eliminar Cuenta</h3>
          <p>
            Si decide no utilizar más FriendlyStakes, puede eliminar su cuenta
            en la sección "Eliminar Cuenta" de la configuración de su perfil.
            Tenga en cuenta que esta acción es irreversible y eliminará
            permanentemente su cuenta y todos los datos asociados.
          </p>
          {/* Más secciones del manual... */}
        </div>
      ) : (
        <div className="user-manual">
          <h2>User Manual</h2>
          <h3>General System Description</h3>
          <p>
            FriendlyStakes is an interactive platform that allows users to
            create and participate in friendly bets and challenges. The
            application is designed to promote healthy competition and
            entertainment, offering multiple gaming modes and apuestas. Users
            can register, log in, manage their profile, participate in custom
            and traditional bets, and use the global and support chat.
          </p>
          <h3>User Registration</h3>
          <p>
            To register on FriendlyStakes, click the "Sign Up" button on the
            homepage and complete the registration form with your personal
            information. Once registered, you can log in to your account using
            your email and password provided during registration.
          </p>
          <h3>Create and Participate in Bets</h3>
          <p>
            You can create your own bets by clicking "Create Bet" and following
            the provided instructions. To participate in an existing bet, simply
            click on the desired bet and follow the instructions to make your
            prediction and place your bet.
          </p>
          <h3>Tracking Bets</h3>
          <p>
            Tracking your bets is available in the "My Bets" section of your
            profile. Here you can view the status of your active bets as well as
            the history of previous bets.
          </p>
          <h3>Password Recovery</h3>
          <p>
            If you forget your password, you can recover it by clicking the
            "Forgot your password?" link on the login page. You will be prompted
            to enter your email address and then receive instructions on how to
            reset your password.
          </p>
          <h3>Language Change</h3>
          <p>
            You can change the language of the application in your profile
            settings. Look for the "Language" option and select your preferred
            language from the dropdown list.
          </p>
          <h3>Edit Profile</h3>
          <p>
            To edit your profile, go to the "Edit Profile" section on your
            profile page. Here you can update your personal information,
            including your name, email address, password, and profile picture.
          </p>
          <h3>Delete Account</h3>
          <p>
            If you decide to no longer use FriendlyStakes, you can delete your
            account in the "Delete Account" section of your profile settings.
            Please note that this action is irreversible and will permanently
            delete your account and all associated data.
          </p>

        </div>
      )}
    </div>
  );
};

export default QuestionsAnswers;
