import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Récupérer un cookie par nom
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset error on input change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const nom = formData.nom.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!nom) newErrors.nom = "Le nom est obligatoire.";
    else if (nom.length > 50)
      newErrors.nom = "Le nom ne doit pas dépasser 50 caractères.";

    if (!email) newErrors.email = "L'email est obligatoire.";
    else if (!emailRegex.test(email)) newErrors.email = "Email invalide.";

    if (!message) newErrors.message = "Le message est obligatoire.";
    else if (message.length > 500)
      newErrors.message = "Le message ne doit pas dépasser 500 caractères.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");

    if (!validateForm()) return;

    setLoading(true);

    const csrfToken = getCookie("csrfToken");

    try {
      await axios.post(
        "http://localhost:3001/contacts",
        {
          nom: formData.nom.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken || "",
          },
        }
      );
      setFeedback("Votre message a bien été envoyé !");
      setFormData({ nom: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      setFeedback("Une erreur est survenue, veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactPage">
      <h1 className="contactTitle">Contactez TECHECOLE</h1>
      <p className="contactIntro">
        Pour toute question, vous pouvez nous écrire ou nous appeler.
        <br />
        📧 Email : techecole@contact.com
        <br />
        ☎️ Téléphone : +33 1 23 45 67 89
      </p>

      <form className="contactForm" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          name="nom"
          placeholder="Votre nom"
          value={formData.nom}
          onChange={handleChange}
          aria-describedby="nomError"
          aria-invalid={!!errors.nom}
          required
        />
        {errors.nom && (
          <p id="nomError" className="errorMessage">
            {errors.nom}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Votre adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          aria-describedby="emailError"
          aria-invalid={!!errors.email}
          required
        />
        {errors.email && (
          <p id="emailError" className="errorMessage">
            {errors.email}
          </p>
        )}

        <textarea
          name="message"
          placeholder="Votre message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          aria-describedby="messageError"
          aria-invalid={!!errors.message}
          required
        ></textarea>
        {errors.message && (
          <p id="messageError" className="errorMessage">
            {errors.message}
          </p>
        )}

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>
      {feedback && <p className="feedbackMessage">{feedback}</p>}
    </div>
  );
};

export default Contact;
