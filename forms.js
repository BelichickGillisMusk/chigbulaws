/* ═══════════════════════════════════════════════════════════════
   CHIGBU LAW — FORMS ENGINE v2.0
   Multi-step intake forms, Spanish toggle, file upload, ticker
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Law Ticker ───────────────────────────────────────────────── */
  const TICKER_ITEMS = [
    "2026: CA minimum wage raised to $17.50/hr statewide — affects all employers",
    "2026: Auto insurance minimums raised to $30K/$60K/$15K — new CA law effective Jan 1",
    "2026: Expanded domestic violence restraining order protections now in effect",
    "2026: DACA renewals currently accepted — processing time 8–12 months — file now",
    "2026: New pay transparency requirements for CA employers with 15+ employees",
    "2026: Updated AB 5 independent contractor rules — review your contractor agreements",
    "2026: Federal bankruptcy exemptions updated — protect more assets in Chapter 7",
    "2026: Enhanced child support enforcement — stronger penalties for non-compliance",
    "2026: New CA immigration enforcement policies — know your rights",
    "2026: Rideshare (Uber/Lyft) insurance requirements updated — new minimum coverage",
  ];

  function initTicker() {
    const tickers = document.querySelectorAll('#law-ticker .ticker-track');
    if (!tickers.length) return;

    tickers.forEach(function (track) {
      let idx = 0;
      function showNext() {
        track.style.opacity = '0';
        track.style.transform = 'translateY(8px)';
        setTimeout(function () {
          track.textContent = TICKER_ITEMS[idx % TICKER_ITEMS.length];
          track.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          track.style.opacity = '1';
          track.style.transform = 'translateY(0)';
          idx++;
        }, 300);
      }
      showNext();
      setInterval(showNext, 5000);
    });
  }

  /* ── Multi-Step Form Engine ───────────────────────────────────── */
  function initForms() {
    const formContainers = document.querySelectorAll('.intake-form[data-steps]');
    formContainers.forEach(function (container) {
      try {
        const steps = JSON.parse(container.getAttribute('data-steps'));
        const formId = container.getAttribute('data-form-id') || 'Intake';
        const formspreeId = container.getAttribute('data-formspree') || '';
        let currentStep = 0;
        let lang = 'en';
        const formData = {};
        const uploadedFiles = {};

        function t(obj) {
          if (typeof obj === 'string') return obj;
          return (obj && obj[lang]) || (obj && obj['en']) || '';
        }

        function render() {
          container.innerHTML = '';

          // Language toggle bar
          const langBar = document.createElement('div');
          langBar.className = 'form-lang-bar';
          const langBtn = document.createElement('button');
          langBtn.type = 'button';
          langBtn.className = 'lang-toggle-btn';
          langBtn.textContent = lang === 'en' ? '🇲🇽 Ver en Español' : '🇺🇸 View in English';
          langBtn.onclick = function () {
            lang = lang === 'en' ? 'es' : 'en';
            render();
          };
          langBar.appendChild(langBtn);
          container.appendChild(langBar);

          // Progress bar
          const progress = document.createElement('div');
          progress.className = 'form-progress';
          const bar = document.createElement('div');
          bar.className = 'form-progress-bar';
          bar.style.width = ((currentStep + 1) / steps.length * 100) + '%';
          progress.appendChild(bar);
          container.appendChild(progress);

          // Step label
          const stepLabel = document.createElement('div');
          stepLabel.className = 'form-step-label';
          const stepTitle = t(steps[currentStep].title);
          stepLabel.innerHTML = '<strong>Step ' + (currentStep + 1) + ' of ' + steps.length + ':</strong> ' + stepTitle;
          container.appendChild(stepLabel);

          // Fields
          const fieldsDiv = document.createElement('div');
          fieldsDiv.className = 'form-fields';
          const step = steps[currentStep];

          step.fields.forEach(function (field) {
            const group = document.createElement('div');
            group.className = 'form-group';

            if (field.type === 'radio' || field.type === 'checkbox') {
              const groupLabel = document.createElement('div');
              groupLabel.className = 'group-label';
              groupLabel.innerHTML = t(field.label) + (field.required ? '<span class="req">*</span>' : '');
              group.appendChild(groupLabel);

              const optGroup = document.createElement('div');
              optGroup.className = field.type === 'radio' ? 'radio-group' : 'checkbox-group';

              const opts = t(field.options);
              opts.forEach(function (opt, i) {
                const label = document.createElement('label');
                label.className = field.type === 'radio' ? 'radio-option' : 'checkbox-option';
                const input = document.createElement('input');
                input.type = field.type;
                input.name = field.name;
                input.value = opt;
                if (field.type === 'radio') {
                  if (formData[field.name] === opt) input.checked = true;
                  input.onchange = function () { formData[field.name] = opt; };
                } else {
                  const saved = formData[field.name] || [];
                  if (saved.includes(opt)) input.checked = true;
                  input.onchange = function () {
                    const arr = formData[field.name] || [];
                    if (this.checked) {
                      formData[field.name] = arr.concat([opt]);
                    } else {
                      formData[field.name] = arr.filter(function (v) { return v !== opt; });
                    }
                  };
                }
                label.appendChild(input);
                label.appendChild(document.createTextNode(opt));
                optGroup.appendChild(label);
              });
              group.appendChild(optGroup);

            } else if (field.type === 'file') {
              const lbl = document.createElement('label');
              lbl.className = 'group-label';
              lbl.textContent = t(field.label);
              group.appendChild(lbl);

              const dropZone = document.createElement('div');
              dropZone.className = 'file-drop-zone';
              dropZone.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p>' + (lang === 'en' ? 'Click to upload or drag & drop' : 'Haga clic para subir o arrastre') + '</p><small>' + (lang === 'en' ? 'PDF, JPG, PNG — max 10MB each' : 'PDF, JPG, PNG — máx 10MB cada uno') + '</small>';

              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.multiple = true;
              fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
              fileInput.style.display = 'none';

              const fileNames = document.createElement('div');
              fileNames.className = 'file-names';

              if (uploadedFiles[field.name]) {
                uploadedFiles[field.name].forEach(function (name) {
                  const tag = document.createElement('span');
                  tag.className = 'file-tag';
                  tag.textContent = name;
                  fileNames.appendChild(tag);
                });
              }

              fileInput.onchange = function () {
                uploadedFiles[field.name] = Array.from(this.files).map(function (f) { return f.name; });
                fileNames.innerHTML = '';
                uploadedFiles[field.name].forEach(function (name) {
                  const tag = document.createElement('span');
                  tag.className = 'file-tag';
                  tag.textContent = name;
                  fileNames.appendChild(tag);
                });
              };

              dropZone.onclick = function () { fileInput.click(); };
              dropZone.ondragover = function (e) { e.preventDefault(); dropZone.style.borderColor = 'var(--navy)'; };
              dropZone.ondragleave = function () { dropZone.style.borderColor = ''; };
              dropZone.ondrop = function (e) {
                e.preventDefault();
                dropZone.style.borderColor = '';
                fileInput.files = e.dataTransfer.files;
                fileInput.onchange();
              };

              group.appendChild(dropZone);
              group.appendChild(fileInput);
              group.appendChild(fileNames);

            } else if (field.type === 'select') {
              const lbl = document.createElement('label');
              lbl.className = 'group-label';
              lbl.innerHTML = t(field.label) + (field.required ? '<span class="req">*</span>' : '');
              group.appendChild(lbl);

              const sel = document.createElement('select');
              sel.name = field.name;
              const blank = document.createElement('option');
              blank.value = '';
              blank.textContent = lang === 'en' ? '— Select an option —' : '— Seleccione una opción —';
              sel.appendChild(blank);

              const opts = t(field.options);
              opts.forEach(function (opt) {
                const o = document.createElement('option');
                o.value = opt;
                o.textContent = opt;
                if (formData[field.name] === opt) o.selected = true;
                sel.appendChild(o);
              });
              sel.onchange = function () { formData[field.name] = this.value; };
              group.appendChild(sel);

            } else if (field.type === 'textarea') {
              const lbl = document.createElement('label');
              lbl.className = 'group-label';
              lbl.innerHTML = t(field.label) + (field.required ? '<span class="req">*</span>' : '');
              group.appendChild(lbl);

              const ta = document.createElement('textarea');
              ta.name = field.name;
              ta.placeholder = t(field.placeholder) || '';
              ta.value = formData[field.name] || '';
              ta.onchange = function () { formData[field.name] = this.value; };
              ta.oninput = function () { formData[field.name] = this.value; };
              group.appendChild(ta);

            } else {
              // text, tel, email
              const lbl = document.createElement('label');
              lbl.className = 'group-label';
              lbl.innerHTML = t(field.label) + (field.required ? '<span class="req">*</span>' : '');
              group.appendChild(lbl);

              const inp = document.createElement('input');
              inp.type = field.type;
              inp.name = field.name;
              inp.placeholder = t(field.placeholder) || '';
              inp.value = formData[field.name] || '';
              inp.onchange = function () { formData[field.name] = this.value; };
              inp.oninput = function () { formData[field.name] = this.value; };
              group.appendChild(inp);
            }

            fieldsDiv.appendChild(group);
          });

          container.appendChild(fieldsDiv);

          // Navigation
          const nav = document.createElement('div');
          nav.className = 'form-nav';

          if (currentStep > 0) {
            const backBtn = document.createElement('button');
            backBtn.type = 'button';
            backBtn.className = 'btn-form-back';
            backBtn.textContent = lang === 'en' ? '← Back' : '← Atrás';
            backBtn.onclick = function () { currentStep--; render(); };
            nav.appendChild(backBtn);
          }

          if (currentStep < steps.length - 1) {
            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'btn-primary btn-form-next';
            nextBtn.textContent = lang === 'en' ? 'Continue →' : 'Continuar →';
            nextBtn.onclick = function () {
              if (validateStep()) { currentStep++; render(); window.scrollTo({ top: container.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' }); }
            };
            nav.appendChild(nextBtn);
          } else {
            const submitBtn = document.createElement('button');
            submitBtn.type = 'button';
            submitBtn.className = 'btn-primary btn-form-submit';
            submitBtn.textContent = lang === 'en' ? 'Submit Free Consultation Request' : 'Enviar Solicitud de Consulta Gratuita';
            submitBtn.onclick = function () {
              if (validateStep()) { submitForm(submitBtn); }
            };
            nav.appendChild(submitBtn);
          }

          container.appendChild(nav);
        }

        function validateStep() {
          const step = steps[currentStep];
          let valid = true;
          step.fields.forEach(function (field) {
            if (!field.required) return;
            const val = formData[field.name];
            if (!val || (Array.isArray(val) && val.length === 0) || (typeof val === 'string' && val.trim() === '')) {
              valid = false;
              // Highlight the field
              const inputs = container.querySelectorAll('[name="' + field.name + '"]');
              inputs.forEach(function (inp) { inp.classList.add('invalid'); setTimeout(function () { inp.classList.remove('invalid'); }, 3000); });
            }
          });
          if (!valid) {
            const msg = lang === 'en' ? 'Please fill in all required fields.' : 'Por favor complete todos los campos requeridos.';
            showError(msg);
          }
          return valid;
        }

        function showError(msg) {
          let err = container.querySelector('.form-error-msg');
          if (!err) {
            err = document.createElement('div');
            err.className = 'form-error-msg';
            err.style.cssText = 'color:#c0392b; font-size:13px; font-weight:600; margin-top:8px; padding:10px 14px; background:rgba(192,57,43,.06); border:1px solid rgba(192,57,43,.2); border-radius:6px;';
            container.appendChild(err);
          }
          err.textContent = msg;
          setTimeout(function () { if (err.parentNode) err.parentNode.removeChild(err); }, 4000);
        }

        function submitForm(btn) {
          btn.disabled = true;
          btn.textContent = lang === 'en' ? 'Sending…' : 'Enviando…';

          // Build submission payload
          const payload = Object.assign({}, formData, {
            _subject: formId + ' — ' + (formData['name'] || 'New Submission'),
            form_language: lang,
            form_type: formId
          });

          // Try Formspree if configured
          const endpoint = formspreeId ? 'https://formspree.io/f/' + formspreeId : null;

          if (endpoint) {
            fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify(payload)
            }).then(function (r) {
              if (r.ok) { showSuccess(); }
              else { showFallback(); }
            }).catch(function () { showFallback(); });
          } else {
            // Fallback: open mailto
            showFallback();
          }
        }

        function showSuccess() {
          container.innerHTML = '<div class="form-success">' +
            '<div class="success-icon">✓</div>' +
            '<h3>' + (lang === 'en' ? 'Request Received!' : '¡Solicitud Recibida!') + '</h3>' +
            '<p>' + (lang === 'en'
              ? 'Thank you. Clifford\'s office will contact you within 1 business day. For urgent matters, call <a href="tel:9162306381">916-230-6381</a> directly.'
              : 'Gracias. La oficina de Clifford se comunicará con usted dentro de 1 día hábil. Para asuntos urgentes, llame directamente al <a href="tel:9162306381">916-230-6381</a>.') +
            '</p></div>';
        }

        function showFallback() {
          // Build mailto as fallback
          const body = Object.entries(formData).map(function (kv) { return kv[0] + ': ' + (Array.isArray(kv[1]) ? kv[1].join(', ') : kv[1]); }).join('\n');
          const subject = encodeURIComponent('New Inquiry — ' + formId);
          const bodyEnc = encodeURIComponent(body);
          window.location.href = 'mailto:chigbulaw@sbcglobal.net?subject=' + subject + '&body=' + bodyEnc;
          showSuccess();
        }

        // Init
        render();

      } catch (e) {
        console.warn('Form init error:', e);
      }
    });
  }

  /* ── Nav Social Icon Style ────────────────────────────────────── */
  function styleNavSocial() {
    const style = document.createElement('style');
    style.textContent = '.nav-social { display:inline-flex; align-items:center; padding:6px 8px !important; opacity:.7; transition:opacity .2s; } .nav-social:hover { opacity:1; }';
    document.head.appendChild(style);
  }

  /* ── Init ─────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTicker();
      initForms();
      styleNavSocial();
    });
  } else {
    initTicker();
    initForms();
    styleNavSocial();
  }

})();
