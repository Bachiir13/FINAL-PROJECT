import React, { useEffect, useState } from "react";
import "../styles/Admin.css"; // Import des styles CSS pour la page admin

const Admin = () => {
  // États pour chaque entité à gérer dans le dashboard
  const [users, setUsers] = useState([]);
  const [cours, setCours] = useState([]);
  const [formations, setFormations] = useState([]);
  const [pedagogies, setPedagogies] = useState([]);
  const [temoignages, setTemoignages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);

  // États pour gérer l'édition
  const [editingItem, setEditingItem] = useState({ id: null, endpoint: null }); // L'élément en cours d'édition
  const [editFormData, setEditFormData] = useState({}); // Les données modifiées à sauvegarder

  // Chargement des données au montage du composant
  useEffect(() => {
    fetchAll(); // Appel de la fonction qui récupère toutes les entités
  }, []);

  // Fonction pour récupérer toutes les entités en parallèle
  const fetchAll = async () => {
    await Promise.all([
      fetchEntity("users", setUsers),
      fetchEntity("cours", setCours),
      fetchEntity("formations", setFormations),
      fetchEntity("pedagogies", setPedagogies),
      fetchEntity("temoignages", setTemoignages),
      fetchEntity("contacts", setMessages),
      fetchEntity("inscriptions", setInscriptions),
    ]);
  };

  // Fonction générique de récupération d'entités (depuis l'API locale)
  const fetchEntity = async (endpoint, setter) => {
    try {
      const res = await fetch(`http://localhost:3002/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (e) {
      console.error(`Erreur chargement ${endpoint} :`, e);
    }
  };

  // Calcul du nombre d'inscriptions pour chaque cours
  const inscriptionsParCours = cours.map((coursItem) => {
    const nbInscriptions = inscriptions.filter(
      (insc) => insc.cours_id === coursItem.id
    ).length;
    return { ...coursItem, nbInscriptions };
  });

  const TAUX_REUSSITE = 94; // Taux fictif de réussite des étudiants

  // Suppression d'un élément
  const handleDelete = async (endpoint, id, setter) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (res.status !== 204 && res.status !== 200) throw new Error("Erreur suppression");
      // Met à jour la liste sans l'élément supprimé
      setter((prev) => prev.filter((item) => item.id !== id));
      if (editingItem.id === id && editingItem.endpoint === endpoint) {
        cancelEditing(); // Annule l'édition si on supprime l'élément en cours de modification
      }
    } catch (e) {
      alert("Erreur suppression : " + e.message);
    }
  };

  // Débute l'édition d’un élément
  const startEditing = (endpoint, item) => {
    setEditingItem({ id: item.id, endpoint }); // Définit l'élément en cours d’édition
    setEditFormData({ ...item }); // Remplit le formulaire avec ses valeurs actuelles
  };

  // Annule l’édition
  const cancelEditing = () => {
    setEditingItem({ id: null, endpoint: null });
    setEditFormData({});
  };

  // Mise à jour des valeurs dans le formulaire
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Enregistre les modifications d’un élément
  const saveEdit = async (setter) => {
    try {
      const { endpoint, id } = editingItem;
      const res = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) throw new Error("Erreur sauvegarde");
      const updatedItem = await res.json();
      // Met à jour l'élément modifié dans la liste
      setter((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
      cancelEditing();
    } catch (e) {
      alert("Erreur sauvegarde : " + e.message);
    }
  };

  // Fonction générique pour afficher les listes modifiables
  const renderList = (title, items, fields, endpoint, setter) => (
    <section className="admin-section">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {/* Si on est en train d’éditer cet élément */}
            {editingItem.id === item.id && editingItem.endpoint === endpoint ? (
              <>
                {fields.map((field) => (
                  <input
                    key={field}
                    name={field}
                    value={editFormData[field] || ""}
                    onChange={handleEditChange}
                    style={{ marginRight: "8px" }}
                  />
                ))}
                <button onClick={() => saveEdit(setter)}>Enregistrer</button>
                <button onClick={cancelEditing}>Annuler</button>
              </>
            ) : (
              <>
                {/* Affichage normal si non édité */}
                <span>{fields.map((f) => item[f]).join(" - ")}</span>
                <button onClick={() => startEditing(endpoint, item)}>Modifier</button>
                <button onClick={() => handleDelete(endpoint, item.id, setter)}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );

  // Liste des inscriptions (modification désactivée ici)
  const renderInscriptions = () => (
    <section className="admin-section">
      <h2>Inscriptions</h2>
      <ul>
        {inscriptions.map((inscription) => (
          <li key={inscription.id}>
            <span>
              <strong>Inscription #{inscription.id}</strong> - Formation :{" "}
              {inscription.formation_nom} - Visiteur :{" "}
              {inscription.visiteur_prenom} {inscription.visiteur_nom}
            </span>
            <button onClick={() => alert("Modification désactivée pour le moment.")}>
              Modifier
            </button>
            <button onClick={() => handleDelete("inscriptions", inscription.id, setInscriptions)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </section>
  );

  // Rendu principal du composant
  return (
    <div className="adminPage">
      <h1>Dashboard Admin</h1>

      {/* Bloc statistiques */}
      <section className="admin-section stats-section">
        <h2>Statistiques et Rapports</h2>

        {/* Inscriptions par cours */}
        <div>
          <h3>Nombre d'inscriptions par cours</h3>
          <ul>
            {inscriptionsParCours.map(({ id, titre, nbInscriptions }) => (
              <li key={id}>
                <strong>{titre} :</strong> {nbInscriptions} inscription
                {nbInscriptions > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>

        {/* Taux de réussite (fictif) */}
        <div>
          <h3>Taux de réussite des étudiants</h3>
          <p>{TAUX_REUSSITE}%</p>
        </div>

        {/* Témoignages des étudiants */}
        <div>
          <h3>Avis et évaluations des étudiants</h3>
          {temoignages.length === 0 ? (
            <p>Aucun témoignage disponible.</p>
          ) : (
            <ul>
              {temoignages.slice(0, 5).map(({ id, nom, promo, message }) => (
                <li key={id}>
                  <em>
                    {nom} (promo {promo}) :
                  </em>{" "}
                  "{message.length > 100 ? message.slice(0, 100) + "..." : message}"
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Rendu des listes modifiables */}
      {renderList("Utilisateurs", users, ["nom", "prenom", "email", "role"], "users", setUsers)}
      {renderList("Cours", cours, ["titre", "description", "user_id"], "cours", setCours)}
      {renderList("Formations", formations, ["nom", "description"], "formations", setFormations)}
      {renderList("Pédagogies", pedagogies, ["titre", "description", "auteur_id"], "pedagogies", setPedagogies)}
      {renderList("Témoignages", temoignages, ["nom", "promo", "message"], "temoignages", setTemoignages)}
      {renderList("Messages de Contact", messages, ["nom", "email", "message"], "contacts", setMessages)}

      {/* Rendu des inscriptions */}
      {renderInscriptions()}
    </div>
  );
};

export default Admin;
