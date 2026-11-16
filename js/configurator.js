/**
 * PISTE Ballistic Systems - Interactive Armoring Configurator
 */

(function () {
  'use strict';

  // Configurator State
  const state = {
    currentStep: 1,
    platform: 'suv',
    platformName: 'Luxury Flagship SUV',
    level: 'b6',
    levelName: 'CEN B6 / VPAM VR7 (Assault Rifle)',
    addons: [
      { id: 'runflats', name: 'Beadlock Run-Flat Inserts (All 4 Wheels)', weight: 35 },
      { id: 'blastfloor', name: 'Underbody Blast Shield (2x DM51 Grenades)', weight: 80 }
    ],
    clientInfo: {
      fullName: '',
      organization: '',
      email: '',
      country: '',
      notes: ''
    }
  };

  // Base platform specs
  const platformSpecs = {
    suv: {
      name: 'Luxury Flagship SUV (e.g., Land Cruiser 300 / Escalade)',
      baseWeight: 2600,
      baseLeadWeeks: 6
    },
    sedan: {
      name: 'Executive State Sedan (e.g., Mercedes S-Class / Maybach)',
      baseWeight: 2200,
      baseLeadWeeks: 7
    },
    tactical: {
      name: 'Tactical Interceptor / APC (e.g., Super Duty B7)',
      baseWeight: 3800,
      baseLeadWeeks: 8
    },
    cit: {
      name: 'Cash-in-Transit (CIT) Bullion Transport Van',
      baseWeight: 3100,
      baseLeadWeeks: 5
    }
  };

  // Ballistic Level specs
  const levelSpecs = {
    b4: {
      name: 'CEN B4 / NIJ IIIA (Handgun & Shotgun)',
      armorWeight: 320,
      glassThickness: '21mm Multi-layer',
      threat: '.44 Magnum, 9mm FMJ, .357 Sig',
      leadDelta: 0
    },
    b6: {
      name: 'CEN B6 / VPAM VR7 (Assault Rifles - AK47 & NATO)',
      armorWeight: 680,
      glassThickness: '39mm Polycarbonate Spall-Shield',
      threat: '7.62x51 NATO M80, 5.56x45 SS109, 7.62x39',
      leadDelta: 1
    },
    b7: {
      name: 'CEN B7 / VPAM VR9/VR10 (Armor Piercing AP)',
      armorWeight: 1150,
      glassThickness: '54mm Heavy Ballistic Composite',
      threat: '7.62x51 AP Tungsten Core, 7.62x54R Dragunov AP',
      leadDelta: 2
    }
  };

  // Addon list definitions
  const availableAddons = {
    runflats: { name: 'Beadlock Run-Flat Inserts (All 4 Wheels + Spare)', weight: 35 },
    blastfloor: { name: 'Underbody Blast Shield (2x DM51 Grenades)', weight: 80 },
    intercom: { name: 'Concealed 100W Siren & 2-Way Intercom PA', weight: 8 },
    gunports: { name: 'Tactical Ballistic Gunports (Cabin Flush)', weight: 15 },
    battery_ecu: { name: 'Dual Ballistic Armored Battery & ECU Housing', weight: 22 },
    operable_windows: { name: 'Heavy-Duty Power Operable Front Windows (100mm)', weight: 18 }
  };

  function initConfigurator() {
    const root = document.getElementById('armoring-configurator');
    if (!root) return;

    setupRadioListeners();
    setupCheckboxListeners();
    setupNavigationButtons();
    updateLiveSummary();
  }

  function setupRadioListeners() {
    // Platform radios
    const platformInputs = document.querySelectorAll('input[name="config_platform"]');
    platformInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        state.platform = e.target.value;
        state.platformName = platformSpecs[state.platform].name;
        highlightSelectedCard('config_platform');
        updateLiveSummary();
      });
    });

    // Level radios
    const levelInputs = document.querySelectorAll('input[name="config_level"]');
    levelInputs.forEach((input) => {
      input.addEventListener('change', (e) => {
        state.level = e.target.value;
        state.levelName = levelSpecs[state.level].name;
        highlightSelectedCard('config_level');
        updateLiveSummary();
      });
    });
  }

  function setupCheckboxListeners() {
    const addonCheckboxes = document.querySelectorAll('input[name="config_addon"]');
    addonCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        recalculateAddons();
        highlightCheckboxCard(checkbox);
        updateLiveSummary();
      });
    });
  }

  function recalculateAddons() {
    const checked = document.querySelectorAll('input[name="config_addon"]:checked');
    state.addons = [];
    checked.forEach((cb) => {
      const item = availableAddons[cb.value];
      if (item) {
        state.addons.push({ id: cb.value, name: item.name, weight: item.weight });
      }
    });
  }

  function highlightSelectedCard(groupName) {
    const cards = document.querySelectorAll(`input[name="${groupName}"]`);
    cards.forEach((input) => {
      const parent = input.closest('.option-card');
      if (parent) {
        if (input.checked) {
          parent.classList.add('selected');
        } else {
          parent.classList.remove('selected');
        }
      }
    });
  }

  function highlightCheckboxCard(checkbox) {
    const parent = checkbox.closest('.option-card');
    if (!parent) return;
    if (checkbox.checked) {
      parent.classList.add('selected');
    } else {
      parent.classList.remove('selected');
    }
  }

  function setupNavigationButtons() {
    const nextBtn = document.getElementById('config-next-btn');
    const prevBtn = document.getElementById('config-prev-btn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.currentStep < 4) {
          goToStep(state.currentStep + 1);
        } else {
          submitConfiguration();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (state.currentStep > 1) {
          goToStep(state.currentStep - 1);
        }
      });
    }

    // Step pill click
    const pills = document.querySelectorAll('.step-pill');
    pills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const targetStep = parseInt(pill.getAttribute('data-step'), 10);
        if (targetStep && targetStep <= 4) {
          goToStep(targetStep);
        }
      });
    });

    // Copy spec button
    const copyBtn = document.getElementById('copy-specs-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', copySpecsToClipboard);
    }
  }

  function goToStep(step) {
    state.currentStep = step;

    // Update pill states
    const pills = document.querySelectorAll('.step-pill');
    pills.forEach((pill) => {
      const s = parseInt(pill.getAttribute('data-step'), 10);
      pill.classList.remove('active', 'completed');
      if (s === step) {
        pill.classList.add('active');
      } else if (s < step) {
        pill.classList.add('completed');
      }
    });

    // Toggle step contents
    const stepPanels = document.querySelectorAll('.step-content');
    stepPanels.forEach((panel) => {
      const s = parseInt(panel.getAttribute('data-step'), 10);
      if (s === step) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Prev / Next button labels
    const prevBtn = document.getElementById('config-prev-btn');
    const nextBtn = document.getElementById('config-next-btn');

    if (prevBtn) {
      prevBtn.style.visibility = step === 1 ? 'hidden' : 'visible';
    }

    if (nextBtn) {
      if (step === 4) {
        nextBtn.innerHTML = `<span>Submit Confidential Inquiry</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
        nextBtn.classList.add('btn-primary');
        populateFinalReview();
      } else {
        nextBtn.innerHTML = `<span>Continue to Step ${step + 1}</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
      }
    }

    updateLiveSummary();
  }

  function updateLiveSummary() {
    const curPlatform = platformSpecs[state.platform];
    const curLevel = levelSpecs[state.level];

    const addonsWeight = state.addons.reduce((acc, curr) => acc + curr.weight, 0);
    const totalArmorWeight = curLevel.armorWeight + addonsWeight;
    const estTotalLead = curPlatform.baseLeadWeeks + curLevel.leadDelta;

    // Update DOM summary fields
    const platformEl = document.getElementById('summary-platform');
    const levelEl = document.getElementById('summary-level');
    const glassEl = document.getElementById('summary-glass');
    const weightEl = document.getElementById('summary-weight');
    const leadEl = document.getElementById('summary-lead');
    const addonsContainer = document.getElementById('summary-addons');

    if (platformEl) platformEl.textContent = curPlatform.name;
    if (levelEl) levelEl.textContent = curLevel.name;
    if (glassEl) glassEl.textContent = curLevel.glassThickness;
    if (weightEl) weightEl.textContent = `+${totalArmorWeight} kg (Certified Spec)`;
    if (leadEl) leadEl.textContent = `Approx. ${estTotalLead} - ${estTotalLead + 2} Weeks`;

    if (addonsContainer) {
      if (state.addons.length === 0) {
        addonsContainer.innerHTML = '<span class="text-muted">Standard Package (No tactical add-ons)</span>';
      } else {
        addonsContainer.innerHTML = state.addons
          .map((a) => `<div class="summary-addon-item">✓ ${a.name}</div>`)
          .join('');
      }
    }
  }

  function populateFinalReview() {
    const reviewBlock = document.getElementById('config-review-specs');
    if (!reviewBlock) return;

    const curPlatform = platformSpecs[state.platform];
    const curLevel = levelSpecs[state.level];
    const addonsWeight = state.addons.reduce((acc, curr) => acc + curr.weight, 0);
    const totalAdded = curLevel.armorWeight + addonsWeight;

    reviewBlock.innerHTML = `
      <div style="background: rgba(13, 18, 26, 0.8); border: 1px solid #1e293b; border-radius: 8px; padding: 1.25rem; font-family: var(--font-mono); font-size: 0.85rem;">
        <div style="color: var(--accent-gold); font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase;">PISTE BALLISTIC DOSSIER #${Math.floor(100000 + Math.random() * 900000)}</div>
        <p><strong>Platform:</strong> ${curPlatform.name}</p>
        <p><strong>Protection Standard:</strong> ${curLevel.name}</p>
        <p><strong>Certified Threat Scope:</strong> ${curLevel.threat}</p>
        <p><strong>Ballistic Glass:</strong> ${curLevel.glassThickness}</p>
        <p><strong>Integrated Add-ons:</strong> ${state.addons.map((a) => a.name).join(', ') || 'None'}</p>
        <p><strong>Estimated Added Armor Weight:</strong> ~${totalAdded} kg</p>
        <p style="margin-top: 0.5rem; color: var(--accent-cyan);">Complies with VPAM BRV 2009 / CEN EN 1063 standards.</p>
      </div>
    `;
  }

  function copySpecsToClipboard() {
    const curPlatform = platformSpecs[state.platform];
    const curLevel = levelSpecs[state.level];
    const addonsWeight = state.addons.reduce((acc, curr) => acc + curr.weight, 0);
    const totalAdded = curLevel.armorWeight + addonsWeight;

    const specText = `[PISTE BALLISTIC SYSTEMS - VEHICLE SPECIFICATION]
Platform: ${curPlatform.name}
Ballistic Level: ${curLevel.name}
Defeats: ${curLevel.threat}
Glass Spec: ${curLevel.glassThickness}
Tactical Upgrades: ${state.addons.map((a) => a.name).join('; ') || 'Standard package'}
Approx Armor Weight Delta: +${totalAdded} kg
Certification: VPAM BRV 2009 / CEN EN 1063 / 1522
Lead Time: ${curPlatform.baseLeadWeeks + curLevel.leadDelta} Weeks`;

    navigator.clipboard.writeText(specText).then(() => {
      const copyBtn = document.getElementById('copy-specs-btn');
      if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span>Copied to Clipboard!</span>`;
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2500);
      }
    });
  }

  function submitConfiguration() {
    const nameInput = document.getElementById('config-name');
    const emailInput = document.getElementById('config-email');
    const orgInput = document.getElementById('config-org');
    const countryInput = document.getElementById('config-country');
    const notesInput = document.getElementById('config-notes');

    if (!emailInput || !emailInput.value.trim()) {
      alert('Please provide a confidential email address so our ballistic engineering team can respond.');
      if (emailInput) emailInput.focus();
      return;
    }

    state.clientInfo = {
      fullName: nameInput ? nameInput.value : '',
      email: emailInput.value,
      organization: orgInput ? orgInput.value : '',
      country: countryInput ? countryInput.value : '',
      notes: notesInput ? notesInput.value : ''
    };

    // Show confirmation modal or alert
    const confirmationModal = document.getElementById('quote-success-modal');
    if (confirmationModal) {
      confirmationModal.classList.add('active');
    } else {
      alert(`Thank you, ${state.clientInfo.fullName || 'Client'}. Your confidential vehicle specification has been registered. An armored systems engineer will contact you under strict NDA protocols.`);
    }
  }

  // Auto-init on DOM loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigurator);
  } else {
    initConfigurator();
  }
})();
