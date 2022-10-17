import React from "react";

const headerStyle = {
  backgroundColor: "white",
  color: "black",
  width: "100%",
  height: "5vh",
  fontFamily: "Apple Chancery, Monaca, monospace"
};

const Header = () => {
  return (
  <header style={headerStyle}>
    <a href="/">LinkedTrust</a>
  </header>);
};

const footerStyle = {
  backgroundColor: "#215cff",
  color: "black",
  width: "100%",
  height: "5vh",
  textAlign: "center",
  fontFamily: "Apple Chancery, Monaca, monospace"
};

const Footer = () => {
  return (<footer style={footerStyle}>
    Made with &#10084; by cmoorelabs
  </footer>);
};

const Layout = props => (
  <div className="Layout">
    <Header />
    <div className="Content">
      {props.children}
    </div>
    <Footer />
  </div>
);

export default Layout;
