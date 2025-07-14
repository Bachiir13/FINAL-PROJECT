import React from 'react';
import '../styles/QuiNousSommes.css';

export default function QuiNousSommes() {
  return (
    <main className="qui-nous-sommes-main-container">
      <header className="qui-nous-sommes-header">
        <h1 className="qui-nous-sommes-title">Qui nous sommes</h1>
      </header>

      <section className="qui-nous-sommes-intro">
        <div className="qui-nous-sommes-text">
          <h2 className="qui-nous-sommes-subtitle">Une école créée par de jeunes passionnés</h2>
          <p>
            Notre école a été fondée par de jeunes passionnés d'informatique désireux d'ouvrir la formation informatique au grand public.
            Nous croyons fermement que l'accès à une éducation technique de qualité doit être simple et accessible à tous, quel que soit le parcours.
          </p>
          <p>
            C’est pourquoi nous proposons des formations adaptées, dynamiques, et surtout, des <span className="qui-nous-sommes-highlight">diplômes certifiés</span> reconnus qui permettent à chacun de concrétiser ses ambitions professionnelles.
          </p>
        </div>
        <img src="/images/pexels-ron-lach-9783353.jpg" alt="Jeunes passionnés" className="qui-nous-sommes-team-image" />
      </section>

      <section className="qui-nous-sommes-values">
        <h3 className="qui-nous-sommes-values-title">Nos valeurs</h3>
        <ul className="qui-nous-sommes-values-list">
          <li>💻 Accessibilité : rendre la formation informatique ouverte à tous</li>
          <li>🔥 Passion : enseigner avec enthousiasme et authenticité</li>
          <li>📜 Certification : garantir la reconnaissance officielle des compétences</li>
          <li>🚀 Innovation : suivre les dernières technologies et pratiques du secteur</li>
        </ul>
      </section>
    </main>
  );
}
