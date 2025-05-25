import FileList from './filelist';
import { useState } from 'react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className='flex flex-row items-center justify-center bg-gradient-to-r from-cyan-400 to-pink-500 p-4 min-h-screen'>
      <div className='ml-40 w-1/2 flex flex-col items-center'>
        <div
          className='relative w-96 h-48 border-2 border-dashed border-gray-400 bg-white flex flex-col items-center justify-center text-gray-600 cursor-pointer'
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <p className='text-lg font-semibold'>Drag and Drop</p>
          <p className='text-sm text-gray-500'>or click to select</p>
          <input
            type='file'
            multiple
            className='opacity-0 absolute w-full h-full top-0 left-0 cursor-pointer'
            onChange={handleFileSelect}
          />
        </div>

        <FileList files={files} onRemove={handleRemoveFile} />
      </div>

      <div className='w-1/2 flex items-center justify-center'>
        <h1 className='text-6xl font-bold text-white'>Cloud Server</h1>
      </div>
    </div>
  );
}

export default App;