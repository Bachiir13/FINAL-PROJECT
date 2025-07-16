import React from 'react';
import '../styles/Mention.css';

const MentionsLegales = () => (
  <main className="mentions-legales-main">
    <h1 className="mentions-legales-title">Mentions Légales</h1>

    <section>
      <h2 className="mentions-legales-subtitle">Éditeur du site</h2>
      <p className="mentions-legales-paragraph">
        Le site <strong>TECHECOLE</strong> est édité par la société TechEcole SARL, 
        au capital de 50 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.
      </p>
      <ul className="mentions-legales-list">
        <li>Siège social : 123 rue de l’Éducation, 75000 Paris</li>
        <li>Téléphone : 01 23 45 67 89</li>
        <li>Email : contact@techecole.com</li>
        <li>Directeur de la publication : M. Jean Dupont</li>
      </ul>
    </section>

    {/* Autres sections comme Hébergement, Propriété intellectuelle, Données personnelles, etc. */}
  </main>
);

export default MentionsLegales;
