import {useState, useRef} from 'react'; 
import './app.css'

export function App() {
  const[imageUrl,setImageUrl]=useState(null)
const[loading,setLoading]=useState(false);
const[error,setError]=useState(null);
const inputRef=useRef();
const handleKeyDown = (e)=>{
  if(e.key==='Enter'){
    generateImage();
  }
}
const generateImage = async()=>{
  const prompt =inputRef.current.value.trim();
  if(!prompt){
    setError('please enter a prompt');
    return;
  }
  setLoading(true);
  setError(null);
  try{
    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': '66e7e5c6a49bfc7d8ecd468f71456a6ce0eb949cd40a8688c0bf9004b5d66b295e366af96ce2fad9a36649b7e295e7c9',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({prompt}),
    });
    if(!response.ok){
           const errorData = await response.json();
           throw new Error(errorData.error || 'Failed to generate image')
    }
    const imageBlob = await response.blob();
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setImageUrl(imageObjectUrl);
  }catch(e){
  console.error('Generateion error:',e);
  setError(e.message || 'something went wrong');
}
finally{
  setLoading(false);
}
};
  return (
    <>
      <div className='min-h-screen min-w-screen px-4 sm:px-6 lg:px-8 text-gray-700 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500'>
         <div className='max-w-3xl mx-auto'>
            <div className='text-center mb-8'>
              <h1 className='text-6xl font-bold text-white mb-2'>Ai Image Generator</h1>
              <p className='text-white'>Create stunning images with Clipdrop API</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6 mb-8 space-y-4'>
              <div>
                <label htmlFor='prompt' className='block text-sm font-medium text-gray-700 mb-1'>Describe the visualization of image that you want to generate</label>
                 <input type='text' ref={inputRef} id='prompt' className='w-full px-4 py-2 h-20 border border-gray-300 rounded-md focus:ring:2 focus:ring-blue-500 focus:border-blue-500' placeholder='A futurestic city at your hand...' onKeyDown={handleKeyDown} />
              </div>
              <button onClick={generateImage} disabled={loading} className={`w-full py-3 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200${loading ? 'opacity-70 cursor-not-allowed':''}`}>{loading ? (<span className='flex items-center justify-center'>
  <svg
    className="animate-spin h-5 w-5 text-white mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8z"
    />
  </svg>
  Loading...
</span>):('Generate image')}</button>
            </div>
            {error && (
              <div className='bg-red-50 border-l-4 border-red-500 p-4 mb-8'>
                <div className='flex'>
                  <div className='flex-shrink-0 text-red-500'> Error</div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-700'>{error}</p>
                    </div>
                  
                </div>
              </div>
            )}
            {imageUrl && (
              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='p-4 border-b border-gray-200'>
                  <h2 className='text-lg font-medium text-gray-900'>Generated Image</h2>
                <div className='p-4'>
                <img
                    src={imageUrl}
                    className="w-full h-auto rounded-md"
                    onError={() => setError('Failed to load generated image...')}
                  /></div>
                </div>
              </div>
            )}
         </div>
      </div>
    </>
  );
}