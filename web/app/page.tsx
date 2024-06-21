'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import Dropzone from 'react-dropzone'

export default function Home() {
  const [displayResult, setDisplayResult] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [map, setMap] = useState<{[key:string]: {
    file: File,
    status: string,
    result: string,
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
          ...item, [file.name]: {file: file, status: 'done', result: data.classification}
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
            result: '',
          },
        }));
        handleUploadImage(file);
      }

    });
  }, [files]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <p className="text-5xl font-bold pb-10">Dog vs Cat</p>
      <div className="w-full flex flex-row justify-between bg-green-300 rounded-md p-">
        {
          displayResult ?
            <div className="flex-1 bg-red-300 h-96 flex items-center justify-center">
              Result
            </div>
            :
            <div className="flex-1 bg-red-300 h-96 flex items-center justify-center">
              <Dropzone onDrop={acceptedFiles => setFiles(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
        }
      </div>
      <div>
        {error.status ? <p className="text-red-500">{error.errorStr}</p> : <div>
      {Object.entries(map).map(([key, value]) => (
        <div key={key}>
          <p>{key}, status:{value.status} {value.result}</p>
        </div>
      ))}
      </div>}
      </div>
    </main>
  );
}
