/**
 * PISTE Ballistic Systems - Main Interactive Application Logic
 */

(function () {
  'use strict';

  // Detailed vehicle specs data for modal inspection
  const vehicleDatabase = {
    'land-cruiser-300': {
      title: 'Toyota Land Cruiser 300 VXR / GR Sport',
      category: 'Luxury SUV',
      protection: 'CEN B6 / VPAM VR7 (Optional B7)',
      glass: '39mm Multi-layer curved ballistic glass with polycarbonate anti-spall shield',
      steel: 'High-Hardness 500+ HBW certified ballistic steel armor cell',
      floor: 'Underbody blast shield protecting against 2x DM51 hand grenades',
      payload: 'Heavy-duty Bilstein suspension, uprated 6-piston slotted brakes',
      range: '50 km at 50 km/h with run-flat composite beadlock inserts',
      features: [
        'Hidden perimeter overlaps ensuring zero ballistic penetration at door seams',
        'Reinforced door hinges anchored directly into chassis pillars',
        'Ballistic protection for engine ECM, dual batteries, and radiator firewall',
        'Optional 100mm operable front windows with dual heavy-duty motors',
        'Concealed PA system, two-way intercom, and exterior siren'
      ]
    },
    'cadillac-escalade': {
      title: 'Cadillac Escalade ESV Executive Armored',
      category: 'Luxury SUV',
      protection: 'CEN B6 Executive Discreet',
      glass: '40mm Curved ballistic glass with optical zero-distortion technology',
      steel: 'Integrated ballistic steel & lightweight aramid composite cabin',
      floor: 'Reinforced ballistic composite floor shield (DM51 / HG85 blast resistant)',
      payload: 'Reinforced Magnetic Ride Control, custom heavy-load air springs',
      range: 'Run-flat tire system tested to international FINABEL standards',
      features: [
        'Complete executive passenger partition with privacy smart glass',
        'Heavy-duty door retention straps and reinforced forged latching systems',
        'Emergency escape hatch hidden beneath rear cargo compartment',
        'Protected self-sealing fuel tank and high-capacity dual alternators',
        'Encrypted SATCOM communication integration'
      ]
    },
    'mercedes-s-class': {
      title: 'Mercedes-Benz S-Class / Maybach Guard S680',
      category: 'Executive Sedan',
      protection: 'VPAM VR9 / VR10 / CEN B7 (Head of State Protection)',
      glass: '54mm Multi-pane laminated glass with splinter-free polycarbonate backing',
      steel: 'Hot-formed special armor steel with bio-inspired composite overlaps',
      floor: 'Heavy blast-resistant armored belly pan protecting against landmines',
      payload: 'Hydraulic emergency power system for doors and windows',
      range: 'Michelin PAX run-flat wheel system with tire pressure sensors',
      features: [
        'Integrated fresh-air emergency breathing system with pressurized cabin',
        'Automatic fire suppression system for engine bay and passenger undercarriage',
        'Siren, exterior flashers, and two-way concealed intercom',
        'Complete OEM factory luxury interior retention with zero aesthetic compromise',
        'Certified blast test compliance to VPAM ERV 2010'
      ]
    },
    'lexus-lx600': {
      title: 'Lexus LX 600 Ultra Luxury Armored',
      category: 'Luxury SUV',
      protection: 'CEN B6 / NIJ Level III',
      glass: '38mm High-impact ballistic glass with internal defogging grid',
      steel: 'Laser-cut 3D CAD formed ballistic plating with interlocking joints',
      floor: 'Fragmentation floor shield against grenade shrapnel and blast shock',
      payload: 'Custom coil-overs, uprated sway bars, and high-temp brake pads',
      range: 'Hutchinson VFI run-flat inserts on all four tires and spare',
      features: [
        'Full 360-degree passenger capsule perimeter ballistic protection',
        'Heavy-duty reinforced door hinges fabricated from aerospace alloys',
        'Engine bay sidewall and firewall ballistic protection',
        'Discreet exterior: identical in visual appearance to standard OEM vehicle',
        'Dual battery backup with automated intelligent isolator'
      ]
    },
    'tactical-apc': {
      title: 'Tactical Interceptor / SWAT Heavy Escort',
      category: 'Tactical & CIT',
      protection: 'CEN B7 / STANAG 4569 Level 1',
      glass: '55mm Bulletproof observation vision blocks with anti-scratch coating',
      steel: 'Full monocoque ballistic steel capsule with angular blast-deflection geometry',
      floor: 'V-shaped blast-deflecting hull mitigating anti-personnel mine detonations',
      payload: 'Heavy-duty military axles, locked differentials, and heavy load springs',
      range: 'Heavy-duty 20-inch beadlock tactical wheels with solid composite run-flats',
      features: [
        'Roof-mounted 360-degree observation and tactical hatch',
        'Multi-point integrated perimeter ballistic gunports',
        'High-power 12,000 lbs tactical recovery winch and heavy bull-bar',
        'FLIR thermal night-vision camera and 360-degree surveillance feeds',
        'Riot control acoustic barrier and multi-tone siren array'
      ]
    },
    'cit-bullion-van': {
      title: 'Cash-in-Transit (CIT) Secure Bullion Transport',
      category: 'Tactical & CIT',
      protection: 'CEN B4 to B6+ Commercial Bullion Standard',
      glass: 'Ballistic certified flat glass with internal weapon access ports',
      steel: 'Dual-compartment ballistic vault with electronic interlocking doors',
      floor: 'Blast-shielded reinforced floor and fuel tank enclosure',
      payload: 'Reinforced commercial chassis, heavy-duty rear suspension',
      range: 'Composite run-flat tire system designed for sustained industrial usage',
      features: [
        'Remote GPS monitoring with automated geo-fence panic interlocks',
        'Deadbolt security locks controlled by authorized cockpit operator',
        'Drop-chute vault safe with anti-fishing ballistic baffles',
        'Independent dual-battery electrical system with tamper alarms',
        'High-definition tamper-proof digital recording system'
      ]
    }
  };

  // Initialize components on load
  function init() {
    setupHeaderScroll();
    setupMobileMenu();
    setupSmoothScroll();
    setupFleetFilters();
    setupVehicleModals();
    setupAnatomyHotspots();
    setupFAQAccordion();
    setupContactForm();
    setupModalDismissal();
  }

  // Header scroll appearance
  function setupHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu drawer
  function setupMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const drawer = document.querySelector('.mobile-drawer');
    if (!btn || !drawer) return;

    btn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const isOpen = drawer.classList.contains('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking mobile links
    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
      });
    });
  }

  // Smooth anchor link scrolling
  function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#' || !targetId.startsWith('#')) return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Fleet portfolio filtering
  function setupFleetFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.fleet-card');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter');

        cards.forEach((card) => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = 'flex';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
            card.style.opacity = '0';
          }
        });
      });
    });
  }

  // Vehicle technical specs modal
  function setupVehicleModals() {
    const modal = document.getElementById('vehicle-spec-modal');
    const triggers = document.querySelectorAll('.view-specs-btn');
    if (!modal) return;

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const vehicleKey = trigger.getAttribute('data-vehicle');
        const data = vehicleDatabase[vehicleKey];
        if (data) {
          populateModal(data);
          modal.classList.add('active');
        }
      });
    });
  }

  function populateModal(data) {
    const titleEl = document.getElementById('modal-vehicle-title');
    const badgeEl = document.getElementById('modal-vehicle-badge');
    const bodyEl = document.getElementById('modal-vehicle-body');

    if (titleEl) titleEl.textContent = data.title;
    if (badgeEl) badgeEl.textContent = data.protection;

    if (bodyEl) {
      bodyEl.innerHTML = `
        <div style="margin-bottom: 1.25rem; font-size: 0.9rem; color: var(--text-secondary);">
          <strong style="color: var(--text-primary); display: block; margin-bottom: 0.25rem;">Vehicle Class:</strong>
          ${data.category}
        </div>
        <div style="background: rgba(13, 18, 26, 0.7); border: 1px solid #1e293b; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h4 style="color: var(--accent-gold); font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem; text-transform: uppercase;">Ballistic Engineering Architecture</h4>
          <p style="margin-bottom: 0.5rem; font-size: 0.85rem;"><strong style="color: var(--accent-cyan);">Ballistic Glass:</strong> ${data.glass}</p>
          <p style="margin-bottom: 0.5rem; font-size: 0.85rem;"><strong style="color: var(--accent-cyan);">Armor Capsule:</strong> ${data.steel}</p>
          <p style="margin-bottom: 0.5rem; font-size: 0.85rem;"><strong style="color: var(--accent-cyan);">Blast Protection:</strong> ${data.floor}</p>
          <p style="margin-bottom: 0.5rem; font-size: 0.85rem;"><strong style="color: var(--accent-cyan);">Chassis Dynamics:</strong> ${data.payload}</p>
          <p style="font-size: 0.85rem;"><strong style="color: var(--accent-cyan);">Run-Flat Range:</strong> ${data.range}</p>
        </div>
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Standard Tactical Inclusions</h4>
          <ul style="list-style: none; font-size: 0.85rem; color: var(--text-secondary);">
            ${data.features.map((f) => `<li style="margin-bottom: 0.4rem; display: flex; align-items: flex-start; gap: 0.5rem;"><span style="color: var(--accent-gold);">✓</span> <span>${f}</span></li>`).join('')}
          </ul>
        </div>
        <div style="margin-top: 1.75rem; display: flex; gap: 0.75rem;">
          <a href="#configurator" class="btn btn-primary btn-sm modal-configure-btn" style="flex: 1;">Configure This Platform</a>
        </div>
      `;

      // Auto-close modal when clicking configure inside modal
      const confBtn = bodyEl.querySelector('.modal-configure-btn');
      if (confBtn) {
        confBtn.addEventListener('click', () => {
          const modal = document.getElementById('vehicle-spec-modal');
          if (modal) modal.classList.remove('active');
        });
      }
    }
  }

  // Anatomy Hotspot interactions
  function setupAnatomyHotspots() {
    const items = document.querySelectorAll('.hotspot-item');
    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      });
      item.addEventListener('click', () => {
        items.forEach((i) => i.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // FAQ Accordion
  function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach((i) => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // Contact Form
  function setupContactForm() {
    const form = document.getElementById('confidential-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;

      if (!email) {
        alert('Please provide a secure email address.');
        return;
      }

      // Show success modal
      const modal = document.getElementById('quote-success-modal');
      if (modal) {
        const modalMsg = document.getElementById('quote-success-message');
        if (modalMsg) {
          modalMsg.textContent = `Thank you, ${name || 'Valued Client'}. Your confidential inquiry has been routed to our senior ballistic engineering team under strict NDA protocols.`;
        }
        modal.classList.add('active');
      } else {
        alert(`Thank you, ${name || 'Valued Client'}. Your confidential inquiry has been recorded.`);
      }

      form.reset();
    });
  }

  // Modal Dismissal (click outside / escape key)
  function setupModalDismissal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach((modal) => {
      const closeBtn = modal.querySelector('.modal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('active');
        });
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modals.forEach((m) => m.classList.remove('active'));
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
