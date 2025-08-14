
interface PDFPreviewProps {
  fileName: string;
  label: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ fileName, label }) => {
  const pdfUrl = new URL(`/canevas/${fileName}`, window.location.origin).toString();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Mobile-friendly PDF viewer */}
      <div className="flex-1 bg-white rounded-lg border overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">{label}</h3>
          </div>

          {/* Inline preview for tablet/desktop */}
          <div className="hidden sm:block w-full">
            <div className="w-full h-[60vh] rounded-md border">
              <iframe
                src={pdfUrl}
                title={`${label} - PDF preview`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* Download/View buttons for mobile */}
          <div className="block sm:hidden flex flex-col gap-2 w-full max-w-xs">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
            >
              Open PDF
            </a>
            <a
              href={pdfUrl}
              download={fileName}
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium text-center transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
