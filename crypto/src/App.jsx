import { useEffect, useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'



function App() {
  
  const [cryptoData, setcryptoData] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchData = async() => {
      try{
        setloading(true);
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr');
        if(!response.ok){
          throw new Error('network response was not ok')
        }
        const data = await response.json();
        setcryptoData(data);
        setloading(false);
      }catch(error){
        //console.error('Error fetching data:', error);
       setError(error.message);
       setloading(false);
      }
    }
    fetchData();
    const interval =setInterval(fetchData, 10000);
    return () => clearInterval(interval);
    },[]);
   
    const formatMarketCap =(marketcap)=>{
      if(marketcap >=1e12){
        return `₹${(marketcap/1e12).toFixed(2)}T`
      }
       else if(marketcap >= 1e9){
        return `₹${(marketcap/1e9).toFixed(2)}B`
      }
        else if(marketcap >= 1e6){
        return `₹${(marketcap/1e6).toFixed(2)}B`
      }
      return marketcap;
}
  return (
   <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-800 via-purple-900 py-4 flex flex-col items-center justify-center">
    <div className='max-w-7xl mx-auto'>
       <h1 className='text-3xl font-bold text-center mb-8 text-white '>  <div className=''> {"Crypto price tracker".split("").map((char, index) => (
    <span key={index} style={{ "--i": index }}>{char}</span>
  ))}</div></h1>
     {error && (
  <div className="text-red-500 text-center mb-4 hidden">
    Error fetching data: {error}
  </div>
)}
  {loading && (
  <div className="flex justify-center items-center mb-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
  </div>
)}

      <div className='grid grid-col-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {cryptoData.map((crypto)=>(<div key={crypto.id} className='bg-white rounded-lg shadow-lg transition-shadow      bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105     duration-300'>
            <div className='bg-white-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700'>
                   <div className='flex items-center mb-4'>
                    <img src={crypto.image} className='w-10 h-10 mr-3'/>
                    <div>
                      <h2 className='text-xl font-semibold text-gray-600'>{crypto.name}</h2>
                       <p className='text-gray-400 uppercase'>{crypto.symbol}</p>
                   </div>
                   </div>
                   <div className='space-y-3'>
                      <div>
                           <p className='text-gray-550'>Price</p>
                           <p className='text-gray-550'>{crypto.current_price} INR</p>
                     
                      </div>
                      <div>
                        <p className='text-2xl font-bold text-blue-500'>24h Change</p>
                        <p className={`text-lg font-semibold ${crypto.price_change_percentage_24h >=0?'text-green-500' : 'text-red-500' }`}>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}{crypto.price_change_percentage_24h >=0 ?'% ↑':'% ↓'}</p>
                     </div>
                     <div className='text-black-500'>Market Cap</div>
                     <div className='text-black-500'>{formatMarketCap(crypto.market_cap)}</div>
                   </div>
            </div>
      </div>))}
    </div>
    </div>
   </div>
  )
}

export default App
