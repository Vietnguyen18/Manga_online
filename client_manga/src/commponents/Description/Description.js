import React from "react";
import Footer from "./component/Footer";
import Contact from "./component/Contact";
import OutstandingFeatures from "./component/OutstandingFeatures";
import About from "./component/About";
import Home from "./component/Home";
import "./index.css";

const Description = () => {
  return (
    <div className="container-app">
      <Home />
      <About />
      <OutstandingFeatures />
      <Contact />
      <Footer />
    </div>
  );
};

export default Description;
