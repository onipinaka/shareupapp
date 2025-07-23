import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import db from '../firebase/firebase';

const Recieve = () => {

    const [recievecode, setRecieveCode] = React.useState<string>('');
    const [fileInfo, setFileInfo] = useState<{ fileName: string; url: string } | null>(null);

    
    const handlesubmit = async () => {
        if (!recievecode.match(/^\d{6}$/)) {
            alert('Enter a valid 6-digit code');
            return;
        }

        const docRef = doc(db, 'files', recievecode);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()) {
            const data = docSnap.data();
            setFileInfo({ fileName: data.fileName, url: data.url });
            
        }else{
            setFileInfo(null);
            alert('No file found for this code');
        }




    }


  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center bg-green-50 p-6'>
        <div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-md'>
            <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>
                Download File
            </h1>
            
            <form 
                onSubmit={(e)=> {e.preventDefault(); handlesubmit();}}
                className='space-y-6'
            >
                <div className='space-y-2'>
                    <label 
                        htmlFor="inp" 
                        className='block text-lg font-semibold text-gray-700'
                    >
                        Enter your 6-digit code
                    </label>
                    <input 
                        id='inp' 
                        onChange={(e)=> setRecieveCode(e.target.value)} 
                        className='w-full p-4 text-xl text-center border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 tracking-widest font-mono'
                        type="text" 
                        placeholder='123456'
                        maxLength={6}
                    />
                </div>
                
                <button 
                    type='submit'
                    className='w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-md hover:shadow-lg'
                >
                    Find File
                </button>
            </form>
        </div>

        {fileInfo && (
            <div className='bg-white rounded-2xl shadow-lg p-6 mt-6 w-full max-w-md'>
                <div className='text-center space-y-4'>
                    <div className='bg-green-100 p-4 rounded-xl'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                            File Found!
                        </h3>
                        <p className='text-gray-600 break-all'>
                            <span className='font-medium'>File:</span> {fileInfo.fileName}
                        </p>
                    </div>
                    
                    <a 
                        href={fileInfo.url} 
                        download
                        className='inline-block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors duration-200 shadow-md hover:shadow-lg'
                    >
                        📥 Download File
                    </a>
                </div>
            </div>
        )}
    </div>
  )
}

export default Recieve