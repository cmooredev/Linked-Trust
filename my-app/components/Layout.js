import React from "react";
import Link from "next/link";
import Router from 'next/router';

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
  Router.push(`/trust/${e.target[0].value}`, undefined, { shallow: true });
  e.preventDefault();
};

const Header = () => {
  return (
  <header style={headerStyle}>
    <Link href="/">
      <a style={navLinks}>LinkedTrust</a>
    </Link>
    <Link href="/about">
      <a style={navLinks}>About</a>
    </Link>
    <Link href="/account">
      <a style={navLinks} href="/account">Account</a>
    </Link>
    <form onSubmit={search}>
    <input style={searchStyle} id="trust" name="id" type="text" placeholder="Search.."></input>
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
