const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

require("dotenv").config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("file");

let filePath;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.post("/api/UploadRoute", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      filePath = req.file.path;
      console.log(filePath);
    }
  });
});

app.post("/api/gemini", async(req,res) => {
   try{
     function fileToGenerativePart(path,mimetype){
      return {
        inlineData : {
          data : Buffer.from(fs.readFileSync(path)).toString("base64"),
          mimeType : mimetype
        }
      }
     }

     const model = genAI.getGenerativeModel({model:"gemini-1.5-flash-latest"});
     const prompt = req.body.message;
     const result = await model.generateContent([prompt,fileToGenerativePart(filePath,"image/jpeg")]);
     const response = await result.response;
     const text = response.text();
     res.send(text);
     console.log(text);

   }catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
   }
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
