import React, { useEffect, useState, useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import '../styles/PageProfilEleve.css';

const BASE_URL = 'http://localhost:3001';

const PageProfilEleve = () => {
  const { user } = useUser();

  const [cours, setCours] = useState([]);
  const [pedagogies, setPedagogies] = useState([]);
  const [inscriptions, setInscriptions] = useState(new Set());
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loadingInscription, setLoadingInscription] = useState(null);
  const carrouselRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'eleve') return;

    const fetchData = async () => {
      try {
        const [coursRes, pedagoRes, inscRes, notesRes] = await Promise.all([
          fetch(`${BASE_URL}/cours`),
          fetch(`${BASE_URL}/pedagogies`),
          fetch(`${BASE_URL}/inscriptions/eleve/${user.id}`),
          fetch(`${BASE_URL}/notes/eleve/${user.id}`)
        ]);

        const [coursData, pedagoData, inscData, notesData] = await Promise.all([
          coursRes.ok ? coursRes.json() : [],
          pedagoRes.ok ? pedagoRes.json() : [],
          inscRes.ok ? inscRes.json() : [],
          notesRes.ok ? notesRes.json() : []
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eleve_id: user.id, cours_id: coursId }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'inscription");

      setInscriptions(prev => new Set(prev).add(coursId));
      alert('Inscription réussie');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingInscription(null);
    }
  };

  const scrollCarrousel = (distance) => {
    carrouselRef.current?.scrollBy({ left: distance, behavior: 'smooth' });
  };

  if (!user) return <p>Chargement...</p>;
  if (user.role !== 'eleve') return <p>Accès interdit</p>;

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

      <section className="section-cours">
        <h2>Cours disponibles</h2>
        {cours.length === 0 ? (
          <p>Aucun cours disponible.</p>
        ) : (
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
                        <a
                          href={`${BASE_URL}/uploads/${c.fichier}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-download"
                        >
                          Pièce jointe : {c.fichier}
                        </a>
                      ) : (
                        <p><em>Aucun fichier publié pour ce cours.</em></p>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => handleInscription(c.id)}
                      disabled={loadingInscription === c.id}
                    >
                      {loadingInscription === c.id ? 'Inscription...' : "S'inscrire"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="section-pedagogies">
        <h2>Mes pédagogies</h2>
        <div className="carrousel-wrapper">
          <button className="scroll-btn left" onClick={() => scrollCarrousel(-300)}>‹</button>
          <div className="carrousel-container" ref={carrouselRef}>
            {pedagogies.map((item, index) => (
              <div className="carte" key={index}>
                <h3>{item.titre}</h3>
                <p>{item.description}</p>

                {/* Lien téléchargement */}
                <a 
                  href={item.fichier_url} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  M'y rendre
                </a>
              </div>
            ))}
          </div>
          <button className="scroll-btn right" onClick={() => scrollCarrousel(300)}>›</button>
        </div>
      </section>

      <section className="section-devoirs">
        <h3>Déposer un devoir</h3>
        <FormDevoir eleveId={user.id} />
      </section>

      <section className="section-notes">
        <h3>Mes notes</h3>
        {notes.length === 0 ? (
          <p>Aucune note disponible</p>
        ) : (
          <table className="notes-table">
            <thead>
              <tr>
                <th>Cours</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(n => (
                <tr key={n.id}>
                  <td>{n.titre_cours}</td>
                  <td>{n.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="section-temoignages">
        <h3>Laisser un témoignage</h3>
        <FormTemoignage eleve={user} />
      </section>
    </div>
  );
};

// === Formulaire Devoir ===
const FormDevoir = ({ eleveId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('eleve_id', eleveId);
      formData.append('devoir', file);

      const res = await fetch(`${BASE_URL}/devoirs`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi du devoir");

      alert('Devoir déposé avec succès');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-devoir" onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} ref={fileInputRef} />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="btn-upload" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
};

// === Formulaire Témoignage ===
const FormTemoignage = ({ eleve }) => {
  const [message, setMessage] = useState('');
  const [promo, setPromo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Le message est requis");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`${BASE_URL}/temoignages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: `${eleve.prenom} ${eleve.nom}`,
          promo,
          message,
          photo_url: null  // On ne récupère plus de photo_url
        })
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi du témoignage");

      setMessage('');
      setPromo('');
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-temoignage" onSubmit={handleSubmit}>
      <textarea
        placeholder="Votre témoignage"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        required
      />
      <input
        type="text"
        placeholder="Promo (ex: 2025)"
        value={promo}
        onChange={e => setPromo(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Témoignage envoyé !</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
};

export default PageProfilEleve;
