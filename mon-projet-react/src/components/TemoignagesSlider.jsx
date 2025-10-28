import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import "./TemoignagesSlider.css";

const TemoignagesSlider = () => {
  const [temoignages, setTemoignages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "temoignages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      // Sécurité : toujours renvoyer un tableau
      const data = Array.isArray(snapshot?.docs)
        ? snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        : [];
      setTemoignages(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="temoignagesSection">
      <h2 className="temoignagesTitle">Témoignages de nos élèves</h2>

      {temoignages.length === 0 ? (
        <p className="noTemoignages">Aucun témoignage pour le moment.</p>
      ) : (
        <div className="temoignagesSlider">
          {temoignages.map(({ id, nom, promo, message, note }) => (
            <div key={id} className="temoignageCard">
              <p className="temoignageMessage">"{message}"</p>
              <p className="temoignageNom">- {nom} {promo && `(${promo})`}</p>
              <p className="temoignageNote">
                {Array.from({ length: note || 0 }, () => '⭐').join('')} {note || 0}/5
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemoignagesSlider;
