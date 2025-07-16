import React from 'react';
import '../styles/Politique.css';

const PolitiqueConfidentialite = () => {
  return (
    <main className="pc-main">
      <h1 className="pc-title">Politique de confidentialité</h1>

      <p className="pc-paragraph">
        Chez <strong>TECHECOLE</strong>, nous prenons très au sérieux la protection de vos données personnelles.
        Cette politique de confidentialité vous explique quelles données nous collectons, pourquoi et comment nous les utilisons,
        ainsi que vos droits concernant vos informations.
      </p>

      <h2 className="pc-subtitle">1. Collecte des données personnelles</h2>
      <p className="pc-paragraph">
        Nous collectons les informations suivantes lorsque vous utilisez nos services :
      </p>
      <ul className="pc-list">
        <li className="pc-list-item">Nom, prénom, adresse email, numéro de téléphone</li>
        <li className="pc-list-item">Données liées à votre inscription et participation à nos formations</li>
        <li className="pc-list-item">Données de navigation sur notre site (cookies, adresses IP, etc.)</li>
      </ul>

      <h2 className="pc-subtitle">2. Utilisation des données</h2>
      <p className="pc-paragraph">
        Vos données sont utilisées pour :
      </p>
      <ul className="pc-list">
        <li className="pc-list-item">Gérer votre inscription et votre suivi dans nos formations</li>
        <li className="pc-list-item">Vous envoyer des informations et communications relatives à nos services</li>
        <li className="pc-list-item">Améliorer notre site web et personnaliser votre expérience</li>
        <li className="pc-list-item">Respecter nos obligations légales et réglementaires</li>
      </ul>

      <h2 className="pc-subtitle">3. Cookies et technologies similaires</h2>
      <p className="pc-paragraph">
        Nous utilisons des cookies pour analyser le trafic, améliorer l’expérience utilisateur et gérer le consentement.
        Vous pouvez accepter ou refuser ces cookies via le bandeau dédié sur notre site.
      </p>

      <h2 className="pc-subtitle">4. Partage et confidentialité</h2>
      <p className="pc-paragraph">
        Nous ne vendons ni ne louons vos données personnelles à des tiers.
        Vos informations peuvent être partagées uniquement avec des prestataires ou partenaires de confiance qui nous assistent dans nos services,
        sous réserve de leur engagement à protéger vos données conformément à la loi.
      </p>

      <h2 className="pc-subtitle">5. Sécurité des données</h2>
      <p className="pc-paragraph">
        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre toute perte, accès non autorisé ou divulgation.
      </p>

      <h2 className="pc-subtitle">6. Durée de conservation</h2>
      <p className="pc-paragraph">
        Vos données sont conservées uniquement le temps nécessaire à la gestion de votre dossier et à la réalisation des finalités décrites,
        sauf obligation légale contraire.
      </p>

      <h2 className="pc-subtitle">7. Vos droits</h2>
      <p className="pc-paragraph">
        Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
      </p>
      <ul className="pc-list">
        <li className="pc-list-item">Droit d’accès, de rectification, de suppression de vos données</li>
        <li className="pc-list-item">Droit de limiter ou de vous opposer au traitement de vos données</li>
        <li className="pc-list-item">Droit à la portabilité des données</li>
        <li className="pc-list-item">Droit de retirer votre consentement à tout moment</li>
        <li className="pc-list-item">Droit d’introduire une réclamation auprès de la CNIL</li>
      </ul>
      <p className="pc-paragraph">
        Pour exercer ces droits, vous pouvez nous contacter à l’adresse suivante :{' '}
        <a href="mailto:privacy@techecole.com" className="pc-link">privacy@techecole.com</a>.
      </p>

      <h2 className="pc-subtitle">8. Contact</h2>
      <p className="pc-paragraph">
        Pour toute question concernant cette politique de confidentialité, merci de nous écrire à :{' '}
        <a href="mailto:privacy@techecole.com" className="pc-link">privacy@techecole.com</a>
      </p>

      <p className="pc-emphasis"><em>Dernière mise à jour : 15 juillet 2025</em></p>
    </main>
  );
};

export default PolitiqueConfidentialite;
