import React from 'react';
import { Link } from 'react-router';
import Menu from './Menu';
import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-wrapper">
            <Menu />

            {/* Arrière-plan animé */}
            <div className="bg-glow glow-1" />
            <div className="bg-glow glow-2" />

            <main className="home-container">
                {/* Hero Section */}
                <header className="hero-section">
                    <span className="hero-badge">⚡ Entraînement & Évaluation</span>
                    <h1 className="hero-title">
                        Révisez et testez vos connaissances avec 
                        <span className="gradient-text"> Quiz Runner</span>
                    </h1>
                    <p className="hero-subtitle">
                        Accédez à la bibliothèque de quiz par matière, entraînez-vous avec correction instantanée ou testez-vous en conditions réelles d'examen.
                    </p>

                    <div className="hero-actions">
                        <Link to="/download" className="cta-button primary-cta">
                            <span>📚 Choisir un quiz</span>
                        </Link>
                        <Link to="/quiz" className="cta-button secondary-cta">
                            <span>📁 Charger un fichier local</span>
                        </Link>
                    </div>
                </header>

                {/* Grille des fonctionnalités */}
                <section className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Mode Entraînement</h3>
                        <p>Feedback immédiat, révision des réponses et navigation libre pour progresser à votre rythme.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Mode Examen</h3>
                        <p>Chronomètre global, aucun retour arrière et résultats détaillés uniquement à la fin.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🧩</div>
                        <h3>Formules & Code</h3>
                        <p>Rendu natif des équations LaTeX avec KaTeX et coloration syntaxique pour tous les extraits de code.</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;