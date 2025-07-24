// 🇮🇳 Tên kiểu Ấn Độ (Họ + Tên)
const firstNames = [
  "Aarav", "Aditya", "Ishaan", "Rohan", "Rahul",
  "Vivaan", "Arjun", "Siddharth", "Veer", "Kabir",
  "Aryan", "Krishna", "Yash", "Nikhil", "Kunal",
  "Tanish", "Reyansh", "Atharv", "Manav", "Parth",
  "Dev", "Ritvik", "Ayaan", "Pranav", "Vihaan",
  "Samar", "Tanmay", "Lakshya", "Hrithik", "Sarthak",
  "Neil", "Rudra", "Om", "Aniket", "Amit",
  "Harsh", "Rishi", "Anshul", "Yuvraj", "Mehul",
  "Tushar", "Devansh", "Darsh", "Raghav", "Shaan",
  "Nirav", "Ivaan", "Arnav", "Saurav", "Kabindra"
];

const lastNames = [
  "Sharma", "Verma", "Reddy", "Patel", "Iyer",
  "Kumar", "Das", "Joshi", "Naidu", "Chopra",
  "Mehta", "Rao", "Gupta", "Pandey", "Singh",
  "Nair", "Bhatia", "Chandra", "Malhotra", "Desai",
  "Shetty", "Ghosh", "Jain", "Bhatt", "Sinha",
  "Dubey", "Pillai", "Menon", "Rathi", "Kapoor",
  "Kulkarni", "Tripathi", "Dixit", "Yadav", "Sen",
  "Bansal", "Jha", "Kohli", "Bhaskar", "Tiwari",
  "Rawat", "Mahajan", "Agrawal", "Roy", "Barua",
  "Shukla", "Chauhan", "Mathur", "Mishra", "Saxena"
];


const years = [["2024", "2027"], ["2023", "2026"]];
const regPrefixes = ["721912", "721913", "721914"];
const avatars = Array.from({ length: 30 }, (_, i) => `images/${i + 1}.png`);

// 👉 Biến toàn cục để dùng tên khi tải file
let generatedName = "";
let generatedRegNo = "";

// 👉 Hàm sinh tên đầy đủ ngẫu nhiên
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
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error("❌ Error loading:", src);
      reject();
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

    const name = getRandomName(); // 🔁 Dùng tên kiểu Ấn
    const regNo = randomFrom(regPrefixes) + Math.floor(100000 + Math.random() * 900000);
    const [startYear, endYear] = randomFrom(years);
    const barcode = "24CV" + regNo.slice(-3);
    const avatarPath = randomFrom(avatars);
    const avatar = await loadImage(avatarPath);

    // Lưu thông tin để đặt tên file
    generatedName = name;
    generatedRegNo = regNo;

    // 📸 Avatar
    ctx.drawImage(avatar, 50, 195, 180, 260);

    // 📝 Thông tin text
    ctx.font = "bold 26px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Name    : ${name}`, 280, 225);
    ctx.fillText("Course  : B.E. (Civil)", 280, 265);
    ctx.fillText(`Reg. No.: ${regNo}`, 280, 305);
    ctx.fillText(`Year       : ${startYear} - ${endYear}`, 280, 345);

    // 🧾 Barcode (text only)
    ctx.fillStyle = "black";
    ctx.font = "bold 26px monospace";
    ctx.fillText(barcode, 360, 455);
  } catch (err) {
    console.error("🚨 Failed to generate:", err);
  }
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

// ✅ Copy email định dạng HoTen123@dsuniversity.ac.in
function copyEmail() {
  if (!generatedName || !generatedRegNo) {
    alert("Please generate an ID first.");
    return;
  }
  const safeName = generatedName.replace(/\s+/g, '');
  const suffix = generatedRegNo.slice(-3);
  const email = `${safeName}${suffix}@dsuniversity.ac.in`;

  navigator.clipboard.writeText(email)
    .then(() => alert(`Copied: ${email}`))
    .catch(() => alert("Failed to copy email."));
}

