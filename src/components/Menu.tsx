import React from "react";
import { Link } from "react-router";
import "./Menu.css";

const Menu: React.FC = () => {
    return (
        <nav>
            <Link to="/">
                <button type="button">🏠 Accueil</button>
            </Link>
            <Link to="/download">
                <button type="button">📚 Choisir un quiz</button>
            </Link>
            <Link to="/quiz">
                <button type="button" className="nav-secondary-btn">⚙️ Importer un fichier</button>
            </Link>
        </nav>
    );
};

export default Menu;