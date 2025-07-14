import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // adapte le chemin si besoin
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setUser(null);
    navigate('/connexion');
  };

  const getProfilPath = () => {
    if (!user) return '/connexion';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'enseignant':
        return '/profil/enseignant';
      case 'eleve':
        return '/profil/eleve';
      case 'visiteur':
      default:
        return '/profil/visiteur';
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">TECHECOLE</div>

      <div className="burger" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </div>

      <ul className={`navLinks ${isOpen ? 'active' : ''}`}>
        {user ? (
          <>
            <li><Link to="/" className="link" onClick={() => setIsOpen(false)}>Accueil</Link></li>
            <li><Link to="/formations" className="link" onClick={() => setIsOpen(false)}>Nos Formations</Link></li>
            <li><Link to="/contact" className="link" onClick={() => setIsOpen(false)}>Contact</Link></li>
            <li>
              <Link
                to={getProfilPath()}
                className="link"
                onClick={() => setIsOpen(false)}
              >
                MonEspace
              </Link>
            </li>
            <li><button onClick={handleLogout} className="link logout-button">Déconnexion</button></li>
          </>
        ) : (
          <>
            <li><Link to="/" className="link" onClick={() => setIsOpen(false)}>Accueil</Link></li>
            <li><Link to="/formations" className="link" onClick={() => setIsOpen(false)}>Formation</Link></li>
            <li><Link to="/connexion" className="link" onClick={() => setIsOpen(false)}>Connexion</Link></li>
            <li><Link to="/inscription" className="link" onClick={() => setIsOpen(false)}>Inscription</Link></li>
            <li><Link to="/contact" className="link" onClick={() => setIsOpen(false)}>Contact</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
