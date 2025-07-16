import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/PageAccueil.css';
import TemoignagesSlider from '../components/TemoignagesSlider';

const PageAccueil = () => {
  const [actualites, setActualites] = useState([]);
  const [showConsent, setShowConsent] = useState(false);

  // Vérifie le consentement au chargement
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === null) {
      setShowConsent(true); // Affiche le bandeau uniquement si pas de consentement
    }
  }, []);

  // Gestion du clic "Accepter"
  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };

  // Gestion du clic "Refuser"
  const handleRefuseCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setShowConsent(false);
  };

  // Chargement des actualités
  useEffect(() => {
    fetch('http://localhost:3001/actualites')
      .then(res => res.json())
      .then(data => setActualites(data))
      .catch(err => console.error('Erreur chargement actualités :', err));
  }, []);

  return (
    <>
      {/* Bandeau Consentement Cookies */}
      {showConsent && (
        <div
          className="cookieConsentBanner"
          role="dialog"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#222',
            color: 'white',
            padding: '1rem',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <p style={{ margin: '0 1rem 0 0', flex: '1 1 auto', minWidth: '250px' }}>
            Nous utilisons des cookies pour améliorer votre expérience. Consultez notre{' '}
            <Link to="/politique-confidentialite" style={{ color: '#4caf50', textDecoration: 'underline' }}>
              politique de confidentialité
            </Link>.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={handleAcceptCookies}
              className="btn"
              aria-label="Accepter les cookies"
              style={{ cursor: 'pointer' }}
            >
              Accepter
            </button>
            <button
              onClick={handleRefuseCookies}
              className="btn btn-outline"
              aria-label="Refuser les cookies"
              style={{ cursor: 'pointer' }}
            >
              Refuser
            </button>
          </div>
        </div>
      )}

      <main className="mainContent" role="main">
        <header className="banner">
          <div>
            <h1 className="bannerTitle">TECHECOLE</h1>
            <p className="bannerText">L’INFORMATIQUE D’AUJOURD’HUI, LES CARRIÈRES DE DEMAIN.</p>
          </div>
        </header>

        {/* Le reste de ton contenu inchangé */}

        <section className="section sectionCenter" aria-label="Introduction">
          <p>
            Bienvenue à <strong>TECHECOLE</strong>, l’établissement de référence pour les métiers d’avenir dans le numérique.
            Notre mission est de vous former aux compétences technologiques les plus recherchées sur le marché du travail.
          </p>
        </section>

        <section className="formationSection" aria-label="Formations les plus demandées">
          <h2 className="sectionTitle">Formations les plus demandées</h2>
          <div className="formationList">
            {/* Cartes formations */}
            <article className="formationCard">
              <img
                src="/images/pexels-goumbik-574077.webp"
                alt="Développement Web et Mobile"
                className="formationImage"
                width={400}
                height={250}
                loading="lazy"
              />
              <h3>Développement Web</h3>
              <p>Maîtrisez les technologies web modernes pour créer des applications puissantes et responsives.</p>
            </article>
            <article className="formationCard">
              <img
                src="/images/pexels-googledeepmind-17483868.webp"
                alt="Intelligence Artificielle"
                className="formationImage"
                width={400}
                height={250}
                loading="lazy"
              />
              <h3>Intelligence Artificielle</h3>
              <p>Apprenez à concevoir des systèmes intelligents et à travailler avec des modèles d’apprentissage automatique.</p>
            </article>
            <article className="formationCard">
              <img
                src="/images/pexels-pixabay-60504.webp"
                alt="Cybersécurité"
                className="formationImage"
                width={400}
                height={250}
                loading="lazy"
              />
              <h3>Cybersécurité</h3>
              <p>Protégez les systèmes d'information en apprenant à anticiper, détecter et contrer les attaques numériques.</p>
            </article>
          </div>
          <div className="formationBtnContainer">
            <Link to="/formations" className="btn">Voir tout le catalogue</Link>
          </div>
        </section>

        <section className="section sectionCenter pourquoi-nous-choisir" aria-label="Pourquoi nous choisir">
          <div className="contenu">
            <h2 className="sectionTitle">Pourquoi nous choisir ?</h2>
            <p>
              <strong>TECHECOLE</strong> propose des formations innovantes, adaptées aux besoins des entreprises modernes.
              Avec un corps enseignant expert et des projets pratiques, nous vous préparons efficacement à votre future carrière.
            </p>
            <ul>
              <li>Formations gratuites et certifiées</li>
              <li>Accès à un réseau professionnel étendu</li>
              <li>Stages et accompagnement personnalisé</li>
              <li>Équipements et laboratoires à la pointe</li>
              <li>Ambiance collaborative et dynamique</li>
            </ul>
          </div>
          <div className="image-container">
            <img
              src="/images/GettyImages-1441933907-2048x1365-1.webp"
              alt="Étudiants en formation"
              width={600}
              height={400}
              loading="lazy"
            />
          </div>
        </section>

        <section className="actualitesSection" aria-label="Actualités">
          <h2 className="sectionTitle">Actualités de l'école</h2>
          {actualites.length === 0 ? (
            <p>Aucune actualité pour le moment.</p>
          ) : (
            <div className="actualitesList">
              {actualites.map((actu) => (
                <article key={actu.id} className="actualiteCard">
                  <h3>{actu.titre}</h3>
                  <p>{actu.contenu.length > 200 ? `${actu.contenu.slice(0, 200)}...` : actu.contenu}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="campusSection" aria-label="Campus">
          <h2 className="sectionTitle">Notre campus</h2>
          <div className="campusContent">
            <div className="campusImages">
              <img
                src="/images/L1018059.webp"
                alt="Vue extérieure du campus"
                className="campusImage"
                width={600}
                height={400}
                loading="lazy"
              />
              <img
                src="/images/Amphi-1024x682.webp"
                alt="Intérieur de l'amphithéâtre"
                className="campusImage"
                width={600}
                height={400}
                loading="lazy"
              />
            </div>
            <div className="campusText">
              <p>
                Situé au cœur de Paris, notre campus moderne offre un cadre d’apprentissage agréable et stimulant. Accessible facilement par les transports, il bénéficie d’infrastructures modernes, comme des salles connectées, des espaces collaboratifs et une médiathèque. Ce lieu favorise l’échange, la concentration et le développement personnel dans une ambiance conviviale.
              </p>
              <p><strong>Adresse :</strong> 42 Rue des Technologies, 75012 Paris, France</p>
            </div>
          </div>
        </section>

        <section className="excellenceSection" aria-label="Objectif excellence">
          <Link
            to="/visez-excellence"
            className="excellenceSection"
            aria-label="Objectif excellence"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h2 className="excellenceTitle">Visez l’excellence</h2>
            <div className="excellenceLogos">
              <div className="logoItem">
                <img
                  src="/images/money-with-wings.png"
                  alt="Formations gratuites"
                  className="logoImg"
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <p>Gratuit</p>
              </div>
              <div className="logoItem">
                <img
                  src="/images/131-1313837_transparent-white-silhouette-png.png"
                  alt="Formation pour tous"
                  className="logoImg"
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <p>Pour Tous</p>
              </div>
              <div className="logoItem">
                <img
                  src="/images/graduation-cap.png"
                  alt="Diplômes certifiés"
                  className="logoImg"
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <p>Diplômes Certifiés</p>
              </div>
            </div>
          </Link>
        </section>

        <section className="professorSection" aria-label="Enseignants qualifiés">
          <div className="professorContent">
            <div className="professorText">
              <h2 className="sectionTitle">Des enseignants qualifiés</h2>
              <p>
                Nos formateurs sont des experts reconnus dans leur domaine, dotés d’une solide expérience professionnelle.
              </p>
              <div className="professorBtnContainer">
                <Link to="/enseignant" className="professorBtn">Voir plus</Link>
              </div>
            </div>
            <div className="professorImageContainer">
              <img
                src="/images/pexels-yankrukov-8199603.jpg"
                alt="Enseignants accompagnant les étudiants"
                className="professorImage"
                width={600}
                height={400}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <TemoignagesSlider />

        <section className="section sectionCenter" aria-label="Partenaires">
          <h2 className="sectionTitle">Nos partenaires</h2>
          <p>
            Nous collaborons avec des entreprises leaders pour vous offrir les meilleures opportunités de stage et d’emploi.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            <img
              src="/images/Microsoft-Logo.wine.png"
              alt="Logo Microsoft"
              style={{ height: '120px' }}
              width={150}
              height={150}
              loading="lazy"
              className="partnerLogo"
            />
            <img
              src="/images/Logo_de_Ubisoft_2017.png"
              alt="Logo Ubisoft"
              style={{ height: '120px' }}
              width={150}
              height={100}
              loading="lazy"
              className="partnerLogo"
            />
            <img
              src="/images/Lenovo_Corporate_Logo.png"
              alt="Logo Lenovo"
              style={{ height: '100px' }}
              width={230}
              height={60}
              loading="lazy"
              className="partnerLogo"
            />
            <img
              src="/images/Dell_Logo.png"
              alt="Logo Dell"
              style={{ height: '100px' }}
              width={230}
              height={60}
              loading="lazy"
              className="partnerLogo"
            />
          </div>
        </section>

        <section className="about-section" aria-label="À propos de nous">
          <div className="about-container reverse">
            <div className="about-content">
              <h2>En savoir plus sur nous</h2>
              <p>
                Découvrez notre mission, notre vision et les valeurs qui guident notre approche éducative.
              </p>
              <Link to="/qui-sommes-nous" className="btnContact">Qui Nous Sommes</Link>
            </div>
            <div className="about-image">
              <img
                src="/images/pexels-googledeepmind-17483848.webp"
                alt="Qui sommes-nous"
                width={600}
                height={400}
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="contactPromptSection" aria-label="Contact">
          <div className="contactPromptContent">
            <div className="contactText">
              <h2>Une question ?</h2>
              <p>Une question en tête ou envie d’en savoir plus ? Nous sommes là pour vous accompagner et vous apporter toutes les informations dont vous avez besoin.</p>
              <Link to="/contact" className="btnContact">Contactez-nous</Link>
            </div>
            <img
              src="/images/pexels-olly-789822.webp"
              alt="Illustration contact"
              className="contactPromptImage"
              width={600}
              height={400}
              loading="lazy"
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default PageAccueil;
