import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/inscription">Inscription</a></li>
            <li><a href="/connexion">Connexion</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Informations</h3>
          <ul>
            <li>TECHÉCOLE</li>
            <li>123 rue de l’Éducation</li>
            <li>75000 Paris</li>
            <li>Email : techecole@contact.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Réseaux sociaux</h3>
          <ul>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <hr className="footer-separator" />

      <p className="footer-copyright">
        © 2025 TechEcole. Tous droits réservés.
      </p>
    </footer>
  );
};

export default Footer;
