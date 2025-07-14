import React, { useEffect, useState } from "react";
import "../styles/Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [cours, setCours] = useState([]);
  const [formations, setFormations] = useState([]);
  const [pedagogies, setPedagogies] = useState([]);
  const [temoignages, setTemoignages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inscriptions, setInscriptions] = useState([]);

  const [editingItem, setEditingItem] = useState({ id: null, endpoint: null });
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchAll();
  }, []);

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

  const fetchEntity = async (endpoint, setter) => {
    try {
      const res = await fetch(`http://localhost:3001/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (e) {
      console.error(`Erreur chargement ${endpoint} :`, e);
    }
  };

  // Calcul nombre d'inscriptions par cours
  const inscriptionsParCours = cours.map((coursItem) => {
    const nbInscriptions = inscriptions.filter(
      (insc) => insc.cours_id === coursItem.id
    ).length;
    return { ...coursItem, nbInscriptions };
  });

  const TAUX_REUSSITE = 94; // taux fictif à 94%

  const handleDelete = async (endpoint, id, setter) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      const res = await fetch(`http://localhost:3001/${endpoint}/${id}`, {
        method: "DELETE",
      });
      if (res.status !== 204 && res.status !== 200) throw new Error("Erreur suppression");
      setter((prev) => prev.filter((item) => item.id !== id));
      if (editingItem.id === id && editingItem.endpoint === endpoint) {
        cancelEditing();
      }
    } catch (e) {
      alert("Erreur suppression : " + e.message);
    }
  };

  const startEditing = (endpoint, item) => {
    setEditingItem({ id: item.id, endpoint });
    setEditFormData({ ...item });
  };

  const cancelEditing = () => {
    setEditingItem({ id: null, endpoint: null });
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      setter((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
      cancelEditing();
    } catch (e) {
      alert("Erreur sauvegarde : " + e.message);
    }
  };

  // Composant générique pour afficher les listes modifiables/supprimables
  const renderList = (title, items, fields, endpoint, setter) => (
    <section className="admin-section">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
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

  // Section Inscriptions : modification désactivée, suppression activée
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

  return (
    <div className="adminPage">
      <h1>Dashboard Admin</h1>

      {/* Bloc Statistiques */}
      <section className="admin-section stats-section">
        <h2>Statistiques et Rapports</h2>

        <div>
          <h3>Nombre d'inscriptions par cours</h3>
          <ul>
            {inscriptionsParCours.map(({ id, titre, nbInscriptions }) => (
              <li key={id}>
                <strong>{titre} :</strong> {nbInscriptions} inscription{nbInscriptions > 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Taux de réussite des étudiants</h3>
          <p>{TAUX_REUSSITE}%</p>
        </div>

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

      {/* Listes modifiables */}
      {renderList("Utilisateurs", users, ["nom", "prenom", "email", "role"], "users", setUsers)}
      {renderList("Cours", cours, ["titre", "description", "user_id"], "cours", setCours)}
      {renderList("Formations", formations, ["nom", "description"], "formations", setFormations)}
      {renderList("Pédagogies", pedagogies, ["titre", "description", "auteur_id"], "pedagogies", setPedagogies)}
      {renderList("Témoignages", temoignages, ["nom", "promo", "message"], "temoignages", setTemoignages)}
      {renderList("Messages de Contact", messages, ["nom", "email", "message"], "contacts", setMessages)}

      {/* Inscriptions */}
      {renderInscriptions()}
    </div>
  );
};

export default Admin;
