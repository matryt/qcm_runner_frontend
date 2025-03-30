import React from "react";
import {Link} from "react-router";

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Quiz Runner</h1>
            <Link to={"/quiz"}>
                <button>Commencer un quiz</button>
            </Link>
            <Link to={"/download"}>
                <button>Télécharger un quiz</button>
            </Link>
        </div>
    )
}

export default Home;