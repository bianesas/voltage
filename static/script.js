document.addEventListener('DOMContentLoaded', function() {
    // === NUEVO ESTADO CON ORDEN ACTUALIZADO ===
    const testState = {
        currentStep: 1, // Empieza en Pregunta 2 (ahora step1)
        responses: {
            usoPanel: null,              // P2: "reducir-costo", "vender-excedente", etc.
            tienePanel: null,            // P1: "si" o "no"
            porcentajeActual: null,      // P1.1: "50", "75", "100", "nose"
            porcentajeDeseado: null,     // P3: "50-futuro", "75-futuro", "100-futuro"
            gastoLuz: null,              // P5: valor numérico
            provincia: null,             // P4: "valparaiso", "marga-marga", etc.
            comuna: null                 // P4: "casablanca", "concon", etc.
        }
    };

    // === NUEVAS FUNCIONES ACTUALIZADAS ===
    function saveResponse(step, value) {
        switch(step) {
            case 1: // Pregunta 2 (uso panel)
                testState.responses.usoPanel = value;
                break;
            case 2: // Pregunta 1 (tiene panel)
                testState.responses.tienePanel = value;
                break;
            case "2.1": // Pregunta 1.1 (porcentaje actual)
                testState.responses.porcentajeActual = value;
                break;
            case 3: // Pregunta 3 (porcentaje deseado)
                testState.responses.porcentajeDeseado = value;
                break;
            case 4: // Pregunta 5 (gasto luz)
                testState.responses.gastoLuz = document.getElementById('gasto-luz').value;
                break;
            case 5: // Pregunta 4 (ubicación) - se maneja automáticamente
                break;
        }
    }

    function nextStep() {
        let nextStep;
        
        switch(testState.currentStep) {
            case 1: // Después de P2, va a P1
                nextStep = 2;
                break;
            case 2: // Después de P1, decide si va a P1.1 o P3
                if (testState.responses.tienePanel === "si") {
                    nextStep = "2.1";
                } else {
                    nextStep = 3;
                }
                break;
            case "2.1": // Después de P1.1, va a P3
                nextStep = 3;
                break;
            case 3: // Después de P3, va a P5
                nextStep = 4;
                break;
            case 4: // Después de P5, va a P4
                nextStep = 5;
                break;
            case 5: // Después de P4, va a resultados
                nextStep = 6;
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
            case 2: // Desde P1, volver a P2
                prevStep = 1;
                break;
            case "2.1": // Desde P1.1, volver a P1
                prevStep = 2;
                break;
            case 3: // Desde P3, volver según tenga panel o no
                if (testState.responses.tienePanel === "si") {
                    prevStep = "2.1";
                } else {
                    prevStep = 2;
                }
                break;
            case 4: // Desde P5, volver a P3
                prevStep = 3;
                break;
            case 5: // Desde P4, volver a P5
                prevStep = 4;
                break;
            case 6: // Desde resultados, volver a P4
                prevStep = 5;
                break;
            default:
                prevStep = 1;
        }
        
        testState.currentStep = prevStep;
        showStep(prevStep);
    }

    function hasResponseForCurrentStep() {
        switch(testState.currentStep) {
            case 1: // P2
                return !!testState.responses.usoPanel;
            case 2: // P1
                return !!testState.responses.tienePanel;
            case "2.1": // P1.1
                return !!testState.responses.porcentajeActual;
            case 3: // P3
                return !!testState.responses.porcentajeDeseado;
            case 4: // P5
                const gasto = document.getElementById('gasto-luz').value;
                return gasto && gasto.trim() !== '' && !isNaN(gasto);
            case 5: // P4
                return !!testState.responses.provincia && !!testState.responses.comuna;
            default:
                return true;
        }
    }

    // === CÓDIGO ORIGINAL (CON AJUSTES) ===
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

    function showStep(step) {
        // Ocultar todos los pasos
        document.querySelectorAll('.test-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Mostrar paso actual
        const stepId = step === "2.1" ? "step2-1" : `step${step}`;
        const currentStepEl = document.getElementById(stepId);
        
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        updateProgress(step);
        updateNextButton();
    }

    function updateProgress(step) {
        const steps = [1, 2, "2.1", 3, 4, 5];
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

    function showResults() {
        const recommendation = calculateRecommendation();
        displayRecommendation(recommendation);
        showStep(6);  // Actualizado a paso 6
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
