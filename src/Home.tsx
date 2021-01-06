import React from 'react';
import "./styles/home.css"

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <p className="first-part">DEWELOPER, KTÓREGO</p>
            <img src="images/photo.png" alt="My photo" width="860" height="860" />
            <p className="second-part">POTRZEBUJESZ</p>
            <i className="fas fa-desktop desktop-icon"></i>
            <i className="fas fa-mobile-alt mobile-icon"></i>
            <i className="fas fa-tablet-alt tablet-icon"></i>
        </div>
    )
}

export default Home;
