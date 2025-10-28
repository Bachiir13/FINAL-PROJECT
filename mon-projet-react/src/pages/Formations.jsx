import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Formations.css';

const Formations = () => {
  const [formations, setFormations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3002/formations')
      .then(res => setFormations(res.data))
      .catch(err => console.error('Erreur chargement formations:', err));
  }, []);

  const handleVoirClick = (id) => {
    navigate(`/formations/${id}`);
  };

  return (
    <div className="formationsPage">
      {/* Bannière avec image et texte */}
      <div className="banner-formation">
        <h1 className="bannerformationText">FORMATION</h1>
      </div>

      <h2 className="formationsTitle">Découvrez nos formations</h2>
      <div className="formationList">
        {formations.map((formation) => (
          <div className="formationCard" key={formation.id}>
            <img
              src={formation.image_url || '/images/default.webp'}
              alt={formation.nom}
              className="formationImage"
            />
            <h3>{formation.nom}</h3>
            <p>{formation.description}</p>
            <button className="voirButton" onClick={() => handleVoirClick(formation.id)}>
              Voir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formations;
