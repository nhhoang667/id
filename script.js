// 🇮🇳 Tên kiểu Ấn Độ
const firstNames = [
  "Aarav", "Rohan", "Aditya", "Ishaan", "Rahul",
  "Siddharth", "Karan", "Nikhil", "Amit", "Yash",
  "Aniket", "Harsh", "Krishna", "Raj", "Vikas"
];
const lastNames = [
  "Sharma", "Verma", "Reddy", "Patel", "Iyer",
  "Kumar", "Das", "Joshi", "Naidu", "Chopra",
  "Mehta", "Rao", "Gupta", "Pandey", "Singh"
];

const years = [["2024", "2027"], ["2023", "2026"]];
const regPrefixes = ["721912", "721913", "721914"];

// To store generated name + regNo for filename
let generatedName = "";
let generatedRegNo = "";

// Hàm tạo tên đầy đủ
function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Cần cho thispersondoesnotexist
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      console.error("❌ Error loading image:", src);
      reject(e);
    };
    img.src = src;
  });
}

async function generateID() {
  const canvas = document.getElementById("idCanvas");
  const ctx = canvas.getContext("2d");

  try {
    const template = await loadImage("template/id_template.png");
    canvas.width = 800;
    canvas.height = 504;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    const name = getRandomName();
    const regNo = randomFrom(regPrefixes) + Math.floor(100000 + Math.random() * 900000);
    const [startYear, endYear] = randomFrom(years);
    const barcode = "24CV" + regNo.slice(-3);

    // Lưu cho tên file
    generatedName = name;
    generatedRegNo = regNo;

    // 🖼️ Dùng ảnh online
    const avatarURL = "https://thispersondoesnotexist.com/image";
    const avatar = await loadImage(avatarURL);

    // Vẽ avatar
    ctx.drawImage(avatar, 50, 195, 180, 260);

    // Vẽ text
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Name    : ${name}`, 280, 225);
    ctx.fillText("Course  : B.E. (Civil)", 280, 265);
    ctx.fillText(`Reg. No.: ${regNo}`, 280, 305);
    ctx.fillText(`Year       : ${startYear} - ${endYear}`, 280, 345);

    ctx.fillStyle = "black";
    ctx.font = "bold 26px monospace";
    ctx.fillText(barcode, 360, 455);
  } catch (err) {
    console.error("🚨 Failed to generate ID:", err);
  }
}

function downloadImage() {
  const canvas = document.getElementById("idCanvas");
  const link = document.createElement("a");

  const safeName = generatedName.replace(/\s+/g, '');
  const suffix = generatedRegNo.slice(-3);
  const filename = `${safeName}${suffix}@dsuniversity.ac.in.jpg`;

  link.download = filename;
  link.href = canvas.toDataURL("image/jpeg");
  link.click();
}

function downloadPDF() {
  const canvas = document.getElementById("idCanvas");
  const imgData = canvas.toDataURL("image/jpeg");

  const safeName = generatedName.replace(/\s+/g, '');
  const suffix = generatedRegNo.slice(-3);
  const filename = `${safeName}${suffix}@dsuniversity.ac.in.pdf`;

  const pdf = new window.jspdf.jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}
