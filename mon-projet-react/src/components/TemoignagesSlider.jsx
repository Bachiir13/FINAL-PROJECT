import React, { useEffect, useState } from "react";
import "./TemoignagesSlider.css";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; // ajuste le chemin si nécessaire

const TemoignagesSlider = () => {
  const [temoignages, setTemoignages] = useState([]);

  useEffect(() => {
    const fetchTemoignages = async () => {
      try {
        const snapshot = await getDocs(collection(db, "temoignages")); // ou "reviews" selon ta base
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTemoignages(data);
      } catch (error) {
        console.error("Erreur lors du chargement des témoignages :", error);
      }
    };

    fetchTemoignages();
  }, []);

  return (
    <section className="temoignagesSection">
      <h2 className="sectionTitle">TÉMOIGNAGES</h2>
      <div className="slider">
        {temoignages.length === 0 ? (
          <p>Aucun témoignage pour le moment.</p>
        ) : (
          temoignages.map(({ id, nom, promo, message, photo_url }) => (
            <div key={id} className="temoignageCard">
              {photo_url && (
                <img src={photo_url} alt={nom} className="temoignagePhoto" />
              )}
              <p className="temoignageMessage">"{message}"</p>
              <p className="temoignageNom">{nom} - Promo {promo}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default TemoignagesSlider;
