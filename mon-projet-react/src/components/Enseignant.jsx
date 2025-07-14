import React from "react";
import "./Enseignant.css";

const Enseignant = ({ enseignant }) => {
  if (!enseignant) return <p>Aucun enseignant sélectionné.</p>;

  const {
    photoUrl,
    prenom,
    nom,
    specialite,
    qualifications,
    biographie,
    experiencePro,
    cours,
  } = enseignant;

  return (
    <section className="enseignant-profile" aria-label={`Profil de l'enseignant ${prenom} ${nom}`}>
      <div className="enseignant-header">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`Photo de ${prenom} ${nom}`}
            className="enseignant-photo"
          />
        ) : (
          <div className="enseignant-photo-placeholder" aria-label="Photo indisponible" />
        )}
        <h2>{prenom} {nom}</h2>
      </div>

      <div className="enseignant-details">
        <h3>Spécialité</h3>
        <p>{specialite || 'Non renseignée'}</p>

        {qualifications && qualifications.length > 0 && (
          <>
            <h3>Qualifications</h3>
            <ul>
              {qualifications.map((qualif, index) => (
                <li key={index}>{qualif}</li>
              ))}
            </ul>
          </>
        )}

        <h3>Biographie</h3>
        <p>{biographie || 'Pas de biographie disponible.'}</p>

        <h3>Expérience professionnelle</h3>
        <p>{experiencePro || 'Aucune expérience renseignée.'}</p>

        <h3>Cours enseignés</h3>
        {cours && cours.length > 0 ? (
          <ul>
            {cours.map(c => (
              <li key={c.id}>
                <strong>{c.titre}</strong>: {c.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun cours renseigné.</p>
        )}
      </div>
    </section>
  );
};

export default Enseignant;
