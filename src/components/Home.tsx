import React from "react";
import {Link} from "react-router";
import Menu from "./Menu";

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Quiz Runner</h1>
            <Menu />
        </div>
    )
}

export default Home;