/**
 * Utility script to apply SEO to all tool pages
 * This helps maintain consistency across all PDF tool pages
 */

export const toolPagesMap = [
  { path: 'MergePDF.tsx', route: '/merge' },
  { path: 'SplitPDF.tsx', route: '/split' },
  { path: 'ReorderPages.tsx', route: '/reorder' },
  { path: 'DeletePages.tsx', route: '/delete' },
  { path: 'RotatePDF.tsx', route: '/rotate' },
  { path: 'PageNumbers.tsx', route: '/page-numbers' },
  { path: 'EditMetadata.tsx', route: '/edit-metadata' },
  { path: 'WatermarkPDF.tsx', route: '/watermark-pdf' },
  { path: 'LockPDF.tsx', route: '/lock-pdf' },
  { path: 'UnlockPDF.tsx', route: '/unlock-pdf' },
  { path: 'CompressPDF.tsx', route: '/compress-pdf' },
  { path: 'PDFToJPG.tsx', route: '/pdf-to-jpg' },
  { path: 'PDFToPNG.tsx', route: '/pdf-to-png' },
  { path: 'PDFToTIFF.tsx', route: '/pdf-to-tiff' },
  { path: 'PDFToWord.tsx', route: '/pdf-to-word' },
  { path: 'PDFToExcel.tsx', route: '/pdf-to-excel' },
  { path: 'PDFToPPT.tsx', route: '/pdf-to-ppt' },
  { path: 'PDFToTXT.tsx', route: '/pdf-to-txt' },
  { path: 'PDFToJSON.tsx', route: '/pdf-to-json' },
  { path: 'PNGToPDF.tsx', route: '/png-to-pdf' },
  { path: 'WordToPDF.tsx', route: '/word-to-pdf' },
  { path: 'ExcelToPDF.tsx', route: '/excel-to-pdf' },
];

export const generateSEOImports = () => {
  return `import { SEOHead } from "@/components/SEOHead";
import { toolSEOData } from "@/lib/seo-data";`;
};

export const generateSEOState = (route: string) => {
  return `const seoData = toolSEOData['${route}'];`;
};

export const generateSEOComponent = (route: string) => {
  const routeKey = route.replace('/', '');
  return `<SEOHead
  title={seoData.title}
  description={seoData.description}
  keywords={seoData.keywords}
  canonicalUrl={\`\${window.location.origin}${route}\`}
  structuredData={seoData.structuredData}
/>`;
};

export const generateSEOH1 = () => {
  return `{seoData.h1}`;
};

export const generateSEODescription = () => {
  return `{seoData.content}`;
};