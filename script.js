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
                        text: 'kWh'
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
                    '#2c7be5',
                    '#00cc8e',
                    '#f6c343',
                    '#e63757',
                    '#39afd1',
                    '#6c757d',
                    '#95aac9'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    updateConsumptionData();
}

function updateConsumptionChart(period) {
    let labels = [];
    let data = [];
    
    switch (period) {
        case 'day':
            labels = Array.from({length: 24}, (_, i) => `${i}h`);
            data = consumptionData.day;
            break;
        case 'week':
            labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            data = consumptionData.week;
            break;
        case 'month':
            labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
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
    const reportPeriod = document.getElementById('report-period').value;
    const reportType = document.getElementById('report-type').value;
    const reportContent = document.getElementById('report-content');
    const reportSummary = document.getElementById('report-summary');
    
    // Sample report data
    let reportData = [];
    let reportLabels = [];
    
    switch (reportType) {
        case 'consumption':
            reportLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            reportData = consumptionData.month;
            break;
        case 'by-device':
            reportLabels = devices.map(device => device.name);
            reportData = devices.map(device => device.consumption * 30); // Monthly consumption
            break;
        case 'by-room':
            const rooms = [...new Set(devices.map(device => device.room))];
            reportLabels = rooms;
            reportData = rooms.map(room => {
                const roomDevices = devices.filter(device => device.room === room);
                return roomDevices.reduce((sum, device) => sum + device.consumption * 30, 0);
            });
            break;
        case 'comparison':
            reportLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            reportData = [
                consumptionData.month, // Current year
                consumptionData.month.map(value => value * 0.9) // Previous year (simulated)
            ];
            break;
    }
    
    // Update report chart
    updateReportChart(reportLabels, reportData, reportType);
    
    // Generate report summary
    reportSummary.innerHTML = '';
    
    const totalConsumption = Array.isArray(reportData[0]) 
        ? reportData[0].reduce((a, b) => a + b, 0) 
        : reportData.reduce((a, b) => a + b, 0);
    
    const totalCost = totalConsumption * 0.60;
    
    const summaryCard = document.createElement('div');
    summaryCard.className = 'card';
    summaryCard.innerHTML = `
        <div class="card-header">
            <h3>Resumo do Relatório</h3>
        </div>
        <div class="card-body">
            <p><strong>Período:</strong> ${getReportPeriodText(reportPeriod)}</p>
            <p><strong>Tipo:</strong> ${getReportTypeText(reportType)}</p>
            <p><strong>Consumo Total:</strong> ${totalConsumption.toFixed(2)} kWh</p>
            <p><strong>Custo Total:</strong> R$ ${totalCost.toFixed(2)}</p>
            <p><strong>Média Diária:</strong> ${(totalConsumption / 30).toFixed(2)} kWh</p>
            ${reportType === 'comparison' ? '<p><strong>Variação Anual:</strong> -10%</p>' : ''}
        </div>
    `;
    
    reportSummary.appendChild(summaryCard);
    
    // Add recommendations if consumption type
    if (reportType === 'consumption' || reportType === 'by-device') {
        const recommendationsCard = document.createElement('div');
        recommendationsCard.className = 'card';
        recommendationsCard.innerHTML = `
            <div class="card-header">
                <h3>Recomendações de Economia</h3>
            </div>
            <div class="card-body">
                <ul>
                    <li>Substitua lâmpadas incandescentes por LED para economizar até 80% de energia.</li>
                    <li>Desligue aparelhos em standby quando não estiverem em uso.</li>
                    <li>Configure o ar condicionado para uma temperatura mais econômica (23-24°C).</li>
                    <li>Utilize máquinas de lavar e secar com carga completa.</li>
                    <li>Considere instalar painéis solares para reduzir a dependência da rede elétrica.</li>
                </ul>
            </div>
        `;
        
        reportSummary.appendChild(recommendationsCard);
    }
}

function updateReportChart(labels, data, reportType) {
    const reportChartCtx = document.getElementById('report-chart').getContext('2d');
    
    if (window.reportChart) {
        window.reportChart.destroy();
    }
    
    const chartConfig = {
        type: reportType === 'by-room' || reportType === 'by-device' ? 'bar' : 'line',
        data: {
            labels: labels,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kWh'
                    }
                }
            }
        }
    };
    
    if (reportType === 'comparison') {
        chartConfig.data.datasets = [
            {
                label: 'Ano Atual',
                data: data[0],
                borderColor: '#2c7be5',
                backgroundColor: 'rgba(44, 123, 229, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Ano Anterior',
                data: data[1],
                borderColor: '#95aac9',
                backgroundColor: 'rgba(149, 170, 201, 0.1)',
                tension: 0.4,
                fill: true
            }
        ];
    } else {
        chartConfig.data.datasets = [
            {
                label: 'Consumo (kWh)',
                data: data,
                backgroundColor: reportType === 'by-room' || reportType === 'by-device' 
                    ? [
                        '#2c7be5', '#00cc8e', '#f6c343', '#e63757', 
                        '#39afd1', '#6c757d', '#95aac9', '#12263f'
                    ] 
                    : 'rgba(44, 123, 229, 0.1)',
                borderColor: '#2c7be5',
                tension: 0.4,
                fill: reportType !== 'by-room' && reportType !== 'by-device'
            }
        ];
    }
    
    window.reportChart = new Chart(reportChartCtx, chartConfig);
}

function getReportPeriodText(period) {
    switch (period) {
        case 'last-month':
            return 'Último Mês';
        case 'last-3-months':
            return 'Últimos 3 Meses';
        case 'last-6-months':
            return 'Últimos 6 Meses';
        case 'last-year':
            return 'Último Ano';
        default:
            return period;
    }
}

function getReportTypeText(type) {
    switch (type) {
        case 'consumption':
            return 'Consumo Total';
        case 'by-device':
            return 'Por Dispositivo';
        case 'by-room':
            return 'Por Cômodo';
        case 'comparison':
            return 'Comparativo';
        default:
            return type;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        transform: translateX(110%);
        transition: transform 0.3s ease-in-out;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        background-color: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.25rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification i {
        font-size: 1.25rem;
    }
`;

document.head.appendChild(notificationStyles);

// ... existing code ...

// Adicionar funcionalidade para calcular kWh com base no valor em dinheiro
const calculateBtn = document.getElementById('calculate-kwh');
const billValueInput = document.getElementById('bill-value');
const kwhRateInput = document.getElementById('kwh-rate');
const resultKwh = document.getElementById('result-kwh');

if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const billValue = parseFloat(billValueInput.value);
        const kwhRate = parseFloat(kwhRateInput.value);
        
        if (billValue && kwhRate) {
            const kwhConsumption = billValue / kwhRate;
            resultKwh.textContent = kwhConsumption.toFixed(2);
            
            // Atualizar o gráfico com o novo valor
            updateConsumptionWithBill(kwhConsumption);
            
            showNotification('Consumo calculado com sucesso!');
        } else {
            showNotification('Por favor, preencha todos os campos!', 'error');
        }
    });
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
    }
}

// Modificar a função de notificação para suportar diferentes tipos
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content ${type}">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Atualizar os estilos de notificação
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        transform: translateX(110%);
        transition: transform 0.3s ease-in-out;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        padding: 1rem 1.5rem;
        border-radius: 0.25rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: white;
    }
    
    .notification-content.success {
        background-color: var(--success-color);
    }
    
    .notification-content.error {
        background-color: var(--danger-color);
    }
    
    .notification i {
        font-size: 1.25rem;
    }
`;

// ... existing code ...