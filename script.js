// Information développeur (protection intégrée)
const DEVELOPER_INFO = {
    name: "Louisa Karoza",
    github: "Andryandraina",
    project: "Smart IoT Agriculture System",
    version: "1.0.0",
    created: new Date().getFullYear(),
    signature: "IoT-Agriculture-Andryandraina-2024"
};

// Fonction pour afficher les informations développeur
function showDeveloperInfo() {
    alert(`🌱 Système d'Agriculture Intelligente IoT\n\n` +
          `👨‍💻 Développeur: ${DEVELOPER_INFO.name}\n` +
          `🚀 GitHub: ${DEVELOPER_INFO.github}\n` +
          `📅 Année: ${DEVELOPER_INFO.created}\n` +
          `🔧 Version: ${DEVELOPER_INFO.version}\n\n` +
          `Je suis ouverte à toute collaboration n'hésitez pas à me contacter par email : andrainalouisa@gmail.com 
          et linkedin : Louisa Karoza Andriandraina`
        );
}

// Protection du code (détection de modification)
function checkIntegrity() {
    const signatures = document.querySelectorAll('.signature-watermark, .developer-signature, .project-footer');
    if (signatures.length < 3) {
        console.warn('⚠️ Signature du développeur manquante - Projet créé par Andryandraina (Louisa Karoza)');
    }
}

// Vérification au chargement
window.addEventListener('load', checkIntegrity);


// Configuration de la simulation
const plotCount = 25;
const updateInterval = 2000; // 2 secondes
let simulationRunning = true;

// Données de la ferme
let farmData = {
    plots: [],
    irrigationOn: false,
    autoMode: true,
    moistureThreshold: 40,
    irrigationIntensity: 5,
    temperature: 22,
    sunlight: 50000,
    weatherForecast: [],
    lastIrrigationTime: null
};

// Éléments DOM
const plotsContainer = document.getElementById('plots-container');
const plotTooltip = document.getElementById('plot-tooltip');
const irrigationToggle = document.getElementById('irrigation-toggle');
const autoModeToggle = document.getElementById('auto-mode');
const moistureThreshold = document.getElementById('moisture-threshold');
const thresholdValue = document.getElementById('threshold-value');
const irrigationIntensity = document.getElementById('irrigation-intensity');
const intensityValue = document.getElementById('intensity-value');
const avgMoistureDisplay = document.getElementById('avg-moisture');
const temperatureDisplay = document.getElementById('temperature');
const sunlightDisplay = document.getElementById('sunlight');
const moistureIndicator = document.getElementById('moisture-indicator');
const tempIndicator = document.getElementById('temp-indicator');
const sunlightIndicator = document.getElementById('sunlight-indicator');
const alertsContainer = document.getElementById('alerts-container');
const forecastContainer = document.getElementById('forecast-container');
const plotTableBody = document.getElementById('plot-table-body');

// Initialiser les parcelles
function initializePlots() {
    plotsContainer.innerHTML = '';
    farmData.plots = [];
    
    for (let i = 0; i < plotCount; i++) {
        const plot = {
            id: i,
            moisture: Math.floor(Math.random() * 30) + 50, // 50-80%
            irrigating: false,
            health: 'good',
            lastMoistureValues: Array(5).fill(50) // Historique récent
        };
        
        farmData.plots.push(plot);
        
        const plotElement = document.createElement('div');
        plotElement.className = 'plot';
        plotElement.dataset.id = i;
        plotElement.style.backgroundColor = getMoistureColor(plot.moisture);
        
        plotElement.addEventListener('mouseover', (e) => showPlotTooltip(e, plot));
        plotElement.addEventListener('mouseout', hidePlotTooltip);
        plotElement.addEventListener('click', () => showPlotDetails(plot));
        
        plotsContainer.appendChild(plotElement);
    }
}

// Afficher l'infobulle de la parcelle
function showPlotTooltip(e, plot) {
    const plotElement = e.target;
    const rect = plotElement.getBoundingClientRect();
    
    plotTooltip.style.display = 'block';
    plotTooltip.style.left = `${rect.left + rect.width / 2}px`;
    plotTooltip.style.top = `${rect.top}px`;
    
    let status;
    if (plot.moisture < 30) status = 'CRITIQUE (trop sec)';
    else if (plot.moisture < 50) status = 'ALERTE (assez sec)';
    else if (plot.moisture < 70) status = 'OPTIMAL';
    else status = 'HUMIDE';
    
    plotTooltip.innerHTML = `
        <strong>Parcelle #${plot.id + 1}</strong><br>
        Humidité: ${plot.moisture.toFixed(1)}%<br>
        État: <strong>${status}</strong><br>
        Irrigation: ${plot.irrigating ? '💧 ACTIVE' : '❌ INACTIVE'}
    `;
}

function hidePlotTooltip() {
    plotTooltip.style.display = 'none';
}

// Afficher les détails d'une parcelle
function showPlotDetails(plot) {
    alert(`Détails Parcelle #${plot.id + 1}\n\n` +
          `Humidité actuelle: ${plot.moisture.toFixed(1)}%\n` +
          `Irrigation: ${plot.irrigating ? 'ACTIVE' : 'INACTIVE'}\n` +
          `Tendance: ${getTrendIcon(plot.lastMoistureValues)}\n` +
          `Dernières valeurs: ${plot.lastMoistureValues.map(v => v.toFixed(1)).join(' → ')}%`);
}

// Obtenir l'icône de tendance
function getTrendIcon(values) {
    if (values.length < 2) return '➖';
    const diff = values[values.length - 1] - values[0];
    return diff > 1 ? '📈' : diff < -1 ? '📉' : '➖';
}

// Obtenir la couleur en fonction de l'humidité
function getMoistureColor(moisture) {
    if (moisture < 30) return '#FF5722'; // Rouge/Orange pour sec
    if (moisture < 50) return '#FFC107'; // Jaune pour assez sec
    if (moisture < 70) return '#4CAF50'; // Vert pour optimal
    return '#2196F3'; // Bleu pour humide
}

// Mettre à jour l'affichage des parcelles
function updatePlotsDisplay() {
    const plotElements = document.querySelectorAll('.plot');
    
    farmData.plots.forEach((plot, index) => {
        const plotElement = plotElements[index];
        plotElement.style.backgroundColor = getMoistureColor(plot.moisture);
        
        if (plot.irrigating) {
            plotElement.classList.add('irrigating');
        } else {
            plotElement.classList.remove('irrigating');
        }
    });
}

// Simuler l'évolution des conditions
function simulateConditions() {
    // Changer légèrement la température et l'ensoleillement
    farmData.temperature += (Math.random() * 2 - 1);
    farmData.temperature = Math.max(15, Math.min(35, farmData.temperature));
    
    farmData.sunlight += (Math.random() * 10000 - 5000);
    farmData.sunlight = Math.max(10000, Math.min(100000, farmData.sunlight));
    
    // Mettre à jour les jauges
    temperatureDisplay.textContent = farmData.temperature.toFixed(1);
    sunlightDisplay.textContent = Math.floor(farmData.sunlight).toLocaleString();
    
    tempIndicator.style.left = `${((farmData.temperature - 15) / 20) * 100}%`;
    sunlightIndicator.style.left = `${((farmData.sunlight - 10000) / 90000) * 100}%`;
    
    // Calculer l'humidité moyenne
    const totalMoisture = farmData.plots.reduce((sum, plot) => sum + plot.moisture, 0);
    const avgMoisture = totalMoisture / farmData.plots.length;
    avgMoistureDisplay.textContent = avgMoisture.toFixed(1);
    moistureIndicator.style.left = `${avgMoisture}%`;
    
    // Irrigation automatique
    if (farmData.autoMode) {
        farmData.plots.forEach(plot => {
            if (plot.moisture < farmData.moistureThreshold && !plot.irrigating) {
                plot.irrigating = true;
                farmData.lastIrrigationTime = new Date();
            } else if (plot.moisture >= farmData.moistureThreshold + 10 && plot.irrigating) {
                plot.irrigating = false;
            }
        });
    }
    
    // Irrigation manuelle
    if (farmData.irrigationOn) {
        farmData.plots.forEach(plot => {
            if (!plot.irrigating) {
                plot.irrigating = true;
                farmData.lastIrrigationTime = new Date();
            }
        });
    }
    
    // Mettre à jour l'humidité des parcelles
    farmData.plots.forEach(plot => {
        // Garder l'historique des 5 dernières valeurs
        plot.lastMoistureValues.shift();
        plot.lastMoistureValues.push(plot.moisture);
        
        // Évaporation naturelle (plus marquée qu'avant)
        const evaporationRate = 0.5 + 
                            (farmData.temperature - 20) * 0.02 + 
                            (farmData.sunlight - 50000) / 100000;
        
        plot.moisture -= evaporationRate;
        
        // Irrigation (effet plus visible)
        if (plot.irrigating) {
            plot.moisture += farmData.irrigationIntensity * 0.8;
        }
        
        // Garder entre 0% et 100%
        plot.moisture = Math.max(0, Math.min(100, plot.moisture));
        
        // Déterminer l'état de santé
        if (plot.moisture < 20 || plot.moisture > 85) {
            plot.health = 'critical';
        } else if (plot.moisture < 30 || plot.moisture > 75) {
            plot.health = 'warning';
        } else {
            plot.health = 'good';
        }
    });
    
    // Mettre à jour l'affichage
    updatePlotsDisplay();
    updateTable();
    updateAlerts();
    updateChart();
}

// Mettre à jour le tableau des parcelles
function updateTable() {
    let tableHTML = '';
    
    farmData.plots.forEach(plot => {
        const trendIcon = getTrendIcon(plot.lastMoistureValues);
        const moistureBar = getMoistureBar(plot.moisture);
        
        tableHTML += `
            <tr>
                <td>${plot.id + 1}</td>
                <td>${plot.moisture.toFixed(1)}% ${moistureBar}</td>
                <td>${getHealthIcon(plot.health)} ${plot.health.toUpperCase()}</td>
                <td>${plot.irrigating ? '💧 ON' : '❌ OFF'}</td>
                <td>${trendIcon} ${plot.moisture.toFixed(1)}%</td>
            </tr>`;
    });
    
    plotTableBody.innerHTML = tableHTML;
}

// Obtenir l'icône d'état
function getHealthIcon(health) {
    return health === 'critical' ? '⚠️' : health === 'warning' ? '⚠️' : '✅';
}

// Obtenir la barre d'humidité visuelle
function getMoistureBar(moisture) {
    const width = Math.min(100, Math.max(0, moisture));
    return `
        <div style="display: inline-block; width: 50px; height: 10px; background: #ddd; border-radius: 5px; margin-left: 5px;">
            <div style="width: ${width}%; height: 100%; background: ${getMoistureColor(moisture)}; border-radius: 5px;"></div>
        </div>`;
}

// Mettre à jour les alertes
function updateAlerts() {
    alertsContainer.innerHTML = '';
    
    // Vérifier les parcelles critiques
    const criticalDry = farmData.plots.filter(p => p.moisture < 20);
    const criticalWet = farmData.plots.filter(p => p.moisture > 85);
    const warningDry = farmData.plots.filter(p => p.moisture < 30 && p.moisture >= 20);
    const warningWet = farmData.plots.filter(p => p.moisture > 75 && p.moisture <= 85);
    
    if (criticalDry.length > 0) {
        addAlert(`danger`, `${criticalDry.length} parcelle(s) TROP SÈCHE(S) (<20%) - Irrigation urgente nécessaire`);
    }
    
    if (criticalWet.length > 0) {
        addAlert(`danger`, `${criticalWet.length} parcelle(s) TROP HUMIDE(S) (>85%) - Risque de pourriture`);
    }
    
    if (warningDry.length > 0) {
        addAlert(`warning`, `${warningDry.length} parcelle(s) assez sèche(s) (20-30%) - Irrigation recommandée`);
    }
    
    if (warningWet.length > 0) {
        addAlert(`warning`, `${warningWet.length} parcelle(s) assez humide(s) (75-85%) - Surveiller`);
    }
    
    // Vérifier la pluie dans les prévisions
    const rainForecast = farmData.weatherForecast.find(f => f.condition === 'rain');
    if (rainForecast) {
        addAlert(`info`, `Pluie prévue ${rainForecast.day} - Réduire l'irrigation`);
    }
    
    // Dernière irrigation
    if (farmData.lastIrrigationTime) {
        const minsAgo = Math.floor((new Date() - farmData.lastIrrigationTime) / 60000);
        if (minsAgo < 5) {
            addAlert(`info`, `Irrigation active il y a ${minsAgo} minute(s)`);
        }
    }
}

function addAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <span class="alert-icon">${type === 'danger' ? '⚠️' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
    `;
    alertsContainer.appendChild(alert);
}

// Générer des prévisions météo
function generateWeatherForecast() {
    const days = ['Aujourd\'hui', 'Demain', 'Après-demain'];
    const conditions = ['sunny', 'cloudy', 'rain', 'partly-cloudy'];
    const icons = {
        sunny: '☀️',
        cloudy: '☁️',
        rain: '🌧️',
        'partly-cloudy': '⛅'
    };
    
    farmData.weatherForecast = days.map(day => {
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
            day,
            condition,
            icon: icons[condition],
            tempHigh: Math.floor(Math.random() * 10) + 20,
            tempLow: Math.floor(Math.random() * 10) + 10
        };
    });
    
    updateWeatherForecast();
}

// Mettre à jour l'affichage des prévisions
function updateWeatherForecast() {
    forecastContainer.innerHTML = '';
    
    farmData.weatherForecast.forEach(forecast => {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="forecast-day">${forecast.day}</div>
            <div class="forecast-icon">${forecast.icon}</div>
            <div>${forecast.tempHigh}° / ${forecast.tempLow}°</div>
        `;
        forecastContainer.appendChild(item);
    });
}

// Initialiser le graphique
let moistureChart;
const moistureHistory = Array(24).fill(50);

function initializeChart() {
    const ctx = document.getElementById('moisture-chart').getContext('2d');
    
    moistureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(24).fill('').map((_, i) => `${i}h`),
            datasets: [{
                label: 'Humidité moyenne (%)',
                data: moistureHistory,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Humidité: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Mettre à jour le graphique
function updateChart() {
    // Décaler les données historiques
    moistureHistory.shift();
    
    // Calculer la nouvelle humidité moyenne
    const totalMoisture = farmData.plots.reduce((sum, plot) => sum + plot.moisture, 0);
    const avgMoisture = totalMoisture / farmData.plots.length;
    
    // Ajouter la nouvelle valeur avec variation réaliste
    const lastValue = moistureHistory[moistureHistory.length - 1] || 50;
    const newValue = avgMoisture + (Math.random() * 4 - 2); // Petit bruit aléatoire
    
    moistureHistory.push(Math.max(10, Math.min(90, newValue)));
    
    // Mettre à jour le graphique
    moistureChart.data.datasets[0].data = moistureHistory;
    moistureChart.update();
}

// Écouteurs d'événements
irrigationToggle.addEventListener('change', function() {
    farmData.irrigationOn = this.checked;
    
    if (this.checked) {
        alert("Irrigation manuelle activée ! Toutes les parcelles seront irriguées.");
    } else {
        // Éteindre l'irrigation sur toutes les parcelles
        farmData.plots.forEach(plot => {
            plot.irrigating = false;
        });
    }
});

autoModeToggle.addEventListener('change', function() {
    farmData.autoMode = this.checked;
    if (this.checked) {
        alert("Mode automatique activé ! Le système irriguera les parcelles sèches automatiquement.");
    }
});

moistureThreshold.addEventListener('input', function() {
    farmData.moistureThreshold = parseInt(this.value);
    thresholdValue.textContent = this.value;
});

irrigationIntensity.addEventListener('input', function() {
    farmData.irrigationIntensity = parseInt(this.value);
    intensityValue.textContent = this.value;
});

// Initialiser la simulation
function initializeSimulation() {
    initializePlots();
    generateWeatherForecast();
    initializeChart();
    
    // Démarrer la boucle de simulation
    setInterval(simulateConditions, updateInterval);
}

// Démarrer la simulation
window.addEventListener('load', initializeSimulation);