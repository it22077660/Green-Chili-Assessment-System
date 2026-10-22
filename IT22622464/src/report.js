import { jsPDF } from 'jspdf';

// PDF standard fonts support Latin text; keep filenames safe for this font.
const text = value => String(value).replace(/[^\x20-\x7E]/g, '_');

export function createReport({ fileName, fileSize, image, result }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({ title: 'Chili leaf analysis report', subject: 'ResNet50 prediction results', creator: 'Chili leaf analyzer' });
  const write = (value, x, y, size = 10, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(37, 59, 49);
    doc.text(text(value), x, y);
  };
  write('Chili leaf analysis report', 18, 23, 22, true);
  const analyzed = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Colombo', dateStyle: 'medium', timeStyle: 'medium',
  }).format(new Date(result.analyzedAt));
  write(`Analyzed: ${analyzed} (Asia/Colombo, UTC+05:30)`, 18, 32, 9);
  doc.setDrawColor(220, 229, 216);
  doc.line(18, 38, 192, 38);

  write('Uploaded image', 18, 48, 12, true);
  const scale = Math.min(82 / image.width, 65 / image.height);
  const width = image.width * scale, height = image.height * scale;
  doc.addImage(image.data, 'JPEG', 18 + (82 - width) / 2, 53 + (65 - height) / 2, width, height);
  write('Top prediction', 110, 59, 11, true);
  write(result.predictions[0].label, 110, 69, 13, true);
  write(`${(result.predictions[0].score * 100).toFixed(2)}% model score`, 110, 80, 15);
  write('Model: ResNet50', 110, 94);
  write('Input: 224 x 224 RGB', 110, 102);
  write(`Inference time: ${(result.elapsedMs / 1000).toFixed(2)} seconds`, 110, 110);
  const filename = text(fileName);
  const filenameLines = doc.splitTextToSize(`File: ${filename}`, 174);
  doc.setFontSize(9);
  doc.text(filenameLines, 18, 128);
  let y = 128 + filenameLines.length * 4 + 4;
  write(`Original: ${image.width} x ${image.height} px | ${(fileSize / 1024).toFixed(1)} KB`, 18, y, 9);
  y += 13;
  write('All class scores', 18, y, 12, true);
  y += 9;
  doc.setFillColor(239, 244, 235);
  doc.rect(18, y - 5, 174, 9, 'F');
  write('Predicted condition', 22, y, 10, true);
  write('Model score', 160, y, 10, true);
  for (const prediction of result.predictions) {
    y += 10;
    write(prediction.label, 22, y);
    write(`${(prediction.score * 100).toFixed(2)}%`, 163, y);
    doc.line(18, y + 3, 192, y + 3);
  }
  y += 15;
  write('How to interpret this report', 18, y, 11, true);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const note = 'Scores are softmax estimates across the six trained classes, not calibrated diagnostic confidence. The model does not verify that the image is a chili leaf. This prediction is not a confirmed diagnosis; confirm visible symptoms before deciding on treatment.';
  doc.text(doc.splitTextToSize(note, 174), 18, y + 7);
  write('Image preparation: orientation corrected, converted to RGB and resized to 224 x 224.', 18, y + 26, 8);
  write('ResNet channel conversion and mean subtraction are built into the model.', 18, y + 31, 8);
  write('Generated locally by Chili leaf analyzer', 18, 287, 8);
  write('Page 1 of 1', 175, 287, 8);
  return doc;
}

export async function exportReport(file, result) {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    const doc = createReport({ fileName: file.name, fileSize: file.size,
      image: { data: canvas.toDataURL('image/jpeg', 0.92), width: img.naturalWidth, height: img.naturalHeight }, result });
    const basename = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80) || 'leaf';
    doc.save(`${basename}-analysis.pdf`);
  } finally {
    URL.revokeObjectURL(url);
  }
}
