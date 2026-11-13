const MAIL = "auraa.creations2407@gmail.com";
const PKGS = {
  "wed-45": { cat: "wedding", tag: "WEDDING • SILVER", title: "Silver Wedding Package", price: "₹45,000", f: ["Traditional Photo & Video", "1 Big Album (12x36) + Pre-Wedding", "Complimentary Pendrive & 12x18 Frame"] },
  "wed-65": { cat: "wedding", tag: "WEDDING • GOLD", title: "Gold Wedding Package", price: "₹65,000", f: ["Traditional Photo & Video + Candid Photo", "1 Big Album (12x36) + Pre-Wedding", "Complimentary Pendrive & 2 Frames (12x18)"] },
  "wed-80": { cat: "wedding", tag: "WEDDING • PLATINUM", title: "Platinum Royal Wedding", price: "₹80,000", f: ["Trad + Candid Photo & Video", "2 Albums (12x36 + 18x12) + Pre-Wedding", "Complimentary Bridal Makeup + Pendrive + 30x40 Frame"] },
  "baby-25": { cat: "ceremony", tag: "BABY SHOWER", title: "Baby Shower (Photo + Album)", price: "₹25,000", f: ["Traditional Photography + 10x30 Album", "Optional Video Add-on: +₹10,000 Extra"] },
  "baby-35": { cat: "ceremony", tag: "BABY SHOWER COMBO", title: "Baby Shower (Photo + Video)", price: "₹35,000", f: ["Traditional Photo + Video + 10x30 Album", "Full Edited HD Video & Soft Copies"] },
  "pub-15": { cat: "ceremony", tag: "BIRTHDAY / PUBERTY", title: "Birthday & Puberty Ceremony", price: "₹15,000 – ₹20,000", f: ["Traditional Photography + 24x8 Album", "Optional Video Add-on: +₹10,000 Extra"] },
  "gifts": { cat: "gifts", tag: "RETURN GIFTS", title: "Jute Bag & Manja Bag Return Gifts", price: "Bulk Quote", f: ["Custom Jute Bags — Sizes & Couple Name Printing", "Traditional Manja Bags — Weddings & Ceremonies"] },
  "addons": { cat: "events", tag: "AARI, DJ & CHENDA MELAM", title: "Aari Work, DJ & Chenda Melam", price: "Custom Quote", f: ["Bridal Aari Work Blouse Designing", "DJ & Club Sound, Chenda Melam, Stage Decor & Drone"] }
};
const DEF_ADM = [{ id: "1", name: "Aishwarya", user: "aishwarya", pass: "auraa2407", role: "owner" }];
const getAcc = () => JSON.parse(localStorage.getItem("ac_acc") || JSON.stringify(DEF_ADM));
const saveAcc = a => localStorage.setItem("ac_acc", JSON.stringify(a));
let curAdm = null;

function renderPkgs(cat = "all") {
  const keys = ["wed-45", "wed-65", "wed-80", "baby-25", "pub-15", "gifts", "addons"];
  const list = keys.map(k => ({ k, ...PKGS[k] })).filter(p => cat === "all" || p.cat === cat);
  document.getElementById("packagesList").innerHTML = list.map(p => `
    <div class="rounded-2xl bg-[#121216] border border-zinc-800 p-4 space-y-2.5">
      <div class="flex justify-between items-start gap-2">
        <div><span class="text-[10px] font-bold uppercase text-amber-400">${p.tag}</span><h4 class="text-sm font-extrabold text-white">${p.title}</h4></div>
        <span class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-extrabold text-amber-400 whitespace-nowrap">${p.price}</span>
      </div>
      <ul class="space-y-1">${p.f.map(x => `<li class="text-xs text-zinc-300 flex gap-2"><span class="text-amber-400 font-bold">✓</span><span>${x}</span></li>`).join("")}</ul>
      <button type="button" onclick="pickPkg('${p.k}')" class="w-full py-2 rounded-xl bg-zinc-900 text-amber-400 border border-zinc-800 text-xs font-bold">Enquire This Package</button>
    </div>`).join("");
}

function filterPkgs(cat) {
  document.querySelectorAll(".cat-pill").forEach(b => {
    b.className = b.dataset.cat === cat ? "cat-pill px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-black whitespace-nowrap" : "cat-pill px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 whitespace-nowrap";
  });
  renderPkgs(cat);
}

function updatePreview() {
  const p = PKGS[document.getElementById("custPackage").value] || PKGS["wed-45"];
  document.getElementById("prevPrice").textContent = p.price;
  document.getElementById("prevTitle").textContent = p.title;
  document.getElementById("prevList").innerHTML = p.f.map(x => `<li class="flex gap-1.5"><span class="text-amber-400 font-bold">✓</span><span>${x}</span></li>`).join("");
  const showGift = document.getElementById("chkJute").checked || document.getElementById("chkManja").checked || document.getElementById("custPackage").value === "gifts";
  document.getElementById("giftBox").classList.toggle("hidden", !showGift);
}

function pickPkg(k) {
  document.getElementById("custPackage").value = k;
  if (k === "gifts") document.getElementById("chkJute").checked = true;
  updatePreview();
  document.getElementById("bookingSection").scrollIntoView({ behavior: "smooth" });
}

function sendEnquiry(e) {
  e.preventDefault();
  const p = PKGS[document.getElementById("custPackage").value] || PKGS["wed-45"];
  const gifts = [document.getElementById("chkJute").checked ? "Jute Bag" : "", document.getElementById("chkManja").checked ? "Manja Bag" : ""].filter(Boolean).join(" & ") || "None";
  const ext = Array.from(document.querySelectorAll('input[name="ext"]:checked')).map(c => c.value).join(", ") || "None";
  const q = { id: "ENQ-" + Date.now().toString().slice(-4), name: document.getElementById("cName").value, phone: document.getElementById("cPhone").value, date: document.getElementById("cDate").value, venue: document.getElementById("cVenue").value || "Madurai", pkg: `${p.title} (${p.price})`, gifts: `${gifts} ${document.getElementById("gQty").value}`, ext };
  const all = JSON.parse(localStorage.getItem("ac_enq") || "[]"); all.unshift(q); localStorage.setItem("ac_enq", JSON.stringify(all));
  fetch(`https://formsubmit.co/ajax/${MAIL}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _subject: `📩 Enquiry: ${q.name}`, ...q }) }).catch(() => {});
  window.open(`https://wa.me/917449288649?text=${encodeURIComponent(`Hello Auraa Creations & Events!\nName: ${q.name}\nPhone: ${q.phone}\nDate:${q.date}\nVenue: ${q.venue}\nPackage:${q.pkg}\nReturn Gifts: ${q.gifts}\nAdd-ons:${q.ext}`)}`, "_blank");
  e.target.reset(); updatePreview();
}

function doLogin(e) {
  e.preventDefault();
  const f = getAcc().find(x => x.user === document.getElementById("uIn").value.trim().toLowerCase() && x.pass === document.getElementById("pIn").value);
  if (!f) return alert("Wrong Username or Password!");
  curAdm = f;
  document.getElementById("adminMenu").removeAttribute("open");
  document.getElementById("clientView").classList.add("hidden");
  document.getElementById("bottomNav").classList.add("hidden");
  document.getElementById("adminView").classList.remove("hidden");
  fetch(`https://formsubmit.co/ajax/${MAIL}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _subject: `🔔 Login: ${f.name} (${f.role})`, Role: f.role, Time: new Date().toLocaleString() }) }).catch(() => {});
  renderAdm();
}

function doLogout() {
  curAdm = null;
  document.getElementById("adminView").classList.add("hidden");
  document.getElementById("clientView").classList.remove("hidden");
  document.getElementById("bottomNav").classList.remove("hidden");
}

function renderAdm() {
  document.getElementById("admName").textContent = curAdm.name;
  document.getElementById("admRole").textContent = curAdm.role.toUpperCase();
  const isOw = curAdm.role === "owner";
  document.getElementById("ownerBox").classList.toggle("hidden", !isOw);
  document.getElementById("accList").innerHTML = getAcc().map(a => `<div class="p-3 rounded-xl bg-zinc-900 flex justify-between items-center text-xs"><div><b>${a.name}</b> (${a.role})<br><span class="text-zinc-400">ID: ${a.user} • Pass: ${a.pass}</span></div><div class="flex gap-1.5"><button onclick="chgPass('${a.id}')" class="px-2.5 py-1 rounded bg-amber-400 text-black font-bold">Change Pass</button>${a.role !== "owner" ? `<button onclick="delAcc('${a.id}')" class="px-2 py-1 rounded bg-red-900 text-white">Del</button>` : ""}</div></div>`).join("");
  const enqs = JSON.parse(localStorage.getItem("ac_enq") || "[]");
  document.getElementById("enqList").innerHTML = enqs.length ? enqs.map(q => `<div class="p-3.5 rounded-2xl bg-[#121216] border border-zinc-800 text-xs space-y-1"><b class="text-amber-400">${q.name} (${q.phone})</b> • ${q.date}<br>${q.pkg}<br><span class="text-emerald-300">Gifts: ${q.gifts} | Add-ons: ${q.ext}</span></div>`).join("") : `<p class="text-xs text-zinc-500">No enquiries yet.</p>`;
}

function addMgr(e) {
  e.preventDefault();
  const a = getAcc(); a.push({ id: Date.now() + "", name: document.getElementById("mName").value, user: document.getElementById("mUser").value.trim().toLowerCase(), pass: document.getElementById("mPass").value, role: "manager" });
  saveAcc(a); e.target.reset(); renderAdm();
}
function chgPass(id) { const np = prompt("Enter New Password:"); if (np) { saveAcc(getAcc().map(a => a.id === id ? { ...a, pass: np } : a)); renderAdm(); } }
function delAcc(id) { saveAcc(getAcc().filter(a => a.id !== id)); renderAdm(); }

renderPkgs("all"); updatePreview();
