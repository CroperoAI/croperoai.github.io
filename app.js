// Application Data
const appData = {
  "branding": {
    "name": "Cropero AI",
    "tagline": "Smart Agriculture Intelligence",
    "logo": "C🌾",
    "primaryColor": "#2E7D32",
    "secondaryColor": "#FF8F00"
  },
  "languages": [
    {"code": "en", "name": "🇺🇸 English", "flag": "🇺🇸"},
    {"code": "hi", "name": "🇮🇳 हिंदी", "flag": "🇮🇳"},
    {"code": "ta", "name": "🇮🇳 தமிழ்", "flag": "🇮🇳"},
    {"code": "te", "name": "🇮🇳 తెలుగు", "flag": "🇮🇳"},
    {"code": "bn", "name": "🇧🇩 বাংলা", "flag": "🇧🇩"},
    {"code": "gu", "name": "🇮🇳 ગુજરાતી", "flag": "🇮🇳"},
    {"code": "mr", "name": "🇮🇳 मराठी", "flag": "🇮🇳"},
    {"code": "kn", "name": "🇮🇳 ಕನ್ನಡ", "flag": "🇮🇳"},
    {"code": "ml", "name": "🇮🇳 മലയാളം", "flag": "🇮🇳"},
    {"code": "pa", "name": "🇮🇳 ਪੰਜਾਬੀ", "flag": "🇮🇳"},
    {"code": "ur", "name": "🇵🇰 اردو", "flag": "🇵🇰"},
    {"code": "ar", "name": "🇸🇦 العربية", "flag": "🇸🇦"}
  ],
  "crops": {
    "rice": {"name": "🌾 Rice", "varieties": ["Basmati 1121", "IR-64", "Pusa Basmati 1509", "Sona Masuri"]},
    "wheat": {"name": "🌾 Wheat", "varieties": ["HD-2967", "PBW-550", "DBW-88", "HD-3086"]},
    "maize": {"name": "🌽 Maize", "varieties": ["DHM-117", "PMH-1", "Bio-9681", "Pioneer 30V92"]},
    "cotton": {"name": "🌸 Cotton", "varieties": ["Bt-Cotton RCH-134", "Suraj", "Mallika", "Shankar-6"]},
    "sugarcane": {"name": "🎋 Sugarcane", "varieties": ["Co-86032", "Co-0238", "Co-94012", "Co-95020"]},
    "soybean": {"name": "🫘 Soybean", "varieties": ["JS-335", "MACS-450", "MAUS-71", "DS-228"]}
  },
  "aiInsights": [
    {
      "type": "success",
      "icon": "✅",
      "title": "Optimal Growing Conditions Detected",
      "message": "Current weather and soil parameters are ideal for crop development. Yield potential is 22% above regional average."
    },
    {
      "type": "warning", 
      "icon": "⚠️",
      "title": "Irrigation Optimization Opportunity",
      "message": "Schedule next irrigation for early morning (5-7 AM) to maximize water efficiency and reduce evaporation by 35%."
    },
    {
      "type": "info",
      "icon": "💡", 
      "title": "Smart Fertilization Recommendation",
      "message": "Nitrogen levels optimal, but consider phosphorus boost in 2 weeks to enhance grain filling stage."
    }
  ],
  "alerts": [
    {
      "type": "critical",
      "icon": "🌡️",
      "title": "Temperature Alert",
      "message": "High temperature detected (38°C). Consider immediate irrigation and shade protection.",
      "time": "2 min ago"
    },
    {
      "type": "warning",
      "icon": "💧", 
      "title": "Soil Moisture Alert",
      "message": "Soil moisture below 25%. Schedule irrigation within 12 hours.",
      "time": "15 min ago"
    },
    {
      "type": "info",
      "icon": "📊",
      "title": "Weekly Report Ready",
      "message": "Your farm performance analytics report is available for download.",
      "time": "2 hours ago"
    }
  ],
  "popularLocations": [
    {"name": "Punjab (Ludhiana)", "crops": "Wheat, Rice, Cotton", "coordinates": [30.9, 75.8]},
    {"name": "Maharashtra (Pune)", "crops": "Sugarcane, Cotton, Soybean", "coordinates": [18.5, 73.9]},
    {"name": "Tamil Nadu (Coimbatore)", "crops": "Cotton, Coconut, Maize", "coordinates": [11.0, 77.0]},
    {"name": "Karnataka (Bangalore)", "crops": "Ragi, Coffee, Sugarcane", "coordinates": [12.9, 77.6]},
    {"name": "Andhra Pradesh (Guntur)", "crops": "Chili, Cotton, Rice", "coordinates": [16.3, 80.4]},
    {"name": "Gujarat (Ahmedabad)", "crops": "Cotton, Groundnut, Wheat", "coordinates": [23.0, 72.6]}
  ]
};

// Global variables
let currentLanguage = 'en';
let currentLocation = 'Punjab (Ludhiana)';
let isDarkMode = false;
let currentStep = 1;
let predictionData = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  // Show loading screen for 2 seconds
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    initializeApp();
  }, 2000);
});

function initializeApp() {
  setupEventListeners();
  populateInsights();
  populateAlerts();
  populateLanguages();
  populateLocations();
  initializeCharts();
  setupWizard();
  
  // Set default dates
  const today = new Date();
  const plantingDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const harvestDate = new Date(today.getTime() + 65 * 24 * 60 * 60 * 1000);
  
  document.getElementById('planting-date').value = plantingDate.toISOString().split('T')[0];
  document.getElementById('harvest-date').value = harvestDate.toISOString().split('T')[0];
}

function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const section = e.target.dataset.section;
      switchSection(section);
    });
  });

  // Header controls
  document.getElementById('language-btn').addEventListener('click', () => {
    document.getElementById('language-modal').classList.remove('hidden');
  });

  document.getElementById('location-btn').addEventListener('click', () => {
    document.getElementById('location-modal').classList.remove('hidden');
  });

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Modal close buttons
  document.querySelectorAll('.modal-close, .modal-backdrop').forEach(element => {
    element.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-backdrop')) {
        e.target.closest('.modal').classList.add('hidden');
      }
    });
  });

  // Quick actions
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.dataset.action;
      handleQuickAction(action);
    });
  });

  // Detect location button
  document.getElementById('detect-location').addEventListener('click', detectLocation);

  // Auto-detect soil button
  document.getElementById('auto-detect-soil').addEventListener('click', autoDetectSoil);

  // Sync weather button
  document.getElementById('sync-weather').addEventListener('click', syncWeather);

  // Crop type change
  document.getElementById('crop-type').addEventListener('change', (e) => {
    populateVarieties(e.target.value);
  });

  // pH range slider
  document.getElementById('soil-ph').addEventListener('input', (e) => {
    document.getElementById('ph-value').textContent = e.target.value;
  });
}

function switchSection(section) {
  // Update navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector(`[data-section="${section}"]`).classList.add('active');

  // Update sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });
  document.getElementById(`${section}-section`).classList.add('active');
}

function populateInsights() {
  const insightsGrid = document.getElementById('insights-grid');
  insightsGrid.innerHTML = '';

  appData.aiInsights.forEach(insight => {
    const insightCard = document.createElement('div');
    insightCard.className = `insight-card ${insight.type}`;
    insightCard.innerHTML = `
      <div class="insight-icon">${insight.icon}</div>
      <div class="insight-content">
        <h4>${insight.title}</h4>
        <p>${insight.message}</p>
      </div>
    `;
    insightsGrid.appendChild(insightCard);
  });
}

function populateAlerts() {
  const alertsList = document.getElementById('alerts-list');
  alertsList.innerHTML = '';

  appData.alerts.forEach(alert => {
    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${alert.type}`;
    alertItem.innerHTML = `
      <div class="alert-icon">${alert.icon}</div>
      <div class="alert-content">
        <h4>${alert.title}</h4>
        <p>${alert.message}</p>
      </div>
      <div class="alert-time">${alert.time}</div>
    `;
    alertsList.appendChild(alertItem);
  });
}

function populateLanguages() {
  const languageGrid = document.getElementById('language-grid');
  languageGrid.innerHTML = '';

  appData.languages.forEach(lang => {
    const langItem = document.createElement('div');
    langItem.className = 'language-item';
    langItem.innerHTML = `
      <div class="language-flag">${lang.flag}</div>
      <div class="language-name">${lang.name}</div>
    `;
    langItem.addEventListener('click', () => {
      selectLanguage(lang);
    });
    languageGrid.appendChild(langItem);
  });
}

function populateLocations() {
  const locationsGrid = document.getElementById('popular-locations');
  locationsGrid.innerHTML = '';

  appData.popularLocations.forEach(location => {
    const locationItem = document.createElement('div');
    locationItem.className = 'location-item';
    locationItem.innerHTML = `
      <div class="location-name">${location.name}</div>
      <div class="location-crops">${location.crops}</div>
    `;
    locationItem.addEventListener('click', () => {
      selectLocation(location);
    });
    locationsGrid.appendChild(locationItem);
  });
}

function selectLanguage(lang) {
  currentLanguage = lang.code;
  document.getElementById('current-language').textContent = lang.flag;
  document.getElementById('language-modal').classList.add('hidden');
  showToast('success', `Language changed to ${lang.name}`);
}

function selectLocation(location) {
  currentLocation = location.name;
  document.getElementById('location-modal').classList.add('hidden');
  showToast('success', `Location set to ${location.name}`);
}

function detectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        showToast('success', `Location detected: ${lat.toFixed(2)}, ${lon.toFixed(2)}`);
        document.getElementById('location-modal').classList.add('hidden');
      },
      (error) => {
        showToast('error', 'Unable to detect location. Please select manually.');
      }
    );
  } else {
    showToast('error', 'Geolocation is not supported by this browser.');
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.setAttribute('data-color-scheme', isDarkMode ? 'dark' : 'light');
  document.getElementById('theme-toggle').textContent = isDarkMode ? '☀️' : '🌙';
  showToast('success', `Switched to ${isDarkMode ? 'dark' : 'light'} mode`);
}

function handleQuickAction(action) {
  switch(action) {
    case 'predict':
      switchSection('prediction');
      break;
    case 'monitor':
      switchSection('monitoring');
      break;
    case 'tips':
      switchSection('recommendations');
      break;
    case 'report':
      showToast('info', 'Generating comprehensive farm report...');
      break;
  }
}

function showToast(type, message) {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

function initializeCharts() {
  // Yield Forecast Chart
  const yieldCtx = document.getElementById('yield-chart').getContext('2d');
  new Chart(yieldCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Predicted Yield (tons/ha)',
        data: [0.5, 1.2, 2.1, 3.2, 4.1, 4.8],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Yield (tons/ha)'
          }
        }
      }
    }
  });

  // Weather Impact Chart
  const weatherCtx = document.getElementById('weather-chart').getContext('2d');
  new Chart(weatherCtx, {
    type: 'bar',
    data: {
      labels: ['Temperature', 'Rainfall', 'Humidity', 'Wind', 'Solar Radiation'],
      datasets: [{
        label: 'Impact Score',
        data: [85, 92, 78, 65, 88],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Impact Score (%)'
          }
        }
      }
    }
  });

  // Trends Chart for Monitoring
  const trendsCtx = document.getElementById('trends-chart').getContext('2d');
  new Chart(trendsCtx, {
    type: 'line',
    data: {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      datasets: [{
        label: 'Temperature (°C)',
        data: [22, 20, 24, 32, 35, 30, 25],
        borderColor: '#DB4545',
        backgroundColor: 'rgba(219, 69, 69, 0.1)',
        yAxisID: 'y'
      }, {
        label: 'Humidity (%)',
        data: [80, 85, 75, 60, 45, 55, 70],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        yAxisID: 'y1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Humidity (%)'
          },
          grid: {
            drawOnChartArea: false,
          },
        }
      }
    }
  });
}

// Prediction Wizard Functions
function setupWizard() {
  document.getElementById('next-step').addEventListener('click', nextStep);
  document.getElementById('prev-step').addEventListener('click', prevStep);
  document.getElementById('generate-prediction').addEventListener('click', generatePrediction);
}

function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < 4) {
      currentStep++;
      updateWizard();
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateWizard();
  }
}

function updateWizard() {
  // Update progress steps
  document.querySelectorAll('.step').forEach((step, index) => {
    step.classList.remove('active', 'completed');
    if (index + 1 < currentStep) {
      step.classList.add('completed');
    } else if (index + 1 === currentStep) {
      step.classList.add('active');
    }
  });

  // Update wizard steps
  document.querySelectorAll('.wizard-step').forEach((step, index) => {
    step.classList.remove('active');
    if (index + 1 === currentStep) {
      step.classList.add('active');
    }
  });

  // Update navigation buttons
  document.getElementById('prev-step').style.display = currentStep > 1 ? 'block' : 'none';
  document.getElementById('next-step').style.display = currentStep < 4 ? 'block' : 'none';
  document.getElementById('generate-prediction').style.display = currentStep === 4 ? 'block' : 'none';
}

function validateStep(step) {
  let isValid = true;
  let requiredFields = [];

  switch(step) {
    case 1:
      requiredFields = ['crop-type', 'crop-variety', 'farm-area', 'planting-date', 'harvest-date', 'farming-type'];
      break;
    case 2:
      requiredFields = ['soil-moisture', 'soil-nitrogen', 'soil-phosphorus', 'soil-potassium', 'organic-matter'];
      break;
    case 3:
      requiredFields = ['irrigation-system', 'water-source', 'fertilizer-usage', 'pest-history'];
      break;
    case 4:
      requiredFields = ['climate-zone', 'avg-rainfall', 'field-slope', 'drainage-quality'];
      break;
  }

  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (!field.value.trim()) {
      field.style.borderColor = 'var(--color-error)';
      isValid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!isValid) {
    showToast('error', 'Please fill in all required fields');
  }

  return isValid;
}

function populateVarieties(cropType) {
  const varietySelect = document.getElementById('crop-variety');
  varietySelect.innerHTML = '<option value="">Select Variety</option>';

  if (cropType && appData.crops[cropType]) {
    appData.crops[cropType].varieties.forEach(variety => {
      const option = document.createElement('option');
      option.value = variety;
      option.textContent = variety;
      varietySelect.appendChild(option);
    });
  }
}

function autoDetectSoil() {
  // Simulate soil detection with mock data
  showToast('info', 'Detecting soil parameters based on your location...');
  
  setTimeout(() => {
    document.getElementById('soil-ph').value = '6.8';
    document.getElementById('ph-value').textContent = '6.8';
    document.getElementById('soil-moisture').value = '42';
    document.getElementById('soil-nitrogen').value = '135';
    document.getElementById('soil-phosphorus').value = '68';
    document.getElementById('soil-potassium').value = '45';
    document.getElementById('organic-matter').value = '3.2';
    
    showToast('success', 'Soil parameters detected successfully!');
  }, 2000);
}

function syncWeather() {
  showToast('info', 'Syncing weather data...');
  
  setTimeout(() => {
    showToast('success', 'Weather data synchronized successfully!');
  }, 1500);
}

function generatePrediction() {
  if (validateStep(4)) {
    // Collect all form data
    predictionData = {
      cropType: document.getElementById('crop-type').value,
      cropVariety: document.getElementById('crop-variety').value,
      farmArea: parseFloat(document.getElementById('farm-area').value),
      plantingDate: document.getElementById('planting-date').value,
      harvestDate: document.getElementById('harvest-date').value,
      farmingType: document.getElementById('farming-type').value,
      soilPh: parseFloat(document.getElementById('soil-ph').value),
      soilMoisture: parseFloat(document.getElementById('soil-moisture').value),
      soilNitrogen: parseFloat(document.getElementById('soil-nitrogen').value),
      soilPhosphorus: parseFloat(document.getElementById('soil-phosphorus').value),
      soilPotassium: parseFloat(document.getElementById('soil-potassium').value),
      organicMatter: parseFloat(document.getElementById('organic-matter').value),
      irrigationSystem: document.getElementById('irrigation-system').value,
      waterSource: document.getElementById('water-source').value,
      fertilizerUsage: document.getElementById('fertilizer-usage').value,
      pestHistory: document.getElementById('pest-history').value,
      previousYield: parseFloat(document.getElementById('previous-yield').value) || 0,
      climateZone: document.getElementById('climate-zone').value,
      avgRainfall: parseFloat(document.getElementById('avg-rainfall').value),
      fieldSlope: document.getElementById('field-slope').value,
      drainageQuality: document.getElementById('drainage-quality').value
    };

    showToast('info', 'Generating AI prediction...');
    
    // Simulate AI processing
    setTimeout(() => {
      document.querySelector('.prediction-wizard').style.display = 'none';
      document.getElementById('prediction-results').classList.remove('hidden');
      
      // Update results based on input data
      updatePredictionResults();
      showToast('success', 'AI prediction generated successfully!');
    }, 3000);
  }
}

function updatePredictionResults() {
  // Calculate dynamic results based on input data
  const baseYield = 4.0;
  let yieldMultiplier = 1.0;
  
  // Factors that affect yield
  if (predictionData.soilPh >= 6.0 && predictionData.soilPh <= 7.5) yieldMultiplier += 0.1;
  if (predictionData.soilMoisture >= 40) yieldMultiplier += 0.05;
  if (predictionData.organicMatter >= 3.0) yieldMultiplier += 0.08;
  if (predictionData.irrigationSystem === 'drip') yieldMultiplier += 0.12;
  if (predictionData.fertilizerUsage === 'mixed') yieldMultiplier += 0.06;
  if (predictionData.drainageQuality === 'excellent') yieldMultiplier += 0.04;
  
  const predictedYield = (baseYield * yieldMultiplier).toFixed(1);
  const totalYield = (predictedYield * predictionData.farmArea).toFixed(1);
  const revenue = Math.round(totalYield * 28000);
  
  // Update result cards
  document.querySelector('.result-card .result-value').textContent = `${predictedYield} tons/ha`;
  document.querySelector('.result-card .result-detail').textContent = `Total: ${totalYield} tons`;
  
  const revenueCard = document.querySelectorAll('.result-card')[1];
  revenueCard.querySelector('.result-value').textContent = `₹${revenue.toLocaleString('en-IN')}`;
  revenueCard.querySelector('.result-detail').textContent = `₹28,000 per ton`;
}

// Initialize some dynamic content updates
setInterval(() => {
  // Update time-based elements
  const timeElements = document.querySelectorAll('[data-live-time]');
  timeElements.forEach(element => {
    const now = new Date();
    element.textContent = now.toLocaleTimeString();
  });
}, 1000);

// Simulate live data updates for monitoring
setInterval(() => {
  const monitorValues = document.querySelectorAll('.monitor-value');
  monitorValues.forEach((value, index) => {
    const current = parseFloat(value.textContent);
    const variation = (Math.random() - 0.5) * 2; // ±1 unit variation
    const newValue = Math.max(0, current + variation);
    
    switch(index) {
      case 0: // Temperature
        value.textContent = `${Math.round(newValue)}°C`;
        break;
      case 1: // Humidity
        value.textContent = `${Math.round(newValue)}%`;
        break;
      case 2: // Soil Moisture
        value.textContent = `${Math.round(newValue)}%`;
        break;
      case 3: // Solar Radiation
        value.textContent = `${Math.round(newValue)} W/m²`;
        break;
    }
  });
}, 10000); // Update every 10 seconds

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
