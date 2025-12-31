// --- GLOBAL DEĞİŞKENLER ---
let myChart = null;
let roiChart = null;

// ŞEHİR LİSTESİ
const fallbackCities = [
    { city: "Adana",        lat: 37.0000, lng: 35.3213, irradiance: 1680 },
    { city: "Adıyaman",     lat: 37.7648, lng: 38.2786, irradiance: 1750 },
    { city: "Afyonkarahisar", lat: 38.7507, lng: 30.5567, irradiance: 1550 },
    { city: "Ağrı",         lat: 39.7191, lng: 43.0503, irradiance: 1450 },
    { city: "Ankara",       lat: 39.9334, lng: 32.8597, irradiance: 1550 },
    { city: "Antalya",      lat: 36.8969, lng: 30.7133, irradiance: 1800 },
    { city: "Artvin",       lat: 41.1828, lng: 41.8183, irradiance: 1050 },
    { city: "Aydın",        lat: 37.8560, lng: 27.8416, irradiance: 1650 },
    { city: "Balıkesir",    lat: 39.6484, lng: 27.8826, irradiance: 1400 },
    { city: "Bursa",        lat: 40.1885, lng: 29.0610, irradiance: 1300 },
    { city: "Çanakkale",    lat: 40.1553, lng: 26.4142, irradiance: 1450 },
    { city: "Çorum",        lat: 40.5506, lng: 34.9556, irradiance: 1420 },
    { city: "Denizli",      lat: 37.7765, lng: 29.0864, irradiance: 1620 },
    { city: "Diyarbakır",   lat: 37.9144, lng: 40.2306, irradiance: 1700 },
    { city: "Edirne",       lat: 41.6768, lng: 26.5603, irradiance: 1300 },
    { city: "Elazığ",       lat: 38.6810, lng: 39.2264, irradiance: 1600 },
    { city: "Erzurum",      lat: 39.9043, lng: 41.2679, irradiance: 1500 },
    { city: "Eskişehir",    lat: 39.7667, lng: 30.5256, irradiance: 1450 },
    { city: "Gaziantep",    lat: 37.0662, lng: 37.3833, irradiance: 1700 },
    { city: "Giresun",      lat: 40.9128, lng: 38.3895, irradiance: 1080 },
    { city: "Hakkari",      lat: 37.5833, lng: 43.7333, irradiance: 1600 },
    { city: "Hatay",        lat: 36.4018, lng: 36.3498, irradiance: 1650 },
    { city: "Isparta",      lat: 37.7648, lng: 30.5566, irradiance: 1600 },
    { city: "İstanbul",     lat: 41.0082, lng: 28.9784, irradiance: 1300 },
    { city: "İzmir",        lat: 38.4192, lng: 27.1287, irradiance: 1650 },
    { city: "Kars",         lat: 40.6172, lng: 43.0974, irradiance: 1400 },
    { city: "Kayseri",      lat: 38.7312, lng: 35.4787, irradiance: 1580 },
    { city: "Konya",        lat: 37.8667, lng: 32.4833, irradiance: 1600 },
    { city: "Mersin",       lat: 36.8000, lng: 34.6333, irradiance: 1750 },
    { city: "Malatya",      lat: 38.3552, lng: 38.3095, irradiance: 1620 },
    { city: "Manisa",       lat: 38.6191, lng: 27.4289, irradiance: 1600 },
    { city: "Mardin",       lat: 37.3212, lng: 40.7245, irradiance: 1720 },
    { city: "Muğla",        lat: 37.2153, lng: 28.3636, irradiance: 1700 },
    { city: "Nevşehir",     lat: 38.6244, lng: 34.7144, irradiance: 1550 },
    { city: "Ordu",         lat: 40.9839, lng: 37.8764, irradiance: 1100 },
    { city: "Rize",         lat: 41.0201, lng: 40.5234, irradiance: 1000 },
    { city: "Sakarya",      lat: 40.7569, lng: 30.3783, irradiance: 1300 },
    { city: "Samsun",       lat: 41.2867, lng: 36.3300, irradiance: 1200 },
    { city: "Siirt",        lat: 37.9333, lng: 41.9500, irradiance: 1650 },
    { city: "Sinop",        lat: 42.0231, lng: 35.1531, irradiance: 1150 },
    { city: "Sivas",        lat: 39.7477, lng: 37.0179, irradiance: 1500 },
    { city: "Şanlıurfa",    lat: 37.1591, lng: 38.7969, irradiance: 1780 },
    { city: "Tekirdağ",     lat: 40.9833, lng: 27.5167, irradiance: 1350 },
    { city: "Trabzon",      lat: 41.0027, lng: 39.7168, irradiance: 1100 },
    { city: "Van",          lat: 38.4891, lng: 43.4089, irradiance: 1650 },
    { city: "Yozgat",       lat: 39.8181, lng: 34.8147, irradiance: 1450 },
    { city: "Zonguldak",    lat: 41.4564, lng: 31.7987, irradiance: 1200 }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1) Şehirleri yükle
    fetch('cities.json')
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(jsonCities => {
            const cities = jsonCities.map(item => {
                const fallback = fallbackCities.find(f => f.city === item.city) || {};
                return {
                    city: item.city ?? fallback.city,
                    lat:  item.lat  ?? fallback.lat,
                    lng:  item.lng  ?? fallback.lng,
                    irradiance: item.irradiance ?? fallback.irradiance
                };
            }).filter(c => typeof c.lat === 'number' && typeof c.lng === 'number');
            initApp(cities.length ? cities : fallbackCities);
        })
        .catch(err => {
            initApp(fallbackCities);
        });
    
    // 2) İletişim sayfasından gelen mesajları kontrol et
    checkUrlParamsForContact();
});

function initApp(cities) {
    populateCitySelect(cities);
    setupEventListeners(cities);
    setupMapInteractions(cities);
    setupScrollAnimations();
    
    // --- AKILLI HAFIZA KONTROLÜ ---
    // Eğer sayfa Navigation (Menü) tıklamasıyla açıldıysa verileri temizle
    // Bunu anlamak için URL'de bir parametre olup olmadığına bakabiliriz veya
    // navigationType kontrolü yapabiliriz.
    
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].type === "back_forward") {
        // Geri tuşuyla gelindiyse verileri yükle
        restoreSavedData();
    } else {
        // Normal açılışta temizle (Eğer başka sayfadan yönlendirme ile gelmediysek)
        // Kullanıcı menüden tıkladıysa localStorage'ı temizleyelim
        // Ancak bu her yenilemede siler. O yüzden şöyle yapıyoruz:
        
        // Eğer sessionStorage'da "keepData" bayrağı yoksa temizle
        if (!sessionStorage.getItem('keepData')) {
            localStorage.removeItem('visu_data');
            localStorage.removeItem('visu_has_calc');
        }
        
        // Veri varsa yükle (Yukarıda silinmediyse)
        restoreSavedData();
        
        // İşimiz bitince bayrağı kaldır ki bir dahaki sefere menüden gelirse temizlensin
        sessionStorage.removeItem('keepData');
    }
}

// --- ŞEHİR SEÇİMİ ---
function populateCitySelect(cities) {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;

    const sorted = [...cities].sort((a, b) => a.city.localeCompare(b.city));
    sorted.forEach(item => {
        const option = document.createElement('option');
        option.value = item.city;
        option.textContent = item.city;
        citySelect.appendChild(option);
    });
}

// --- EVENTLER ---
function setupEventListeners(cities) {
    const form   = document.getElementById('solarForm');
    const burger = document.querySelector('.hamburger');
    const nav    = document.querySelector('.nav-links');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = burger.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateSolarPotential(cities);
        });
    }
    
    // NAVBAR LİNKLERİNE TIKLANINCA VERİYİ SİLME EMRİ
    // Menüdeki "Hesaplama Aracı" linkine tıklanırsa verilerin temizlenmesini istiyoruz.
    const calcLinks = document.querySelectorAll('a[href="calculator.html"]');
    calcLinks.forEach(link => {
        link.addEventListener('click', () => {
            // keepData bayrağını temizle, böylece sayfa açılınca veriler silinsin
            sessionStorage.removeItem('keepData');
        });
    });
}

// --- HARİTA & POPUP ---
function setupMapInteractions(cities) {
    const mapElement = document.getElementById('solar-map');
    if (!mapElement || typeof L === 'undefined') return;

    const map = L.map('solar-map').setView([39.0, 35.5], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color:#0ea5a4;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 10px #0ea5a4;"></div>`,
        iconSize: [20, 20]
    });

    cities.forEach(data => {
        if (typeof data.lat !== 'number' || typeof data.lng !== 'number') return;
        const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(map);
        
        const popupContent = `
            <div class="popup-content">
                <h3 style="margin:0;color:#0ea5a4">${data.city}</h3>
                <p style="margin:5px 0 10px;color:#ddd">Işınım: <strong>${data.irradiance} kWh</strong></p>
                <button class="popup-btn" onclick="selectCityFromMap('${data.city}')" style="border:none;cursor:pointer;width:100%;background:#0ea5a4;color:white;padding:5px;border-radius:4px;">
                    Seç ve Hesapla
                </button>
            </div>`;
        marker.bindPopup(popupContent);
    });
}

window.selectCityFromMap = function (cityName) {
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.value = cityName;
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }
};

// --- HESAPLAMA ---
function calculateSolarPotential(cities) {
    const citySelect = document.getElementById('city');
    const areaInput  = document.getElementById('area');
    const effInput   = document.getElementById('efficiency');
    const tiltInput  = document.getElementById('tilt');
    const shadingInput = document.getElementById('shading');

    if (!citySelect || !areaInput) return;

    const city       = citySelect.value;
    const area       = parseFloat(areaInput.value);
    const efficiency = parseFloat(effInput ? effInput.value : 20) / 100;
    const tilt       = parseFloat(tiltInput ? tiltInput.value : 30);
    
    const cityData = cities.find(item => item.city === city);
    if (!cityData) {
        alert("Lütfen bir şehir seçiniz.");
        return;
    }

    if (isNaN(area) || area <= 0) {
        alert("Lütfen geçerli bir çatı alanı giriniz.");
        return;
    }

    let shadingFactor = 1.0;
    if (shadingInput) {
        if (shadingInput.value === 'medium') shadingFactor = 0.85;
        if (shadingInput.value === 'high') shadingFactor = 0.60;
    }

    const tiltFactor = 1 - (Math.abs(tilt - 30) * 0.005);
    const annualKwh  = area * cityData.irradiance * efficiency * tiltFactor * shadingFactor * 0.85;
    const earnings   = annualKwh * 3.5;
    const co2Saved   = annualKwh * 0.6;
    const panelCount = Math.ceil(area / 1.7);
    const costPerPanel = 3000;
    const totalInvestment = panelCount * costPerPanel + (panelCount * 1000);

    updateUI({ annualKwh, earnings, co2Saved, panelCount, totalInvestment });
    drawGraphs(annualKwh, earnings, totalInvestment);
    
    // HESAPLAMA YAPILINCA VERİYİ KAYDET
    saveDataToStorage({
        city, area, efficiency: effInput.value, tilt: tiltInput.value, shading: shadingInput ? shadingInput.value : 'low',
        result_kwh: annualKwh,
        result_earnings: earnings,
        result_cost: totalInvestment,
        result_co2: co2Saved,
        result_panels: panelCount
    });

    const resultCard = document.getElementById('resultCard');
    const successAnim = document.getElementById('successAnim');
    if (resultCard) {
        resultCard.style.opacity = '1';
        resultCard.style.pointerEvents = 'all';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (successAnim) {
        successAnim.style.display = 'block';
        successAnim.play();
    }
}

function updateUI(data) {
    const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
    setText('kwhValue', fmt(data.annualKwh));
    setText('moneyValue', fmt(data.earnings) + " TL");
    setText('co2Value', fmt(data.co2Saved));
    setText('panelCount', data.panelCount);
    setText('systemCost', fmt(data.totalInvestment) + " TL");
    setText('treeValue', fmt(data.co2Saved / 20));
    setText('carValue', fmt(data.annualKwh * 6));
    setText('homeValue', (data.annualKwh / 3000).toFixed(1));
}

function setText(id, val) {
    const el = document.getElementById(id);
    if(el) el.innerText = val;
}

function drawGraphs(annualKwh, annualEarnings, totalCost) {
    const ctxMonthly = document.getElementById('monthlyChart');
    if (ctxMonthly) {
        const weights = [0.05, 0.06, 0.08, 0.10, 0.12, 0.13, 0.14, 0.13, 0.10, 0.06, 0.04, 0.05];
        const data = weights.map(w => Math.round(annualKwh * w));
        if (myChart) myChart.destroy();
        myChart = new Chart(ctxMonthly.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
                datasets: [{
                    label: 'Üretim (kWh)',
                    data: data,
                    backgroundColor: 'rgba(14, 165, 164, 0.7)',
                    borderColor: '#0ea5a4',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc'} },
                    x: { grid: { display: false }, ticks: { color: '#ccc'} }
                }
            }
        });
    }

    const ctxRoi = document.getElementById('roiChart');
    if (ctxRoi) {
        const roiYears = [];
        const cashFlow = [];
        for(let i=0; i<=10; i++) {
            roiYears.push('Yıl ' + i);
            cashFlow.push((annualEarnings * i) - totalCost);
        }
        if (roiChart) roiChart.destroy();
        roiChart = new Chart(ctxRoi.getContext('2d'), {
            type: 'line',
            data: {
                labels: roiYears,
                datasets: [{
                    label: 'Net Kâr / Zarar (TL)',
                    data: cashFlow,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { 
                    y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#ccc'} },
                    x: { ticks: { color: '#ccc'} }
                }
            }
        });
    }
}

// --- HAFIZA YÖNETİMİ ---
function saveDataToStorage(data) {
    localStorage.setItem('visu_data', JSON.stringify(data));
    localStorage.setItem('visu_has_calc', 'true');
}

function restoreSavedData() {
    const hasCalc = localStorage.getItem('visu_has_calc');
    if (hasCalc !== 'true') return;

    const rawData = localStorage.getItem('visu_data');
    if (!rawData) return;
    const data = JSON.parse(rawData);

    const cityEl = document.getElementById('city');
    const areaEl = document.getElementById('area');
    const effEl = document.getElementById('efficiency');
    const tiltEl = document.getElementById('tilt');
    const shadEl = document.getElementById('shading');

    if (cityEl) cityEl.value = data.city;
    if (areaEl) areaEl.value = data.area;
    if (effEl)  effEl.value  = data.efficiency;
    if (tiltEl) tiltEl.value = data.tilt;
    if (shadEl) shadEl.value = data.shading;

    updateUI({
        annualKwh: data.result_kwh,
        earnings: data.result_earnings,
        co2Saved: data.result_co2,
        panelCount: data.result_panels,
        totalInvestment: data.result_cost
    });
    drawGraphs(data.result_kwh, data.result_earnings, data.result_cost);

    const resultCard = document.getElementById('resultCard');
    if (resultCard) {
        resultCard.style.opacity = '1';
        resultCard.style.pointerEvents = 'all';
    }
}

// --- DİĞER FONKSİYONLAR ---
function setupScrollAnimations() {
    const counters = document.querySelectorAll('.counter');
    const section  = document.querySelector('.live-impact-section');
    if (!section || counters.length === 0) return;
    let hasAnimated = false;
    const onScroll = () => {
        if (section.getBoundingClientRect().top < window.innerHeight / 1.3 && !hasAnimated) {
            hasAnimated = true;
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const inc = target / 50;
                const update = () => {
                    count += inc;
                    if (count < target) {
                        counter.innerText = Math.ceil(count).toLocaleString();
                        setTimeout(update, 20);
                    } else counter.innerText = target.toLocaleString();
                };
                update();
            });
            window.removeEventListener('scroll', onScroll);
        }
    };
    window.addEventListener('scroll', onScroll);
}

function checkUrlParamsForContact() {
    const messageBox = document.querySelector('textarea'); 
    if (messageBox) {
        const params = new URLSearchParams(window.location.search);
        const city = params.get('city');
        const kwh = params.get('kwh');
        if (city && kwh) {
            messageBox.value = `Merhaba, ${city} şehrindeki mülküm için sitenizde hesaplama yaptım. Yıllık yaklaşık ${kwh} kWh üretim potansiyelim görünüyor. Süreç hakkında detaylı bilgi almak istiyorum.`;
        }
    }
}

// YÖNLENDİRME YAPARKEN "VERİYİ TUT" DİYORUZ
window.goToOffer = function() {
    // Başka sayfaya giderken verilerin saklanmasını istiyoruz
    sessionStorage.setItem('keepData', 'true');
    
    const city = document.getElementById('city').value;
    const kwhText = document.getElementById('kwhValue').innerText;
    if (!city || kwhText === '0') {
        alert("Lütfen önce hesaplama yapınız.");
        return;
    }
    window.location.href = `contact.html?city=${encodeURIComponent(city)}&kwh=${encodeURIComponent(kwhText)}`;
};

window.goToPaymentPage = function() {
    // Başka sayfaya giderken verilerin saklanmasını istiyoruz
    sessionStorage.setItem('keepData', 'true');
    
    const costText = document.getElementById('systemCost').innerText;
    if (costText === "0" || costText === "") {
        alert("Lütfen önce hesaplama yapınız.");
        return;
    }
    const rawAmount = costText.replace(/\./g, '').replace(/,/g, '').replace(/[^0-9]/g, '');
    window.location.href = `payment.html?amount=${rawAmount}`;
};

// PDF İndir
document.getElementById('downloadBtn')?.addEventListener('click', async () => {
  const resultCard = document.getElementById('resultCard');
  const city = document.getElementById('city')?.value;

  if (!resultCard || !city) {
    alert("Lütfen önce hesaplama yapınız.");
    return;
  }

  // PDF'e girmesin diye gizle
  const hiddenEls = resultCard.querySelectorAll('.pdf-hide');
  hiddenEls.forEach(el => el.style.display = 'none');

  await new Promise(r => requestAnimationFrame(r));

  const canvas = await html2canvas(resultCard, {
    scale: 2,
    backgroundColor: '#0b1220'
  });

  // Geri göster
  hiddenEls.forEach(el => el.style.display = '');

  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 10, pageWidth, imgHeight);
  pdf.save(`VisuEnergy-Rapor-${city}.pdf`);
});


// Tema ve Chat
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeToggle?.classList.replace('fa-sun', 'fa-moon');
}
themeToggle?.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        themeToggle.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});
document.getElementById('chatToggle')?.addEventListener('click', () => {
    document.getElementById('chatWindow').classList.add('active');
    document.querySelector('.notification-dot').style.display = 'none';
});
document.getElementById('closeChat')?.addEventListener('click', () => {
    document.getElementById('chatWindow').classList.remove('active');
});

// --- MODAL (Nasıl Çalışır?) ---
window.openModal = function () {
  const modal = document.getElementById('processModal');
  if (!modal) return;

  modal.classList.add('show');
  document.body.style.overflow = 'hidden'; // arkayı scroll kilitle
};

window.closeModal = function () {
  const modal = document.getElementById('processModal');
  if (!modal) return;

  modal.classList.remove('show');
  document.body.style.overflow = ''; // scroll geri aç
};
function setupFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    // Başlangıçta kapalı olsun
    answer.style.maxHeight = '0px';

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // diğerlerini kapat
      items.forEach(i => {
        i.classList.remove('active');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0px';
      });

      // tıklananı aç/kapat
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// app.js içinde en sona ekle:
document.addEventListener('DOMContentLoaded', () => {
  setupFaqAccordion();
});


// -------------------- CHATBOT (MESAJLAŞMA) --------------------
document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chatToggle");
  const chatWindow = document.getElementById("chatWindow");
  const closeChat  = document.getElementById("closeChat");
  const dot        = document.querySelector(".notification-dot");

  const chatBody  = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendBtn   = document.getElementById("sendBtn");

  // Bu sayfada chat yoksa çık (diğer sayfalarda hata vermesin)
  if (!chatWindow || !chatBody || !chatInput || !sendBtn) return;


  // Mesaj ekleme yardımcıları
  const appendMessage = (text, type = "bot") => {
    const wrap = document.createElement("div");
    wrap.className = `message ${type === "user" ? "user-msg" : "bot-msg"}`;
    wrap.innerHTML = `<p>${text}</p>`;
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  const botReply = (text) => {
    // minik gecikme daha doğal
    setTimeout(() => appendMessage(text, "bot"), 350);
  };

  // Basit bot cevapları
  const getBotAnswer = (msg) => {
    const m = msg.toLowerCase();

    if (m.includes("fiyat")) {
      return "Fiyatlar; çatı alanı, panel sayısı ve inverter seçimine göre değişir. Hesaplama Aracı’nda çıktı aldıktan sonra ‘Bilgi Al’ ile teklif isteyebilirsin.";
    }
    if (m.includes("amortisman") || m.includes("geri dönüş") || m.includes("roi")) {
      return "Türkiye’de ortalama amortisman genelde 4–6 yıl bandındadır. Senin için en net süre, Hesaplama Aracı’ndaki yıllık kazanç ve yatırım tutarına göre hesaplanır.";
    }
    if (m.includes("çat") || m.includes("uygun")) {
      return "Çatının uygunluğu; şehir, alan, eğim ve gölgelenmeye bağlı. Hesaplama Aracı’nda bilgileri girersen yıllık üretimi ve panel sayısını gösterebilirim.";
    }

    return "Daha fazlası için iletişim sayfasından ekibimize ulaşabilirsin.";
  };

  // Gönderme fonksiyonu
  const sendMessage = (text) => {
    const msg = (text ?? chatInput.value).trim();
    if (!msg) return;

    appendMessage(msg, "user");
    chatInput.value = "";
    botReply(getBotAnswer(msg));
  };

  // Buton ile gönder
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendMessage();
  });

  // Enter ile gönder
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // HTML’deki hızlı butonlar bunu çağırıyor: sendQuickMsg("...")
  window.sendQuickMsg = (text) => {
    // chat kapalıysa aç
    chatWindow.classList.add("active");
    if (dot) dot.style.display = "none";
    sendMessage(text);
  };
});


