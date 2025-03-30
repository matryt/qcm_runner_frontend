import {Link} from "react-router";
import React from "react";
import "./Menu.css";

const Menu: React.FC = () => {
    return (
        <nav>
            <Link to={"/quiz"}>
                <button>Commencer un quiz</button>
            </Link>
            <Link to={"/download"}>
                <button>Télécharger un quiz</button>
            </Link>
        </nav>
    )
}

export default Menu;