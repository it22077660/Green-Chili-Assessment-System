import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function History({ history, onClearHistory }) {
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const closeDetails = () => {
    setSelectedAssessment(null);
  };

  // =========================
  // DOWNLOAD HISTORY AS PDF
  // =========================
  const downloadPDF = () => {
    if (history.length === 0) {
      return;
    }

    const doc = new jsPDF();

    const generatedDate = new Date().toLocaleDateString();
    const generatedTime = new Date().toLocaleTimeString();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(24, 95, 49);
    doc.text("Green Chili Assessment System", 14, 20);

    // Subtitle
    doc.setFontSize(13);
    doc.setTextColor(60, 80, 65);
    doc.text("Assessment History Report", 14, 29);

    // Generated date/time
    doc.setFontSize(9);
    doc.setTextColor(110, 120, 112);
    doc.text(
      `Generated: ${generatedDate} ${generatedTime}`,
      14,
      36
    );

    doc.text(
      `Total Assessments: ${history.length}`,
      14,
      42
    );

    // Table data
    const tableRows = history.map((item, index) => [
      index + 1,
      item.imageName || "-",
      item.predictedClass || "-",
      `${Number(item.confidence).toFixed(2)}%`,
      item.assessment || "-",
      item.time || "-",
    ]);

    autoTable(doc, {
      startY: 50,

      head: [
        [
          "#",
          "Image",
          "Prediction",
          "Confidence",
          "Assessment",
          "Time",
        ],
      ],

      body: tableRows,

      theme: "grid",

      headStyles: {
        fillColor: [35, 111, 60],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [244, 250, 245],
      },

      styles: {
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
      },

      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 35 },
        2: { cellWidth: 27 },
        3: { cellWidth: 22 },
        4: { cellWidth: 60 },
        5: { cellWidth: 25 },
      },

      margin: {
        left: 10,
        right: 10,
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      doc.setFontSize(8);
      doc.setTextColor(130, 140, 132);

      doc.text(
        `Page ${i} of ${pageCount}`,
        180,
        290,
        { align: "right" }
      );
    }

    // Download
    doc.save(
      `Green_Chili_Assessment_History_${generatedDate.replaceAll(
        "/",
        "-"
      )}.pdf`
    );
  };

  return (
    <main className="page-container">
      <section className="history-section history-page">

        {/* =========================
            HISTORY HEADER
        ========================= */}

        <div className="history-header">
          <div>
            <p className="eyebrow-dark">
              RECENT ACTIVITY
            </p>

            <h2>Assessment History</h2>

            <p>
              Review the latest chili images analyzed by the
              system.
            </p>
          </div>

          {history.length > 0 && (
            <div className="history-actions">

              <button
                className="download-history-button"
                onClick={downloadPDF}
              >
                ↓ Download PDF
              </button>

              <button
                className="clear-history-button"
                onClick={onClearHistory}
              >
                Clear History
              </button>

            </div>
          )}
        </div>


        {/* =========================
            EMPTY HISTORY
        ========================= */}

        {history.length === 0 ? (
          <div className="history-empty">

            <span>🌿</span>

            <h3>No assessment history</h3>

            <p>
              Analyze a chili image from the Assessment page
              and the result will appear here.
            </p>

          </div>
        ) : (

          /* =========================
             HISTORY TABLE
          ========================= */

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>
                <tr>
                  <th>Image</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                  <th>Assessment</th>
                  <th>Time</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>

                {history.map((item) => (

                  <tr key={item.id}>

                    <td className="history-image-name">
                      {item.imageName}
                    </td>

                    <td>
                      <span className="prediction-tag">
                        {item.predictedClass}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {Number(
                          item.confidence
                        ).toFixed(2)}%
                      </strong>
                    </td>

                    <td>
                      {item.assessment}
                    </td>

                    <td>
                      {item.time}
                    </td>

                    <td>
                      <button
                        className="view-details-button"
                        onClick={() =>
                          setSelectedAssessment(item)
                        }
                      >
                        View Details
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>


      {/* =========================
          ASSESSMENT DETAILS MODAL
      ========================= */}

      {selectedAssessment && (

        <div
          className="modal-overlay"
          onClick={closeDetails}
        >

          <div
            className="assessment-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p className="modal-eyebrow">
                  ASSESSMENT DETAILS
                </p>

                <h2>
                  {selectedAssessment.predictedClass}
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={closeDetails}
                aria-label="Close assessment details"
              >
                ×
              </button>

            </div>


            {/* IMAGE */}

            {selectedAssessment.imagePreview ? (

              <div className="history-image-preview">

                <img
                  src={
                    selectedAssessment.imagePreview
                  }
                  alt={
                    selectedAssessment.imageName
                  }
                />

              </div>

            ) : (

              <div className="history-no-image">

                <span>🌶️</span>

                <p>
                  Image preview is not available for this
                  previous assessment.
                </p>

              </div>
            )}


            {/* DETAILS */}

            <div className="modal-details-grid">

              <div className="modal-info-box">

                <span>Prediction</span>

                <strong>
                  {
                    selectedAssessment.predictedClass
                  }
                </strong>

              </div>


              <div className="modal-info-box">

                <span>Confidence</span>

                <strong>
                  {Number(
                    selectedAssessment.confidence
                  ).toFixed(2)}%
                </strong>

              </div>


              <div className="modal-info-box">

                <span>Assessment</span>

                <strong>
                  {selectedAssessment.assessment}
                </strong>

              </div>


              <div className="modal-info-box">

                <span>Time</span>

                <strong>
                  {selectedAssessment.time}
                </strong>

              </div>

            </div>


            {/* FILE NAME */}

            <div className="modal-file-name">

              <span>Image file</span>

              <strong>
                {selectedAssessment.imageName}
              </strong>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default History;