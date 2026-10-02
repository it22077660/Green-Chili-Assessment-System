import { useEffect, useState } from "react";

const getRecommendation = (predictedClass) => {
  const recommendations = {
    Flower:
      "The plant is in the flowering stage. Continue monitoring flower development and maintain suitable growing conditions.",

    "Green Chili":
      "The fruit is in the green maturity stage. Continue monitoring fruit development until the required harvest maturity is reached.",

    "Red Chili":
      "The fruit has reached the red mature stage. It may be suitable for harvesting depending on the intended use.",

    "Rotten Chili":
      "Visible deterioration has been detected. Inspect the affected fruit and consider removing damaged fruits to maintain crop quality.",

    "Dry chili":
      "A dry fruit condition has been detected. Inspect the fruit and surrounding plant condition before deciding on harvesting or removal.",
  };

  return (
    recommendations[predictedClass] ||
    "Continue monitoring the chili plant and fruit condition."
  );
};

function Assessment({ onNewAssessment }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  return () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };
}, [preview]);

const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};
  

const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
  ];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(
      "Invalid file type. Please upload a JPG, JPEG, or PNG image."
    );
    event.target.value = "";
    return;
  }

  // Maximum file size = 10 MB
  const maxFileSize = 10 * 1024 * 1024;

  if (file.size > maxFileSize) {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(
      "Image is too large. Please upload an image smaller than 10 MB."
    );
    event.target.value = "";
    return;
  }

  setSelectedFile(file);
  setPreview(URL.createObjectURL(file));
  setResult(null);
  setError("");
};

  const analyzeImage = async () => {
    if (!selectedFile) {
      setError("Please select a chili image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Prediction request failed.");
      }

      const data = await response.json();

     setResult(data);

     const imageBase64 = await convertImageToBase64(selectedFile);

// Save only accepted predictions to assessment history
if (Number(data.confidence) >= 70) {
  onNewAssessment({
    id: Date.now(),
    imageName: selectedFile.name,
    imagePreview: imageBase64,
    predictedClass: data.predicted_class,
    confidence: data.confidence,
    assessment: data.assessment,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
}
    } catch (err) {
      console.error(err);

      setError(
        "Unable to analyze the image. Please check whether the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <main className="dashboard">

      {/* =========================
          IMAGE UPLOAD
      ========================= */}

      <section className="card upload-card">
        <div className="section-heading">
          <span className="step">01</span>

          <div>
            <h2>Upload Image</h2>
            <p>Select a clear image for assessment.</p>
          </div>
        </div>

        {!preview ? (
          <label className="upload-area">
            <div className="upload-icon">↑</div>

            <h3>Choose a chili image</h3>

            <p>JPG, JPEG or PNG</p>

            <span className="choose-button">
              Browse Image
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              hidden
            />
          </label>
        ) : (
          <div className="preview-container">
            <img
              src={preview}
              alt="Selected chili"
              className="preview-image"
            />

            <div className="file-details">
              <strong>{selectedFile?.name}</strong>
              <span>Ready for assessment</span>
            </div>
          </div>
        )}

        <div className="button-row">
          <button
            className="analyze-button"
            onClick={analyzeImage}
            disabled={!selectedFile || loading}
          >
            {loading ? (
            <span className="loading-content">
            <span className="spinner"></span>
            Analyzing Image...
            </span>
          ) : (
          "Analyze Image"
          )}
          </button>

          {selectedFile && (
            <button
              className="reset-button"
              onClick={resetAnalysis}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </section>


      {/* =========================
          ASSESSMENT RESULT
      ========================= */}

      <section className="card result-card">
        <div className="section-heading">
          <span className="step">02</span>

          <div>
            <h2>Assessment Result</h2>
            <p>AI-generated classification results.</p>
          </div>
        </div>

        {!result ? (
  <div className="empty-result">
    <div className="plant-icon">🌱</div>

    <h3>No assessment yet</h3>

    <p>
      Upload an image and select Analyze Image to view
      the prediction.
    </p>
  </div>

) : Number(result.confidence) < 70 ? (

  <div className="invalid-result">
    <div className="invalid-icon">⚠️</div>

    <p className="invalid-label">
      LOW CONFIDENCE
    </p>

    <h2>Unable to Identify Chili Image</h2>

    <p className="invalid-description">
      The model could not confidently identify a chili flower
      or fruit in this image. Please upload a clear image
      containing a chili flower or chili fruit.
    </p>

    <div className="invalid-confidence">
      Highest model confidence:{" "}
      <strong>
        {Number(result.confidence).toFixed(2)}%
      </strong>
    </div>

    <p className="invalid-note">
      This image has not been accepted as a valid assessment.
    </p>
  </div>

) : (

  <div className="result-content">

            {/* PREDICTED CLASS */}

            <div className="prediction-main">
              <p className="result-label">
                PREDICTED CLASS
              </p>

              <h2>{result.predicted_class}</h2>

              <div className="confidence">
                {Number(result.confidence).toFixed(2)}% confidence
              </div>

              {result.confidence < 70 && (
                <div className="confidence-warning">
                  ⚠ Low confidence prediction. Please use a clearer
                  image with the chili flower or fruit clearly visible.
                </div>
              )}
            </div>


            {/* CATEGORY + ASSESSMENT */}

            <div className="assessment-grid">

              <div className="info-box">
                <span>Category</span>

                <strong>
                  {result.category}
                </strong>
              </div>

              <div className="info-box">
                <span>Assessment</span>

                <strong>
                  {result.assessment}
                </strong>
              </div>

            </div>


            {/* RECOMMENDATION
                IMPORTANT:
                This is OUTSIDE assessment-grid
            */}

            <div className="recommendation-card">

              <div className="recommendation-icon">
                🌿
              </div>

              <div>
                <span>RECOMMENDATION</span>

                <p>
                  {getRecommendation(
                    result.predicted_class
                  )}
                </p>
              </div>

            </div>


            {/* CLASS PROBABILITIES */}

            <div className="probability-section">

              <h3>Class Probabilities</h3>

              {Object.entries(
                result.probabilities
              ).map(([className, probability]) => (

                <div
                  className="probability-item"
                  key={className}
                >

                  <div className="probability-header">

                    <span>
                      {className}
                    </span>

                    <strong>
                      {Number(probability).toFixed(2)}%
                    </strong>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-bar"
                      style={{
                        width: `${probability}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>
        )}
      </section>

    </main>
  );
}

export default Assessment;