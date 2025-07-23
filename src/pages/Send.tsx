import React, { useState } from 'react';
import supabase from '../storage/database'; // Your Supabase client
import { doc, setDoc } from 'firebase/firestore';
import db from '../firebase/firebase'; // Your Firestore instance

const Send = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uniqueKey, setUniqueKey] = useState<string>('');

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || file.size === 0) {
      alert('Please select a valid file.');
      return;
    }

    setUploading(true);
    const code = generateCode();
    const filePath = `${code}/${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('shareup') 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error(uploadError);
        alert('Upload failed: ' + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('shareup')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      await setDoc(doc(db, 'files', code), {
        fileName: file.name,
        url: publicUrl,
        createdAt: new Date(),
      });

      setUniqueKey(code);
      alert('Upload successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center bg-green-50 p-6'>
      <div className='bg-white rounded-2xl shadow-lg p-8 w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>
           Send File
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <label 
              htmlFor="file-input" 
              className='block text-lg font-semibold text-gray-700'
            >
              Choose a file to share
            </label>
            <div className='relative'>
              <input
                id='file-input'
                type='file'
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className='w-full p-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200'
              />
            </div>
            {file && (
              <div className='bg-green-100 p-3 rounded-lg'>
                <p className='text-sm text-green-800'>
                  <span className='font-medium'>Selected:</span> {file.name}
                </p>
                <p className='text-xs text-green-600'>
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          <button
            type='submit'
            disabled={uploading || !file}
            className='w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-md hover:shadow-lg'
          >
            {uploading ? (
              <>
                <span className='inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></span>
                Uploading...
              </>
            ) : (
              ' Send File'
            )}
          </button>
        </form>
      </div>

      {uniqueKey && (
        <div className='bg-white rounded-2xl shadow-lg p-6 mt-6 w-full max-w-md'>
          <div className='text-center space-y-4'>
            <div className='bg-green-100 p-4 rounded-xl'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                File Uploaded Successfully!
              </h3>
              <p className='text-gray-600 mb-3'>
                Share this code with the recipient:
              </p>
              <div className='bg-white p-4 rounded-lg border-2 border-green-300'>
                <p className='text-3xl font-mono font-bold text-green-600 tracking-widest'>
                  {uniqueKey}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => navigator.clipboard.writeText(uniqueKey)}
              className='inline-block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors duration-200 shadow-md hover:shadow-lg'
            >
               Copy Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Send;
