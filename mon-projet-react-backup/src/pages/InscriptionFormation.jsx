import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/InscriptionFormation.css';

const InscriptionFormation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formation = location.state?.formation;

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    motivation: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!formation) {
    return (
      <div className="pageInscription">
        <button onClick={() => navigate(-1)} className="backButton">← Retour</button>
        <h2 className="noFormationTitle">Aucune formation sélectionnée</h2>
        <p className="noFormationText">Veuillez sélectionner une formation depuis la page descriptive.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { nom, prenom, email, telephone, motivation } = formData;
    if (!nom.trim() || !prenom.trim() || !validateEmail(email) || !telephone.trim() || !motivation.trim()) {
      return setError("Veuillez remplir tous les champs obligatoires.");
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3001/inscriptions', {
        ...formData,
        formation_id: formation.id,
      });
      alert('Votre demande a bien été envoyée.');
      navigate('/');
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err.response?.data || err.message);
      setError("Erreur lors de l'envoi, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageInscription">
      <button onClick={() => navigate(-1)} className="backButton">← Retour</button>
      <h1 className="inscriptionTitle">Demande d’inscription : {formation.nom}</h1>

      <form onSubmit={handleSubmit} className="inscriptionForm">
        {[
          { label: "Nom", name: "nom" },
          { label: "Prénom", name: "prenom" },
          { label: "Email", name: "email", type: "email" },
          { label: "Téléphone", name: "telephone", type: "tel" },
          { label: "Adresse", name: "adresse" },
          { label: "Ville", name: "ville" },
          { label: "Code postal", name: "code_postal" },
        ].map(({ label, name, type = "text" }) => (
          <div className="formGroup" key={name}>
            <label htmlFor={name} className="formLabel">{label} *</label>
            <input
              id={name}
              className="formInput"
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required={["nom", "prenom", "email", "telephone"].includes(name)}
            />
          </div>
        ))}

        <div className="formGroup">
          <label htmlFor="motivation" className="formLabel">Motivation *</label>
          <textarea
            id="motivation"
            className="formTextarea"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="submitButton">
          {loading ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>

        {error && <p className="errorMessage">{error}</p>}
      </form>
    </div>
  );
};

export default InscriptionFormation;
