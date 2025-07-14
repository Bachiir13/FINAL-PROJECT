import React, { useState, useEffect, useRef } from "react";
import "../styles/Connexion.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  // Nettoyage simple email & password (juste retirer <>")
  const sanitizeInput = (value) => {
    return value.replace(/[<>"]/g, "");
  };

  useEffect(() => {
    const renderCaptcha = () => {
      if (window.grecaptcha && captchaRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: "6LcxCnUrAAAAAJQCQ2pB48ogaKQVeh0MqczpUEXv",
          callback: (token) => setCaptchaToken(token),
          "expired-callback": () => setCaptchaToken(null),
        });
      }
    };

    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderCaptcha;
      document.body.appendChild(script);
    } else {
      renderCaptcha();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const cleanEmail = sanitizeInput(email);
    const cleanPassword = sanitizeInput(motDePasse);

    if (!emailRegex.test(cleanEmail)) {
      alert("Veuillez saisir un email valide.");
      setIsSubmitting(false);
      return;
    }
    if (!passwordRegex.test(cleanPassword)) {
      alert(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      setIsSubmitting(false);
      return;
    }

    if (!captchaToken) {
      alert("Merci de valider le reCAPTCHA.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, motDePasse: cleanPassword, captchaToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Email ou mot de passe incorrect.");
      }

      const userData = await response.json();
      const user = userData.user;

      setUser({
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      });

      alert("Connexion réussie !");

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "enseignant") {
        navigate("/profil/enseignant");
      } else if (user.role === "eleve") {
        navigate("/profil/eleve");
      } else {
        navigate("/profil/visiteur");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="connexionPage">
      <h2 className="connexionTitle">CONNEXION</h2>
      <form className="connexionForm" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(sanitizeInput(e.target.value))}
          required
          maxLength={100}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(sanitizeInput(e.target.value))}
          required
          maxLength={50}
          autoComplete="current-password"
        />
        <div ref={captchaRef} style={{ margin: "20px 0" }}></div>
        <button type="submit" className="btn" disabled={isSubmitting}>
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Connexion;
