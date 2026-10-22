import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Leaf, UploadCloud, ScanLine, Check, ArrowRight, X, LoaderCircle, Download, ImagePlus } from 'lucide-react';
import './style.css';

function App() {
  const [health, setHealth] = useState(null), [file, setFile] = useState(null), [preview, setPreview] = useState('');
  const [result, setResult] = useState(null), [busy, setBusy] = useState(false), [error, setError] = useState(''), [drag, setDrag] = useState(false);
  const [exporting, setExporting] = useState(false);
  const input = useRef(null), controller = useRef(null);
  useEffect(() => { let alive = true; const check = () => fetch('/api/health').then(r => { if (!r.ok) throw Error(); return r.json(); }).then(d => alive && setHealth(d)).catch(() => alive && setHealth({ ready: false })); check(); const timer = setInterval(check, 15000); return () => { alive = false; clearInterval(timer); controller.current?.abort(); }; }, []);
  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  function select(f) { if (!f || busy) return; setError(''); if (!['image/jpeg','image/png','image/webp'].includes(f.type)) { setError('Please choose a JPG, PNG or WebP image.'); return; } if (f.size > 10 * 1024 * 1024) { setError('Please choose an image smaller than 10 MB.'); return; } setFile(f); setResult(null); }
  async function analyze() { setBusy(true); setError(''); setResult(null); controller.current = new AbortController(); const timeout = setTimeout(() => controller.current.abort(), 120000); try { const response = await fetch('/api/predict', {method:'POST', headers:{'Content-Type':file.type}, body:file, signal:controller.current.signal}); const data = await response.json(); if (!response.ok) throw Error(data.detail || 'Analysis failed. Please try again.'); setResult({ ...data, analyzedAt: new Date().toISOString() }); } catch (e) { setError(e.name === 'AbortError' ? 'Analysis timed out. Please try again.' : e.message === 'Failed to fetch' ? 'Cannot reach the model. Check that the Python API is running.' : e.message); } finally { clearTimeout(timeout); setBusy(false); } }
  async function download() {
    if (!file || !result || exporting) return;
    setExporting(true);
    setError('');
    try {
      const { exportReport } = await import('./report.js');
      await exportReport(file, result);
    } catch {
      setError('Could not create the PDF report. Please try exporting again.');
    } finally {
      setExporting(false);
    }
  }
  return <main><section className="intro"><h1>Chili leaf analyzer</h1><p>Upload a leaf photo to check its predicted condition.</p></section>
  <section id="analyzer" className="workspace"><div className="upload-panel"><div className="panel-heading"><div><h2>Your leaf image</h2></div></div><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={e => { select(e.target.files[0]); e.target.value=''; }}/>
  <div className={`dropzone ${drag ? 'dragging' : ''} ${preview ? 'has-image' : ''}`} onDragOver={e => {e.preventDefault(); setDrag(true);}} onDragLeave={() => setDrag(false)} onDrop={e => {e.preventDefault(); setDrag(false); select(e.dataTransfer.files[0]);}}>{preview ? <><img src={preview} alt="Selected chili leaf"/><button className="remove" aria-label="Remove image" disabled={busy} onClick={() => {setFile(null);setResult(null);setError('');}}><X size={18}/></button><span className="image-label"><Check size={14}/> Ready for a closer look</span></> : <><div className="upload-icon"><UploadCloud size={30} strokeWidth={1.4}/></div><h3>Drop your leaf photo here</h3><p>or choose an image from your device</p><button className="browse" onClick={() => input.current.click()}><ImagePlus size={16}/> Browse files</button><small>JPG, PNG or WebP · Up to 10 MB</small></>}</div>
  <div className="file-caption"><span>{file ? file.name : 'Choose a clear photo of a single leaf.'}</span>{file && <button disabled={busy} onClick={() => input.current.click()}>Change image</button>}</div>
  {health?.ready === false && <p className="connection-note">Start the local model API with <code>./start-api.sh</code> to enable analysis.</p>}{error && <p className="error" role="alert">{error}</p>}<button className="analyze" disabled={!file || busy || !health?.ready} onClick={analyze}>{busy ? <LoaderCircle className="spin" size={19}/> : <ScanLine size={19}/>} {busy ? 'Analyzing your leaf…' : 'Analyze leaf'}{!busy && <ArrowRight size={19}/>}</button><p className="privacy">Your photo is processed locally and is not saved.</p></div>
  <div className="result-panel"><div className="panel-heading"><div><h2>Analysis results</h2></div><span className={`status ${health?.ready ? 'online' : ''}`}><i/>{health === null ? 'Connecting' : health.ready ? 'Model ready' : 'API offline'}</span></div>
  <div aria-live="polite" className={result ? 'results' : 'empty-result'}>{result ? <><div className="eyebrow">TOP MODEL PREDICTION</div><h3>{result.predictions[0].label}</h3><div className="score">{(result.predictions[0].score*100).toFixed(1)}<span>% model score</span></div><p className="result-note">A model estimate, not a confirmed diagnosis. Confirm symptoms before deciding on treatment.</p><div className="ranking">{result.predictions.map(p => <div className="rank" key={p.index}><div><span>{p.label}</span><b>{(p.score*100).toFixed(1)}%</b></div><div className="track"><span style={{width:`${p.score*100}%`}}/></div></div>)}</div><div className="result-footer"><span>{(result.elapsedMs/1000).toFixed(2)}s · ResNet50</span><button onClick={download} disabled={exporting}>{exporting ? <LoaderCircle className="spin" size={15}/> : <Download size={15}/>} {exporting ? 'Creating PDF…' : 'Export PDF'}</button></div></> : <><div className={`scan-illustration ${busy ? 'scanning' : ''}`}><span/><Leaf size={56} strokeWidth={1}/><span/></div><h3>{busy ? 'Analyzing…' : 'Your results will appear here'}</h3><p>{busy ? 'Your image is being processed by the ResNet50 model.' : 'Upload a leaf photo to see its predicted condition and a breakdown of all six classes.'}</p></>}</div></div></section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
