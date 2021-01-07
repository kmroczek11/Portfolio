import React from 'react';
import "./styles/home.css";
import styled from "styled-components";
import { motion } from "framer-motion";

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <p className="first-part">DEWELOPER, KTÓREGO</p>
            <img src="images/photo.png" alt="My photo" width="860" height="860" />
            <p className="second-part">POTRZEBUJESZ</p>
            {
                [
                    { name: "fa-desktop", top: "10vh", left: "10vw" },
                    { name: "fa-mobile-alt", bottom: "10vh", left: "20vw" },
                    { name: "fa-tablet-alt", top: "10vh", right: "20vw" },
                ].map((e) =>
                    <Icon
                        className={`fas ${e.name}`}
                        variants={{
                            hidden: {
                                top: e.top && 0,
                                bottom: e.bottom && 0,
                                left: e.left && 0,
                                right: e.right && 0,
                            },
                            visible: {
                                top: e.top && e.top,
                                bottom: e.bottom && e.bottom,
                                left: e.left && e.left,
                                right: e.right && e.right,
                            },
                        }}
                        initial="hidden"
                        animate={"visible"}
                    ></Icon>
                )}
        </div>
    )
}

export default Home;

const Icon = styled(motion.div)`
    position: absolute;
    font-size: 10em;
    color: #ff4d17;
`;
