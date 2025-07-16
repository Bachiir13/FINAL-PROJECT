import React, { useEffect, useState } from "react";
import "./TemoignagesSlider.css"; // styles spécifiques

const TemoignagesSlider = () => {
  const [temoignages, setTemoignages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/temoignages")
      .then((res) => res.json())
      .then(setTemoignages)
      .catch((err) => console.error("Erreur chargement temoignages:", err));
  }, []);

  return (
    <section className="temoignagesSection">
      <h2 className="sectionTitle">TEMOIGNAGES</h2>
      <div className="slider">
        {temoignages.map(({ id, nom, promo, message, photo_url }) => (
          <div key={id} className="temoignageCard">
            <p className="temoignageMessage">"{message}"</p>
            <p className="temoignageNom">{nom} - Promo {promo}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TemoignagesSlider;
