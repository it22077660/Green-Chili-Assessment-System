import { useEffect, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import History from "./pages/History";
import ModelPerformance from "./pages/ModelPerformance";


function AppContent() {
  const location = useLocation();

  const [history, setHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem(
        "chiliAssessmentHistory"
      );

      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });


  useEffect(() => {
    localStorage.setItem(
      "chiliAssessmentHistory",
      JSON.stringify(history)
    );
  }, [history]);


  const addAssessment = (newAssessment) => {
    setHistory((previousHistory) =>
      [newAssessment, ...previousHistory].slice(0, 10)
    );
  };


  const clearHistory = () => {
    setHistory([]);
  };


  /*
    Home page has its own header/navigation.
    Therefore the main application header is hidden on /home.
  */
  const isHomePage =
    location.pathname === "/home" ||
    location.pathname === "/";


  return (
    <div className="app">

      {/* =====================================
          HEADER
          Hidden on Home page
      ====================================== */}
      {!isHomePage && (
        <>
          <header className="header">
            <div>
              <p className="eyebrow">
                AI-POWERED CROP ASSESSMENT
              </p>

              <h1>
                Green Chili Intelligent Assessment System
              </h1>

              <p className="subtitle">
                An integrated AI-powered platform for green chili
                crop assessment and intelligent decision support.
              </p>
            </div>

            <div className="model-badge">
              <span className="status-dot"></span>
              AI Research Platform
            </div>
          </header>


          {/* =====================================
              MAIN NAVIGATION
          ====================================== */}
          <nav className="navigation">

            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Home
            </NavLink>


            <NavLink
              to="/assessment"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Assessment
            </NavLink>


            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              History

              {history.length > 0 && (
                <span className="history-count">
                  {history.length}
                </span>
              )}
            </NavLink>


            <NavLink
              to="/performance"
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              Model Performance
            </NavLink>

          </nav>
        </>
      )}


      {/* =====================================
          ROUTES
      ====================================== */}
      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={
            <Navigate
              to="/home"
              replace
            />
          }
        />


        {/* HOME */}
        <Route
          path="/home"
          element={<Home />}
        />


        {/* COMPONENT 1 ASSESSMENT */}
        <Route
          path="/assessment"
          element={
            <Assessment
              onNewAssessment={addAssessment}
            />
          }
        />


        {/* HISTORY */}
        <Route
          path="/history"
          element={
            <History
              history={history}
              onClearHistory={clearHistory}
            />
          }
        />


        {/* MODEL PERFORMANCE */}
        <Route
          path="/performance"
          element={<ModelPerformance />}
        />


        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={
            <Navigate
              to="/home"
              replace
            />
          }
        />

      </Routes>


      {/* =====================================
          FOOTER
          Hidden on Home page because
          Home can have its own footer/CTA
      ====================================== */}
      {!isHomePage && (
       <footer className="app-footer">
  <div className="footer-brand">
    <div className="footer-logo">🌱</div>

    <div>
      <strong>Green Chili Intelligent Assessment System</strong>
      <p>AI-Powered Agricultural Research Platform</p>
    </div>
  </div>

  <div className="footer-info">
    <span>Research Project</span>
    <span className="footer-dot">•</span>
    <span>SLIIT</span>
    <span className="footer-dot">•</span>
    <span>2026</span>
  </div>
</footer>
      )}

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;