import { useState } from 'react';

function FileList({ files, onRemove }) {
  const [preview, setPreview] = useState(null);

  const handleFileClick = (file) => {
    const type = file.type;

    if (type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview({ type: 'image', content: e.target.result });
      };
      reader.readAsDataURL(file);
    } else if (type === 'application/pdf') {
      const pdfURL = URL.createObjectURL(file);
      setPreview({ type: 'pdf', content: pdfURL });
    } else if (type.startsWith('text/') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview({ type: 'text', content: e.target.result });
      };
      reader.readAsText(file);
    } else {
      setPreview({
        type: 'unsupported',
        content: `Preview not supported for file: ${file.name}`,
      });
    }
  };

  const handleClosePreview = () => setPreview(null);

  return (
    <div className="mt-4 w-96">
      <h2 className="text-lg font-semibold mb-2">Uploaded files:</h2>
      <ul>
        {files.map((file, index) => (
          <li
            key={index}
            className="relative list-disc mt-4 list-inside bg-blue-100 p-2 rounded shadow-md text-gray-700 hover:bg-blue-200"
          >
            <span onClick={() => handleFileClick(file)} className="cursor-pointer">
              {index + 1}. {file.name}
            </span>
            <button
              onClick={() => onRemove(index)} // Trigger the remove function here
              className="absolute top-1 right-2 text-red-500 hover:text-red-700 font-bold text-xl"
              title="Remove file"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {preview && (
        <div className="relative mt-6 bg-gray-100 p-4 rounded shadow-inner">
          <button
            onClick={handleClosePreview}
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 font-bold text-xl"
            aria-label="Close preview"
          >
            &times;
          </button>

          {preview.type === 'text' && (
            <>
              <h3 className="font-bold mb-2">File Content:</h3>
              <pre className="whitespace-pre-wrap max-h-60 overflow-auto">{preview.content}</pre>
            </>
          )}

          {preview.type === 'image' && (
            <>
              <h3 className="font-bold mb-2">Image Preview:</h3>
              <img src={preview.content} alt="preview" className="rounded shadow-md max-w-full" />
            </>
          )}

          {preview.type === 'pdf' && (
            <>
              <h3 className="font-bold mb-2">PDF Preview:</h3>
              <iframe
                src={preview.content}
                title="PDF Preview"
                className="w-full h-96 border rounded"
              />
            </>
          )}

          {preview.type === 'unsupported' && (
            <div className="text-red-600 font-medium">{preview.content}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileList;