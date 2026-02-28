const modal = document.getElementById("modal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.querySelector(".close");

loginBtn.onclick = () => (modal.style.display = "flex");
closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;
  if (user === "alumno@demo.com" && pass === "demo123") {
    window.location.href = "Aula/index.html";
  } else {
    alert("Credenciales incorrectas. Usa alumno@demo.com / demo123");
  }
}
