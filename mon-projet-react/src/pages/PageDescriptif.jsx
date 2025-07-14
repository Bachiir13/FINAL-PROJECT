import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/PageDescriptif.css';

const formationsDetails = [
  {
    id: 5,
    nom: "Data Science",
    description_courte: "Analysez les données avec Python, pandas, SQL et créez des visualisations impactantes.",
    description_longue: "Dans cette formation Data Science, vous apprendrez à manipuler, analyser et visualiser des données volumineuses en utilisant Python, pandas, SQL, ainsi que des outils de machine learning pour extraire des insights pertinents et construire des modèles prédictifs performants.",
    prerequis: "Connaissances de base en programmation Python et statistiques.",
    duree: "3 mois",
    objectifs: [
      "Maîtriser les outils de manipulation de données.",
      "Savoir créer des visualisations impactantes.",
      "Appliquer des algorithmes de machine learning.",
      "Développer un projet Data Science complet."
    ],
    contenu: [
      "Introduction à Python et pandas",
      "Bases de données SQL",
      "Statistiques pour Data Science",
      "Visualisation avec Matplotlib et Seaborn",
      "Introduction au Machine Learning",
      "Projet final"
    ],
    public_cible: "Développeurs, analystes, statisticiens souhaitant se spécialiser en data.",
    methodes: "Cours théoriques, travaux pratiques, projets encadrés.",
    evaluation: "QCM, projet final, soutenance.",
    faq: [
      { q: "Cette formation est-elle accessible aux débutants ?", r: "Oui, si vous avez des bases en Python." },
      { q: "Y a-t-il un suivi post-formation ?", r: "Oui, accès à notre forum et ressources." }
    ],
    image_url: "/images/pexels-thisisengineering-3861969.jpg"
  },
  {
    id: 4,
    nom: "Réseaux & Systèmes",
    description_courte: "Maîtrisez les fondamentaux des réseaux, systèmes Linux/Windows et virtualisation.",
    description_longue: "Cette formation vous plonge dans l'univers des réseaux informatiques et des systèmes d'exploitation. Vous découvrirez les concepts essentiels des réseaux, la configuration des systèmes Linux et Windows, ainsi que les technologies de virtualisation pour déployer des infrastructures efficaces et sécurisées.",
    prerequis: "Bases en informatique générale.",
    duree: "2 mois",
    objectifs: [
      "Comprendre l’architecture réseau.",
      "Configurer et administrer Linux et Windows.",
      "Déployer des machines virtuelles.",
      "Sécuriser un réseau d’entreprise."
    ],
    contenu: [
      "Principes de réseaux",
      "Administration Linux",
      "Administration Windows",
      "Virtualisation avec VMware/Hyper-V",
      "Sécurité réseau"
    ],
    public_cible: "Techniciens, administrateurs débutants.",
    methodes: "Cours en ligne, TP, études de cas.",
    evaluation: "QCM, exercices pratiques.",
    faq: [
      { q: "Faut-il un PC puissant ?", r: "Un ordinateur standard suffit." }
    ],
    image_url: "/images/pexels-kevin-ku-92347-577585.jpg"
  },
  {
    id: 3,
    nom: "Cybersécurité",
    description_courte: "Protégez les données et les infrastructures avec des techniques de sécurité réseau, cryptographie et audit.",
    description_longue: "La formation en cybersécurité vous permettra d’acquérir les compétences nécessaires pour sécuriser des réseaux, détecter des vulnérabilités, et protéger les systèmes d’information contre les cyberattaques.",
    prerequis: "Notions en systèmes, réseaux et Linux.",
    duree: "3 mois",
    objectifs: [
      "Comprendre les menaces et vulnérabilités courantes.",
      "Configurer des pare-feu et outils de protection.",
      "Analyser les failles et réaliser des audits.",
      "Mettre en place une politique de sécurité."
    ],
    contenu: [
      "Introduction à la cybersécurité",
      "Sécurité des réseaux",
      "Cryptographie",
      "Tests d’intrusion (pentesting)",
      "Audit de sécurité",
      "Réponse aux incidents"
    ],
    public_cible: "Administrateurs, développeurs, étudiants en informatique.",
    methodes: "Cas pratiques, simulations d’attaques, labs techniques.",
    evaluation: "Tests techniques, analyse de cas, rapport d’audit.",
    faq: [
      { q: "Est-ce que la formation inclut des outils comme Wireshark ?", r: "Oui, plusieurs outils professionnels sont utilisés." }
    ],
    image_url: "/images/pexels-pixabay-60504.webp"
  },
  {
    id: 2,
    nom: "Intelligence Artificielle",
    description_courte: "Apprenez à concevoir des systèmes intelligents avec Python, TensorFlow et l’apprentissage automatique.",
    description_longue: "Cette formation couvre les bases de l’IA : algorithmes d’apprentissage automatique, réseaux de neurones, NLP, et vision par ordinateur. Vous construirez des modèles capables d’apprendre à partir des données et de résoudre des tâches complexes.",
    prerequis: "Bonnes bases en Python et mathématiques (algèbre, proba).",
    duree: "4 mois",
    objectifs: [
      "Comprendre le fonctionnement de l’IA.",
      "Mettre en œuvre des modèles de deep learning.",
      "Utiliser TensorFlow et Keras.",
      "Déployer des applications IA."
    ],
    contenu: [
      "Introduction à l’IA",
      "Machine learning supervisé/non-supervisé",
      "Réseaux de neurones artificiels",
      "Traitement du langage naturel (NLP)",
      "Vision par ordinateur",
      "Déploiement d’un modèle IA"
    ],
    public_cible: "Développeurs, chercheurs, ingénieurs souhaitant se spécialiser en IA.",
    methodes: "Cours vidéo, notebooks interactifs, projets guidés.",
    evaluation: "Mini-projets, évaluation finale.",
    faq: [
      { q: "TensorFlow est-il le seul framework abordé ?", r: "Non, PyTorch est aussi présenté en bonus." }
    ],
    image_url: "/images/pexels-googledeepmind-17483868.webp"
  },
  {
    id: 1,
    nom: "Développement Web & Mobile",
    description_courte: "Créez des applications web et mobiles performantes avec React, Node.js et Flutter.",
    description_longue: "Cette formation complète vous guide dans la création d’applications modernes côté frontend et backend. Vous apprendrez React, Node.js, Express et Flutter pour concevoir des interfaces riches et des services performants.",
    prerequis: "Connaissances en HTML/CSS et JavaScript.",
    duree: "4 mois",
    objectifs: [
      "Maîtriser le développement web moderne (React, Node.js).",
      "Créer des APIs REST.",
      "Développer des apps mobiles avec Flutter.",
      "Mettre en production une app complète."
    ],
    contenu: [
      "JavaScript moderne (ES6+)",
      "React & React Router",
      "Node.js & Express",
      "Base de données MongoDB",
      "Flutter & Dart",
      "Déploiement (Heroku, Firebase)"
    ],
    public_cible: "Futurs développeurs fullstack et mobile.",
    methodes: "Live coding, TP hebdomadaires, projet fil rouge.",
    evaluation: "Projet web complet, app mobile, soutenance.",
    faq: [
      { q: "Dois-je choisir entre web et mobile ?", r: "Non, la formation vous permet de faire les deux." }
    ],
    image_url: "/images/pexels-goumbik-574077.webp"
  }
];

const PageDescriptif = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formation = formationsDetails.find(f => f.id === Number(id));

  if (!formation) {
    return (
      <div className="pageDescriptif">
        <button onClick={() => navigate(-1)} className="backButton">← Retour</button>
        <h2>Formation non trouvée</h2>
        <p>Désolé, cette formation n'existe pas.</p>
      </div>
    );
  }

  return (
    <div className="pageDescriptif">
      <button onClick={() => navigate(-1)} className="backButton">← Retour</button>
      <h1>{formation.nom}</h1>

      <div className="topSection">
        <img src={formation.image_url} alt={formation.nom} className="formationImageLarge" />
        <div className="infosPrincipales">
          <p><strong>Description :</strong> {formation.description_courte}</p>
          <p><strong>Durée :</strong> {formation.duree}</p>
          <p><strong>Prérequis :</strong> {formation.prerequis}</p>
          <p><strong>Public cible :</strong> {formation.public_cible}</p>
<button
  className="inscriptionButton"
  onClick={() => navigate(`/inscription-formation`, { state: { formation } })}
>
  S'inscrire
</button>

        </div>
      </div>

      <section>
        <h2>Objectifs</h2>
        <ul>{formation.objectifs.map((obj, i) => <li key={i}>{obj}</li>)}</ul>
      </section>

      <section>
        <h2>Contenu</h2>
        <ol>{formation.contenu.map((item, i) => <li key={i}>{item}</li>)}</ol>
      </section>

      <section>
        <h2>Méthodes pédagogiques</h2>
        <p>{formation.methodes}</p>
      </section>

      <section>
        <h2>Évaluation</h2>
        <p>{formation.evaluation}</p>
      </section>

      <section>
        <h2>FAQ</h2>
        {formation.faq.map((faq, i) => (
          <div key={i} className="faqItem">
            <strong>Q:</strong> {faq.q}<br />
            <strong>R:</strong> {faq.r}
          </div>
        ))}
      </section>
    </div>
  );
};

export default PageDescriptif;
