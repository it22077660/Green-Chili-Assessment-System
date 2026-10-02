function ModelPerformance() {
  return (
    <main className="page-container">
      <section className="performance-section performance-page">
        <div className="performance-heading">
          <p className="eyebrow-dark">MODEL PERFORMANCE</p>

          <h2>EfficientNetB0 Classification Model</h2>

          <p>
            Performance obtained from the held-out test dataset
            after fine-tuning.
          </p>
        </div>

        <div className="performance-grid">
          <div className="metric-card">
            <span>Test Accuracy</span>
            <strong>99.23%</strong>
            <small>259 / 261 correct predictions</small>
          </div>

          <div className="metric-card">
            <span>Test Loss</span>
            <strong>0.0359</strong>
            <small>Fine-tuned model</small>
          </div>

          <div className="metric-card">
            <span>Classes</span>
            <strong>5</strong>
            <small>
              Flower, Green Chili, Red Chili, Dry chili & Rotten Chili
            </small>
          </div>

          <div className="metric-card">
            <span>Architecture</span>
            <strong>EfficientNetB0</strong>
            <small>Transfer learning + fine-tuning</small>
          </div>
        </div>

        <div className="model-details-card">
          <h3>Classification Performance</h3>

          <div className="model-detail-grid">
            <div>
              <span>Macro Precision</span>
              <strong>99.23%</strong>
            </div>

            <div>
              <span>Macro Recall</span>
              <strong>99.34%</strong>
            </div>

            <div>
              <span>Macro F1-Score</span>
              <strong>99.27%</strong>
            </div>

            <div>
              <span>Test Images</span>
              <strong>261</strong>
            </div>
          </div>
        </div>

        <div className="classification-report">
  <div className="report-heading">
    <p className="eyebrow-dark">CLASS-WISE EVALUATION</p>
    <h3>Classification Report</h3>
    <p>
      Precision, recall and F1-score obtained from the
      held-out test dataset.
    </p>
  </div>

  <div className="report-table-wrapper">
    <table className="report-table">
      <thead>
        <tr>
          <th>Class</th>
          <th>Precision</th>
          <th>Recall</th>
          <th>F1-Score</th>
          <th>Support</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td><strong>Dry Chili</strong></td>
          <td>1.0000</td>
          <td>1.0000</td>
          <td>1.0000</td>
          <td>62</td>
        </tr>

        <tr>
          <td><strong>Flower</strong></td>
          <td>1.0000</td>
          <td>0.9672</td>
          <td>0.9833</td>
          <td>61</td>
        </tr>

        <tr>
          <td><strong>Green Chili</strong></td>
          <td>0.9615</td>
          <td>1.0000</td>
          <td>0.9804</td>
          <td>50</td>
        </tr>

        <tr>
          <td><strong>Red Chili</strong></td>
          <td>1.0000</td>
          <td>1.0000</td>
          <td>1.0000</td>
          <td>30</td>
        </tr>

        <tr>
          <td><strong>Rotten Chili</strong></td>
          <td>1.0000</td>
          <td>1.0000</td>
          <td>1.0000</td>
          <td>58</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div className="evaluation-summary">
  <div className="summary-icon">✓</div>

  <div className="summary-content">
    <p className="summary-label">EVALUATION SUMMARY</p>

    <h3>Strong Performance on the Held-Out Test Set</h3>

    <p>
      The fine-tuned EfficientNetB0 model achieved
      <strong> 99.23% test accuracy</strong> across 261 held-out
      images. Dry Chili, Red Chili and Rotten Chili achieved
      perfect precision and recall on this test set, while minor
      classification errors were observed for Flower and Green
      Chili.
    </p>

    <div className="summary-note">
      <strong>Note:</strong> These results represent performance
      on the current held-out test dataset and do not guarantee
      identical performance on unseen real-world images.
    </div>
  </div>
</div>
      </section>
    </main>
  );
}

export default ModelPerformance;