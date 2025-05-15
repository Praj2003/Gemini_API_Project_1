import { useState } from "react";
export default function Home() {
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState("")

  const supriseOptions = [
    "What is this image about?",
    "What is the main subject of this image?",
    "What emotions does this image convey?",
    "What is the background of this image?",
    "What is the color palette of this image?",
    "What is the style of this image?",
    "What is the mood of this image?",
    "What is the composition of this image?",
    "What is the lighting in this image?",
    "What is the perspective of this image?",
  ];

  const suprise = async () => {
    const random =
      supriseOptions[Math.floor(Math.random() * supriseOptions.length)];
    setValue(random);
  };

  const analyzeImage = async () => {
    if(!image) {
      alert("Please upload an image first");
      return;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
      }),
    }

    try{

      const response = await fetch("http://localhost:3000/api/gemini", options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.text();
      setResponse(data);
      console.log(data);

    }catch(err){
      console.log(err);
    }
  }

  const uploadImage = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    setImage(e.target.files[0]);

    const options = {
      method: "POST",
      body: formData,
    };

    try {
      const response = await fetch("http://localhost:3000/api/UploadRoute", options);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const clear = () => {
    setValue("");
    setImage(null);
    setResponse("");
  };

  return (
    <div className="min-w-full min-h-screen grid lg:grid-cols-2 grid-cols-1 justify-center items-center place-items-center bg-white px-20">
      <div className="Main Container flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 pb-6">
          Gemini API Mini Project
        </h1>

        <div className="relative md:w-[300px] md:h-[300px] w-[200px] h-[200px] border border-black rounded-2xl flex items-center justify-center">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Uploaded"
              className="w-full h-full rounded-2xl"
            />
          ) : (
            <label
              htmlFor="files"
              className="w-full h-full bg-white rounded-2xl flex items-center justify-center cursor-pointer"
            >
              <p className="text-black font-bold px-3 text-center">
                Click to upload an image
              </p>
              <input
                onChange={uploadImage}
                id="files"
                accept="image/*"
                type="file"
                hidden
              />
            </label>
          )}
        </div>

        <div className="flex flex-col sm:flex-row w-full sm:w-4xl items-center justify-center mt-5 gap-3 sm:gap-2">
          <input
            type="text"
            placeholder="Enter the question you want to ask?"
            value={value}
            className="w-full sm:w-1/3 h-10 sm:h-12 p-2 sm:p-3 text-black border border-black rounded-2xl text-center"
          />
          <button
            onClick={analyzeImage}
            type="button"
            className="w-full sm:w-auto h-10 sm:h-12 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-4 sm:px-5 text-center"
          >
            Ask
          </button>
          <button
            onClick={suprise}
            type="button"
            className="w-full sm:w-auto h-10 sm:h-12 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-4 sm:px-5 text-center"
          >
            Prompt a Question
          </button>

          <button
            onClick={clear}
            type="button"
            className="w-full sm:w-auto h-10 sm:h-12 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg px-4 sm:px-5 text-center"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="max-w-3xl mt-5 p-5 border border-gray-300 rounded-lg shadow-md bg-gray-100">
        <p className="text-black text-center">
          {
            response === "" ? (
              <span className="text-gray-500">Response will be shown here</span>
            ) : (
              response
            ) 
          }
        </p>
      </div>
    </div>
  );
}
