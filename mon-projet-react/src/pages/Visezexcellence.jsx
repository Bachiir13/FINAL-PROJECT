import React from 'react';
import '../styles/Visezexcellence.css';

const VisezExcellence = () => {
  return (
    <main className="visezExcellenceMain">
      <section className="excellenceSectionBlock">
        <div className="excellenceContent">
          <div className="excellenceText">
            <h2>Formations 100% Gratuites</h2>
            <p>
              Chez <strong>TECHECOLE</strong>, l’éducation ne devrait jamais être un luxe. C’est pourquoi nos formations sont
              entièrement gratuites, pour permettre à chacun d'accéder aux compétences numériques d'avenir, peu importe sa situation financière.
            </p>
          </div>
          <div className="excellenceImageContainer">
            <img
              src="/images/179308326-amis-multiculturels-s-amusant-avec-un-téléphone-portable-dans-la-cour-de-l-université-du-campus.jpg"
              alt="Gratuité des formations"
              width={400}
              height={300}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="excellenceSectionBlock reverse">
        <div className="excellenceContent">
          <div className="excellenceImageContainer">
            <img
              src="/images/Visuel_diversite_2-scaled.jpg"
              alt="Accessibilité sans discrimination"
              width={400}
              height={300}
              loading="lazy"
            />
          </div>
          <div className="excellenceText">
            <h2>Pour Tous, Sans Discrimination</h2>
            <p>
              La diversité est notre force. Peu importe votre âge, origine, genre ou parcours, <strong>TECHECOLE</strong>
              vous ouvre ses portes. Nous croyons en une éducation inclusive, équitable et bienveillante.
            </p>
          </div>
        </div>
      </section>

      <section className="excellenceSectionBlock">
        <div className="excellenceContent">
          <div className="excellenceText">
            <h2>Diplômes Certifiés par l’État</h2>
            <p>
              À l’issue de votre formation, vous obtiendrez un diplôme reconnu par l’État. Gage de qualité et de sérieux,
              ce diplôme vous ouvre les portes de nombreuses opportunités professionnelles en France et à l’étranger.
            </p>
          </div>
          <div className="excellenceImageContainer">
            <img
              src="/images/AdobeStock_976142046-768x432.jpeg"
              alt="Diplômes certifiés"
              width={400}
              height={300}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default VisezExcellence;
