import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import '../styles/PageProfilEnseignant.css';

const PageProfilEnseignant = () => {
  const { user, setUser } = useUser();
  const [cours, setCours] = useState([]);
  const [inscriptions, setInscriptions] = useState({});
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, from: 'Admin', content: 'Bienvenue sur votre espace enseignant !' },
    { id: 2, from: 'Support', content: 'N’oubliez pas de mettre à jour vos cours.' },
  ]);

  useEffect(() => {
    if (!user || user.role !== 'enseignant') return;
    setError(null);

    fetch(`http://localhost:3001/cours/enseignant/${user.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur chargement cours');
        return res.json();
      })
      .then(async data => {
        setCours(data);
        try {
          const results = await Promise.all(
            data.map(c =>
              fetch(`http://localhost:3001/inscriptions/cours/${c.id}`)
                .then(res => (res.ok ? res.json() : []))
                .catch(() => [])
                .then(inscrits => [c.id, inscrits])
            )
          );
          setInscriptions(Object.fromEntries(results));
        } catch {
          setInscriptions({});
        }
      })
      .catch(err => {
        setCours([]);
        setInscriptions({});
        setError(err.message);
      });
  }, [user]);

  if (!user) return <p className="loading-text">Chargement...</p>;
  if (user.role !== 'enseignant') return <p className="access-denied-text">Accès interdit</p>;

  const totalEleves = Object.values(inscriptions).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="profil-page">
      <header className="profil-banniere">
        <img src="/images/pexels-pixabay-289737 1.png" alt="Bannière" className="profil-banniere-image" />
        <div className="profil-banniere-info">
          <h1>Bonjour, {user.prenom} {user.nom} !</h1>
          <div className="profil-role-badge">ENSEIGNANT</div>
        </div>
      </header>

      {error && <p className="profil-error-message" role="alert">{error}</p>}

      <main className="profil-main-content">
        <section className="profil-info-section">
          <h2 className="section-title">Mes informations</h2>
          <ul className="info-list">
            <li><strong>Nom complet :</strong> {user.prenom} {user.nom}</li>
            <li><strong>Email :</strong> {user.email}</li>
            <li><strong>Rôle :</strong> Enseignant</li>
          </ul>
        </section>

        <section className="profil-stats-section">
          <h2 className="section-title">Statistiques</h2>
          <div className="stats-cards-container">
            <div className="stat-card">
              <h3 className="stat-number">{cours.length}</h3>
              <p className="stat-label">Cours créés</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">{totalEleves}</h3>
              <p className="stat-label">Élèves inscrits</p>
            </div>
          </div>
        </section>

        <EnseignantSection
          user={user}
          cours={cours}
          setCours={setCours}
          inscriptions={inscriptions}
          setInscriptions={setInscriptions}
          setError={setError}
        />

        <section className="profil-messages-section">
          <h2 className="section-title">Messages</h2>
          {messages.length === 0 ? (
            <p className="no-messages-text">Aucun message pour le moment.</p>
          ) : (
            <ul className="messages-list">
              {messages.map(m => (
                <li key={m.id} className="message-item">
                  <strong className="message-from">{m.from} :</strong> <span className="message-content">{m.content}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

const EnseignantSection = ({ user, cours, setCours, inscriptions, setInscriptions, setError }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ titre: '', description: '' });
  const [newCours, setNewCours] = useState({ titre: '', description: '', file: null });

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewCours(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewCours(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const submitNewCours = async (e) => {
    e.preventDefault();
    if (!newCours.titre.trim() || !newCours.description.trim()) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titre', newCours.titre);
      formData.append('description', newCours.description);
      formData.append('user_id', user.id);
      if (newCours.file) {
        formData.append('fichier', newCours.file);
      }

      const res = await fetch('http://localhost:3001/cours', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur création cours');
      const created = await res.json();
      setCours(prev => [created, ...prev]);
      setNewCours({ titre: '', description: '', file: null });
      alert('Cours créé avec succès');
    } catch (err) {
      alert(err.message);
      setError(err.message);
    }
  };

  const startEdit = (coursItem) => {
    setEditingId(coursItem.id);
    setEditForm({ titre: coursItem.titre, description: coursItem.description });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ titre: '', description: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editForm.titre.trim() || !editForm.description.trim()) {
      alert("Merci de remplir tous les champs.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/cours/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, user_id: user.id }),
      });

      if (!res.ok) throw new Error('Erreur mise à jour cours');
      const updatedCours = await res.json();
      setCours(prev => prev.map(c => (c.id === editingId ? updatedCours : c)));
      setEditingId(null);
      setEditForm({ titre: '', description: '' });
      alert('Cours mis à jour avec succès');
    } catch (err) {
      alert(err.message);
      setError(err.message);
    }
  };

  return (
    <section className="cours-section">
      <h2 className="section-title">Mes cours</h2>

      <form onSubmit={submitNewCours} className="form-nouveau-cours">
        <h3 className="form-title">Ajouter un nouveau cours</h3>
        <input
          type="text"
          name="titre"
          placeholder="Titre du cours"
          value={newCours.titre}
          onChange={handleNewChange}
          required
          className="input-text"
        />
        <textarea
          name="description"
          placeholder="Description du cours"
          value={newCours.description}
          onChange={handleNewChange}
          required
          className="input-textarea"
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="input-file"
        />
        <button type="submit" className="btn btn-primary">Créer le cours</button>
      </form>

      {cours.length === 0 ? (
        <p className="no-cours-text">Aucun cours pour le moment.</p>
      ) : (
        <ul className="cours-liste">
          {cours.map(c => (
            <li key={c.id} className="cours-item">
              {editingId === c.id ? (
                <form onSubmit={submitEdit} className="form-edit-cours">
                  <input
                    type="text"
                    name="titre"
                    value={editForm.titre}
                    onChange={handleEditChange}
                    required
                    className="input-text"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    required
                    className="input-textarea"
                  />
                  <button type="submit" className="btn btn-success">Enregistrer</button>
                  <button type="button" onClick={cancelEdit} className="btn btn-secondary">Annuler</button>
                </form>
              ) : (
                <>
                  <h4 className="cours-title">{c.titre}</h4>
                  <p className="cours-description">{c.description}</p>
                  <button onClick={() => startEdit(c)} className="btn btn-primary">Modifier</button>

                  <h5 className="eleves-title">Élèves inscrits :</h5>
                  {inscriptions[c.id]?.length > 0 ? (
                    <ul className="eleves-liste">
                      {inscriptions[c.id].map(eleve => (
                        <li key={eleve.id} className="eleve-item">
                          {eleve.prenom} {eleve.nom} ({eleve.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-eleves-text">Aucun élève inscrit.</p>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PageProfilEnseignant;
