import React, { useState } from "react";
import "../styles/Inscription.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Inscription = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    motDePasse: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const sanitizeInput = (value) => {
    return value.replace(/[<>"'`]/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));

    // Clear error on field change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire.";
    else if (formData.nom.trim().length > 50)
      newErrors.nom = "Le nom ne doit pas dépasser 50 caractères.";

    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire.";
    else if (formData.prenom.trim().length > 50)
      newErrors.prenom = "Le prénom ne doit pas dépasser 50 caractères.";

    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire.";
    else if (!emailRegex.test(formData.email.trim()))
      newErrors.email = "Email invalide.";

    if (formData.telephone && formData.telephone.length > 15)
      newErrors.telephone = "Le téléphone ne doit pas dépasser 15 caractères.";

    if (!formData.motDePasse)
      newErrors.motDePasse = "Le mot de passe est obligatoire.";
    else if (!passwordRegex.test(formData.motDePasse))
      newErrors.motDePasse =
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";

    if (formData.motDePasse !== formData.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom.trim(),
          prenom: formData.prenom.trim(),
          email: formData.email.trim(),
          telephone: formData.telephone.trim(),
          date_naissance: formData.dateNaissance,
          mot_de_passe: formData.motDePasse,
          role: "visiteur",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur serveur:", response.status, errorText);
        throw new Error("Erreur lors de l'enregistrement.");
      }

      const createdUser = await response.json();

      setUser({
        id: createdUser.id,
        nom: createdUser.nom,
        prenom: createdUser.prenom,
        email: createdUser.email,
        role: createdUser.role,
      });

      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        dateNaissance: "",
        motDePasse: "",
        confirmPassword: "",
      });
      setErrors({});

      alert("Inscription réussie !");
      navigate("/profil/visiteur");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setErrors({ general: error.message || "Erreur inconnue." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="inscriptionPage">
      <h1 className="inscriptionTitle">Inscription à TECHECOLE</h1>
      <form className="inscriptionForm" onSubmit={handleSubmit} noValidate>
        <label htmlFor="nom"></label>
        <input
          id="nom"
          type="text"
          name="nom"
          placeholder="Nom"
          onChange={handleChange}
          value={formData.nom}
          required
          maxLength={50}
          aria-describedby="nomError"
          aria-invalid={!!errors.nom}
        />
        {errors.nom && (
          <p id="nomError" className="error" role="alert">
            {errors.nom}
          </p>
        )}

        <label htmlFor="prenom"></label>
        <input
          id="prenom"
          type="text"
          name="prenom"
          placeholder="Prénom"
          onChange={handleChange}
          value={formData.prenom}
          required
          maxLength={50}
          aria-describedby="prenomError"
          aria-invalid={!!errors.prenom}
        />
        {errors.prenom && (
          <p id="prenomError" className="error" role="alert">
            {errors.prenom}
          </p>
        )}

        <label htmlFor="email"></label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          onChange={handleChange}
          value={formData.email}
          required
          maxLength={100}
          aria-describedby="emailError"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="emailError" className="error" role="alert">
            {errors.email}
          </p>
        )}

        <label htmlFor="telephone"></label>
        <input
          id="telephone"
          type="tel"
          name="telephone"
          placeholder="Téléphone"
          onChange={handleChange}
          value={formData.telephone}
          maxLength={15}
          aria-describedby="telephoneError"
          aria-invalid={!!errors.telephone}
        />
        {errors.telephone && (
          <p id="telephoneError" className="error" role="alert">
            {errors.telephone}
          </p>
        )}

        <label htmlFor="dateNaissance">Date de naissance</label>
        <input
          id="dateNaissance"
          type="date"
          name="dateNaissance"
          onChange={handleChange}
          value={formData.dateNaissance}
        />

        <label htmlFor="motDePasse"></label>
        <input
          id="motDePasse"
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          onChange={handleChange}
          value={formData.motDePasse}
          required
          autoComplete="new-password"
          maxLength={50}
          aria-describedby="motDePasseError"
          aria-invalid={!!errors.motDePasse}
        />
        {errors.motDePasse && (
          <p id="motDePasseError" className="error" role="alert">
            {errors.motDePasse}
          </p>
        )}

        <label htmlFor="confirmPassword"></label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirmer mot de passe"
          onChange={handleChange}
          value={formData.confirmPassword}
          required
          autoComplete="new-password"
          maxLength={50}
          aria-describedby="confirmPasswordError"
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p id="confirmPasswordError" className="error" role="alert">
            {errors.confirmPassword}
          </p>
        )}

        {errors.general && (
          <p className="error generalError" role="alert">
            {errors.general}
          </p>
        )}

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "S'inscrire"}
        </button>
      </form>
    </main>
  );
};

export default Inscription;
