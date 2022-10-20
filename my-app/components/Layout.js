import React from "react";

const headerStyle = {
  display: "flex",
  backgroundColor: "white",
  color: "black",
  width: "100%",
  height: "40px",
  fontFamily: "Courier",
  alignItems: "center",
};

const navLinks = {
  margin: "5px",
};

const searchStyle = {
  float: "right",
  border: "none",
  fontSize: "15px",
};

const search = (e) => {
  console.log(e.target[0].value);
  e.preventDefault();
};

const Header = () => {
  return (
  <header style={headerStyle}>
    <a style={navLinks} href="/">LinkedTrust</a>
    <a style={navLinks} href="/about">About</a>
    <a style={navLinks} href="/account">Account</a>
    <form onSubmit={search}>
    <input style={searchStyle} type="text" placeholder="Search.."></input>
    </form>
  </header>);
};

const footerStyle = {
  backgroundColor: "#215cff",
  color: "black",
  width: "100%",
  height: "5vh",
  textAlign: "center",
  fontFamily: "Courier"
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
