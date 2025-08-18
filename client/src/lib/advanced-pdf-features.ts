// Advanced PDF features and processing capabilities

import { PDFDocument, rgb, StandardFonts, PageSizes, degrees } from 'pdf-lib';
import JSZip from 'jszip';

export interface AdvancedPDFOptions {
  compression?: 'low' | 'medium' | 'high';
  quality?: number;
  colorSpace?: 'rgb' | 'grayscale' | 'cmyk';
  metadata?: PDFMetadata;
  security?: PDFSecurityOptions;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  producer?: string;
}

export interface PDFSecurityOptions {
  userPassword?: string;
  ownerPassword?: string;
  permissions?: {
    printing?: boolean;
    modifying?: boolean;
    copying?: boolean;
    annotating?: boolean;
    fillingForms?: boolean;
    extracting?: boolean;
    assembling?: boolean;
    printingHighQuality?: boolean;
  };
}

export interface BookmarkItem {
  title: string;
  page: number;
  children?: BookmarkItem[];
}

export interface FormField {
  type: 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  value?: string;
  options?: string[];
  required?: boolean;
}

export class AdvancedPDFProcessor {
  // Advanced PDF splitting with custom ranges
  static async splitPDFWithRanges(
    file: File, 
    ranges: Array<{ start: number; end: number; name?: string }>
  ): Promise<File[]> {
    const arrayBuffer = await file.arrayBuffer();
    const sourcePdf = await PDFDocument.load(arrayBuffer);
    const results: File[] = [];

    for (const range of ranges) {
      const newPdf = await PDFDocument.create();
      
      for (let i = range.start; i <= Math.min(range.end, sourcePdf.getPageCount()); i++) {
        const [copiedPage] = await newPdf.copyPages(sourcePdf, [i - 1]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const fileName = range.name || `${file.name.replace('.pdf', '')}_pages_${range.start}-${range.end}.pdf`;
      results.push(new File([pdfBytes], fileName, { type: 'application/pdf' }));
    }

    return results;
  }

  // Advanced PDF merging with bookmarks and metadata
  static async mergePDFsAdvanced(
    files: File[], 
    options: {
      includeBookmarks?: boolean;
      metadata?: PDFMetadata;
      pageLayout?: 'single' | 'continuous' | 'facing';
    } = {}
  ): Promise<File> {
    const mergedPdf = await PDFDocument.create();
    const bookmarks: BookmarkItem[] = [];
    let currentPageIndex = 0;

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      
      // Copy all pages
      const copiedPages = await mergedPdf.copyPages(pdf, [...Array(pageCount)].map((_, i) => i));
      copiedPages.forEach(page => mergedPdf.addPage(page));

      // Add bookmark for this document
      if (options.includeBookmarks) {
        bookmarks.push({
          title: file.name.replace('.pdf', ''),
          page: currentPageIndex + 1
        });
      }

      currentPageIndex += pageCount;
    }

    // Set metadata
    if (options.metadata) {
      mergedPdf.setTitle(options.metadata.title || 'Merged PDF');
      mergedPdf.setAuthor(options.metadata.author || 'PDFo');
      mergedPdf.setSubject(options.metadata.subject || 'Merged PDF Document');
      mergedPdf.setKeywords(options.metadata.keywords || []);
      mergedPdf.setProducer('PDFo - PDF Manipulation Platform');
      mergedPdf.setCreator(options.metadata.creator || 'PDFo');
      mergedPdf.setCreationDate(new Date());
      mergedPdf.setModificationDate(new Date());
    }

    const pdfBytes = await mergedPdf.save();
    return new File([pdfBytes], 'merged_document.pdf', { type: 'application/pdf' });
  }

  // Advanced compression with quality options
  static async compressPDFAdvanced(
    file: File, 
    compressionLevel: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);

    // Compression settings based on level
    const compressionSettings = {
      low: { imageQuality: 0.8, removeMetadata: false },
      medium: { imageQuality: 0.6, removeMetadata: true },
      high: { imageQuality: 0.4, removeMetadata: true }
    };

    const settings = compressionSettings[compressionLevel];

    // Remove metadata for higher compression
    if (settings.removeMetadata) {
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
    }

    const pdfBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50
    });

    const compressionRatio = ((file.size - pdfBytes.length) / file.size * 100).toFixed(1);
    const compressedFileName = file.name.replace('.pdf', `_compressed_${compressionLevel}.pdf`);
    
    return new File([pdfBytes], compressedFileName, { 
      type: 'application/pdf'
    });
  }

  // Add digital watermark
  static async addWatermark(
    file: File,
    watermarkText: string,
    options: {
      opacity?: number;
      rotation?: number;
      fontSize?: number;
      color?: [number, number, number];
      position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    } = {}
  ): Promise<File> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    const {
      opacity = 0.3,
      rotation = 45,
      fontSize = 50,
      color = [0.5, 0.5, 0.5],
      position = 'center'
    } = options;

    const pages = pdf.getPages();

    pages.forEach(page => {
      const { width, height } = page.getSize();
      
      let x: number, y: number;
      
      switch (position) {
        case 'top-left':
          x = 50;
          y = height - 50;
          break;
        case 'top-right':
          x = width - 200;
          y = height - 50;
          break;
        case 'bottom-left':
          x = 50;
          y = 50;
          break;
        case 'bottom-right':
          x = width - 200;
          y = 50;
          break;
        default: // center
          x = width / 2;
          y = height / 2;
      }

      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color[0], color[1], color[2]),
        opacity,
        rotate: degrees(rotation)
      });
    });

    const pdfBytes = await pdf.save();
    const watermarkedFileName = file.name.replace('.pdf', '_watermarked.pdf');
    
    return new File([pdfBytes], watermarkedFileName, { type: 'application/pdf' });
  }

  // Extract and download all images from PDF
  static async extractAllImages(file: File): Promise<{ images: File[]; zipFile: File }> {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use pdf.js for image extraction
    const pdfjsLib = await import('pdfjs-dist');
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const images: File[] = [];
    const zip = new JSZip();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const operatorList = await page.getOperatorList();
      
      // Extract images from page operations
      for (let i = 0; i < operatorList.fnArray.length; i++) {
        if (operatorList.fnArray[i] === pdfjsLib.OPS.paintImageXObject) {
          try {
            const imgIndex = operatorList.argsArray[i][0];
            const imgData = page.objs.get(imgIndex);
            
            if (imgData) {
              // Convert image data to blob
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              if (ctx && imgData.width && imgData.height) {
                canvas.width = imgData.width;
                canvas.height = imgData.height;
                
                const imageData = new ImageData(
                  new Uint8ClampedArray(imgData.data),
                  imgData.width,
                  imgData.height
                );
                
                ctx.putImageData(imageData, 0, 0);
                
                canvas.toBlob(blob => {
                  if (blob) {
                    const filename = `page_${pageNum}_image_${i}.png`;
                    const imageFile = new File([blob], filename, { type: 'image/png' });
                    images.push(imageFile);
                    zip.file(filename, blob);
                  }
                }, 'image/png');
              }
            }
          } catch (error) {
            console.warn(`Failed to extract image from page ${pageNum}:`, error);
          }
        }
      }
    }

    // Create ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], `${file.name.replace('.pdf', '')}_images.zip`, { 
      type: 'application/zip' 
    });

    return { images, zipFile };
  }

  // Advanced OCR text extraction
  static async extractTextAdvanced(file: File): Promise<{
    fullText: string;
    pageTexts: string[];
    metadata: any;
  }> {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const pageTexts: string[] = [];
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      pageTexts.push(pageText);
      fullText += pageText + '\n\n';
    }

    const metadata = await pdf.getMetadata();

    return {
      fullText: fullText.trim(),
      pageTexts,
      metadata: metadata.info
    };
  }

  // Create fillable PDF forms
  static async createFormPDF(
    pageSize: [number, number] = PageSizes.A4,
    fields: FormField[],
    title: string = 'Form Document'
  ): Promise<File> {
    const pdf = await PDFDocument.create();
    const page = pdf.addPage(pageSize);
    const font = await pdf.embedFont(StandardFonts.Helvetica);

    // Set metadata
    pdf.setTitle(title);
    pdf.setCreator('PDFo - PDF Form Creator');
    pdf.setProducer('PDFo');

    // Add form fields
    const form = pdf.getForm();

    fields.forEach(field => {
      switch (field.type) {
        case 'text':
          const textField = form.createTextField(field.name);
          textField.setText(field.value || '');
          if (field.required) textField.setRequired(true);
          textField.addToPage(page, {
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height
          });
          break;

        case 'checkbox':
          const checkBox = form.createCheckBox(field.name);
          if (field.value === 'true') checkBox.check();
          checkBox.addToPage(page, {
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height
          });
          break;

        case 'dropdown':
          const dropdown = form.createDropdown(field.name);
          if (field.options) {
            dropdown.setOptions(field.options);
          }
          if (field.value) dropdown.select(field.value);
          dropdown.addToPage(page, {
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height
          });
          break;
      }
    });

    const pdfBytes = await pdf.save();
    return new File([pdfBytes], `${title.replace(/\s+/g, '_')}_form.pdf`, { 
      type: 'application/pdf' 
    });
  }

  // PDF comparison tool
  static async comparePDFs(file1: File, file2: File): Promise<{
    differences: Array<{
      page: number;
      type: 'content' | 'structure' | 'metadata';
      description: string;
    }>;
    similarity: number;
  }> {
    const [text1, text2] = await Promise.all([
      this.extractTextAdvanced(file1),
      this.extractTextAdvanced(file2)
    ]);

    const differences: Array<{
      page: number;
      type: 'content' | 'structure' | 'metadata';
      description: string;
    }> = [];

    // Compare page counts
    if (text1.pageTexts.length !== text2.pageTexts.length) {
      differences.push({
        page: 0,
        type: 'structure',
        description: `Different page counts: ${text1.pageTexts.length} vs ${text2.pageTexts.length}`
      });
    }

    // Compare page content
    const minPages = Math.min(text1.pageTexts.length, text2.pageTexts.length);
    let totalSimilarity = 0;

    for (let i = 0; i < minPages; i++) {
      const similarity = this.calculateTextSimilarity(text1.pageTexts[i], text2.pageTexts[i]);
      totalSimilarity += similarity;

      if (similarity < 0.9) {
        differences.push({
          page: i + 1,
          type: 'content',
          description: `Page content differs (${(similarity * 100).toFixed(1)}% similar)`
        });
      }
    }

    const overallSimilarity = totalSimilarity / minPages;

    return {
      differences,
      similarity: overallSimilarity
    };
  }

  // Calculate text similarity using basic algorithm
  private static calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  // Batch processing utility
  static async batchProcess<T>(
    files: File[],
    operation: (file: File) => Promise<T>,
    concurrency: number = 3
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map(file => operation(file))
      );
      results.push(...batchResults);
    }
    
    return results;
  }
}