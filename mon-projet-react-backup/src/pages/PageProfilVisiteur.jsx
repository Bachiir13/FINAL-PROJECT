import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // ✅ Ajout
import '../styles/PageProfilVisiteur.css';

const PageProfilVisiteur = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ Utilise le contexte utilisateur

  return (
    <>
      {/* BANNIÈRE VISITEUR */}
      <div className="banniere-wrapper">
  <div className="banniere-visiteur">
    <img
      src="/images/pexels-pixabay-289737 1.png"
      alt="Bannière"
      className="banniere-image"
    />
    <div className="banniere-contenu">
      <h1>
        {user ? `Bonjour, ${user.prenom} ${user.nom} !` : 'Visiteur'}
      </h1>
      <span className="badge-role">
        {user ? 'VISITEUR' : 'Découverte libre'}
      </span>
    </div>
  </div>
</div>


      <section className="visiteur-section" aria-label="Section visiteurs non connectés">
        <h2>Bienvenue sur notre plateforme !</h2>
        <p>
          Découvrez nos formations en ligne pour développer vos compétences. Inscrivez-vous pour accéder à plus de contenus personnalisés.
        </p>

        <div className="visiteur-actions">
          <button
            onClick={() => navigate('/formations')}
            aria-label="Voir les formations"
            className="btn-primary"
          >
            Voir les formations
          </button>

          <button
            onClick={() => navigate('/contact')}
            aria-label="Contacter l'équipe"
            className="btn-secondary"
          >
            Contactez-nous
          </button>
        </div>

        <section className="faq-rapide" aria-label="Questions fréquentes">
          <h3>Questions fréquentes</h3>
          <ul>
            <li>
              <strong>Comment m’inscrire ?</strong> Cliquez sur “Voir les formations” pour candidatez.
            </li>
            <li>
              <strong>Quels sont les types de cours ?</strong> Nous proposons des cours pour tous les niveaux, en présentiel et en ligne.
            </li>
            <li>
              <strong>Comment nous contacter ?</strong> Utilisez la page Contact pour nous envoyer un message.
            </li>
          </ul>
        </section>
      </section>
    </>
  );
};

export default PageProfilVisiteur;
