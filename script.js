// Kamerani ochish
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
  })
  .catch((err) => console.error("Kamera ishlamadi:", err));

// Rasmni olish va ishlash
async function captureAndProcess() {
  // Rasmni olish
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");

  // OCR orqali matnni o'qish
  const text = await recognizeText(imageData);

  // Word fayl yaratish
  createWordFile(text, imageData);
}

// OCR matn tanib olish
async function recognizeText(imageData) {
  const result = await Tesseract.recognize(imageData, "eng");
  console.log("Aniqlangan matn:", result.data.text);
  return result.data.text;
}

// Word fayl yaratish
function createWordFile(text, imageBase64) {
  const doc = new docx.Document();
  doc.addSection({
    children: [new docx.Paragraph(text)],
  });

  docx.Packer.toBlob(doc).then((blob) => {
    saveAs(blob, "ID_Card.docx");
    console.log("Word fayl saqlandi.");
  });
}
