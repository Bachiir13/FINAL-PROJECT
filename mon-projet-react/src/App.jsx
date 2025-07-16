import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageAccueil from './pages/PageAccueil';
import Inscription from './pages/Inscription'; 
import Connexion from './pages/Connexion';
import Formations from './pages/Formations'; // Assurez-vous que ce fichier existe
import Contact from './pages/Contact'; // Assurez-vous que ce fichier existe
import PageAdmin from './pages/PageAdmin'; // Assurez-vous que ce fichier existe
import PageEnseignant from './pages/PageEnseignant'; // Assurez-vous que ce fichier existe
import PageProfilEnseignant from './pages/PageProfilEnseignant'; // nouvelle page profil enseignant
import PageProfilEleve from './pages/PageProfilEleve'; // nouvelle page profil élève
import PageProfilVisiteur from './pages/PageProfilVisiteur'; // nouvelle page profil visiteur
import PageDescriptif from './pages/PageDescriptif'; // Assurez-vous que ce fichier existe
import QuiNousSommes from './pages/QuiNousSommes'; // Assurez-vous que ce fichier existe
import InscriptionFormation from './pages/InscriptionFormation';
import VisezExcellence from './pages/Visezexcellence';
import PolitiqueConfidentialite from './pages/Politique';
import MentionsLegales from './pages/Mention';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PageAccueil />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/inscription-formation" element={<InscriptionFormation />} />
        <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route path="/profil/enseignant" element={<PageProfilEnseignant />} />
        <Route path="/profil/eleve" element={<PageProfilEleve />} />
        <Route path="/profil/visiteur" element={<PageProfilVisiteur />} />
        <Route path="/admin" element={<PageAdmin />} />
        <Route path="/enseignant" element={<PageEnseignant />} />
        <Route path="/formations/:id" element={<PageDescriptif />} />
        <Route path="/qui-sommes-nous" element={<QuiNousSommes />} />
        <Route path="/visez-excellence" element={<VisezExcellence />} />
         <Route path="/mentions-legales" element={<MentionsLegales />} /> {/* Route Mentions Légales */}

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
