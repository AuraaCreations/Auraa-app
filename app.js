const MAIL = "auraa.creations2407@gmail.com";
const DB_URL = "https://script.google.com/macros/s/AKfycbzoiCnNwz8uy25rz28dfbvlI_hevEYwimB-fN9hxDo-w_-kcfs70Nb5csfmWS_6Vp5B/exec";

const PKGS = {
  "wed-45": { cat: "wedding", tag: "WEDDING • SILVER", title: "Silver Wedding Package", price: "₹45,000", num: 45000, f: ["Traditional Photo & Video", "1 Big Album (12x36) + Pre-Wedding", "Complimentary Pendrive & 12x18 Frame"] },
  "wed-65": { cat: "wedding", tag: "WEDDING • GOLD", title: "Gold Wedding Package", price: "₹65,000", num: 65000, f: ["Traditional Photo & Video + Candid Photo", "1 Big Album (12x36) + Pre-Wedding", "Complimentary Pendrive & 2 Frames (12x18)"] },
  "wed-80": { cat: "wedding", tag: "WEDDING • PLATINUM", title: "Platinum Royal Wedding", price: "₹80,000", num: 80000, f: ["Trad + Candid Photo & Video", "2 Albums (12x36 + 18x12) + Pre-Wedding", "Complimentary Bridal Makeup + Pendrive + 30x40 Frame"] },
  "baby-25": { cat: "ceremony", tag: "BABY SHOWER", title: "Baby Shower (Photo + Album)", price: "₹25,000", num: 25000, f: ["Traditional Photography + 10x30 Album", "Optional Video Add-on: +₹10,000 Extra"] },
  "baby-35": { cat: "ceremony", tag: "BABY SHOWER COMBO", title: "Baby Shower (Photo + Video)", price: "₹35,000", num: 35000, f: ["Traditional Photo + Video + 10x30 Album", "Full Edited HD Video & Soft Copies"] },
  "pub-15": { cat: "ceremony", tag: "BIRTHDAY / PUBERTY", title: "Birthday & Puberty Ceremony", price: "₹15,000 – ₹20,000", num: 15000, f: ["Traditional Photography + 24x8 Album", "Optional Video Add-on: +₹10,000 Extra"] },
  "gifts": { cat: "gifts", tag: "RETURN GIFTS", title: "Jute Bag & Manja Bag Return Gifts", price: "Bulk Quote", num: 0, f: ["Custom Jute Bags — Sizes & Couple Name Printing", "Traditional Manja Bags — Weddings & Ceremonies"] },
  "addons": { cat: "events", tag: "AARI, DJ & CHENDA MELAM", title: "Aari Work, DJ & Chenda Melam", price: "Custom Quote", num: 0, f: ["Bridal Aari Work Blouse Designing", "DJ & Club Sound, Chenda Melam, Stage Decor & Drone"] }
};

const DEF_ADM = [{ id: "1", name: "Aishwarya", user: "aishwarya", pass: "auraa2407", role: "owner" }];
let DB = {
  accounts: JSON.parse(localStorage.getItem("ac_acc") || JSON.stringify(DEF_ADM)),
  enquiries: JSON.parse(localStorage.getItem("ac_enq") || "[]")
};
let curAdm = null;

async function syncFromCloud() {
  try {
    const res = await fetch(DB_URL);
    const data = await res.json();
    if (data.accounts && data.accounts.length) {
      DB.accounts = data.accounts;
      localStorage.setItem("ac_acc", JSON.stringify(DB.accounts));
    }
    if (data.enquiries) {
      DB.enquiries = data.enquiries;
      localStorage.setItem("ac_enq", JSON.stringify(DB.enquiries));
    }
    if (curAdm) renderAdm();
  } catch (e) {}
}

async function pushToCloud() {
  localStorage.setItem("ac_acc", JSON.stringify(DB.accounts));
  localStorage.setItem("ac_enq", JSON.stringify(DB.enquiries));
  try {
    await fetch(DB_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(DB)
    });
  } catch (e) {}
}

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

async function sendEnquiry(e) {
  e.preventDefault();
  await syncFromCloud();
  const p = PKGS[document.getElementById("custPackage").value] || PKGS["wed-45"];
  const gifts = [document.getElementById("chkJute").checked ? "Jute Bag" : "", document.getElementById("chkManja").checked ? "Manja Bag" : ""].filter(Boolean).join(" & ") || "None";
  const ext = Array.from(document.querySelectorAll('input[name="ext"]:checked')).map(c => c.value).join(", ") || "None";
  const q = {
    id: "ENQ-" + Date.now().toString().slice(-4),
    name: document.getElementById("cName").value,
    phone: document.getElementById("cPhone").value,
    date: document.getElementById("cDate").value,
    venue: document.getElementById("cVenue").value || "Madurai",
    pkg: `${p.title} (${p.price})`,
    gifts: `${gifts} ${document.getElementById("gQty").value}`.trim(),
    ext,
    status: "New Enquiry",
    total: p.num || 0,
    advance: 0
  };
  DB.enquiries.unshift(q);
  await pushToCloud();
  fetch(`https://formsubmit.co/ajax/${MAIL}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _subject: `📩 Enquiry: ${q.name}`, ...q }) }).catch(() => {});
  window.open(`https://wa.me/917449288649?text=${encodeURIComponent(`Hello Auraa Creations & Events!\nName: ${q.name}\nPhone: ${q.phone}\nDate: ${q.date}\nVenue: ${q.venue}\nPackage: ${q.pkg}\nReturn Gifts: ${q.gifts}\nAdd-ons: ${q.ext}`)}`, "_blank");
  e.target.reset(); updatePreview();
}

async function doLogin(e) {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  btn.textContent = "Checking Cloud...";
  await syncFromCloud();
  btn.textContent = "Login & Open Dashboard";
  const f = DB.accounts.find(x => x.user.toLowerCase() === document.getElementById("uIn").value.trim().toLowerCase() && x.pass === document.getElementById("pIn").value);
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

async function updStatus(idx, val) {
  DB.enquiries[idx].status = val;
  renderAdm();
  await pushToCloud();
}

async function updPay(idx, field, val) {
  if (curAdm.role === "admin") return;
  DB.enquiries[idx][field] = Number(val) || 0;
  renderAdm();
  await pushToCloud();
}

async function delEnq(idx) {
  if (curAdm.role !== "owner") return;
  if (!confirm("Delete this client enquiry?")) return;
  DB.enquiries.splice(idx, 1);
  renderAdm();
  await pushToCloud();
}

function replyClient(idx) {
  const q = DB.enquiries[idx];
  const ph = String(q.phone).replace(/\D/g, "");
  const wa = ph.length === 10 ? "91" + ph : ph;
  const bal = (Number(q.total) || 0) - (Number(q.advance) || 0);
  const txt = `Vanakkam ${q.name}! Greetings from *Auraa Creations & Events, Madurai*.\n• Event Date: ${q.date}\n• Package: ${q.pkg}\n• Status: ${q.status || "New Enquiry"}\n• Total: ₹${q.total || 0} | Advance: ₹${q.advance || 0} | Balance: ₹${bal}`;
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(txt)}`, "_blank");
}

function renderAdm() {
  document.getElementById("admName").textContent = curAdm.name;
  document.getElementById("admRole").textContent = curAdm.role.toUpperCase();
  const isOw = curAdm.role === "owner";
  const isAdmStaff = curAdm.role === "admin";

  const ownerBox = document.getElementById("ownerBox");
  ownerBox.classList.toggle("hidden", !isOw);
  if (isOw && !document.getElementById("mRole")) {
    const sel = document.createElement("select");
    sel.id = "mRole";
    sel.className = "w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white";
    sel.innerHTML = `<option value="manager">Role: Manager (Can update Status, Total & Advance)</option><option value="admin">Role: Admin / Staff (Restricted — Status & WhatsApp only)</option>`;
    document.getElementById("mPass").insertAdjacentElement("afterend", sel);
  }

  document.getElementById("accList").innerHTML = DB.accounts.map(a => `
    <div class="p-3 rounded-xl bg-zinc-900 flex justify-between items-center text-xs">
      <div><b>${a.name}</b> <span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] uppercase">${a.role}</span><br><span class="text-zinc-400">ID: ${a.user} • Pass: ${a.pass}</span></div>
      <div class="flex gap-1.5">
        <button onclick="chgPass('${a.id}')" class="px-2.5 py-1 rounded bg-amber-400 text-black font-bold">Change Pass</button>
        ${a.role !== "owner" ? `<button onclick="delAcc('${a.id}')" class="px-2 py-1 rounded bg-red-900 text-white">Del</button>` : ""}
      </div>
    </div>`).join("");

  const enqs = DB.enquiries;
  const totSum = enqs.reduce((s, q) => s + (Number(q.total) || 0), 0);
  const advSum = enqs.reduce((s, q) => s + (Number(q.advance) || 0), 0);

  const syncBar = `<div class="flex justify-between items-center mb-2"><span class="text-[11px] text-emerald-400">☁️ Synced with 5TB Google Drive</span><button type="button" onclick="syncFromCloud()" class="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-[11px] text-amber-400 font-bold">🔄 Refresh</button></div>`;

  const summaryHtml = !isAdmStaff && enqs.length ? `
    <div class="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-900 border border-amber-500/30 text-center text-xs mb-3">
      <div><span class="text-[10px] text-zinc-400 block">TOTAL</span><b class="text-white">₹${totSum}</b></div>
      <div><span class="text-[10px] text-zinc-400 block">ADVANCE</span><b class="text-emerald-400">₹${advSum}</b></div>
      <div><span class="text-[10px] text-zinc-400 block">BALANCE</span><b class="text-amber-400">₹${totSum - advSum}</b></div>
    </div>` : "";

  document.getElementById("enqList").innerHTML = syncBar + summaryHtml + (enqs.length ? enqs.map((q, i) => {
    const st = q.status || "New Enquiry";
    const tot = Number(q.total) || 0;
    const adv = Number(q.advance) || 0;
    const bal = tot - adv;
    const stColor = st === "Confirmed" ? "text-emerald-400 border-emerald-700" : st === "Completed" ? "text-sky-400 border-sky-700" : st === "Cancelled" ? "text-red-400 border-red-700" : "text-amber-400 border-amber-700";

    return `
      <div class="p-3.5 rounded-2xl bg-[#121216] border border-zinc-800 text-xs space-y-2.5">
        <div class="flex justify-between items-start gap-2">
          <div><b class="text-amber-400 text-sm">${q.name}</b> <span class="text-zinc-400">(${q.phone})</span><p class="text-[11px] text-zinc-400">📅 ${q.date} • 📍 ${q.venue || "Madurai"}</p></div>
          <select onchange="updStatus(${i}, this.value)" class="px-2 py-1 rounded-lg bg-zinc-900 border ${stColor} text-[11px] font-bold">
            <option ${st === "New Enquiry" ? "selected" : ""}>New Enquiry</option>
            <option ${st === "Confirmed" ? "selected" : ""}>Confirmed</option>
            <option ${st === "Completed" ? "selected" : ""}>Completed</option>
            <option ${st === "Cancelled" ? "selected" : ""}>Cancelled</option>
          </select>
        </div>

        <p class="text-white font-semibold">${q.pkg}</p>
        <p class="text-emerald-300 text-[11px]">Gifts: ${q.gifts} | Add-ons: ${q.ext}</p>

        ${isAdmStaff ? `
          <div class="p-2 rounded-xl bg-zinc-900/80 text-[11px] text-zinc-400">🔒 Payment & Balance editing restricted to Owner / Manager</div>
        ` : `
          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
            <div>
              <label class="text-[10px] text-zinc-400 block">Total (₹)</label>
              <input type="number" value="${tot}" onchange="updPay(${i}, 'total', this.value)" class="w-full mt-0.5 px-2 py-1 rounded bg-black border border-zinc-700 text-white font-bold" />
            </div>
            <div>
              <label class="text-[10px] text-zinc-400 block">Advance (₹)</label>
              <input type="number" value="${adv}" onchange="updPay(${i}, 'advance', this.value)" class="w-full mt-0.5 px-2 py-1 rounded bg-black border border-zinc-700 text-emerald-400 font-bold" />
            </div>
            <div>
              <label class="text-[10px] text-zinc-400 block">Balance (₹)</label>
              <div class="mt-0.5 px-2 py-1 rounded bg-black/60 border border-zinc-800 text-amber-400 font-extrabold">₹${bal}</div>
            </div>
          </div>
        `}

        <div class="flex gap-2 pt-1">
          <button type="button" onclick="replyClient(${i})" class="flex-1 py-2 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 font-bold">💬 Send Status & Bill on WhatsApp</button>
          ${isOw ? `<button type="button" onclick="delEnq(${i})" class="px-3 py-2 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 font-bold">Delete</button>` : ""}
        </div>
      </div>`;
  }).join("") : `<p class="text-xs text-zinc-500">No enquiries yet.</p>`);
}

async function addMgr(e) {
  e.preventDefault();
  const roleSel = document.getElementById("mRole") ? document.getElementById("mRole").value : "manager";
  DB.accounts.push({ id: Date.now() + "", name: document.getElementById("mName").value, user: document.getElementById("mUser").value.trim().toLowerCase(), pass: document.getElementById("mPass").value, role: roleSel });
  e.target.reset(); renderAdm();
  await pushToCloud();
}

async function chgPass(id) {
  const np = prompt("Enter New Password:");
  if (!np) return;
  DB.accounts = DB.accounts.map(a => a.id === id ? { ...a, pass: np } : a);
  renderAdm();
  await pushToCloud();
}

async function delAcc(id) {
  DB.accounts = DB.accounts.filter(a => a.id !== id);
  renderAdm();
  await pushToCloud();
}

renderPkgs("all"); updatePreview(); syncFromCloud();
