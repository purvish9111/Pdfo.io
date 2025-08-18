// Minimal React App without hooks to test React loading
export default function MinimalApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>PDFo - PDF Tools Platform</h1>
      <p>✅ React is loading correctly!</p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Merge PDF</h3>
          <p>Combine multiple PDF files into one document</p>
        </div>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Split PDF</h3>
          <p>Extract pages from PDF documents</p>
        </div>
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Compress PDF</h3>
          <p>Reduce PDF file size efficiently</p>
        </div>
      </div>
    </div>
  );
}