/*!
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Image from 'next/image';

export const ImproveMeetings = () => {
  return (
    <>
      <section>
        <p>
          ¿Alguna vez has sentido como si estuvieras hablándole a la pantalla en lugar de a tus
          compañeros durante las reuniones online? El silencio incómodo, las miradas perdidas en las
          cámaras... y el famoso &quot;¿Alguien quiere añadir algo?&quot; que siempre acaba en un
          largo silencio.
        </p>
        <p>
          No estás sola. Mantener la participación y el compromiso en las reuniones virtuales es una
          misión que muchas enfrentamos en esta era digital. ¡Pero no te preocupes! Hay formas súper
          creativas de mejorar esto.
        </p>
        <p>Aquí van algunos trucos que te ayudaran…</p>
      </section>
      <section id="ice-breakers">
        <h2>Icebreakers</h2>
        <p>
          Los icebreakers son herramientas estratégicas para construir confianza y energizar al
          grupo, y no solo sirven para romper el hielo, sino que también te permiten estimular la
          creatividad desde el inicio. <br />
          Un buen icebreaker es como el café por la mañana: necesario para despertar y entrar en
          calor. 🐠
        </p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/improve/blog-1.png"
          fill
          alt="Woman loading ice into a an old car."
          objectFit="contain"
          objectPosition="top"
        />
      </div>
      <section id="surveys">
        <h2>Encuestas</h2>
        <p>
          Incorpora encuestas en vivo para recoger opiniones y preferencias instantáneas. Las
          encuestas pueden ser sobre la temática de la reunión o para romper el hielo. Funcionan muy
          bien para dar voz a todos los asistentes, y de esta forma, aumentar la participación. Por
          ejemplo, puedes lanzar una encuesta sobre el snack favorito para las meetings o el mejor
          meme del mes. Las encuestas son como el GPS de la reunión, te dicen por dónde va la gente
          y mantienen a todos en ruta. ¡Y lo mejor es que todos sienten que pilotan! Puedes hacerlo
          con herramientas como Kahot, Butter, o Google Forms.
        </p>
      </section>
      <section id="agenda">
        <h2>Agenda</h2>
        <p>
          Comparte una agenda detallada antes de la reunión. Asegúrate de que sea clara, concisa y
          que destaque los puntos clave y tiempos específicos para cada tema. Esto ayuda a los
          participantes a prepararse y a mantener la reunión enfocada y eficiente.
        </p>
      </section>
      <section id="reactions">
        <h2>Reacciones</h2>
        <p>
          Anima a los participantes a usar reacciones durante la reunión. Usa las reacciones como
          confeti en un carnaval: que vuelen los pulgares arriba y los corazones cuando algo mola.
          Es la manera más rápida de decir &quot;¡Eso es!&quot; sin cortar el rollo. En Stooa
          solemos empezar las sesiones lanzando una pregunta y pidiendo a los participantes que
          contesten con reacciones. Puedes preguntar qué preferirían entre dos cosas, por ejemplo:
          no poder escuchar música nunca más 👎, o tener que escuchar música todo el tiempo 👍, y
          pedir que reaccionen con el pulgar hacia arriba o hacia abajo.
        </p>
      </section>
      <div className="image-container">
        <Image
          src="/img/web/blog/improve/blog-2.png"
          fill
          alt="People laughing in a cinema"
          objectFit="contain"
          objectPosition="top"
        />
      </div>
      <section id="fishbowl">
        <h2>Fishbowl</h2>
        <p>
          La dinámica del Fishbowl te permitirá dejar de ser la persona que dinamiza la sesión para
          poder centrarte en la conversación y los insights extraídos. Esta dinámica pone el foco en
          mejorar el flujo del diálogo, y consigue activar la participación dando a todos los
          asistentes la oportunidad de participar activamente.
        </p>
        <h3>¿Cómo funciona?</h3>
        <p>
          El Fishbowl es como un acuario para ideas brillantes. Imagina que estas en una reunión
          online, y en lugar de todos hablar a la vez (¡caos total!), algunos participantes se
          encuentran en el &quot;acuario&quot; (el Fishbowl propiamente dicho) compartiendo sus
          ideas mientras el resto observa y escucha atentamente. Los participantes que estan dentro
          del acuario se rotan, asegurando que todos tengan la oportunidad de sumergirse en el
          centro de la acción.
        </p>
        <h3>Beneficios del Fishbowl:</h3>
        <ol>
          <li>
            <span className="medium">Equilibrio perfecto:</span> Todos tienen su momento de
            protagonismo, evitando el caos de hablar al mismo tiempo.
          </li>
          <li>
            <span className="medium">Enfoque sin distracciones:</span> Elimina las interrupciones,
            manteniendo la reunión centrada en las ideas esenciales.
          </li>
          <li>
            <span className="medium">Participación activa:</span> La rotación constante dentro del
            acuario garantiza que cada miembro del equipo tenga su oportunidad de brillar.
          </li>
          <li>
            <span className="medium">Ambiente creativo y relajado:</span> La estructura única del
            Fishbowl crea un espacio cómodo para compartir ideas, sin formalidades excesivas.
          </li>
        </ol>
      </section>
      <section>
        <p>
          Prepárate para sumergirte en la dinámica del Fishbowl y hacer que tus reuniones online
          sean un festín de innovación y participación. 🚀🐟
        </p>
      </section>
    </>
  );
};
