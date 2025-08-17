export interface ToolSEOData {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  content: string;
  structuredData: object;
}

export const toolSEOData: Record<string, ToolSEOData> = {
  '/merge': {
    title: 'Merge PDF - Combine PDF Files Online Free | PDFo',
    description: 'Merge PDF files online for free and fast. Easily combine multiple PDFs into one document with drag-and-drop reordering. Try PDFo now!',
    keywords: 'merge pdf, combine pdf, join pdf files, pdf merger, combine pdf online, merge documents',
    h1: 'Merge PDF',
    content: 'Combine multiple PDF files into a single document with our free online PDF merger. Simply upload your files, arrange them in the desired order with drag-and-drop, and download your merged PDF instantly. No software installation required - works directly in your browser with complete privacy.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Merge PDF Files Online",
      "description": "Learn how to combine multiple PDF documents into one file using PDFo's free online tool",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload PDF Files",
          "text": "Click 'Add PDF' button and select multiple PDF files from your device"
        },
        {
          "@type": "HowToStep", 
          "name": "Arrange Files",
          "text": "Drag and drop the files to reorder them as needed"
        },
        {
          "@type": "HowToStep",
          "name": "Merge PDFs",
          "text": "Click 'Merge PDFs' button to combine all files into one document"
        },
        {
          "@type": "HowToStep",
          "name": "Download Result",
          "text": "Download your merged PDF file to your device"
        }
      ]
    }
  },
  '/split': {
    title: 'Split PDF - Extract Pages from PDF Online Free | PDFo',
    description: 'Split PDF files online for free. Extract specific pages or split at any point. View page thumbnails and choose exactly where to split. Try PDFo now!',
    keywords: 'split pdf, extract pdf pages, divide pdf, pdf splitter, separate pdf pages, split document',
    h1: 'Split PDF',
    content: 'Split large PDF files into smaller documents with precision. View page thumbnails to identify exact split points, extract specific pages, or divide your PDF at any location. Our free online tool processes files securely in your browser without uploading to servers.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Split PDF Files Online",
      "description": "Learn how to split PDF documents into separate files using PDFo's free tool",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload PDF File",
          "text": "Select and upload the PDF file you want to split"
        },
        {
          "@type": "HowToStep",
          "name": "Choose Split Points",
          "text": "View page thumbnails and click between pages to add split points"
        },
        {
          "@type": "HowToStep",
          "name": "Split PDF",
          "text": "Click 'Split PDF' to create separate documents"
        },
        {
          "@type": "HowToStep",
          "name": "Download Files",
          "text": "Download each split PDF file individually"
        }
      ]
    }
  },
  '/reorder': {
    title: 'Reorder PDF Pages - Rearrange PDF Pages Online Free | PDFo',
    description: 'Reorder PDF pages online for free. Drag and drop pages to rearrange them in any order. Preview thumbnails and reorganize your document easily. Try PDFo now!',
    keywords: 'reorder pdf pages, rearrange pdf, reorganize pdf, pdf page order, sort pdf pages, arrange document',
    h1: 'Reorder Pages',
    content: 'Rearrange PDF pages in any order with our intuitive drag-and-drop interface. View page thumbnails to easily identify content and reorganize your document structure. Perfect for fixing page order issues or customizing document flow.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Reorder PDF Pages Online",
      "description": "Learn how to rearrange PDF pages using PDFo's free online tool"
    }
  },
  '/delete': {
    title: 'Delete PDF Pages - Remove Pages from PDF Online Free | PDFo',
    description: 'Delete PDF pages online for free. Remove unwanted pages from your PDF documents. Select specific pages and delete them instantly. Try PDFo now!',
    keywords: 'delete pdf pages, remove pdf pages, extract pdf pages, pdf page remover, delete document pages',
    h1: 'Delete Pages',
    content: 'Remove unwanted pages from your PDF documents quickly and easily. Select specific pages using page thumbnails and delete them with one click. Perfect for removing blank pages, confidential content, or unnecessary sections from your documents.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Delete PDF Pages Online",
      "description": "Learn how to remove pages from PDF documents using PDFo's free tool"
    }
  },
  '/rotate': {
    title: 'Rotate PDF Pages - Fix PDF Orientation Online Free | PDFo',
    description: 'Rotate PDF pages online for free. Fix page orientation, rotate clockwise or counterclockwise. Adjust individual pages or entire document. Try PDFo now!',
    keywords: 'rotate pdf, fix pdf orientation, rotate pdf pages, pdf rotation, turn pdf pages, adjust page direction',
    h1: 'Rotate PDF',
    content: 'Fix PDF page orientation with our free online rotation tool. Rotate individual pages or the entire document clockwise or counterclockwise. Perfect for correcting scanned documents or adjusting page layout for better viewing.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Rotate PDF Pages Online",
      "description": "Learn how to fix PDF page orientation using PDFo's free rotation tool"
    }
  },
  '/page-numbers': {
    title: 'Add Page Numbers to PDF - Number PDF Pages Online Free | PDFo',
    description: 'Add page numbers to PDF online for free. Customize position, format, and style. Professional page numbering for your documents. Try PDFo now!',
    keywords: 'add page numbers pdf, pdf page numbering, number pdf pages, pdf pagination, page numbers online',
    h1: 'Page Numbers',
    content: 'Add professional page numbers to your PDF documents with customizable formatting options. Choose position, style, and numbering format to match your document requirements. Essential for reports, manuscripts, and formal documents.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Add Page Numbers to PDF",
      "description": "Learn how to add professional page numbers to PDF documents using PDFo"
    }
  },
  '/edit-metadata': {
    title: 'Edit PDF Metadata - Modify PDF Properties Online Free | PDFo',
    description: 'Edit PDF metadata online for free. Modify title, author, subject, and keywords. Update document properties and information easily. Try PDFo now!',
    keywords: 'edit pdf metadata, pdf properties, pdf document info, modify pdf metadata, pdf title author',
    h1: 'Edit Metadata',
    content: 'Modify PDF document properties including title, author, subject, keywords, and creation date. Essential for document management, SEO optimization, and professional document presentation. Edit metadata without altering the actual content.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Edit PDF Metadata Online",
      "description": "Learn how to modify PDF document properties using PDFo's metadata editor"
    }
  },
  '/watermark-pdf': {
    title: 'Add Watermark to PDF - PDF Watermark Online Free | PDFo',
    description: 'Add watermark to PDF online for free. Text or image watermarks with custom positioning and transparency. Protect your documents easily. Try PDFo now!',
    keywords: 'pdf watermark, add watermark pdf, watermark online, pdf protection, document watermark, brand pdf',
    h1: 'Watermark PDF',
    content: 'Add text or image watermarks to your PDF documents for branding and protection. Customize position, opacity, rotation, and size to perfectly match your needs. Ideal for copyrights, branding, and document security.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Add Watermark to PDF Online",
      "description": "Learn how to add text or image watermarks to PDF documents using PDFo"
    }
  },
  '/lock-pdf': {
    title: 'Password Protect PDF - Lock PDF Online Free | PDFo',
    description: 'Password protect PDF files online for free. Add security with user and owner passwords. Restrict printing, editing, and copying. Try PDFo now!',
    keywords: 'password protect pdf, lock pdf, pdf security, encrypt pdf, secure pdf online, pdf password',
    h1: 'Lock PDF',
    content: 'Secure your PDF documents with password protection and permission controls. Set user passwords for viewing and owner passwords for editing. Restrict printing, copying, and modification to protect sensitive information.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Password Protect PDF Online",
      "description": "Learn how to add password security to PDF documents using PDFo"
    }
  },
  '/unlock-pdf': {
    title: 'Unlock PDF - Remove PDF Password Online Free | PDFo',
    description: 'Unlock PDF files online for free. Remove password protection from PDF documents. Access locked PDFs with known passwords easily. Try PDFo now!',
    keywords: 'unlock pdf, remove pdf password, decrypt pdf, pdf password remover, unlock secured pdf',
    h1: 'Unlock PDF',
    content: 'Remove password protection from PDF files when you have the correct password. Unlock secured PDFs to enable editing, printing, and copying. Essential for accessing your own protected documents or files with known passwords.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Unlock PDF Files Online",
      "description": "Learn how to remove password protection from PDF documents using PDFo"
    }
  },
  '/compress-pdf': {
    title: 'Compress PDF - Reduce PDF File Size Online Free | PDFo',
    description: 'Compress PDF files online for free. Reduce file size while maintaining quality. Choose compression levels for optimal results. Try PDFo now!',
    keywords: 'compress pdf, reduce pdf size, pdf compressor, shrink pdf, optimize pdf size, pdf file reducer',
    h1: 'Compress PDF',
    content: 'Reduce PDF file size with our intelligent compression algorithm. Choose from different compression levels to balance file size and quality. Perfect for email attachments, web uploads, and storage optimization while preserving document readability.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Compress PDF Files Online",
      "description": "Learn how to reduce PDF file size using PDFo's compression tool"
    }
  },
  '/pdf-to-jpg': {
    title: 'Convert PDF to JPG - PDF to Image Online Free | PDFo',
    description: 'Convert PDF to JPG images online for free. High-quality image conversion with custom DPI settings. Download individual images or ZIP. Try PDFo now!',
    keywords: 'pdf to jpg, convert pdf to image, pdf to jpeg, pdf image converter, pdf to pictures',
    h1: 'PDF to JPG',
    content: 'Convert PDF pages to high-quality JPG images with customizable resolution settings. Perfect for creating thumbnails, web images, or extracting graphics from documents. Download images individually or as a convenient ZIP archive.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to JPG Online",
      "description": "Learn how to convert PDF documents to JPG images using PDFo"
    }
  },
  '/pdf-to-png': {
    title: 'Convert PDF to PNG - PDF to PNG Online Free | PDFo',
    description: 'Convert PDF to PNG images online for free. Transparent background support with high-quality conversion. Perfect for graphics and web use. Try PDFo now!',
    keywords: 'pdf to png, convert pdf to png, pdf png converter, pdf to transparent images, pdf graphics extraction',
    h1: 'PDF to PNG',
    content: 'Convert PDF pages to PNG images with transparency support and crisp quality. Ideal for web graphics, presentations, and applications requiring transparent backgrounds. Maintain image quality while achieving perfect compatibility.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to PNG Online",
      "description": "Learn how to convert PDF documents to PNG images using PDFo"
    }
  },
  '/pdf-to-tiff': {
    title: 'Convert PDF to TIFF - PDF to TIFF Online Free | PDFo',
    description: 'Convert PDF to TIFF images online for free. High-resolution conversion with compression options. Professional image format for archival. Try PDFo now!',
    keywords: 'pdf to tiff, convert pdf to tiff, pdf tiff converter, pdf to tif, professional image conversion',
    h1: 'PDF to TIFF',
    content: 'Convert PDF documents to TIFF format for professional archival and high-resolution imaging needs. TIFF format preserves image quality and supports various compression options, making it ideal for printing and professional graphics workflows.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to TIFF Online",
      "description": "Learn how to convert PDF documents to TIFF images using PDFo"
    }
  },
  '/pdf-to-word': {
    title: 'Convert PDF to Word - PDF to DOCX Online Free | PDFo',
    description: 'Convert PDF to Word documents online for free. Editable DOCX format with preserved formatting. Perfect for document editing and collaboration. Try PDFo now!',
    keywords: 'pdf to word, pdf to docx, convert pdf to word, pdf word converter, editable pdf to word',
    h1: 'PDF to Word',
    content: 'Transform PDF documents into editable Word format while preserving original formatting, layout, and structure. Perfect for editing content, collaboration, and document modification. Maintains text formatting, images, and table structures.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to Word Online",
      "description": "Learn how to convert PDF documents to editable Word format using PDFo"
    }
  },
  '/pdf-to-excel': {
    title: 'Convert PDF to Excel - PDF to XLSX Online Free | PDFo',
    description: 'Convert PDF to Excel spreadsheets online for free. Extract tables and data into XLSX format. Perfect for data analysis and editing. Try PDFo now!',
    keywords: 'pdf to excel, pdf to xlsx, convert pdf to excel, pdf excel converter, extract pdf tables',
    h1: 'PDF to Excel',
    content: 'Extract tables and data from PDF documents into Excel spreadsheets for analysis and editing. Automatically detects table structures and converts them to properly formatted XLSX files, preserving data relationships and cell formatting.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to Excel Online",
      "description": "Learn how to convert PDF tables to Excel spreadsheets using PDFo"
    }
  },
  '/pdf-to-ppt': {
    title: 'Convert PDF to PowerPoint - PDF to PPTX Online Free | PDFo',
    description: 'Convert PDF to PowerPoint presentations online for free. Transform pages into editable slides. Perfect for presentations and editing. Try PDFo now!',
    keywords: 'pdf to powerpoint, pdf to pptx, convert pdf to ppt, pdf presentation converter, pdf to slides',
    h1: 'PDF to PPT',
    content: 'Convert PDF pages into PowerPoint presentation slides for easy editing and presentation. Each PDF page becomes an individual slide, maintaining visual elements and layout while making content editable in PowerPoint.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to PowerPoint Online",
      "description": "Learn how to convert PDF documents to PowerPoint presentations using PDFo"
    }
  },
  '/pdf-to-txt': {
    title: 'Convert PDF to Text - Extract Text from PDF Online Free | PDFo',
    description: 'Convert PDF to text online for free. Extract plain text content from PDF documents. Perfect for content analysis and text processing. Try PDFo now!',
    keywords: 'pdf to text, extract text from pdf, pdf text converter, pdf to txt, plain text extraction',
    h1: 'PDF to TXT',
    content: 'Extract plain text content from PDF documents for analysis, processing, or content management. Removes formatting and images to provide clean, searchable text that can be easily manipulated and analyzed.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Extract Text from PDF Online",
      "description": "Learn how to convert PDF documents to plain text using PDFo"
    }
  },
  '/pdf-to-json': {
    title: 'Convert PDF to JSON - Extract PDF Data Online Free | PDFo',
    description: 'Convert PDF to JSON format online for free. Extract structured data and metadata. Perfect for data processing and integration. Try PDFo now!',
    keywords: 'pdf to json, convert pdf to json, pdf data extraction, pdf json converter, structured data extraction',
    h1: 'PDF to JSON',
    content: 'Extract structured data from PDF documents into JSON format for programming and data processing applications. Converts text, metadata, and document structure into machine-readable JSON for easy integration with applications and databases.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PDF to JSON Online",
      "description": "Learn how to extract structured data from PDF documents using PDFo"
    }
  },
  '/png-to-pdf': {
    title: 'Convert PNG to PDF - Image to PDF Online Free | PDFo',
    description: 'Convert PNG images to PDF online for free. Combine multiple images into one PDF. Drag and drop to reorder. Perfect for image archival. Try PDFo now!',
    keywords: 'png to pdf, image to pdf, convert png to pdf, pictures to pdf, photo to pdf converter',
    h1: 'PNG to PDF',
    content: 'Convert PNG images into PDF documents with customizable page layouts and ordering. Combine multiple images into a single PDF file, perfect for creating photo albums, documentation, or archiving image collections in a portable format.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert PNG to PDF Online",
      "description": "Learn how to convert PNG images to PDF documents using PDFo"
    }
  },
  '/word-to-pdf': {
    title: 'Convert Word to PDF - DOCX to PDF Online Free | PDFo',
    description: 'Convert Word documents to PDF online for free. Preserve formatting and layout perfectly. Professional PDF conversion from DOCX files. Try PDFo now!',
    keywords: 'word to pdf, docx to pdf, convert word to pdf, word pdf converter, document to pdf',
    h1: 'Word to PDF',
    content: 'Convert Word documents to PDF format while preserving all formatting, images, and layout elements. Perfect for sharing documents in a universal format that maintains appearance across all devices and platforms.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Word to PDF Online",
      "description": "Learn how to convert Word documents to PDF format using PDFo"
    }
  },
  '/excel-to-pdf': {
    title: 'Convert Excel to PDF - XLSX to PDF Online Free | PDFo',
    description: 'Convert Excel spreadsheets to PDF online for free. Preserve tables, charts, and formatting. Professional PDF conversion from XLSX files. Try PDFo now!',
    keywords: 'excel to pdf, xlsx to pdf, convert excel to pdf, spreadsheet to pdf, excel pdf converter',
    h1: 'Excel to PDF',
    content: 'Convert Excel spreadsheets to PDF format while maintaining all formatting, charts, and table structures. Ideal for sharing financial reports, data analysis, and spreadsheets in a professional, uneditable format.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Convert Excel to PDF Online",
      "description": "Learn how to convert Excel spreadsheets to PDF format using PDFo"
    }
  }
};