import React, { useRef, useState } from 'react';
import axios from 'axios';



function FileUpload() {

    const [file, setFile] = useState('');
    const [getFile] = useState({ name: "", path: "" });

    const [progress, setProgess] = useState(0);
    const el = useRef();

    const handleChange = (e) => {
        setProgess(0)
        const file = e.target.files[0];
        console.log(file);
        setFile(file);
    }


    const uploadFile =  () => {
        // const formData = new FormData();
        //    await formData.append('file', file); 
        console.log('dddddddd', file);
        axios.post('http://localhost:8000/api/users/upload', {


            files: file,

        },
            {
                headers: {
                    "Content-Type": "form-data",
                },
                onUploadProgress: (ProgressEvent) => {
                    let progress = Math.round(
                    ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                    setProgess(progress);
                }
            }


          
        ).then(res => {
            console.log(res, ';;;;;;');

            // getFile({
            //     name: res.data.name,
            //     path: res.data.path
            // })
        }).catch(err => console.log(err))
    }

    return (
        <div>
            <div className="file-upload">
                <input type="file" ref={el} onChange={handleChange} />
                <div className="progessBar" style={{ color: "green" }}>
                    {progress}
                </div>
                <button onClick={uploadFile} className="upbutton">
                    Upload
                </button>
                <hr />
            </div>
        </div>
    );
}

export default FileUpload;