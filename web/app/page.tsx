'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import Dropzone from 'react-dropzone';


export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [map, setMap] = useState<{[key:string]: {
    file: File,
    status: string,
    label: string,
    confidence: number,
  }}>({});

  const [error, setError] = useState({errorStr: '', status: false});

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/classify',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok){
        throw new Error('Failed to upload image');
      }

      const data: ApiDataType = await response.json();
      

      setMap((item) => (
        {
          ...item, [file.name]: {file: file, status: 'done', label: data.classification, confidence: data.confidence}
        }
      ))
    }catch(error){
      console.error('Error uploading image:', error);
      setError({errorStr: 'Error uploading image', status: true});
    }
  };

  // function handler to check if file is an image
  const handleFileChecker = (file: File) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/svg+xml'];
    return imageTypes.includes(file.type);
  }

  useEffect(() => {
  
    files.map((file) => {
      // Check if file is an image
      if (handleFileChecker(file)) {
        setMap((item) => ({
          ...item, [file.name]: {
            file: file,
            status: 'waiting',
            label: '',
            confidence: 0.0,
          },
        }));
        handleUploadImage(file);
      }

    });
  }, [files]);

  return (
    <main className="flex min-h-screen flex-col items-center pl-16 pr-16">
      <div className="w-32 ">
        <Image src='/dogncat.png' alt='dog and cat' width={200} height={100} className="flex justify-center w-full"/>
      </div>
      <p className="flex justify-center text-5xl font-bold pb-4 w-full">Dog vs Cat</p>
      <div className="w-full flex flex-row justify-between bg-slate-300 rounded-md p-">
        
            <div className="flex-1 h-60 flex items-center justify-center">
              <Dropzone onDrop={acceptedFiles => setFiles(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p className="flex justify-center p-10 text-gray-700 text-center">Drag and drop some images here, or click to select images</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
        
      </div>
      <div className="w-full pt-2">
        <div className="w-full flex flex-row justify-between">
          <span className="w-24">File</span>
          <span className="w-24">Status</span>
          <span className="w-24">Confidence</span>
          <span className="w-24">Label</span>
        </div>
        {error.status ? <p className="text-red-500">{error.errorStr}</p> : <div>
      {Object.entries(map).map(([key, value]) => (
        <div key={key} className="w-full flex flex-row justify-between border">
          <span className="w-24 truncate ">{key}</span>
          <span className="w-24">{value.status}</span>
          <span className="w-24">{(100*value.confidence).toFixed(2)}%</span>
          <span className="w-24 font-bold">{value.label == "cats" ? "cat": "dog"}</span>
        </div>
      ))}
      </div>}
      </div>
    </main>
  );
}
