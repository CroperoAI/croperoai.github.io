//**
 * ===================================================================
 * AGRITECH AI PLATFORM - UNIFIED JAVASCRIPT
 * Author: Gemini AI
 * Version: 1.0.0
 * ===================================================================
 * CONTENTS
 * 1. AgriTechApp (Main Controller)
 * 2. TranslationService
 * 3. CropYieldPredictor
 * 4. PlantDiseaseAI
 * 5. AIMarketAnalytics
 * 6. Initialization
 * ===================================================================
 */

// 1. MAIN APP CONTROLLER
class AgriTechApp {
    constructor() {
        this.currentLanguage = 'en';
        this.activePage = 'yield';
        this.initTheme();
        this.setupEventListeners();
        
        this.translationService = new TranslationService();
        this.yieldPredictor = new CropYieldPredictor(this.translationService);
        this.diseaseDetector = new PlantDiseaseAI(this.translationService);
        this.marketAnalytics = new AIMarketAnalytics(this.translationService);

        this.showPage(this.activePage);
        this.changeLanguage(this.currentLanguage);
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeIcon();
    }
    
    updateThemeIcon() {
        const themeIcon = document.querySelector('#theme-toggle i');
        if (this.theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    setupEventListeners() {
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('languageSelect').addEventListener('change', (e) => this.changeLanguage(e.target.value));
        
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = e.currentTarget.dataset.page;
                this.showPage(pageId);
                
                document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    showPage(pageId) {
        this.activePage = pageId;
        document.querySelectorAll('.page-content').forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageId}-page`).classList.add('active');
        
        const pageTitleKey = this.translationService.getPageTitleKey(pageId);
        document.getElementById('pageTitle').setAttribute('data-translate', pageTitleKey);
        this.translatePage();
    }

    changeLanguage(langCode) {
        this.currentLanguage = langCode;
        this.translationService.currentLanguage = langCode;
        this.translatePage();
    }
    
    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            const translation = this.translationService.translate(key);
            if(translation) el.textContent = translation;
        });

        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            const translation = this.translationService.translate(key);
            if(translation) el.placeholder = translation;
        });
        
        // Re-translate dynamic content if needed
        if(this.yieldPredictor) this.yieldPredictor.retranslateDynamicContent();
    }
}

// 2. TRANSLATION SERVICE
class TranslationService {
    constructor() {
        this.currentLanguage = 'en';
        // Merged translations from all three modules
        this.translations = {
            en: {
                main_title: "AgriTech AI Platform", main_title_short: "AgriTech AI",
                yield_prediction_nav: "Yield Prediction", disease_detection_nav: "Disease Detection", market_analytics_nav: "Market Analytics",
                // YIELD
                yield_prediction_title: "🌾 AI Crop Yield Prediction", crop_selection: "Crop Selection", location_weather: "Location & Weather", soil_parameters: "Soil Parameters", farm_details: "Farm Details", ai_prediction: "AI Prediction",
                crop_selection_title: "🌾 Crop Selection", crop_selection_desc: "Select your crop category, type, variety and planting season", crop_category: "Crop Category", select_category: "Select Category",
                cereals: "Cereals", pulses: "Pulses", oilseeds: "Oilseeds", cash_crops: "Cash Crops", vegetables: "Vegetables", fruits: "Fruits", spices: "Spices",
                crop_type: "Crop Type", select_type: "Select Type", crop_variety: "Crop Variety", select_variety: "Select Variety", planting_season: "Planting Season",
                kharif: "Kharif (Jun-Oct)", rabi: "Rabi (Nov-Apr)", zaid: "Zaid (Mar-Jun)", crop_information: "Crop Information",
                location_weather_title: "📍 Location & Weather", location_weather_desc: "GPS location detection with live weather data", detect_location: "📡 Detect GPS Location", manual_location: "🗺️ Manual Selection",
                current_location: "Current Location", coordinates: "Coordinates", address: "Address", weather_data: "Weather Data", temperature: "Temperature", humidity: "Humidity", rainfall: "Rainfall", wind_speed: "Wind Speed",
                soil_parameters_title: "🌱 Soil Parameters", soil_parameters_desc: "IoT sensor data or manual soil parameter input", iot_sensors: "📡 IoT Sensors", manual_input: "✏️ Manual Input",
                sensors_connected: "📡 IoT Sensors Connected", soil_ph: "pH Level", nitrogen: "Nitrogen (N)", phosphorus: "Phosphorus (P)", potassium: "Potassium (K)",
                fertilizer_recommendations: "Fertilizer Recommendations",
                farm_details_title: "🚜 Farm Details", farm_details_desc: "Farm area, irrigation system and management practices", farm_area: "Farm Area", hectare: "Hectare", acre: "Acre",
                irrigation_system: "Irrigation System", select_irrigation: "Select System", drip_irrigation: "Drip Irrigation", sprinkler_irrigation: "Sprinkler", flood_irrigation: "Flood Irrigation", furrow_irrigation: "Furrow", rainfed: "Rain-fed",
                previous_crop: "Previous Crop", enter_previous_crop: "Enter previous crop", farm_management: "Management Practice", select_management: "Select Practice",
                organic: "Organic", conventional: "Conventional", integrated: "Integrated", precision: "Precision Farming", economic_parameters: "Economic Parameters",
                seed_cost: "Seed Cost (₹/ha)", fertilizer_cost: "Fertilizer Cost (₹/ha)", labor_cost: "Labor Cost (₹/ha)", irrigation_cost: "Irrigation Cost (₹/ha)",
                ai_prediction_title: "🤖 AI Prediction", ai_prediction_desc: "Generate comprehensive yield prediction with economic analysis", generate_prediction: "🔮 Generate AI Prediction",
                prediction_results: "Prediction Results", confidence: "Confidence", predicted_yield: "Predicted Yield", estimated_revenue: "Estimated Revenue", profit_margin: "Profit Margin", risk_assessment: "Risk Level",
                recommendations: "Recommendations", download_report: "📄 Download Report", save_prediction: "💾 Save Prediction", generating_prediction: "Generating AI prediction...",
                risk_low: "Low", risk_medium: "Medium", risk_high: "High", prediction_saved: "Prediction saved successfully!",
                // DISEASE
                disease_detection_title: "🔬 AI Plant Disease Detection", disease_upload_title: "📸 Upload Crop Image for Analysis", disease_supported_formats: "Supports: JPG, PNG, WebP | Max: 10MB",
                disease_upload_heading: "Upload or Capture Crop Image", disease_upload_desc: "Drag & drop an image here or click to select from device", disease_select_file: "Select File", disease_use_camera: "Use Camera",
                disease_remove: "Remove", disease_start_analysis: "Start AI Disease Analysis", disease_analysis_progress: "AI Disease Analysis in Progress...", disease_initializing: "Initializing computer vision algorithms...",
                disease_results_title: "🔬 AI Analysis Results", disease_analysis_time: "Analysis completed in 3.2 seconds", disease_treatment_title: "💊 Comprehensive Treatment Recommendations",
                chemical: "Chemical", biological: "Biological", integrated_pest_management: "Integrated", disease_cost_calculator_title: "💰 Treatment Cost Calculator",
                disease_find_dealers: "Find Nearby Dealers", disease_consult_expert: "Consult Expert", disease_analyze_another: "Analyze Another Image", disease_details: "Disease Details",
                // MARKET
                market_analytics_title: "📊 AI Market Analytics", market_overview: "Market Overview", price_predictions: "Price Predictions", technical_analytics: "Technical Analytics", price_alerts: "Price Alerts", ai_insights: "AI Insights",
                market_summary: "Market Summary", total_markets: "Total Markets", new_today: "New Today", active_crops: "Active Crops", ai_accuracy: "AI Accuracy", daily_volume: "Daily Volume",
                top_performers: "Top Performers", top_gainers: "Top Gainers", top_losers: "Top Losers", high_volume: "High Volume", live_market_prices: "Live Market Prices",
            },
            hi: {
                main_title: "एग्रीटेक एआई प्लेटफॉर्म", main_title_short: "एग्रीटेक एआई",
                yield_prediction_nav: "उपज भविष्यवाणी", disease_detection_nav: "रोग पहचान", market_analytics_nav: "बाजार विश्लेषण",
                // YIELD
                yield_prediction_title: "🌾 AI फसल उत्पादन पूर्वानुमान", crop_selection: "फसल चयन", location_weather: "स्थान और मौसम", soil_parameters: "मिट्टी पैरामीटर", farm_details: "खेत विवरण", ai_prediction: "AI पूर्वानुमान",
                crop_selection_title: "🌾 फसल चयन", crop_selection_desc: "अपनी फसल श्रेणी, प्रकार, किस्म और बुआई का मौसम चुनें", crop_category: "फसल श्रेणी", select_category: "श्रेणी चुनें",
                cereals: "अनाज", pulses: "दालें", oilseeds: "तिलहन", cash_crops: "नकदी फसलें", vegetables: "सब्जियाँ", fruits: "फल", spices: "मसाले",
                crop_type: "फसल प्रकार", select_type: "प्रकार चुनें", crop_variety: "फसल किस्म", select_variety: "किस्म चुनें", planting_season: "बुआई का मौसम",
                kharif: "खरीफ (जून-अक्टूबर)", rabi: "रबी (नवंबर-अप्रैल)", zaid: "जायद (मार्च-जून)", crop_information: "फसल जानकारी",
                location_weather_title: "📍 स्थान और मौसम", location_weather_desc: "GPS स्थान पहचान के साथ लाइव मौसम डेटा", detect_location: "📡 GPS स्थान पहचानें", manual_location: "🗺️ मैनुअल चयन",
                current_location: "वर्तमान स्थान", coordinates: "निर्देशांक", address: "पता", weather_data: "मौसम डेटा", temperature: "तापमान", humidity: "नमी", rainfall: "वर्षा", wind_speed: "हवा की गति",
                soil_parameters_title: "🌱 मिट्टी पैरामीटर", soil_parameters_desc: "IoT सेंसर डेटा या मैनुअल मिट्टी पैरामीटर इनपुट", iot_sensors: "📡 IoT सेंसर", manual_input: "✏️ मैनुअल इनपुट",
                sensors_connected: "📡 IoT सेंसर जुड़े हुए", soil_ph: "pH स्तर", nitrogen: "नाइट्रोजन (N)", phosphorus: "फास्फोरस (P)", potassium: "पोटेशियम (K)",
                fertilizer_recommendations: "उर्वरक सिफारिशें",
                farm_details_title: "🚜 खेत विवरण", farm_details_desc: "खेत क्षेत्र, सिंचाई प्रणाली और प्रबंधन प्रथाएं", farm_area: "खेत क्षेत्र", hectare: "हेक्टेयर", acre: "एकड़",
                ai_prediction_desc: "आर्थिक विश्लेषण के साथ व्यापक उत्पादन पूर्वानुमान उत्पन्न करें", generate_prediction: "🔮 AI पूर्वानुमान उत्पन्न करें", prediction_results: "पूर्वानुमान परिणाम", confidence: "आत्मविश्वास",
                predicted_yield: "अनुमानित उत्पादन", estimated_revenue: "अनुमानित आय", profit_margin: "लाभ मार्जिन", risk_assessment: "जोखिम स्तर", recommendations: "सिफारिशें",
                download_report: "📄 रिपोर्ट डाउनलोड करें", save_prediction: "💾 पूर्वानुमान सेव करें", generating_prediction: "AI पूर्वानुमान उत्पन्न कर रहे हैं...",
                risk_low: "कम", risk_medium: "मध्यम", risk_high: "उच्च",
                // DISEASE
                disease_detection_title: "🔬 AI पादप रोग पहचान", disease_upload_title: "📸 विश्लेषण के लिए फसल की छवि अपलोड करें", disease_supported_formats: "समर्थन: JPG, PNG, WebP | अधिकतम: 10MB",
                disease_upload_heading: "फसल की छवि अपलोड करें या कैप्चर करें", disease_upload_desc: "यहां एक छवि खींचें और छोड़ें या डिवाइस से चुनें", disease_select_file: "फ़ाइल चुनें", disease_use_camera: "कैमरे का उपयोग करें",
                disease_start_analysis: "AI रोग विश्लेषण शुरू करें", disease_analysis_progress: "AI रोग विश्लेषण प्रगति पर है...", disease_results_title: "🔬 AI विश्लेषण परिणाम",
                chemical: "रासायनिक", biological: "जैविक", integrated_pest_management: "एकीकृत",
                // MARKET
                market_analytics_title: "📊 AI बाजार विश्लेषण", market_overview: "बाजार अवलोकन", price_predictions: "मूल्य पूर्वानुमान", technical_analytics: "तकनीकी विश्लेषण", price_alerts: "मूल्य अलर्ट", ai_insights: "AI अंतर्दृष्टि",
            },
            // ... Other languages can be added here in the same structure
        };
    }

    translate(key) {
        return this.translations[this.currentLanguage]?.[key] || this.translations.en[key] || key;
    }

    getPageTitleKey(pageId) {
        const titleMap = {
            yield: 'yield_prediction_title',
            disease: 'disease_detection_title',
            market: 'market_analytics_title'
        };
        return titleMap[pageId] || 'main_title';
    }
}

// 3. CROP YIELD PREDICTOR MODULE
class CropYieldPredictor {
    constructor(translationService) {
        this.translator = translationService;
        this.formData = {};
        this.cropDatabase = this.initializeCropDatabase();
        this.setupEventListeners();
    }
    
    initializeCropDatabase() {
        return {
            cereals: {
                rice: { varieties: ["Basmati-370", "IR-64", "Swarna", "Pusa-1121"], npk: [120, 60, 60] },
                wheat: { varieties: ["HD-2967", "PBW-343", "DBW-173", "WH-1105"], npk: [150, 60, 40] },
                maize: { varieties: ["Pioneer-3396", "DEKALB-900M", "NK-30", "Hishell"], npk: [180, 80, 80] },
            },
            pulses: {
                chickpea: { varieties: ["Pusa-256", "JG-130", "Avarodhi"], npk: [20, 60, 20] },
                pigeon_pea: { varieties: ["Pusa-992", "Bahar", "NDA-1"], npk: [20, 40, 20] },
            },
            oilseeds: {
                mustard: { varieties: ["Pusa Bold", "RH-30", "Ganga"], npk: [80, 40, 40] },
                groundnut: { varieties: ["TG-37A", "Kadiri-6", "Girnar-3"], npk: [25, 50, 75] },
            },
            vegetables: {
                tomato: { varieties: ["Pusa Ruby", "Arka Rakshak", "Heemsohna"], npk: [150, 80, 80] },
                potato: { varieties: ["Kufri Chipsona", "Kufri Jyoti", "Kufri Bahar"], npk: [180, 60, 100] },
            },
            // More crops...
        };
    }

    setupEventListeners() {
        // Event listeners specific to the yield predictor UI
        document.getElementById('cropCategory').addEventListener('change', (e) => this.populateCropTypes(e.target.value));
        document.getElementById('cropType').addEventListener('change', (e) => this.populateCropVarieties(e.target.value));
        document.getElementById('generatePrediction').addEventListener('click', () => this.generatePrediction());
        document.querySelectorAll('#manualN, #manualP, #manualK, #cropType').forEach(el => {
            el.addEventListener('change', () => this.generateFertilizerRecs());
        });
        document.getElementById('detectGPS').addEventListener('click', () => this.detectGPSLocation());
    }
    
    populateCropTypes(category) {
        const typeSelect = document.getElementById('cropType');
        typeSelect.innerHTML = `<option value="">${this.translator.translate('select_type')}</option>`;
        if (category && this.cropDatabase[category]) {
            Object.keys(this.cropDatabase[category]).forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
                typeSelect.appendChild(option);
            });
        }
        typeSelect.disabled = !category;
        document.getElementById('cropVariety').disabled = true;
    }

    populateCropVarieties(type) {
        const category = document.getElementById('cropCategory').value;
        const varietySelect = document.getElementById('cropVariety');
        varietySelect.innerHTML = `<option value="">${this.translator.translate('select_variety')}</option>`;
        if (type && this.cropDatabase[category]?.[type]) {
            this.cropDatabase[category][type].varieties.forEach(variety => {
                const option = document.createElement('option');
                option.value = variety;
                option.textContent = variety;
                varietySelect.appendChild(option);
            });
        }
        varietySelect.disabled = !type;
    }

    detectGPSLocation() {
        const pos = { lat: 11.0168, lon: 76.9558 }; // Coimbatore
        document.getElementById('coordinates').textContent = `${pos.lat.toFixed(4)}°N, ${pos.lon.toFixed(4)}°E`;
        document.getElementById('address').textContent = "Coimbatore, Tamil Nadu, India";
        document.getElementById('locationInfo').style.display = 'block';
        this.loadWeatherData();
    }

    loadWeatherData() {
        document.getElementById('temperature').textContent = `${(28 + Math.random() * 5).toFixed(1)}°C`;
        document.getElementById('humidity').textContent = `${(65 + Math.random() * 15).toFixed(1)}%`;
        document.getElementById('rainfall').textContent = `${(5 + Math.random() * 10).toFixed(1)} mm`;
        document.getElementById('windSpeed').textContent = `${(8 + Math.random() * 7).toFixed(1)} km/h`;
        document.getElementById('weatherInfo').style.display = 'block';
    }

    generateFertilizerRecs() {
        const category = document.getElementById('cropCategory').value;
        const type = document.getElementById('cropType').value;
        if (!category || !type) return;

        const idealNPK = this.cropDatabase[category]?.[type]?.npk;
        if (!idealNPK) return;

        const userN = parseFloat(document.getElementById('manualN').value) || 0;
        const userP = parseFloat(document.getElementById('manualP').value) || 0;
        const userK = parseFloat(document.getElementById('manualK').value) || 0;
        
        const recs = { N: idealNPK[0] - userN, P: idealNPK[1] - userP, K: idealNPK[2] - userK };
        const contentEl = document.getElementById('fertilizerRecsContent');
        
        let html = '<div class="rec-grid">';
        Object.entries(recs).forEach(([nutrient, value]) => {
            let recommendation = 'Sufficient';
            if (value > 20) recommendation = 'Deficient - Add Fertilizer';
            else if (value < -20) recommendation = 'Excess - Reduce Application';
            
            html += `<div class="rec-card">
                        <h4>${this.translator.translate(nutrient.toLowerCase())} (${nutrient})</h4>
                        <p>${recommendation}</p>
                        <div class="value">${value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)} kg/ha</div>
                     </div>`;
        });
        html += '</div>';

        contentEl.innerHTML = html;
        document.getElementById('fertilizerRecs').style.display = 'block';
    }

    generatePrediction() {
        document.getElementById('loadingIndicator').style.display = 'block';
        document.getElementById('predictionResults').style.display = 'none';

        setTimeout(() => {
            document.getElementById('predictedYield').textContent = `${(3.5 + Math.random() * 2).toFixed(2)} tonnes/ha`;
            document.getElementById('estimatedRevenue').textContent = `₹ ${(60000 + Math.random() * 20000).toLocaleString('en-IN')}/ha`;
            document.getElementById('profitMargin').textContent = `${(25 + Math.random() * 15).toFixed(1)}%`;
            document.getElementById('riskAssessment').textContent = this.translator.translate('risk_medium');
            
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('predictionResults').style.display = 'block';
        }, 2000);
    }
    
    retranslateDynamicContent() {
        // This method can be called after language change to update any dynamic text
        this.populateCropTypes(document.getElementById('cropCategory').value);
    }
}

// 4. PLANT DISEASE AI MODULE
class PlantDiseaseAI {
    constructor(translationService) {
        this.translator = translationService;
        this.isProcessing = false;
        // Setup listeners for disease detection page
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const page = document.getElementById('disease-page');
        if (!page) return;
        
        page.querySelector('#select-file-btn').addEventListener('click', () => page.querySelector('#file-input').click());
        page.querySelector('#file-input').addEventListener('change', (e) => this.handleFileSelect(e));
        page.querySelector('#remove-image').addEventListener('click', () => this.removeImage());
        page.querySelector('#analyze-btn').addEventListener('click', () => this.startAnalysis());
        page.querySelector('#modal-close').addEventListener('click', () => this.closeModal());
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const page = document.getElementById('disease-page');
            page.querySelector('#preview-image').src = event.target.result;
            page.querySelector('#image-name').textContent = file.name;
            page.querySelector('#image-size').textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
            page.querySelector('#upload-content').classList.add('hidden');
            page.querySelector('#image-preview').classList.remove('hidden');
            page.querySelector('#analyze-btn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    removeImage() {
        const page = document.getElementById('disease-page');
        page.querySelector('#file-input').value = '';
        page.querySelector('#upload-content').classList.remove('hidden');
        page.querySelector('#image-preview').classList.add('hidden');
        page.querySelector('#analyze-btn').disabled = true;
    }
    
    startAnalysis() {
        const page = document.getElementById('disease-page');
        page.querySelector('.upload-section').classList.add('hidden');
        page.querySelector('.processing-section').classList.remove('hidden');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            page.querySelector('#progress-fill').style.width = `${progress}%`;
            page.querySelector('#progress-percentage').textContent = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                this.displayResults();
            }
        }, 300);
    }
    
    displayResults() {
        const page = document.getElementById('disease-page');
        page.querySelector('.processing-section').classList.add('hidden');
        page.querySelector('.results-section').classList.remove('hidden');
        // In a real app, you'd populate results dynamically here
        page.querySelector('#disease-results').innerHTML = `<div class="disease-card">
            <div class="disease-header">
                <div class="disease-name"><h3>Rice Blast</h3><p class="scientific-name">Pyricularia oryzae</p></div>
                <div class="disease-badges"><span class="confidence-score">96.8%</span><span class="severity-badge high">High Risk</span></div>
            </div>
        </div>`;
        page.querySelector('#treatment-content').innerHTML = `<p>Recommended treatment: Tricyclazole 75% WP. Please consult a local expert.</p>`;
    }

    closeModal() {
        document.getElementById('disease-modal').classList.add('hidden');
    }
}

// 5. AI MARKET ANALYTICS MODULE
class AIMarketAnalytics {
    constructor(translationService) {
        this.translator = translationService;
        this.charts = {};
        this.marketData = this.initializeMarketData();
        // Event listeners are set up when the market page is shown for the first time
    }
    
    initializeMarketData() {
        return {
            rice: { price: 45.2, change: 0.0345 },
            wheat: { price: 28.5, change: -0.0125 },
            maize: { price: 22.8, change: 0.0187 },
            cotton: { price: 85.5, change: 0.0298 },
        };
    }
    
    initPage() {
        if (this.initialized) return;
        this.updateTopPerformers();
        this.initializeLiveChart();
        this.initialized = true;
    }
    
    updateTopPerformers(type = 'gainers') {
        const list = document.getElementById('performersList');
        if (!list) return;

        let crops = Object.entries(this.marketData);
        crops.sort((a, b) => type === 'gainers' ? b[1].change - a[1].change : a[1].change - b[1].change);
        
        list.innerHTML = crops.slice(0, 3).map(([name, data], i) => `
            <div class="performer-item">
                <div class="performer-rank">${i+1}</div>
                <div class="performer-info"><div>${name.charAt(0).toUpperCase() + name.slice(1)}</div></div>
                <div class="performer-change ${data.change > 0 ? 'positive' : 'negative'}">${(data.change*100).toFixed(2)}%</div>
            </div>
        `).join('');
    }

    initializeLiveChart() {
        const ctx = document.getElementById('liveChart')?.getContext('2d');
        if (!ctx || this.charts.liveChart) return;

        this.charts.liveChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Rice Price (₹/kg)',
                    data: [42, 43, 44, 43.5, 44.5, 45.2],
                    borderColor: 'var(--color-primary)',
                    fill: true,
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

// 6. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    window.agriTechApp = new AgriTechApp();
});
