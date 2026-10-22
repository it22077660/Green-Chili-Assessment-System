import { useEffect, useRef, useState } from "react";

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
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [harvestTarget, setHarvestTarget] = useState("green");
  const [harvestChecks, setHarvestChecks] = useState({ size: false, firmness: false, color: false, quality: false });
  const [checklistReviewed, setChecklistReviewed] = useState(false);
  const checkCount = Object.values(harvestChecks).filter(Boolean).length;
  const isTargetColor = result && ((result.predicted_class === "Green Chili" && result.harvest_target === "green") || (result.predicted_class === "Red Chili" && result.harvest_target === "red"));
  const toggleCheck = (key) => {
    setHarvestChecks((previous) => ({ ...previous, [key]: !previous[key] }));
    setChecklistReviewed(false);
  };

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
  setHarvestChecks({ size: false, firmness: false, color: false, quality: false });
  setChecklistReviewed(false);
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
    formData.append("harvest_target", harvestTarget);

    try {
      const response = await fetch(
         `http://${window.location.hostname}:8000/predict`,
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
    harvestTarget: data.harvest_target,
    harvestReadiness: data.harvest_assessment?.readiness,
    harvestRecommendation: data.harvest_assessment?.recommendation,
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
    setHarvestChecks({ size: false, firmness: false, color: false, quality: false });
    setChecklistReviewed(false);
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
  <div className="upload-area">
    <div className="upload-icon">↑</div>

    <h3>Choose a chili image</h3>
    <p>JPG, JPEG or PNG</p>

    <div className="camera-upload-actions">
      <button
        type="button"
        className="camera-button"
        onClick={() => cameraInputRef.current?.click()}
      >
        📷 Take Photo
      </button>

      <button
        type="button"
        className="gallery-button"
        onClick={() => galleryInputRef.current?.click()}
      >
        🖼️ Choose from Gallery
      </button>
    </div>

    <input
      ref={cameraInputRef}
      type="file"
      accept="image/jpeg,image/png"
      capture="environment"
      onChange={handleImageChange}
      hidden
    />

    <input
      ref={galleryInputRef}
      type="file"
      accept="image/jpeg,image/png"
      onChange={handleImageChange}
      hidden
    />
  </div>
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

        <div className="harvest-target-selector" style={{ marginTop: 20, marginBottom: 16 }}>
          <label htmlFor="harvest-target" style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Harvest Target
          </label>
          <select
            id="harvest-target"
            value={harvestTarget}
            onChange={(event) => {
              setHarvestTarget(event.target.value);
              setResult(null);
              setHarvestChecks({ size: false, firmness: false, color: false, quality: false });
              setChecklistReviewed(false);
            }}
            disabled={loading}
            style={{ width: "100%", maxWidth: 360, padding: 12, borderRadius: 8, border: "1px solid #b7c8bd", background: "white", color: "#183c2a" }}
          >
            <option value="green">Green chili harvest</option>
            <option value="red">Red chili harvest</option>
          </select>
          <p style={{ fontSize: 13, opacity: 0.75, marginTop: 8 }}>
            Select the intended harvest color before analyzing the image.
          </p>
        </div>

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
      The model confidence is below the current 70% review threshold.
      This does not necessarily mean the image is invalid. Please inspect
      the image and try another clear photo if needed.
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
              <div className="recommendation-icon">🌿</div>
              <div>
                <span>HARVEST READINESS</span>
                <h3 style={{ margin: "8px 0" }}>
                  {result.harvest_assessment?.readiness || "Needs Inspection"}
                </h3>
                <p><strong>Target:</strong> {result.harvest_target === "red" ? "Red chili" : "Green chili"}</p>
                <p>
                  {result.harvest_assessment?.recommendation ||
                    getRecommendation(result.predicted_class)}
                </p>
                <p style={{ fontSize: 12, opacity: 0.75, marginTop: 10 }}>
                  Preliminary image-based guidance only. Confirm harvesting suitability
                  through physical inspection and crop-specific advice.
                </p>
              </div>
            </div>

           
{/* FARMER-REPORTED PHYSICAL HARVEST CHECKLIST */}
{isTargetColor && (
  <div
    className="harvest-checklist-container"
    style={{
      marginTop: "20px",
      padding: "24px",
      background: "#f1faf4",
      border: "1px solid #b8dfc2",
      borderLeft: "6px solid #238747",
      borderRadius: "18px",
      width: "100%",
      minWidth: 0,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: "14px",
    }}
  >
    <h3 style={{ margin: 0, color: "#174d30" }}>
      🌶️ Harvest Readiness Checklist
    </h3>

    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Inspect the actual fruit and tick only the conditions
      you have personally confirmed. The AI cannot verify
      size or firmness from this image.
    </p>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        width: "100%",
      }}
    >
      {[
        ["size", "Fruit meets the expected harvest size"],
        ["firmness", "Fruit feels appropriately firm"],
        ["color", "Fruit matches the selected harvest color"],
        ["quality", "No obvious damage or deterioration"],
      ].map(([key, label]) => (
        <label
          key={key}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: "12px",
            width: "100%",
            minWidth: 0,
            cursor: "pointer",
            fontWeight: 400,
            letterSpacing: "normal",
            lineHeight: 1.5,
          }}
        >
          <input
            type="checkbox"
            checked={harvestChecks[key]}
            onChange={() => toggleCheck(key)}
            style={{
              width: "18px",
              height: "18px",
              flexShrink: 0,
              marginTop: "3px",
              accentColor: "#238747",
            }}
          />

          <span
            style={{
              flex: 1,
              minWidth: 0,
              whiteSpace: "normal",
              overflowWrap: "break-word",
              fontWeight: 400,
              letterSpacing: "normal",
            }}
          >
            {label}
          </span>
        </label>
      ))}
    </div>

    <p style={{ margin: 0 }}>
      <strong>Confirmed checks:</strong> {checkCount}/4
    </p>

    <button
      type="button"
      className="analyze-button"
      style={{
        width: "fit-content",
        maxWidth: "100%",
        padding: "12px 22px",
        alignSelf: "flex-start",
      }}
      onClick={() => setChecklistReviewed(true)}
    >
      Review Checklist
    </button>

    {checklistReviewed && (
      <div
        style={{
          background: "#ffffff",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid #c9e4d0",
        }}
      >
        <strong>
          {checkCount === 4
            ? "Preliminary checks passed"
            : "Further inspection required"}
        </strong>

        <p style={{ marginTop: "10px", lineHeight: 1.6 }}>
          {checkCount === 4
            ? "The selected physical checks have been confirmed by the user. Harvest suitability remains provisional; follow local crop and market guidance."
            : "Some physical checks have not been confirmed. Do not treat the fruit as harvest-ready based on its image classification alone."}
        </p>
      </div>
    )}

    <p
      style={{
        fontSize: "12px",
        opacity: 0.75,
        margin: 0,
        lineHeight: 1.6,
      }}
    >
      This is a user-reported checklist, not a validated
      AI harvest-readiness prediction.
    </p>
  </div>
)}

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