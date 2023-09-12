import React from "react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bottom-banner">
      <h1>&copy; {currentYear} Ishkhan Terzian</h1>
    </div>
  );
}

export default Footer;
