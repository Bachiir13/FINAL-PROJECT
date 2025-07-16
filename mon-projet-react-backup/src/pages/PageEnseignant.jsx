import React from 'react';
import Enseignant from '../components/Enseignant'; // Assure-toi que le chemin est correct
import '../styles/PageEnseignant.css';

const enseignantsData = [
  {
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    prenom: 'José',
    nom: 'DaSilva',
    specialite: 'Cybersécurité',
    qualifications: [
      'Master en Sécurité Informatique',
      'Certification CISSP',
      'Expert en audit sécurité'
    ],
    biographie:
      "José est passionné par la sécurité des systèmes d'information. Il partage son savoir-faire acquis en plus de 4 ans d'expérience dans le secteur privé et public.",
    experiencePro:
      "3 ans en cybersécurité chez SecureTech et CyberDefense Inc.",
    cours: [
      { id: 1, titre: 'Introduction à la cybersécurité', description: "Bases et enjeux de la sécurité informatique." },
      { id: 2, titre: 'Audit de sécurité', description: "Méthodologies pour réaliser un audit complet." },
    ],
  },
  {
    photoUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    prenom: 'Claire',
    nom: 'Lemoine',
    specialite: 'Développement Web',
    qualifications: [
      "Licence en Informatique",
      "Formations React et Node.js"
    ],
    biographie:
      "Claire aime transmettre sa passion du développement front-end et back-end, avec un focus sur les technologies modernes.",
    experiencePro:
      "8 ans de développement fullstack chez WebSolutions.",
    cours: [
      { id: 3, titre: 'Développement React', description: "Créer des interfaces modernes et dynamiques." },
      { id: 4, titre: 'Node.js et APIs', description: "Construire des APIs REST performantes." },
    ],
  },
  {
    photoUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
    prenom: 'Ahmed',
    nom: 'Benali',
    specialite: 'Intelligence Artificielle',
    qualifications: [
      "Doctorat en IA",
      "Certifications TensorFlow et PyTorch"
    ],
    biographie:
      "Ahmed combine recherche et enseignement pour former les futurs experts en IA et apprentissage automatique.",
    experiencePro:
      "Chercheur en IA chez AI Labs, conférencier international.",
    cours: [
      { id: 5, titre: "Machine Learning", description: "Algorithmes et modèles de machine learning." },
      { id: 6, titre: "Deep Learning", description: "Réseaux de neurones profonds et applications." },
    ],
  },
  // Nouvel enseignant ajouté
  {
    photoUrl: 'https://randomuser.me/api/portraits/women/25.jpg',
    prenom: 'Sophie',
    nom: 'Dubois',
    specialite: 'Gestion de Projet',
    qualifications: [
      "MBA en Management",
      "Certifiée PMP",
      "Formations Agile et Scrum"
    ],
    biographie:
      "Sophie est experte en gestion de projets digitaux et accompagne les étudiants vers une maîtrise complète des méthodes Agile.",
    experiencePro:
      "10 ans comme chef de projet chez Innovatech et DigitalCorp.",
    cours: [
      { id: 7, titre: "Introduction à la gestion de projet", description: "Les fondamentaux et outils essentiels." },
      { id: 8, titre: "Méthodes Agile et Scrum", description: "Approches agiles pour des projets réussis." },
    ],
  },
];

const PageEnseignant = () => {
  return (
    <div className="page-enseignant">
      <h1>Nos Enseignants</h1>
      {enseignantsData.map((enseignant, idx) => (
        <Enseignant key={idx} enseignant={enseignant} />
      ))}
    </div>
  );
};

export default PageEnseignant;
