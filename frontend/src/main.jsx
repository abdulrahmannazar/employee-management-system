import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import DashboardPage from "./DashboardPage.jsx";
import CompanyPage from "./CompanyPage.jsx";


function App() {

  const [path, setPath] = useState(
    window.location.pathname
  );


  useEffect(() => {

    const handleNavigation = () => {

      setPath(
        window.location.pathname
      );

    };


    window.addEventListener(
      "popstate",
      handleNavigation
    );


    return () => {

      window.removeEventListener(
        "popstate",
        handleNavigation
      );

    };

  }, []);


  if (
    path === "/companies" ||
    path.startsWith("/companies/")
  ) {

    return <CompanyPage />;

  }


  return <DashboardPage />;
}


createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <App />

  </StrictMode>

);