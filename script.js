// 🇮🇳 Tên kiểu Ấn Độ (Họ + Tên)
const firstNames = [ "Aarav", "Aditya", "Ishaan", "Rohan", "Rahul", "Vivaan", "Arjun", "Siddharth", "Veer", "Kabir", "Aryan", "Krishna", "Yash", "Nikhil", "Kunal", "Tanish", "Reyansh", "Atharv", "Manav", "Parth", "Dev", "Ritvik", "Ayaan", "Pranav", "Vihaan", "Samar", "Tanmay", "Lakshya", "Hrithik", "Sarthak", "Neil", "Rudra", "Om", "Aniket", "Amit", "Harsh", "Rishi", "Anshul", "Yuvraj", "Mehul", "Tushar", "Devansh", "Darsh", "Raghav", "Shaan", "Nirav", "Ivaan", "Arnav", "Saurav", "Kabindra" ];

const lastNames = [ "Sharma", "Verma", "Reddy", "Patel", "Iyer", "Kumar", "Das", "Joshi", "Naidu", "Chopra", "Mehta", "Rao", "Gupta", "Pandey", "Singh", "Nair", "Bhatia", "Chandra", "Malhotra", "Desai", "Shetty", "Ghosh", "Jain", "Bhatt", "Sinha", "Dubey", "Pillai", "Menon", "Rathi", "Kapoor", "Kulkarni", "Tripathi", "Dixit", "Yadav", "Sen", "Bansal", "Jha", "Kohli", "Bhaskar", "Tiwari", "Rawat", "Mahajan", "Agrawal", "Roy", "Barua", "Shukla", "Chauhan", "Mathur", "Mishra", "Saxena" ];

const years = [["2024", "2027"], ["2023", "2026"]];
const regPrefixes = ["721912", "721913", "721914"];
const avatars = Array.from({ length: 30 }, (_, i) => `images/${i + 1}.png`);

// 👉 Biến toàn cục
let generatedName = "";
let generatedRegNo = "";

// 👉 Random tên
function getRandomName() {
  const first = randomFrom(firstNames);
  const last = randomFrom(lastNames);
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

// 🎯 Generate ID
async function generateID() {
  const canvas = document.getElementById("idCanvas");
  const ctx = canvas.getContext("2d");

  try {
    const template = await loadImage("template/id_template.png");
    canvas.width = 1200;
    canvas.height = 757;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    const name = getRandomName();
    const regNo = randomFrom(regPrefixes) + Math.floor(100000 + Math.random() * 900000);
    const [startYear, endYear] = randomFrom(years);
    const yearSuffix = startYear.slice(-2); // Lấy 2 số cuối năm
    const barcode = `${yearSuffix}CV${regNo.slice(-3)}`;
    const avatarPath = randomFrom(avatars);
    const avatar = await loadImage(avatarPath);

    // Gán biến toàn cục
    generatedName = name;
    generatedRegNo = regNo;

    // 📸 Avatar
    ctx.drawImage(avatar, 75, 290, 300, 450); // full avatar không crop

    // 📝 Text
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(`Name    : ${name}`, 420, 335);
    ctx.fillText("Course  : B.E. (Civil)", 420, 400);
    ctx.fillText(`Reg. No.: ${regNo}`, 420, 465);
    ctx.fillText(`Year       : ${startYear} - ${endYear}`, 420, 530);

    // 🧾 Barcode
    ctx.fillStyle = "black";
    ctx.font = "bold 50px monospace";
    ctx.fillText(barcode, 545, 685);

    // 📨 Hiển thị email
    const safeName = generatedName.replace(/\s+/g, '');
    const suffix = generatedRegNo.slice(-3);
    const email = `${safeName}${suffix}@dsuniversity.ac.in`;
    document.getElementById("emailDisplay").textContent = email;

  } catch (err) {
    console.error("🚨 Failed to generate:", err);
  }
}

// 📤 PDF Export (fix mismatch bug)
function downloadPDF() {
  const canvas = document.getElementById("idCanvas");

  setTimeout(() => {
    const safeName = generatedName.replace(/\s+/g, '');
    const suffix = generatedRegNo.slice(-3);
    const email = `${safeName}${suffix}@dsuniversity.ac.in`;
    const filename = `${email}.pdf`;

    const [startYear, endYear] = years.find(([s, e]) =>
      document.getElementById("emailDisplay").textContent.includes(s)
    ) || ["2024", "2027"];

    const yearSuffix = startYear.slice(-2);
    const barcode = `${yearSuffix}CV${generatedRegNo.slice(-3)}`;

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new window.jspdf.jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    // 👕 Draw background from canvas
    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);

    // 📝 Text same as canvas
    pdf.setFont("helvetica", "bold"); // closest to Arial
    pdf.setTextColor(255, 0, 0);
    pdf.setFontSize(50);
    pdf.text(`Name    : ${generatedName}`, 420, 335);
    pdf.text("Course  : B.E. (Civil)", 420, 400);
    pdf.text(`Reg. No.: ${generatedRegNo}`, 420, 465);
    pdf.text(`Year       : ${startYear} - ${endYear}`, 420, 530);

    pdf.setFont("courier", "bold"); // monospace for barcode
    pdf.setTextColor(0, 0, 0);
    pdf.text(barcode, 545, 685);

    pdf.save(filename);
  }, 300);
}
