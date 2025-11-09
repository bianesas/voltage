document.addEventListener('DOMContentLoaded', function() {
    // Estado del test
    const testState = {
        currentStep: 1,
        responses: {
            tienePanel: null,
            porcentajeActual: null,
            usoPanel: null,
            porcentajeDeseado: null,
            provincia: null,
            comuna: null
        }
    };

    // Datos de comunas por provincia
    const comunasPorProvincia = {
        'valparaiso': ['Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Valparaíso', 'Viña del Mar'],
        'marga-marga': ['Limache', 'Olmué', 'Quilpué', 'Villa Alemana'],
        'quillota': ['La Calera', 'La Cruz', 'Hijuelas', 'Nogales', 'Quillota'],
        'san-antonio': ['Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'San Antonio', 'Santo Domingo'],
        'san-felipe': ['Catemu', 'Llay Llay', 'Panquehue', 'Putaendo', 'San Felipe', 'Santa María'],
        'los-andes': ['Calle Larga', 'Los Andes', 'Rinconada', 'San Esteban'],
        'petorca': ['Cabildo', 'La Ligua', 'Papudo', 'Petorca', 'Zapallar']
    };

    // Inicializar test
    initTest();

    function initTest() {
        showStep(testState.currentStep);
        bindEvents();
        initLocationSelector();
    }

    function bindEvents() {
        // Seleccionar opciones
        document.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', function() {
                selectOption(this);
            });
        });

        // Botones siguiente
        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', nextStep);
        });

        // Botones anterior
        document.querySelectorAll('.prev-btn').forEach(btn => {
            btn.addEventListener('click', prevStep);
        });

        // Botón finalizar
        const finishBtn = document.getElementById('finish-btn');
        if (finishBtn) {
            finishBtn.addEventListener('click', showResults);
        }

        // Scroll al test
        const heroBtn = document.querySelector('.hero .btn');
        if (heroBtn) {
            heroBtn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('test').scrollIntoView({ 
                    behavior: 'smooth' 
                });
            });
        }
    }

    function initLocationSelector() {
        const provinciaSelect = document.getElementById('provincia-select');
        const comunaSelect = document.getElementById('comuna-select');
        
        provinciaSelect.addEventListener('change', function() {
            const provincia = this.value;
            
            if (provincia) {
                comunaSelect.disabled = false;
                comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
                
                comunasPorProvincia[provincia].forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna.toLowerCase().replace(/ /g, '-');
                    option.textContent = comuna;
                    comunaSelect.appendChild(option);
                });
                
                testState.responses.provincia = provincia;
                testState.responses.comuna = null;
            } else {
                comunaSelect.disabled = true;
                comunaSelect.innerHTML = '<option value="">Primero selecciona una provincia</option>';
                testState.responses.provincia = null;
                testState.responses.comuna = null;
            }
            
            updateLocationConfirmation();
            updateFinishButton();
        });
        
        comunaSelect.addEventListener('change', function() {
            testState.responses.comuna = this.value;
            updateLocationConfirmation();
            updateFinishButton();
        });
    }

    function updateLocationConfirmation() {
        const selectedLocation = document.getElementById('selected-location');
        const locationText = document.getElementById('location-text');
        
        if (testState.responses.provincia && testState.responses.comuna) {
            const provinciaText = document.querySelector(`#provincia-select option[value="${testState.responses.provincia}"]`).textContent;
            const comunaText = document.querySelector(`#comuna-select option[value="${testState.responses.comuna}"]`).textContent;
            
            locationText.textContent = `${comunaText}, ${provinciaText}`;
            selectedLocation.style.display = 'block';
        } else {
            selectedLocation.style.display = 'none';
        }
    }

    function updateFinishButton() {
        const finishBtn = document.getElementById('finish-btn');
        if (finishBtn) {
            finishBtn.disabled = !(testState.responses.provincia && testState.responses.comuna);
        }
    }

    function selectOption(card) {
        const step = testState.currentStep;
        const value = card.getAttribute('data-value');
        
        // Deseleccionar otros
        card.closest('.options-grid').querySelectorAll('.option-card').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Seleccionar este
        card.classList.add('selected');
        
        // Guardar respuesta
        saveResponse(step, value);
        updateNextButton();
    }

    function saveResponse(step, value) {
        switch(step) {
            case 1:
                testState.responses.tienePanel = value;
                break;
            case "1.1":
                testState.responses.porcentajeActual = value;
                break;
            case 2:
                testState.responses.usoPanel = value;
                break;
            case 3:
                testState.responses.porcentajeDeseado = value;
                break;
        }
    }

    function nextStep() {
        let nextStep;
        
        switch(testState.currentStep) {
            case 1:
                nextStep = testState.responses.tienePanel === "si" ? "1.1" : 2;
                break;
            case "1.1":
                nextStep = 2;
                break;
            case 2:
                nextStep = 3;
                break;
            case 3:
                nextStep = 4;
                break;
            case 4:
                nextStep = 5;
                break;
            default:
                nextStep = 1;
        }
        
        testState.currentStep = nextStep;
        showStep(nextStep);
    }

    function prevStep() {
        let prevStep;
        
        switch(testState.currentStep) {
            case "1.1":
                prevStep = 1;
                break;
            case 2:
                prevStep = testState.responses.tienePanel === "si" ? "1.1" : 1;
                break;
            case 3:
                prevStep = 2;
                break;
            case 4:
                prevStep = 3;
                break;
            case 5:
                prevStep = 4;
                break;
            default:
                prevStep = 1;
        }
        
        testState.currentStep = prevStep;
        showStep(prevStep);
    }

    function showStep(step) {
        // Ocultar todos los pasos
        document.querySelectorAll('.test-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Mostrar paso actual
        const stepId = step === "1.1" ? "step1-1" : `step${step}`;
        const currentStepEl = document.getElementById(stepId);
        
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        updateProgress(step);
        updateNextButton();
    }

    function updateProgress(step) {
        const steps = [1, "1.1", 2, 3, 4];
        const currentIndex = steps.indexOf(step);
        
        document.querySelectorAll('.progress-step').forEach((progressStep, index) => {
            progressStep.classList.remove('active', 'completed');
            
            if (index < currentIndex) {
                progressStep.classList.add('completed');
            } else if (index === currentIndex) {
                progressStep.classList.add('active');
            }
        });
    }

    function updateNextButton() {
        const hasResponse = hasResponseForCurrentStep();
        const nextBtn = document.querySelector('.test-step.active .next-btn');
        
        if (nextBtn) {
            nextBtn.disabled = !hasResponse;
        }
    }

    function hasResponseForCurrentStep() {
        switch(testState.currentStep) {
            case 1:
                return !!testState.responses.tienePanel;
            case "1.1":
                return !!testState.responses.porcentajeActual;
            case 2:
                return !!testState.responses.usoPanel;
            case 3:
                return !!testState.responses.porcentajeDeseado;
            case 4:
                return !!testState.responses.provincia && !!testState.responses.comuna;
            default:
                return true;
        }
    }

    function showResults() {
        const recommendation = calculateRecommendation();
        displayRecommendation(recommendation);
        showStep(5);
    }

    function calculateRecommendation() {
        const { porcentajeDeseado, usoPanel } = testState.responses;
        
        if (porcentajeDeseado === "50-futuro") {
            return {
                sistema: "On-Grid de 2kW",
                paneles: "3-4 paneles solares",
                ahorro: "50%",
                costoMensual: "$30.000 mensual"
            };
        } else if (porcentajeDeseado === "75-futuro") {
            return {
                sistema: "On-Grid de 3kW",
                paneles: "4-6 paneles solares",
                ahorro: "75%",
                costoMensual: "$45.000 mensual"
            };
        } else {
            if (usoPanel === "cortes-luz") {
                return {
                    sistema: "Híbrido de 5kW con baterías",
                    paneles: "8-10 paneles solares",
                    ahorro: "90%",
                    costoMensual: "$60.000 mensual"
                };
            } else {
                return {
                    sistema: "Off-Grid de 4kW",
                    paneles: "6-8 paneles solares",
                    ahorro: "100%",
                    costoMensual: "$55.000 mensual"
                };
            }
        }
    }

    function displayRecommendation(recommendation) {
        const projectInfo = document.querySelector('.project-info');
        if (projectInfo) {
            projectInfo.innerHTML = `
                <h3>Tu sistema solar recomendado</h3>
                <p>Basado en tus respuestas, te recomendamos un sistema <strong>${recommendation.sistema}</strong> que te permitirá ahorrar aproximadamente <strong>${recommendation.ahorro}</strong> en tu cuenta de luz.</p>
                <div class="recommendation-details">
                    <div class="detail-item">
                        <i class="fas fa-solar-panel"></i>
                        <span>${recommendation.paneles}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-bolt"></i>
                        <span>Inversor de ${recommendation.sistema.split(' ')[2]}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>Ahorro estimado: ${recommendation.costoMensual}</span>
                    </div>
                </div>
            `;
        }
    }
});