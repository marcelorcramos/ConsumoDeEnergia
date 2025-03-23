// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const menu = document.querySelector('.menu');
const navLinks = document.querySelectorAll('.menu a');
const sections = document.querySelectorAll('.section');
const addDeviceBtn = document.getElementById('add-device');
const deviceModal = document.getElementById('device-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const deviceForm = document.getElementById('device-form');
const devicesGrid = document.getElementById('devices-grid');
const activeDevicesList = document.getElementById('active-devices');
const timePeriodSelect = document.getElementById('time-period');
const deviceSearch = document.getElementById('device-search');
const profileForm = document.getElementById('profile-form');
const tariffForm = document.getElementById('tariff-form');
const notificationsForm = document.getElementById('notifications-form');
const generateReportBtn = document.getElementById('generate-report');
const calculateBtn = document.getElementById('calculate-kwh');
const billValueInput = document.getElementById('bill-value');
const kwhRateInput = document.getElementById('kwh-rate');
const resultKwh = document.getElementById('result-kwh');

// Sample Data
const consumptionData = {
    day: [2.1, 1.8, 1.5, 1.2, 1.0, 1.3, 1.7, 2.5, 3.2, 3.8, 4.0, 3.5, 3.2, 3.0, 2.8, 3.0, 3.5, 4.2, 4.5, 4.0, 3.5, 3.0, 2.5, 2.2],
    week: [12.5, 13.2, 14.8, 13.5, 15.2, 14.0, 12.8],
    month: [387, 352, 410, 375, 398, 420, 405, 390, 412, 380, 365, 395],
    year: [1150, 1080, 1200, 1350, 1450, 1500, 1580, 1620, 1450, 1300, 1250, 1180]
};

const devices = [
    {
        id: 1,
        name: 'Ar Condicionado',
        type: 'hvac',
        room: 'Sala de Estar',
        power: 1200,
        isActive: true,
        isSmart: true,
        consumption: 8.5,
        icon: 'fa-snowflake'
    },
    {
        id: 2,
        name: 'Geladeira',
        type: 'appliance',
        room: 'Cozinha',
        power: 350,
        isActive: true,
        isSmart: false,
        consumption: 7.2,
        icon: 'fa-refrigerator'
    },
    {
        id: 3,
        name: 'TV LED 55"',
        type: 'entertainment',
        room: 'Sala de Estar',
        power: 120,
        isActive: false,
        isSmart: true,
        consumption: 3.6,
        icon: 'fa-tv'
    },
    {
        id: 4,
        name: 'Máquina de Lavar',
        type: 'appliance',
        room: 'Área de Serviço',
        power: 500,
        isActive: false,
        isSmart: true,
        consumption: 4.8,
        icon: 'fa-washing-machine'
    },
    {
        id: 5,
        name: 'Iluminação Sala',
        type: 'lighting',
        room: 'Sala de Estar',
        power: 60,
        isActive: true,
        isSmart: true,
        consumption: 1.8,
        icon: 'fa-lightbulb'
    },
    {
        id: 6,
        name: 'Computador',
        type: 'entertainment',
        room: 'Escritório',
        power: 200,
        isActive: true,
        isSmart: false,
        consumption: 4.0,
        icon: 'fa-desktop'
    }
];

const distributionData = {
    labels: ['Ar Condicionado', 'Geladeira', 'TV', 'Máquina de Lavar', 'Iluminação', 'Computador', 'Outros'],
    data: [35, 20, 10, 8, 7, 12, 8]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Close mobile menu
            menu.classList.remove('active');
        });
    });

    // Modal functionality
    addDeviceBtn.addEventListener('click', () => {
        deviceModal.classList.add('active');
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            deviceModal.classList.remove('active');
        });
    });

    // Close modal when clicking outside
    deviceModal.addEventListener('click', (e) => {
        if (e.target === deviceModal) {
            deviceModal.classList.remove('active');
        }
    });

    // Device form submission
    deviceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newDevice = {
            id: devices.length + 1,
            name: document.getElementById('device-name').value,
            type: document.getElementById('device-type').value,
            room: document.getElementById('device-room').options[document.getElementById('device-room').selectedIndex].text,
            power: parseInt(document.getElementById('device-power').value),
            isActive: false,
            isSmart: document.getElementById('device-smart').checked,
            consumption: 0,
            icon: getDeviceIcon(document.getElementById('device-type').value)
        };
        
        devices.push(newDevice);
        renderDevices();
        deviceModal.classList.remove('active');
        deviceForm.reset();
    });

    // Time period change
    timePeriodSelect.addEventListener('change', () => {
        updateConsumptionData();
    });

    // Device search
    deviceSearch.addEventListener('input', () => {
        renderDevices();
    });

    // Form submissions
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Perfil atualizado com sucesso!');
    });

    tariffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Tarifas atualizadas com sucesso!');
    });

    notificationsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Configurações de notificações atualizadas!');
    });

    // Generate report
    generateReportBtn.addEventListener('click', () => {
        generateReport();
    });

    // Bill calculator functionality
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const billValue = parseFloat(billValueInput.value);
            const kwhRate = parseFloat(kwhRateInput.value);
            
            if (billValue && kwhRate) {
                const kwhConsumption = billValue / kwhRate;
                resultKwh.textContent = kwhConsumption.toFixed(2);
                
                // Update the dashboard with the new value
                updateConsumptionWithBill(kwhConsumption);
                
                showNotification('Consumo calculado com sucesso!');
            } else {
                showNotification('Por favor, preencha todos os campos!', 'error');
            }
        });
    }

    // Initialize charts and data
    initializeCharts();
    renderDevices();
    updateActiveDevices();
});

// Helper Functions
function getDeviceIcon(type) {
    switch (type) {
        case 'lighting':
            return 'fa-lightbulb';
        case 'appliance':
            return 'fa-blender';
        case 'hvac':
            return 'fa-snowflake';
        case 'entertainment':
            return 'fa-tv';
        default:
            return 'fa-plug';
    }
}

function renderDevices() {
    const searchTerm = deviceSearch.value.toLowerCase();
    const filteredDevices = devices.filter(device => 
        device.name.toLowerCase().includes(searchTerm) || 
        device.room.toLowerCase().includes(searchTerm) ||
        device.type.toLowerCase().includes(searchTerm)
    );
    
    devicesGrid.innerHTML = '';
    
    filteredDevices.forEach(device => {
        const deviceCard = document.createElement('div');
        deviceCard.className = 'card device-card';
        deviceCard.innerHTML = `
            <div class="card-header">
                <div class="device-card-header">
                    <div class="device-icon">
                        <i class="fas ${device.icon}"></i>
                    </div>
                    <div>
                        <h3>${device.name}</h3>
                        <p>${device.room}</p>
                    </div>
                </div>
            </div>
            <div class="card-body device-card-body">
                <div>
                    <p><strong>Potência:</strong> ${device.power} W</p>
                    <p><strong>Consumo Estimado:</strong> ${device.consumption} kWh/dia</p>
                    <p><strong>Tipo:</strong> ${getDeviceTypeName(device.type)}</p>
                    <p><strong>Dispositivo Inteligente:</strong> ${device.isSmart ? 'Sim' : 'Não'}</p>
                </div>
                <div class="device-status">
                    <div class="status-indicator">
                        <div class="status-dot ${device.isActive ? 'active' : 'inactive'}"></div>
                        <span>${device.isActive ? 'Ativo' : 'Inativo'}</span>
                    </div>
                    <label class="device-toggle">
                        <input type="checkbox" ${device.isActive ? 'checked' : ''} data-device-id="${device.id}">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        `;
        
        devicesGrid.appendChild(deviceCard);
        
        // Add toggle event listener
        const toggle = deviceCard.querySelector('input[type="checkbox"]');
        toggle.addEventListener('change', () => {
            const deviceId = parseInt(toggle.getAttribute('data-device-id'));
            const device = devices.find(d => d.id === deviceId);
            device.isActive = toggle.checked;
            
            // Update status indicator
            const statusDot = deviceCard.querySelector('.status-dot');
            const statusText = deviceCard.querySelector('.status-indicator span');
            
            statusDot.className = `status-dot ${device.isActive ? 'active' : 'inactive'}`;
            statusText.textContent = device.isActive ? 'Ativo' : 'Inativo';
            
            updateActiveDevices();
        });
    });
}

function getDeviceTypeName(type) {
    switch (type) {
        case 'lighting':
            return 'Iluminação';
        case 'appliance':
            return 'Eletrodoméstico';
        case 'hvac':
            return 'Ar Condicionado/Aquecimento';
        case 'entertainment':
            return 'Entretenimento';
        default:
            return 'Outro';
    }
}

function updateActiveDevices() {
    const activeDevices = devices.filter(device => device.isActive);
    activeDevicesList.innerHTML = '';
    
    activeDevices.forEach(device => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="device-info">
                <div class="device-icon">
                    <i class="fas ${device.icon}"></i>
                </div>
                <div class="device-details">
                    <h4>${device.name}</h4>
                    <p>${device.room}</p>
                </div>
            </div>
            <div class="device-consumption">${device.consumption} kWh/dia</div>
        `;
        
        activeDevicesList.appendChild(li);
    });
}

function updateConsumptionData() {
    const period = timePeriodSelect.value;
    const consumptionAmount = document.getElementById('consumption-amount');
    const consumptionCost = document.getElementById('consumption-cost');
    
    let totalConsumption = 0;
    
    switch (period) {
        case 'day':
            totalConsumption = consumptionData.day.reduce((a, b) => a + b, 0);
            break;
        case 'week':
            totalConsumption = consumptionData.week.reduce((a, b) => a + b, 0);
            break;
        case 'month':
            totalConsumption = consumptionData.month[new Date().getMonth()];
            break;
        case 'year':
            totalConsumption = consumptionData.year.reduce((a, b) => a + b, 0);
            break;
    }
    
    consumptionAmount.textContent = totalConsumption.toFixed(0);
    consumptionCost.textContent = (totalConsumption * 0.60).toFixed(2);
    
    updateConsumptionChart(period);
}

function updateConsumptionWithBill(kwhValue) {
    // Atualizar o valor de consumo no dashboard
    const consumptionAmount = document.getElementById('consumption-amount');
    const consumptionCost = document.getElementById('consumption-cost');
    
    if (consumptionAmount && consumptionCost) {
        consumptionAmount.textContent = kwhValue.toFixed(0);
        consumptionCost.textContent = billValueInput.value;
        
        // Atualizar o gráfico de consumo mensal
        const currentMonth = new Date().getMonth();
        consumptionData.month[currentMonth] = kwhValue;
        updateConsumptionChart('month');
        
        // Atualizar o período selecionado para mês
        if (timePeriodSelect) {
            timePeriodSelect.value = 'month';
        }
    }
}

function initializeCharts() {
    // Consumption Chart
    const consumptionCtx = document.getElementById('consumption-chart').getContext('2d');
    window.consumptionChart = new Chart(consumptionCtx, {
        type: 'line',
        data: {
            labels: Array.from({length: 24}, (_, i) => `${i}h`),
            datasets: [{
                label: 'Consumo (kWh)',
                data: consumptionData.day,
                borderColor: '#2c7be5',
                backgroundColor: 'rgba(44, 123, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [2, 4]
                    }
                }
            }
        }
    });
    
    // Distribution Chart
    const distributionCtx = document.getElementById('distribution-chart').getContext('2d');
    window.distributionChart = new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: distributionData.labels,
            datasets: [{
                data: distributionData.data,
                backgroundColor: [
                    '#2c7be5', '#a6c5f7', '#d2ddec', '#6e84a3', 
                    '#12263f', '#95aac9', '#e3ebf6'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 15
                    }
                }
            }
        }
    });
    
    // Initialize Weather Impact Chart
    initializeWeatherImpactChart();
    
    // Initialize weather functionality
    setupWeatherFunctionality();
    
    // Update consumption data
    updateConsumptionData();
}

function updateConsumptionChart(period) {
    let labels, data;
    
    switch (period) {
        case 'day':
            labels = Array.from({length: 24}, (_, i) => `${i}h`);
            data = consumptionData.day;
            break;
        case 'week':
            labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            data = consumptionData.week;
            break;
        case 'month':
            labels = Array.from({length: 30}, (_, i) => `${i+1}`);
            data = consumptionData.month;
            break;
        case 'year':
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            data = consumptionData.year;
            break;
    }
    
    window.consumptionChart.data.labels = labels;
    window.consumptionChart.data.datasets[0].data = data;
    window.consumptionChart.update();
}

function generateReport() {
    showNotification('Relatório gerado com sucesso!');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Weather Impact Functions
function initializeWeatherImpactChart() {
    const ctx = document.getElementById('weather-impact-chart').getContext('2d');
    window.weatherImpactChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [
                {
                    label: 'Temperatura (°C)',
                    data: [27, 25, 29, 30, 24, 26, 28],
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                },
                {
                    label: 'Consumo Estimado (kWh)',
                    data: [12.5, 11.8, 14.2, 15.0, 11.2, 12.0, 13.5],
                    borderColor: '#2c7be5',
                    backgroundColor: 'rgba(44, 123, 229, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    grid: {
                        borderDash: [2, 4]
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Consumo (kWh)'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y;
                                if (context.datasetIndex === 0) {
                                    label += '°C';
                                } else {
                                    label += ' kWh';
                                }
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Setup weather functionality
function setupWeatherFunctionality() {
    // Add city input and search button to the weather card header
    const weatherCard = document.querySelector('.weather-impact .card-header');
    
    if (weatherCard) {
        // Create city input container
        const cityInputContainer = document.createElement('div');
        cityInputContainer.className = 'city-search-container';
        cityInputContainer.innerHTML = `
            <input type="text" id="city-input" placeholder="Digite sua cidade..." class="city-input">
            <button id="search-city" class="btn btn-sm btn-primary">
                <i class="fas fa-search"></i>
            </button>
            <button id="location-button" class="btn btn-sm btn-secondary">
                <i class="fas fa-map-marker-alt"></i>
            </button>
        `;
        
        weatherCard.appendChild(cityInputContainer);
        
        // Add event listeners for city search
        const searchCityButton = document.getElementById('search-city');
        const cityInput = document.getElementById('city-input');
        const locationButton = document.getElementById('location-button');
        
        if (searchCityButton && cityInput) {
            // Search when button is clicked
            searchCityButton.addEventListener('click', function() {
                const city = cityInput.value.trim();
                if (city) {
                    getWeatherDataForCity(city);
                }
            });
            
            // Search when Enter key is pressed in the input field
            cityInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const city = cityInput.value.trim();
                    if (city) {
                        getWeatherDataForCity(city);
                    }
                }
            });
        }
        
        // Use geolocation when location button is clicked
        if (locationButton) {
            locationButton.addEventListener('click', function() {
                getWeatherData();
            });
        }
        
        // Add event listener for weather period selector
        const weatherPeriodSelect = document.getElementById('weather-period');
        if (weatherPeriodSelect) {
            weatherPeriodSelect.addEventListener('change', function() {
                updateWeatherImpact(this.value);
            });
            
            // Initialize with default period (week)
            updateWeatherImpact('week');
        }
        
        // Initialize with user's location
        getWeatherData();
    }
}

// Update weather impact data based on selected period
function updateWeatherImpact(period) {
    // In a real application, this would fetch data from an API
    // For now, we'll just simulate different data for different periods
    
    let labels, temperatureData, consumptionData;
    
    switch (period) {
        case 'day':
            labels = Array.from({length: 24}, (_, i) => `${i}h`);
            temperatureData = [
                22, 21, 20, 19, 19, 20, 
                21, 23, 25, 27, 28, 29, 
                30, 30, 29, 28, 27, 26, 
                25, 24, 23, 22, 22, 21
            ];
            consumptionData = [
                0.4, 0.3, 0.3, 0.3, 0.3, 0.5,
                0.7, 0.9, 1.1, 1.2, 1.3, 1.4,
                1.5, 1.5, 1.4, 1.3, 1.2, 1.1,
                1.0, 0.9, 0.8, 0.6, 0.5, 0.4
            ];
            break;
        case 'week':
            labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            temperatureData = [27, 25, 29, 30, 24, 26, 28];
            consumptionData = [12.5, 11.8, 14.2, 15.0, 11.2, 12.0, 13.5];
            break;
        case 'month':
            labels = Array.from({length: 30}, (_, i) => `${i+1}`);
            // Generate random temperature data between 22 and 32
            temperatureData = Array.from({length: 30}, () => Math.floor(Math.random() * 10) + 22);
            // Generate consumption data that correlates with temperature
            consumptionData = temperatureData.map(temp => (temp - 20) * 0.8 + Math.random() * 2);
            break;
    }
    
    // Update chart data
    window.weatherImpactChart.data.labels = labels;
    window.weatherImpactChart.data.datasets[0].data = temperatureData;
    window.weatherImpactChart.data.datasets[1].data = consumptionData;
    window.weatherImpactChart.update();
    
    // Update weather recommendations based on current temperature
    updateWeatherRecommendations(temperatureData[temperatureData.length - 1]);
}

// Update weather recommendations based on temperature
function updateWeatherRecommendations(temperature) {
    const recommendationsElement = document.querySelector('.weather-recommendations ul');
    if (!recommendationsElement) return;
    
    recommendationsElement.innerHTML = '';
    
    // Base recommendations
    const recommendations = [
        '<i class="fas fa-lightbulb"></i> Aproveite a luz natural durante o dia'
    ];
    
    // Temperature-specific recommendations
    if (temperature > 28) {
        recommendations.push('<i class="fas fa-snowflake"></i> Ajuste o ar condicionado para 24°C para economizar energia');
        recommendations.push('<i class="fas fa-fan"></i> Use ventiladores em vez de ar condicionado quando possível');
        recommendations.push('<i class="fas fa-window-close"></i> Mantenha janelas e portas fechadas quando o ar condicionado estiver ligado');
    } else if (temperature > 24) {
        recommendations.push('<i class="fas fa-fan"></i> Use ventiladores para circular o ar');
        recommendations.push('<i class="fas fa-window-maximize"></i> Abra as janelas durante a noite para refrescar a casa');
    } else if (temperature < 18) {
        recommendations.push('<i class="fas fa-sun"></i> Aproveite a luz solar para aquecer ambientes durante o dia');
        recommendations.push('<i class="fas fa-door-closed"></i> Mantenha portas e janelas fechadas para conservar o calor');
    }
    
    // Add recommendations to the DOM
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = rec;
        recommendationsElement.appendChild(li);
    });
}

// Function to get weather data for a specific city
function getWeatherDataForCity(city) {
    // Show loading state
    const currentWeatherElement = document.querySelector('.current-weather');
    if (currentWeatherElement) {
        currentWeatherElement.innerHTML = 
            `<i class="fas fa-spinner fa-spin"></i>
             <div class="weather-data">
                <span class="condition">Carregando dados...</span>
             </div>`;
    }
    
    // API key for OpenWeatherMap
    const apiKey = '12ed3f4c22485987e56ea9c7944360d5';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${apiKey}`;
    
    fetch(weatherApiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Cidade não encontrada');
            }
            return response.json();
        })
        .then(data => {
            updateWeatherUI(data);
            calculateWeatherImpact(data.main.temp);
            
            // Get 5-day forecast
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${apiKey}`);
        })
        .then(response => response.json())
        .then(forecastData => {
            updateForecastUI(forecastData);
            updateWeatherImpactChartWithForecast(forecastData);
        })
        .catch(error => {
            console.error('Erro ao buscar dados climáticos:', error);
            if (currentWeatherElement) {
                currentWeatherElement.innerHTML = 
                    `<i class="fas fa-exclamation-circle"></i>
                     <div class="weather-data">
                        <span class="condition">Erro: ${error.message}</span>
                     </div>`;
            }
        });
}

// Function to get weather data using geolocation
function getWeatherData() {
    if (navigator.geolocation) {
        // Show loading state
        const currentWeatherElement = document.querySelector('.current-weather');
        if (currentWeatherElement) {
            currentWeatherElement.innerHTML = 
                `<i class="fas fa-spinner fa-spin"></i>
                 <div class="weather-data">
                    <span class="condition">Obtendo localização...</span>
                 </div>`;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // API key for OpenWeatherMap
                const apiKey = '12ed3f4c22485987e56ea9c7944360d5';
                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
                
                fetch(weatherApiUrl)
                    .then(response => response.json())
                    .then(data => {
                        updateWeatherUI(data);
                        calculateWeatherImpact(data.main.temp);
                        
                        // Update city input with the detected city
                        const cityInput = document.getElementById('city-input');
                        if (cityInput && data.name) {
                            cityInput.value = data.name;
                        }
                        
                        // Get 5-day forecast
                        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`);
                    })
                    .then(response => response.json())
                    .then(forecastData => {
                        updateForecastUI(forecastData);
                        updateWeatherImpactChartWithForecast(forecastData);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar dados climáticos:', error);
                        if (currentWeatherElement) {
                            currentWeatherElement.innerHTML = 
                                `<i class="fas fa-exclamation-circle"></i>
                                 <div class="weather-data">
                                    <span class="condition">Erro ao obter dados climáticos</span>
                                 </div>`;
                        }
                    });
            },
            (error) => {
                console.error('Erro de geolocalização:', error);
                if (currentWeatherElement) {
                    currentWeatherElement.innerHTML = 
                        `<i class="fas fa-exclamation-circle"></i>
                         <div class="weather-data">
                            <span class="condition">Erro de localização: ${error.message}</span>
                         </div>`;
                }
                
                // Default to a city if geolocation fails
                getWeatherDataForCity('São Paulo');
            }
        );
    } else {
        console.error('Geolocalização não suportada pelo navegador');
        // Default to a city if geolocation is not supported
        getWeatherDataForCity('São Paulo');
    }
}

// Function to update the weather UI with data from the API
function updateWeatherUI(data) {
    const currentWeatherElement = document.querySelector('.current-weather');
    const weatherLocationElement = document.querySelector('.weather-location');
    
    if (currentWeatherElement) {
        // Get weather icon based on condition code
        const weatherIcon = getWeatherIcon(data.weather[0].id);
        
        // Update current weather display
        currentWeatherElement.innerHTML = `
            <i class="${weatherIcon}"></i>
            <div class="weather-data">
                <span class="temperature">${Math.round(data.main.temp)}°C</span>
                <span class="condition">${data.weather[0].description}</span>
            </div>
        `;
    }
    
    // Update location display
    if (weatherLocationElement) {
        weatherLocationElement.innerHTML = `
            <i class="fas fa-map-marker-alt"></i>
            <span>${data.name}, ${data.sys.country}</span>
        `;
    }
    
    // Update weather impact data
    const impactElement = document.querySelector('.weather-impact-data');
    if (impactElement) {
        const impact = calculateWeatherImpact(data.main.temp);
        impactElement.innerHTML = `
            <div>Impacto estimado no consumo:</div>
            <div class="impact-value">${impact > 0 ? '+' : ''}${impact}%</div>
        `;
    }
    
    // Update weather recommendations
    updateWeatherRecommendations(data.main.temp);
}

// Function to calculate the impact of weather on energy consumption
function calculateWeatherImpact(temperature) {
    // Simple model: extreme temperatures increase consumption
    let impact = 0;
    
    if (temperature > 28) {
        // Hot weather increases consumption (air conditioning)
        impact = Math.round((temperature - 28) * 3);
    } else if (temperature < 15) {
        // Cold weather increases consumption (heating)
        impact = Math.round((15 - temperature) * 2);
    }
    
    return impact;
}

// Function to update the forecast UI
function updateForecastUI(forecastData) {
    const forecastContainer = document.querySelector('.forecast-items');
    if (!forecastContainer) return;
    
    forecastContainer.innerHTML = '';
    
    // Get one forecast per day (noon time) for the next 5 days
    const dailyForecasts = [];
    const today = new Date().setHours(0, 0, 0, 0);
    
    forecastData.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((forecastDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 0 && daysDiff <= 5 && !dailyForecasts.some(f => new Date(f.dt * 1000).setHours(0, 0, 0, 0) === forecastDate)) {
            dailyForecasts.push(forecast);
        }
    });
    
    // Create forecast day elements
    dailyForecasts.slice(0, 5).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = getDayName(date.getDay());
        const temp = Math.round(forecast.main.temp);
        const icon = getWeatherIcon(forecast.weather[0].id);
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <span class="day">${dayName}</span>
            <i class="${icon}"></i>
            <span class="temp">${temp}°C</span>
        `;
        
        forecastContainer.appendChild(forecastDay);
    });
}

// Function to update the weather impact chart with forecast data
function updateWeatherImpactChartWithForecast(forecastData) {
    const temperatureData = [];
    const consumptionData = [];
    const labels = [];
    
    // Get data for the next 7 days (or as many as available)
    const dailyForecasts = [];
    const today = new Date().setHours(0, 0, 0, 0);
    
    forecastData.list.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((forecastDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 0 && daysDiff <= 7 && !dailyForecasts.some(f => new Date(f.dt * 1000).setHours(0, 0, 0, 0) === forecastDate)) {
            dailyForecasts.push(forecast);
        }
    });
    
    // Add today if not already included
    if (!dailyForecasts.some(f => new Date(f.dt * 1000).setHours(0, 0, 0, 0) === today)) {
        if (forecastData.list.length > 0) {
            dailyForecasts.unshift(forecastData.list[0]);
        }
    }
    
    // Sort forecasts by date
    dailyForecasts.sort((a, b) => a.dt - b.dt);
    
    // Create data for chart
    dailyForecasts.slice(0, 7).forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dayName = getDayName(date.getDay());
        const temp = Math.round(forecast.main.temp);
        
        // Estimate consumption based on temperature
        // This is a simplified model - in a real app, you'd use more sophisticated algorithms
        let consumption;
        if (temp > 28) {
            consumption = 10 + (temp - 28) * 0.5; // Higher consumption for hot days
        } else if (temp < 15) {
            consumption = 10 + (15 - temp) * 0.3; // Higher consumption for cold days
        } else {
            consumption = 10 - Math.abs(temp - 21) * 0.1; // Optimal temperature around 21°C
        }
        
        labels.push(dayName);
        temperatureData.push(temp);
        consumptionData.push(consumption.toFixed(1));
    });
    
    // Update chart data
    window.weatherImpactChart.data.labels = labels;
    window.weatherImpactChart.data.datasets[0].data = temperatureData;
    window.weatherImpactChart.data.datasets[1].data = consumptionData;
    window.weatherImpactChart.update();
}

// Function to update weather recommendations based on temperature
function updateWeatherRecommendations(temperature) {
    const recommendationsElement = document.querySelector('.weather-recommendations ul');
    if (!recommendationsElement) return;
    
    recommendationsElement.innerHTML = '';
    
    // Base recommendations
    const recommendations = [
        '<i class="fas fa-lightbulb"></i> Aproveite a luz natural durante o dia'
    ];
    
    // Temperature-specific recommendations
    if (temperature > 28) {
        recommendations.push('<i class="fas fa-snowflake"></i> Ajuste o ar condicionado para 24°C para economizar energia');
        recommendations.push('<i class="fas fa-fan"></i> Use ventiladores em vez de ar condicionado quando possível');
        recommendations.push('<i class="fas fa-window-close"></i> Mantenha janelas e portas fechadas quando o ar condicionado estiver ligado');
    } else if (temperature > 24) {
        recommendations.push('<i class="fas fa-fan"></i> Use ventiladores para circular o ar');
        recommendations.push('<i class="fas fa-window-maximize"></i> Abra as janelas durante a noite para refrescar a casa');
    } else if (temperature < 18) {
        recommendations.push('<i class="fas fa-sun"></i> Aproveite a luz solar para aquecer ambientes durante o dia');
        recommendations.push('<i class="fas fa-door-closed"></i> Mantenha portas e janelas fechadas para conservar o calor');
    }
    
    // Add recommendations to the DOM
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = rec;
        recommendationsElement.appendChild(li);
    });
}

// Helper function to get day name from day index
function getDayName(dayIndex) {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[dayIndex];
}

// Helper function to get weather icon based on condition code
function getWeatherIcon(conditionCode) {
    // Weather condition codes: https://openweathermap.org/weather-conditions
    if (conditionCode >= 200 && conditionCode < 300) {
        return 'fas fa-bolt'; // Thunderstorm
    } else if (conditionCode >= 300 && conditionCode < 400) {
        return 'fas fa-cloud-rain'; // Drizzle
    } else if (conditionCode >= 500 && conditionCode < 600) {
        return 'fas fa-cloud-showers-heavy'; // Rain
    } else if (conditionCode >= 600 && conditionCode < 700) {
        return 'fas fa-snowflake'; // Snow
    } else if (conditionCode >= 700 && conditionCode < 800) {
        return 'fas fa-smog'; // Atmosphere (fog, mist, etc.)
    } else if (conditionCode === 800) {
        return 'fas fa-sun'; // Clear sky
    } else if (conditionCode > 800 && conditionCode < 900) {
        return 'fas fa-cloud'; // Clouds
    } else {
        return 'fas fa-cloud-sun'; // Default
    }
}

function generateReport() {
    showNotification('Relatório gerado com sucesso!');
}

function updateConsumptionChart(period) {
    let labels, data;
    
    switch (period) {
        case 'day':
            labels = Array.from({length: 24}, (_, i) => `${i}h`);
            data = consumptionData.day;
            break;
        case 'week':
            labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
            data = consumptionData.week;
            break;
        case 'month':
            labels = Array.from({length: 30}, (_, i) => `${i+1}`);
            data = consumptionData.month;
            break;
        case 'year':
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            data = consumptionData.year;
            break;
    }
    
    window.consumptionChart.data.labels = labels;
    window.consumptionChart.data.datasets[0].data = data;
    window.consumptionChart.update();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Auto-hide after 5 seconds
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Energy Saving Tips
    function initializeEnergyTips() {
        const tipsContainer = document.querySelector('.energy-tips-list');
        if (!tipsContainer) return;
        
        const tips = [
            {
                title: 'Desligue aparelhos em standby',
                description: 'Aparelhos em modo de espera podem consumir até 10% da energia residencial.',
                icon: 'fa-power-off',
                saving: '5-10%'
            },
            {
                title: 'Use lâmpadas LED',
                description: 'Lâmpadas LED consomem até 85% menos energia que as incandescentes tradicionais.',
                icon: 'fa-lightbulb',
                saving: '5-15%'
            },
            {
                title: 'Otimize o uso do ar condicionado',
                description: 'Cada grau a menos no ar condicionado economiza cerca de 10% de energia.',
                icon: 'fa-snowflake',
                saving: '10-20%'
            },
            {
                title: 'Lave roupas com água fria',
                description: 'Até 90% da energia usada pela máquina de lavar é para aquecer a água.',
                icon: 'fa-tshirt',
                saving: '3-5%'
            },
            {
                title: 'Mantenha os filtros limpos',
                description: 'Filtros sujos em aparelhos como ar condicionado reduzem a eficiência energética.',
                icon: 'fa-filter',
                saving: '5-8%'
            }
        ];
        
        tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'energy-tip';
            tipElement.innerHTML = `
                <div class="tip-icon">
                    <i class="fas ${tip.icon}"></i>
                </div>
                <div class="tip-content">
                    <h4>${tip.title}</h4>
                    <p>${tip.description}</p>
                    <div class="tip-saving">Economia potencial: <span>${tip.saving}</span></div>
                </div>
            `;
            
            tipsContainer.appendChild(tipElement);
        });
    }
    
    // Initialize energy tips when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeEnergyTips();
        
        // Add event listener for energy tips toggle
        const tipsToggle = document.getElementById('tips-toggle');
        const tipsContainer = document.querySelector('.energy-tips-container');
        
        if (tipsToggle && tipsContainer) {
            tipsToggle.addEventListener('click', function() {
                tipsContainer.classList.toggle('expanded');
                tipsToggle.querySelector('i').classList.toggle('fa-chevron-down');
                tipsToggle.querySelector('i').classList.toggle('fa-chevron-up');
            });
        }
    });
    
    // Export data functionality
    function exportConsumptionData() {
        const period = timePeriodSelect.value;
        let data, filename;
        
        switch (period) {
            case 'day':
                data = {
                    labels: Array.from({length: 24}, (_, i) => `${i}h`),
                    values: consumptionData.day
                };
                filename = 'consumo_diario.csv';
                break;
            case 'week':
                data = {
                    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
                    values: consumptionData.week
                };
                filename = 'consumo_semanal.csv';
                break;
            case 'month':
                data = {
                    labels: Array.from({length: 30}, (_, i) => `${i+1}`),
                    values: consumptionData.month
                };
                filename = 'consumo_mensal.csv';
                break;
            case 'year':
                data = {
                    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                    values: consumptionData.year
                };
                filename = 'consumo_anual.csv';
                break;
        }
        
        // Create CSV content
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Período,Consumo (kWh)\n';
        
        data.labels.forEach((label, index) => {
            csvContent += `${label},${data.values[index]}\n`;
        });
        
        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        
        // Trigger download
        link.click();
        document.body.removeChild(link);
        
        showNotification('Dados exportados com sucesso!');
    }
    
    // Add event listener for export button
    document.addEventListener('DOMContentLoaded', function() {
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportConsumptionData);
        }
    });
    
    // Print report functionality
    function printReport() {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        
        // Get current date
        const currentDate = new Date();
        const dateFormatted = currentDate.toLocaleDateString('pt-BR');
        
        // Get consumption data
        const period = timePeriodSelect.value;
        let totalConsumption = 0;
        let periodText = '';
        
        switch (period) {
            case 'day':
                totalConsumption = consumptionData.day.reduce((a, b) => a + b, 0);
                periodText = 'Diário';
                break;
            case 'week':
                totalConsumption = consumptionData.week.reduce((a, b) => a + b, 0);
                periodText = 'Semanal';
                break;
            case 'month':
                totalConsumption = consumptionData.month[new Date().getMonth()];
                periodText = 'Mensal';
                break;
            case 'year':
                totalConsumption = consumptionData.year.reduce((a, b) => a + b, 0);
                periodText = 'Anual';
                break;
        }
        
        // Get active devices
        const activeDevices = devices.filter(device => device.isActive);
        
        // Create HTML content for the report
        const reportContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Consumo de Energia</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1, h2, h3 {
                        color: #2c7be5;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 20px;
                    }
                    .section {
                        margin-bottom: 30px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table, th, td {
                        border: 1px solid #ddd;
                    }
                    th, td {
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background-color: #f8f9fa;
                    }
                    .footer {
                        margin-top: 50px;
                        text-align: center;
                        font-size: 0.8em;
                        color: #6c757d;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Relatório de Consumo de Energia</h1>
                    <p>Data: ${dateFormatted}</p>
                </div>
                
                <div class="section">
                    <h2>Resumo de Consumo ${periodText}</h2>
                    <p>Consumo Total: <strong>${totalConsumption.toFixed(2)} kWh</strong></p>
                    <p>Custo Estimado: <strong>R$ ${(totalConsumption * 0.60).toFixed(2)}</strong></p>
                </div>
                
                <div class="section">
                    <h2>Dispositivos Ativos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Dispositivo</th>
                                <th>Local</th>
                                <th>Potência (W)</th>
                                <th>Consumo (kWh/dia)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${activeDevices.map(device => `
                                <tr>
                                    <td>${device.name}</td>
                                    <td>${device.room}</td>
                                    <td>${device.power}</td>
                                    <td>${device.consumption}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Distribuição de Consumo</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Categoria</th>
                                <th>Percentual</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${distributionData.labels.map((label, index) => `
                                <tr>
                                    <td>${label}</td>
                                    <td>${distributionData.data[index]}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h2>Recomendações para Economia</h2>
                    <ul>
                        <li>Desligue aparelhos em standby para economizar até 10% de energia.</li>
                        <li>Substitua lâmpadas tradicionais por LED para reduzir o consumo em até 85%.</li>
                        <li>Ajuste o ar condicionado para 24°C para um equilíbrio entre conforto e economia.</li>
                        <li>Utilize eletrodomésticos com selo de eficiência energética A.</li>
                        <li>Aproveite a luz natural durante o dia.</li>
                    </ul>
                </div>
                
                <div class="footer">
                    <p>Este relatório foi gerado automaticamente pelo Sistema de Monitoramento de Consumo de Energia.</p>
                </div>
            </body>
            </html>
        `;
        
        // Write content to the new window
        printWindow.document.open();
        printWindow.document.write(reportContent);
        printWindow.document.close();
        
        // Wait for content to load before printing
        printWindow.onload = function() {
            printWindow.print();
        };
        
        showNotification('Relatório preparado para impressão!');
    }
    
    // Add event listener for print report button
    document.addEventListener('DOMContentLoaded', function() {
        const printReportBtn = document.getElementById('print-report');
        if (printReportBtn) {
            printReportBtn.addEventListener('click', printReport);
        }
    });