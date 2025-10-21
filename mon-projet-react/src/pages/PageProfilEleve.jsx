// src/pages/PageProfilEleve.jsx
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import "../styles/PageProfilEleve.css";
import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import TemoignagesSlider from "../components/TemoignagesSlider";

const BASE_URL = "http://localhost:3001";

const PageProfilEleve = () => {
  const { user } = useUser();
  const [cours, setCours] = useState([]);
  const [pedagogies, setPedagogies] = useState([]);
  const [inscriptions, setInscriptions] = useState(new Set());
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingInscription, setLoadingInscription] = useState(null);
  const [avisMessage, setAvisMessage] = useState("");
  const [avisNote, setAvisNote] = useState(5);
  const [loadingAvis, setLoadingAvis] = useState(false);
  const carrouselRef = useRef(null);

  // Récupération des données
  useEffect(() => {
    if (!user || user.role !== "eleve") return;

    const fetchData = async () => {
      try {
        const [coursRes, pedagoRes, inscRes, notesRes] = await Promise.all([
          fetch(`${BASE_URL}/cours`),
          fetch(`${BASE_URL}/pedagogies`),
          fetch(`${BASE_URL}/inscriptions/eleve/${user.id}`),
          fetch(`${BASE_URL}/notes/eleve/${user.id}`),
        ]);

        if (!coursRes.ok || !pedagoRes.ok || !inscRes.ok || !notesRes.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const [coursData, pedagoData, inscData, notesData] = await Promise.all([
          coursRes.json(),
          pedagoRes.json(),
          inscRes.json(),
          notesRes.json(),
        ]);

        setCours(coursData);
        setPedagogies(pedagoData);
        setInscriptions(new Set(inscData.map(insc => insc.cours_id)));
        setNotes(notesData);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, [user]);

  const handleInscription = async (coursId) => {
    setLoadingInscription(coursId);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/inscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eleve_id: user.id, cours_id: coursId }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'inscription");

      setInscriptions(prev => new Set(prev).add(coursId));
      alert("Inscription réussie");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingInscription(null);
    }
  };

  const handlePostAvis = async (e) => {
    e.preventDefault();
    if (!avisMessage.trim()) return;

    setLoadingAvis(true);
    setError(null);
    try {
      await addDoc(collection(db, "temoignages"), {
        nom: `${user.prenom} ${user.nom}`,
        promo: user.promo || "",
        message: avisMessage,
        note: avisNote,
        createdAt: serverTimestamp(),
      });
      setAvisMessage("");
      setAvisNote(5);
    } catch (err) {
      console.error(err);
      setError("Impossible de poster l'avis. Vérifie tes permissions Firestore.");
    } finally {
      setLoadingAvis(false);
    }
  };

  const scrollCarrousel = (distance) => {
    carrouselRef.current?.scrollBy({ left: distance, behavior: "smooth" });
  };

  if (!user) return <p>Chargement...</p>;
  if (user.role !== "eleve") return <p>Accès interdit</p>;

  return (
    <div className="profil-page">
      <header className="profil-banniere">
        <img src="/images/pexels-pixabay-289737 1.png" alt="Bannière" className="profil-banniere-image" />
        <div className="profil-banniere-info">
          <h1>Bonjour, {user.prenom} {user.nom} !</h1>
          <div className="profil-role-badge">ELEVE</div>
        </div>
      </header>

      {error && <p className="error-message">{error}</p>}

      {/* Section Cours */}
      <section className="section-cours">
        <h2>Cours disponibles</h2>
        {cours.length === 0 ? <p>Aucun cours disponible.</p> :
          <div className="grille-cours">
            {cours.map(c => {
              const isInscrit = inscriptions.has(c.id);
              const hasFile = c.fichier && c.fichier.trim() !== "";
              return (
                <div className="carte" key={c.id}>
                  <h3>{c.titre}</h3>
                  <p>{c.description}</p>
                  {isInscrit ? (
                    <>
                      <button disabled>Inscrit</button>
                      {hasFile ? (
                        <a href={`${BASE_URL}/uploads/${c.fichier}`} target="_blank" rel="noopener noreferrer">
                          Pièce jointe : {c.fichier}
                        </a>
                      ) : <p><em>Aucun fichier publié.</em></p>}
                    </>
                  ) : (
                    <button onClick={() => handleInscription(c.id)} disabled={loadingInscription === c.id}>
                      {loadingInscription === c.id ? "Inscription..." : "S'inscrire"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        }
      </section>

      {/* Section Pédagogies */}
      <section className="section-pedagogies">
        <h2>Mes pédagogies</h2>
        <div className="carrousel-wrapper">
          <button className="scroll-btn left" onClick={() => scrollCarrousel(-300)}>‹</button>
          <div className="carrousel-container" ref={carrouselRef}>
            {pedagogies.map((item, index) => (
              <div className="carte" key={index}>
                <h3>{item.titre}</h3>
                <p>{item.description}</p>
                <a href={item.fichier_url} download target="_blank" rel="noopener noreferrer">M'y rendre</a>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scrollCarrousel(300)}>›</button>
        </div>
      </section>

      {/* Section Notes */}
      <section className="section-notes">
        <h3>Mes notes</h3>
        {notes.length === 0 ? <p>Aucune note disponible</p> :
          <table className="notes-table">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Note</th>
                <th>Commentaire</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(n => (
                <tr key={n.id}>
                  <td>{n.titre_cours || n.matiere}</td>
                  <td>{`${n.valeur}/${n.max_note}`}</td>
                  <td>{n.commentaire || "-"}</td>
                  <td>{new Date(n.date_note).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </section>

      {/* Section Témoignages */}
      <section className="section-temoignages">
        <h3>Témoignages</h3>

        {/* Formulaire pour poster un avis */}
        <form onSubmit={handlePostAvis} className="form-temoignage">
          <textarea
            placeholder="Votre avis"
            value={avisMessage}
            onChange={e => setAvisMessage(e.target.value)}
            required
          />
          <label>
            Note :
            <select value={avisNote} onChange={e => setAvisNote(Number(e.target.value))}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button type="submit" disabled={loadingAvis}>
            {loadingAvis ? "Publication..." : "Poster l'avis"}
          </button>
        </form>

        {/* Slider des témoignages */}
        <TemoignagesSlider />
      </section>
    </div>
  );
};

export default PageProfilEleve;
