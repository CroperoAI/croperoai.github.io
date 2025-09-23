// CroperoAI - Smart Agriculture Platform JavaScript
// Main application logic and event handlers

class CroperoAI {
    constructor() {
        this.currentTab = 'disease-detection';
        this.currentStep = 1;
        this.selectedCrop = null;
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.currentLocation = 'Coimbatore, Tamil Nadu';
        this.uploadedImage = null;
        this.analysisResults = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupImageUpload();
        this.setupLocationDetection();
        this.setupThemeToggle();
        this.setupLanguageSelector();
        this.setupStepNavigation();
        this.setupFormValidation();
        this.initializeCharts();
        this.startPriceTicker();
        this.loadTranslations();
    }

    setupEventListeners() {
        // Main tab navigation
        document.querySelectorAll('.main-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.mainTab;
                this.switchTab(tabId);
            });
        });

        // Disease detection buttons
        const cameraBtn = document.getElementById('cameraBtn');
        const galleryBtn = document.getElementById('galleryBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const changeImageBtn = document.getElementById('changeImageBtn');

        if (cameraBtn) cameraBtn.addEventListener('click', () => this.openCamera());
        if (galleryBtn) galleryBtn.addEventListener('click', () => this.openGallery());
        if (analyzeBtn) analyzeBtn.addEventListener('click', () => this.analyzeImage());
        if (changeImageBtn) changeImageBtn.addEventListener('click', () => this.resetImageUpload());

        // Yield predictor buttons
        const nextStepBtn = document.getElementById('nextStepBtn');
        const prevStepBtn = document.getElementById('prevStepBtn');
        const generatePredictionBtn = document.getElementById('generatePredictionBtn');

        if (nextStepBtn) nextStepBtn.addEventListener('click', () => this.nextStep());
        if (prevStepBtn) prevStepBtn.addEventListener('click', () => this.prevStep());
        if (generatePredictionBtn) generatePredictionBtn.addEventListener('click', () => this.generateYieldPrediction());

        // Market analytics buttons
        const refreshChartBtn = document.getElementById('refreshChartBtn');
        const createAlertBtn = document.getElementById('createAlertBtn');

        if (refreshChartBtn) refreshChartBtn.addEventListener('click', () => this.refreshMarketChart());
        if (createAlertBtn) createAlertBtn.addEventListener('click', () => this.createPriceAlert());

        // Modal buttons
        const changeLocationBtn = document.getElementById('changeLocationBtn');
        const closeLocationModal = document.getElementById('closeLocationModal');

        if (changeLocationBtn) changeLocationBtn.addEventListener('click', () => this.openLocationModal());
        if (closeLocationModal) closeLocationModal.addEventListener('click', () => this.closeLocationModal());

        // Crop selection
        document.querySelectorAll('.crop-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectCrop(e.currentTarget.dataset.crop);
            });
        });

        // Treatment tabs
        document.querySelectorAll('.treatment-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTreatmentTab(e.currentTarget.dataset.treatment);
            });
        });
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const cameraInput = document.getElementById('cameraInput');
        const galleryInput = document.getElementById('galleryInput');

        // Drag and drop functionality
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleImageUpload(files[0]);
                }
            });
        }

        // File input handlers
        if (cameraInput) {
            cameraInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }

        if (galleryInput) {
            galleryInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleImageUpload(e.target.files[0]);
                }
            });
        }
    }

    setupLocationDetection() {
        const detectLocationBtn = document.getElementById('detectLocationBtn');
        if (detectLocationBtn) {
            detectLocationBtn.addEventListener('click', () => this.detectLocation());
        }

        // Location options
        document.querySelectorAll('.location-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const location = e.currentTarget.dataset.location;
                this.setLocation(location);
            });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Apply saved theme
        const savedTheme = localStorage.getItem('cropero-theme') || 'light';
        this.setTheme(savedTheme);
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }

        // Apply saved language
        const savedLanguage = localStorage.getItem('cropero-language') || 'en';
        this.setLanguage(savedLanguage);
    }

    setupStepNavigation() {
        // Step navigation for yield predictor
        document.querySelectorAll('[data-step]').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepNumber = parseInt(e.currentTarget.dataset.step);
                this.goToStep(stepNumber);
            });
        });
    }

    setupFormValidation() {
        // Form validation for yield predictor
        const requiredFields = document.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }

    // Tab Management
    switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.main-tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tab buttons
        document.querySelectorAll('.main-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab content
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Add active class to selected tab button
        const targetBtn = document.querySelector(`[data-main-tab="${tabId}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }

        this.currentTab = tabId;

        // Initialize tab-specific functionality
        this.initializeTabFeatures(tabId);
    }

    initializeTabFeatures(tabId) {
        switch (tabId) {
            case 'disease-detection':
                this.initializeDiseaseDetection();
                break;
            case 'yield-predictor':
                this.initializeYieldPredictor();
                break;
            case 'market-analytics':
                this.initializeMarketAnalytics();
                break;
        }
    }

    // Image Upload and Analysis
    openCamera() {
        const cameraInput = document.getElementById('cameraInput');
        if (cameraInput) cameraInput.click();
    }

    openGallery() {
        const galleryInput = document.getElementById('galleryInput');
        if (galleryInput) galleryInput.click();
    }

    handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showAlert('Please select a valid image file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.displayImagePreview(imageUrl);
            this.uploadedImage = file;
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview(imageUrl) {
        const placeholder = document.getElementById('uploadPlaceholder');
        const previewContainer = document.getElementById('imagePreviewContainer');
        const previewImage = document.getElementById('previewImage');

        if (placeholder) placeholder.style.display = 'none';
        if (previewContainer) previewContainer.style.display = 'block';
        if (previewImage) previewImage.src = imageUrl;
    }

    resetImageUpload() {
        const placeholder = document.getElementById('uploadPlaceholder');
        const previewContainer = document.getElementById('imagePreviewContainer');
        const analysisResults = document.getElementById('analysisResults');

        if (placeholder) placeholder.style.display = 'block';
        if (previewContainer) previewContainer.style.display = 'none';
        if (analysisResults) analysisResults.style.display = 'none';

        this.uploadedImage = null;
        this.analysisResults = null;
    }

    async analyzeImage() {
        if (!this.uploadedImage) {
            this.showAlert('Please upload an image first.', 'error');
            return;
        }

        this.showLoading('Analyzing image...', 'AI is processing your plant image');
        
        try {
            // Simulate API call
            await this.delay(3000);
            
            // Mock analysis results
            const results = this.generateMockAnalysisResults();
            this.displayAnalysisResults(results);
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Analysis failed. Please try again.', 'error');
        }
    }

    generateMockAnalysisResults() {
        const diseases = [
            {
                name: 'Cotton Bollworm',
                scientificName: 'Helicoverpa armigera',
                confidence: 88.9,
                severity: 'High',
                yieldImpact: '25-45% Loss',
                symptoms: ['Holes in leaves', 'Damaged bolls', 'Frass presence', 'Wilting'],
                treatments: {
                    organic: ['Neem oil spray', 'Bacillus thuringiensis', 'Pheromone traps'],
                    chemical: ['Cypermethrin', 'Chlorpyrifos', 'Emamectin benzoate'],
                    biological: ['Trichogramma wasps', 'Chrysoperla carnea', 'NPV virus'],
                    integrated: ['Combination approach', 'Rotation strategy', 'Monitoring system']
                }
            }
        ];
        
        return { diseases, confidence: 94.2 };
    }

    displayAnalysisResults(results) {
        const analysisResults = document.getElementById('analysisResults');
        const detectedDiseases = document.getElementById('detectedDiseases');
        
        if (analysisResults) analysisResults.style.display = 'block';
        
        // Display disease cards
        if (detectedDiseases && results.diseases) {
            detectedDiseases.innerHTML = '';
            results.diseases.forEach((disease, index) => {
                const diseaseCard = this.createDiseaseCard(disease, index);
                detectedDiseases.appendChild(diseaseCard);
            });
        }
        
        this.analysisResults = results;
    }

    createDiseaseCard(disease, index) {
        const card = document.createElement('div');
        card.className = 'disease-card';
        card.innerHTML = `
            <div class="disease-header">
                <h4 class="disease-name">${disease.name}</h4>
                <div class="confidence-score">${disease.confidence}%</div>
            </div>
            <p class="disease-description">${disease.scientificName}</p>
            <div class="disease-summary">
                <span class="severity-badge ${disease.severity.toLowerCase()}">${disease.severity} Severity</span>
            </div>
        `;
        
        card.addEventListener('click', () => this.showDiseaseDetails(disease));
        return card;
    }

    showDiseaseDetails(disease) {
        const detailPanel = document.getElementById('diseaseDetailPanel');
        if (!detailPanel) return;
        
        // Update disease details
        const title = document.getElementById('diseaseTitle');
        const scientificName = document.getElementById('scientificName');
        const confidence = document.getElementById('confidenceScore');
        const severity = document.getElementById('severityLevel');
        const yieldImpact = document.getElementById('yieldImpact');
        
        if (title) title.textContent = disease.name;
        if (scientificName) scientificName.textContent = disease.scientificName;
        if (confidence) confidence.textContent = `${disease.confidence}%`;
        if (severity) severity.textContent = disease.severity;
        if (yieldImpact) yieldImpact.textContent = disease.yieldImpact;
        
        // Update symptoms
        this.updateSymptoms(disease.symptoms);
        
        // Update treatments
        this.updateTreatments(disease.treatments);
        
        detailPanel.style.display = 'block';
    }

    updateSymptoms(symptoms) {
        const symptomsGrid = document.getElementById('symptomsGrid');
        if (!symptomsGrid) return;
        
        symptomsGrid.innerHTML = '';
        symptoms.forEach(symptom => {
            const symptomItem = document.createElement('div');
            symptomItem.className = 'symptom-item';
            symptomItem.innerHTML = `<span>• ${symptom}</span>`;
            symptomsGrid.appendChild(symptomItem);
        });
    }

    updateTreatments(treatments) {
        const treatmentContent = document.getElementById('treatmentContent');
        if (!treatmentContent) return;
        
        // Show organic treatments by default
        this.showTreatmentType('organic', treatments);
    }

    switchTreatmentTab(type) {
        // Update tab appearance
        document.querySelectorAll('.treatment-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-treatment="${type}"]`);
        if (activeTab) activeTab.classList.add('active');
        
        // Show treatments for selected type
        if (this.analysisResults && this.analysisResults.diseases.length > 0) {
            this.showTreatmentType(type, this.analysisResults.diseases[0].treatments);
        }
    }

    showTreatmentType(type, treatments) {
        const treatmentContent = document.getElementById('treatmentContent');
        if (!treatmentContent || !treatments[type]) return;
        
        treatmentContent.innerHTML = '';
        treatments[type].forEach(treatment => {
            const treatmentItem = document.createElement('div');
            treatmentItem.className = 'treatment-item';
            treatmentItem.innerHTML = `
                <div class="treatment-icon">💊</div>
                <div class="treatment-details">
                    <h5>${treatment}</h5>
                    <p>Detailed instructions for ${treatment} application.</p>
                </div>
            `;
            treatmentContent.appendChild(treatmentItem);
        });
    }

    // Yield Predictor Functions
    selectCrop(cropType) {
        // Remove selection from all crops
        document.querySelectorAll('.crop-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked crop
        const selectedCard = document.querySelector(`[data-crop="${cropType}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        this.selectedCrop = cropType;
        
        // Enable next step button
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.disabled = false;
        }
    }

    nextStep() {
        if (this.currentStep < 5) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= 5) {
            this.currentStep = stepNumber;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Update progress indicator
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Show current step content
        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const currentContent = document.querySelector(`[data-step-content="${this.currentStep}"]`);
        if (currentContent) {
            currentContent.classList.add('active');
        }
    }

    async generateYieldPrediction() {
        // Validate form inputs
        if (!this.validateYieldForm()) {
            this.showAlert('Please fill in all required fields.', 'error');
            return;
        }
        
        this.showLoading('Generating AI prediction...', 'Analyzing your farm data with advanced ML models');
        
        try {
            // Simulate API call
            await this.delay(4000);
            
            const prediction = this.generateMockPrediction();
            this.displayPredictionResults(prediction);
            this.nextStep(); // Move to results step
            
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            this.showAlert('Prediction generation failed. Please try again.', 'error');
        }
    }

    validateYieldForm() {
        const requiredFields = [
            'yieldFarmArea',
            'plantingDate',
            'soilPh',
            'organicMatter',
            'nitrogen',
            'phosphorus',
            'potassium'
        ];
        
        return requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });
    }

    generateMockPrediction() {
        return {
            expectedYield: 45.2,
            totalProduction: 45.2,
            marketValue: 128700,
            harvestDate: 'Dec 15, 2025',
            confidence: 94,
            recommendations: [
                'Increase nitrogen application by 10%',
                'Monitor soil moisture levels weekly',
                'Consider organic matter supplementation',
                'Plan harvest timing for optimal pricing'
            ]
        };
    }

    displayPredictionResults(prediction) {
        const predictedYield = document.getElementById('predictedYield');
        const predictionConfidence = document.getElementById('predictionConfidence');
        const totalProduction = document.getElementById('totalProduction');
        const marketValue = document.getElementById('marketValue');
        const harvestDate = document.getElementById('harvestDate');
        
        if (predictedYield) predictedYield.textContent = `${prediction.expectedYield} quintals/hectare`;
        if (predictionConfidence) predictionConfidence.textContent = `${prediction.confidence}%`;
        if (totalProduction) totalProduction.textContent = `${prediction.totalProduction} quintals`;
        if (marketValue) marketValue.textContent = `₹${prediction.marketValue.toLocaleString()}`;
        if (harvestDate) harvestDate.textContent = prediction.harvestDate;
        
        // Update recommendations
        this.updateRecommendations(prediction.recommendations);
        
        // Update yield chart
        this.updateYieldChart();
    }

    updateRecommendations(recommendations) {
        const recommendationList = document.getElementById('recommendationList');
        if (!recommendationList) return;
        
        recommendationList.innerHTML = '';
        recommendations.forEach(rec => {
            const recItem = document.createElement('div');
            recItem.className = 'recommendation-item';
            recItem.innerHTML = `
                <div class="recommendation-icon">💡</div>
                <div class="recommendation-content">
                    <p>${rec}</p>
                </div>
            `;
            recommendationList.appendChild(recItem);
        });
    }

    // Location Management
    openLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    closeLocationModal() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    setLocation(location) {
        this.currentLocation = location;
        
        const locationDisplay = document.getElementById('current-location');
        if (locationDisplay) {
            locationDisplay.textContent = location;
        }
        
        this.closeLocationModal();
        this.updateWeatherInfo();
        localStorage.setItem('cropero-location', location);
    }

    detectLocation() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // In a real app, you would reverse geocode the coordinates
                    this.setLocation('Detected Location');
                },
                (error) => {
                    this.showAlert('Location detection failed. Please select manually.', 'error');
                }
            );
        } else {
            this.showAlert('Geolocation is not supported by this browser.', 'error');
        }
    }

    updateWeatherInfo() {
        // Simulate weather update based on location
        const weatherInfo = document.getElementById('weatherInfo');
        if (weatherInfo) {
            // In a real app, you would fetch weather data from an API
            weatherInfo.innerHTML = `
                <span class="weather-temp">28°C</span>
                <span class="weather-desc">Partly Cloudy</span>
            `;
        }
    }

    // Theme Management
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        localStorage.setItem('cropero-theme', theme);
    }

    // Language Management
    changeLanguage(language) {
        this.setLanguage(language);
        this.loadTranslations();
    }

    setLanguage(language) {
        this.currentLanguage = language;
        
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = language;
        }
        
        localStorage.setItem('cropero-language', language);
    }

    async loadTranslations() {
        // In a real app, you would load translations from a file or API
        // For now, we'll just update the text direction for RTL languages
        const rtlLanguages = ['ar', 'fa', 'ur'];
        if (rtlLanguages.includes(this.currentLanguage)) {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
    }

    // Chart Management
    initializeCharts() {
        this.yieldChart = null;
        this.marketChart = null;
        this.predictionChart = null;
    }

    updateYieldChart() {
        const canvas = document.getElementById('yieldChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.yieldChart) {
            this.yieldChart.destroy();
        }
        
        // Create new chart with Chart.js
        if (typeof Chart !== 'undefined') {
            this.yieldChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Predicted Yield',
                        data: [30, 35, 40, 42, 45, 45.2],
                        borderColor: '#21808D',
                        backgroundColor: 'rgba(33, 128, 141, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Yield (quintals/hectare)'
                            }
                        }
                    }
                }
            });
        }
    }

    // Market Analytics
    initializeMarketAnalytics() {
        this.updateMarketChart();
    }

    updateMarketChart() {
        const canvas = document.getElementById('marketChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.marketChart) {
            this.marketChart.destroy();
        }
        
        // Create market price chart
        if (typeof Chart !== 'undefined') {
            this.marketChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Wheat',
                            data: [2800, 2820, 2850, 2840, 2860, 2850, 2870],
                            borderColor: '#21808D',
                            backgroundColor: 'rgba(33, 128, 141, 0.1)'
                        },
                        {
                            label: 'Rice',
                            data: [3150, 3200, 3180, 3220, 3200, 3190, 3200],
                            borderColor: '#2ECC71',
                            backgroundColor: 'rgba(46, 204, 113, 0.1)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            title: {
                                display: true,
                                text: 'Price (₹/quintal)'
                            }
                        }
                    }
                }
            });
        }
    }

    refreshMarketChart() {
        this.showLoading('Refreshing market data...', 'Fetching latest prices');
        
        setTimeout(() => {
            this.updateMarketChart();
            this.hideLoading();
        }, 2000);
    }

    startPriceTicker() {
        // Price ticker animation is handled by CSS
        // This function could be used to update ticker content dynamically
    }

    createPriceAlert() {
        const commodity = document.getElementById('alertCommodity').value;
        const condition = document.getElementById('alertCondition').value;
        const price = document.getElementById('alertPrice').value;
        
        if (!commodity || !condition || !price) {
            this.showAlert('Please fill in all alert fields.', 'error');
            return;
        }
        
        // Add alert to list
        const alertsList = document.getElementById('alertsList');
        if (alertsList) {
            const alertItem = document.createElement('div');
            alertItem.className = 'alert-item';
            alertItem.innerHTML = `
                <div class="alert-info">
                    <span class="alert-commodity">${commodity}</span>
                    <span class="alert-condition">${condition} ₹${price}/q</span>
                </div>
                <div class="alert-actions">
                    <span class="alert-status active">Active</span>
                    <button class="alert-delete" onclick="this.parentElement.parentElement.remove()">🗑️</button>
                </div>
            `;
            alertsList.appendChild(alertItem);
        }
        
        // Clear form
        document.getElementById('alertCommodity').value = '';
        document.getElementById('alertCondition').value = 'above';
        document.getElementById('alertPrice').value = '';
        
        this.showAlert('Price alert created successfully!', 'success');
    }

    // Utility Functions
    showLoading(title, message) {
        const modal = document.getElementById('loadingModal');
        const titleEl = document.getElementById('loadingTitle');
        const messageEl = document.getElementById('loadingMessage');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (modal) modal.classList.remove('hidden');
        if (titleEl) titleEl.textContent = title;
        if (messageEl) messageEl.textContent = message;
        
        // Animate progress bar
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${Math.round(progress)}%`;
        }, 200);
    }

    hideLoading() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">${this.getAlertIcon(type)}</span>
                <span class="alert-message">${message}</span>
                <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getAlertColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 10001;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(alert);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    getAlertIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    getAlertColor(type) {
        switch (type) {
            case 'success': return '#2ECC71';
            case 'error': return '#E74C3C';
            case 'warning': return '#F39C12';
            default: return '#3498DB';
        }
    }

    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.style.borderColor = '#E74C3C';
            return false;
        }
        return true;
    }

    clearFieldError(field) {
        field.style.borderColor = '';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Initialize specific tab features
    initializeDiseaseDetection() {
        // Reset any previous state
        this.resetImageUpload();
    }

    initializeYieldPredictor() {
        // Reset to first step
        this.currentStep = 1;
        this.updateStepDisplay();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CroperoAI();
});

// Add CSS animation for alerts
const alertStyles = document.createElement('style');
alertStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    }
`;
document.head.appendChild(alertStyles);
