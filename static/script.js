document.addEventListener('DOMContentLoaded', function() {
    console.log('[test] script.js loaded');
    const testState = {
        currentStep: 1,
        responses: {
            usoPanel: null,
            tienePanel: null,
            porcentajeActual: null,
            porcentajeDeseado: null,
            gastoLuz: null,
            provincia: null,
            comuna: null
        }
    };

    function saveResponse(step, value) {
        switch(step) {
            case 1: testState.responses.usoPanel = value; break;
            case 2: testState.responses.tienePanel = value; break;
            case '2.1': testState.responses.porcentajeActual = value; break;
            case 3: testState.responses.porcentajeDeseado = value; break;
            case 4: testState.responses.gastoLuz = parseNumber(document.getElementById('gasto-luz').value); break;
            default: break;
        }
    }

    function parseNumber(str) {
        if (!str) return NaN;
        const cleaned = String(str).replace(/[^0-9\-\.]/g, '');
        const n = Number(cleaned);
        return isNaN(n) ? NaN : n;
    }

    function nextStep() {
        let nextStep;
        switch(testState.currentStep) {
            case 1: nextStep = 2; break;
            case 2: nextStep = testState.responses.tienePanel === 'si' ? '2.1' : 3; break;
            case '2.1': nextStep = 3; break;
            case 3: nextStep = 4; break;
            case 4: nextStep = 5; break;
            case 5: nextStep = 6; break;
            default: nextStep = 1;
        }
        testState.currentStep = nextStep;
        showStep(nextStep);
    }

    function prevStep() {
        let prevStep;
        switch(testState.currentStep) {
            case 2: prevStep = 1; break;
            case '2.1': prevStep = 2; break;
            case 3: prevStep = testState.responses.tienePanel === 'si' ? '2.1' : 2; break;
            case 4: prevStep = 3; break;
            case 5: prevStep = 4; break;
            case 6: prevStep = 5; break;
            default: prevStep = 1;
        }
        testState.currentStep = prevStep;
        showStep(prevStep);
    }

    function hasResponseForCurrentStep() {
        switch(testState.currentStep) {
            case 1: return !!testState.responses.usoPanel;
            case 2: return !!testState.responses.tienePanel;
            case '2.1': return !!testState.responses.porcentajeActual;
            case 3: return !!testState.responses.porcentajeDeseado;
            case 4: {
                const gastoVal = document.getElementById('gasto-luz') ? document.getElementById('gasto-luz').value : '';
                const num = parseNumber(gastoVal);
                return !isNaN(num) && num > 0;
            }
            case 5: return !!testState.responses.provincia && !!testState.responses.comuna;
            default: return true;
        }
    }

    const comunasPorProvincia = {
        'valparaiso': ['Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Valparaíso', 'Viña del Mar'],
        'marga-marga': ['Limache', 'Olmué', 'Quilpué', 'Villa Alemana'],
        'quillota': ['La Calera', 'La Cruz', 'Hijuelas', 'Nogales', 'Quillota'],
        'san-antonio': ['Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'San Antonio', 'Santo Domingo'],
        'san-felipe': ['Catemu', 'Llay Llay', 'Panquehue', 'Putaendo', 'San Felipe', 'Santa María'],
        'los-andes': ['Calle Larga', 'Los Andes', 'Rinconada', 'San Esteban'],
        'petorca': ['Cabildo', 'La Ligua', 'Papudo', 'Petorca', 'Zapallar']
    };

    initTest();

    function initTest() {
        showStep(testState.currentStep);
        bindEvents();
        initLocationSelector();
    }

    function bindEvents() {
        document.querySelectorAll('.option-card').forEach(card => card.addEventListener('click', function() { selectOption(this); }));
        document.querySelectorAll('.next-btn').forEach(btn => btn.addEventListener('click', nextStep));
        document.querySelectorAll('.prev-btn').forEach(btn => btn.addEventListener('click', prevStep));
        const finishBtn = document.getElementById('finish-btn'); if (finishBtn) finishBtn.addEventListener('click', showResults);
        const heroBtn = document.querySelector('.hero .btn'); if (heroBtn) heroBtn.addEventListener('click', function(e){ e.preventDefault(); document.getElementById('test').scrollIntoView({ behavior: 'smooth' }); });

        const gastoInput = document.getElementById('gasto-luz');
        if (gastoInput) {
            gastoInput.addEventListener('input', function() {
                const val = parseNumber(this.value);
                testState.responses.gastoLuz = isNaN(val) ? null : val;
                updateNextButton();
            });
            updateNextButton();
        }
    }

    function initLocationSelector() {
        const provinciaSelect = document.getElementById('provincia-select');
        const comunaSelect = document.getElementById('comuna-select');
        if (!provinciaSelect || !comunaSelect) return;

        provinciaSelect.addEventListener('change', function() {
            const provincia = this.value;
            if (provincia) {
                comunaSelect.disabled = false;
                comunaSelect.innerHTML = '<option value="">Selecciona una comuna</option>';
                comunasPorProvincia[provincia].forEach(comuna => {
                    const option = document.createElement('option'); option.value = comuna.toLowerCase().replace(/ /g, '-'); option.textContent = comuna; comunaSelect.appendChild(option);
                });
                testState.responses.provincia = provincia; testState.responses.comuna = null;
            } else {
                comunaSelect.disabled = true; comunaSelect.innerHTML = '<option value="">Primero selecciona una provincia</option>'; testState.responses.provincia = null; testState.responses.comuna = null;
            }
            updateLocationConfirmation(); updateFinishButton();
        });

        comunaSelect.addEventListener('change', function() { testState.responses.comuna = this.value; updateLocationConfirmation(); updateFinishButton(); });
    }

    function updateLocationConfirmation() {
        const selectedLocation = document.getElementById('selected-location');
        const locationText = document.getElementById('location-text');
        if (testState.responses.provincia && testState.responses.comuna) {
            const provinciaText = document.querySelector(`#provincia-select option[value="${testState.responses.provincia}"]`).textContent;
            const comunaText = document.querySelector(`#comuna-select option[value="${testState.responses.comuna}"]`).textContent;
            locationText.textContent = `${comunaText}, ${provinciaText}`; selectedLocation.style.display = 'block';
        } else {
            selectedLocation.style.display = 'none';
        }
    }

    function updateFinishButton() { const finishBtn = document.getElementById('finish-btn'); if (finishBtn) finishBtn.disabled = !(testState.responses.provincia && testState.responses.comuna); }

    function selectOption(card) { const step = testState.currentStep; const value = card.getAttribute('data-value'); card.closest('.options-grid').querySelectorAll('.option-card').forEach(opt => opt.classList.remove('selected')); card.classList.add('selected'); saveResponse(step, value); updateNextButton(); }

    function showStep(step) {
        document.querySelectorAll('.test-step').forEach(stepEl => stepEl.classList.remove('active'));
        const stepId = step === '2.1' ? 'step2-1' : `step${step}`;
        const currentStepEl = document.getElementById(stepId);
        if (currentStepEl) currentStepEl.classList.add('active');
        updateProgress(step); updateNextButton();
    }

    function updateProgress(step) {
        const steps = [1,2,'2.1',3,4,5,6];
        const currentIndex = steps.indexOf(step);
        const stepId = step === '2.1' ? 'step2-1' : `step${step}`;
        const currentStepEl = document.getElementById(stepId);
        if (!currentStepEl) return;
        const progressSteps = currentStepEl.querySelectorAll('.progress-step');
        progressSteps.forEach((ps, idx) => {
            ps.classList.remove('active','completed');
            if (idx < currentIndex) ps.classList.add('completed');
            else if (idx === currentIndex) ps.classList.add('active');
        });
    }

    function updateNextButton() { const hasResponse = hasResponseForCurrentStep(); const nextBtn = document.querySelector('.test-step.active .next-btn'); if (nextBtn) nextBtn.disabled = !hasResponse; }

    function showResults() { const recommendation = calculateRecommendation(); displayRecommendation(recommendation); showStep(6); }

    function calculateRecommendation() {
        const { porcentajeDeseado, usoPanel } = testState.responses;
        if (porcentajeDeseado === '50-futuro') return { sistema: 'On-Grid de 2kW', paneles: '3-4 paneles solares', ahorro: '50%', costoMensual: '$30.000 mensual' };
        if (porcentajeDeseado === '75-futuro') return { sistema: 'On-Grid de 3kW', paneles: '4-6 paneles solares', ahorro: '75%', costoMensual: '$45.000 mensual' };
        if (usoPanel === 'cortes-luz') return { sistema: 'Híbrido de 5kW con baterías', paneles: '8-10 paneles solares', ahorro: '90%', costoMensual: '$60.000 mensual' };
        return { sistema: 'Off-Grid de 4kW', paneles: '6-8 paneles solares', ahorro: '100%', costoMensual: '$55.000 mensual' };
    }

    function displayRecommendation(recommendation) {
        const projectInfo = document.querySelector('.project-info');
        if (!projectInfo) return;
        projectInfo.innerHTML = `
            <h3>Tu sistema solar recomendado</h3>
            <p>Basado en tus respuestas, te recomendamos un sistema <strong>${recommendation.sistema}</strong> que te permitirá ahorrar aproximadamente <strong>${recommendation.ahorro}</strong> en tu cuenta de luz.</p>
            <div class="recommendation-details">
                <div class="detail-item"><i class="fas fa-solar-panel"></i><span>${recommendation.paneles}</span></div>
                <div class="detail-item"><i class="fas fa-bolt"></i><span>Inversor de ${recommendation.sistema.split(' ')[2]}</span></div>
                <div class="detail-item"><i class="fas fa-money-bill-wave"></i><span>Ahorro estimado: ${recommendation.costoMensual}</span></div>
            </div>
        `;
    }
});
