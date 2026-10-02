import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">

      {/* HERO SECTION */}
      <section className="home-hero">
        <div className="home-hero-content">

          <p className="home-eyebrow">
            AI-POWERED GREEN CHILI INTELLIGENT MONITORING
          </p>

          <h2>
            Intelligent Assessment for
            <span> Smarter Chili Cultivation</span>
          </h2>

          <p className="home-description">
            An integrated research platform that combines
            image-based crop assessment with intelligent
            analysis to support green chili monitoring and
            management decisions.
          </p>

          <div className="home-buttons">
            <Link
              to="/assessment"
              className="home-primary-button"
            >
              Start Assessment →
            </Link>

            <a
              href="#components"
              className="home-secondary-button"
            >
              Explore System
            </a>
          </div>

        </div>

        <div className="home-hero-visual">
          <div className="chili-visual">
            🌶️
          </div>

          <p>AI-Powered Crop Intelligence</p>
        </div>
      </section>


      {/* SYSTEM OVERVIEW */}
      <section
        className="home-system-section"
        id="components"
      >
        <div className="home-section-heading">

          <p className="eyebrow-dark">
            OUR RESEARCH SYSTEM
          </p>

          <h2>Four Intelligent Components</h2>

          <p>
            The integrated solution combines four analytical
            components to provide a broader understanding of
            green chili crop condition.
          </p>

        </div>


        <div className="component-grid">

          {/* COMPONENT 1 */}
          <div className="component-card featured-component">

            <div className="component-number">
              01
            </div>

            <div className="component-icon">
              🌱
            </div>

            <h3>
              Growth, Maturity & Fruit Condition
            </h3>

            <p>
              Image-based classification of chili development,
              maturity and visible fruit condition.
            </p>

            <div className="component-tags">
              <span>Flower</span>
              <span>Green</span>
              <span>Red</span>
              <span>Rotten</span>
              <span>Dry</span>
            </div>

            <Link
              to="/assessment"
              className="component-link"
            >
              Open Assessment →
            </Link>

          </div>


          {/* COMPONENT 2 */}
          <div className="component-card">

            <div className="component-number">
              02
            </div>

            <div className="component-icon">
              🍃
            </div>

            <h3>
              Chili Health & Disease Classification
            </h3>

            <p>
              Image-based analysis for identifying chili
              health status and disease-related conditions.
            </p>

            <span className="development-badge">
              Team Component
            </span>

          </div>


          {/* COMPONENT 3 */}
          <div className="component-card">

            <div className="component-number">
              03
            </div>

            <div className="component-icon">
              🔬
            </div>

            <h3>
              Disease Severity & Crop Health
            </h3>

            <p>
              Assessment of disease severity and its impact
              on overall chili crop health.
            </p>

            <span className="development-badge">
              Team Component
            </span>

          </div>


          {/* COMPONENT 4 */}
          <div className="component-card">

            <div className="component-number">
              04
            </div>

            <div className="component-icon">
              🌦️
            </div>

            <h3>
              Climate-Aware Risk & Yield Prediction
            </h3>

            <p>
              Climate and greenhouse data analysis for crop
              risk assessment and yield-related prediction.
            </p>

            <span className="development-badge">
              Team Component
            </span>

          </div>

        </div>
      </section>


      {/* INTEGRATED FLOW */}
      <section className="integration-section">

        <div className="home-section-heading">

          <p className="eyebrow-dark">
            INTEGRATED INTELLIGENCE
          </p>

          <h2>How the System Works</h2>

          <p>
            Multiple analytical outputs can be combined to
            support a more complete crop assessment.
          </p>

        </div>


        <div className="integration-flow">

          <div className="flow-card">
            <span>01</span>
            <strong>Data Input</strong>
            <p>
              Crop images and greenhouse / climate data
            </p>
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-card">
            <span>02</span>
            <strong>AI Analysis</strong>
            <p>
              Independent intelligent analytical modules
            </p>
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-card">
            <span>03</span>
            <strong>Integrated Assessment</strong>
            <p>
              Combined crop condition and risk information
            </p>
          </div>

          <div className="flow-arrow">
            →
          </div>

          <div className="flow-card">
            <span>04</span>
            <strong>Recommendation</strong>
            <p>
              Adaptive crop management support
            </p>
          </div>

        </div>
      </section>


      {/* COMPONENT 1 CTA */}
      <section className="home-cta">

        <div>
          <p className="home-cta-label">
            COMPONENT 01
          </p>

          <h2>
            Try the Growth & Maturity Assessment
          </h2>

          <p>
            Upload a chili image and receive an AI-generated
            classification, confidence score, assessment and
            recommendation.
          </p>
        </div>

        <Link
          to="/assessment"
          className="home-primary-button"
        >
          Analyze Image →
        </Link>

      </section>

    </main>
  );
}

export default Home;