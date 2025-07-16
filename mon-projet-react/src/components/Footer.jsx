import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/inscription">Inscription</Link></li>
            <li><Link to="/connexion">Connexion</Link></li>
            <li><Link to="/contact">Contact</Link></li>
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
            <li><a href="#" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/mentions-legales">Mentions légales</Link></li>
            <li><Link to="/politique-confidentialite">Politique de confidentialité</Link></li>
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
