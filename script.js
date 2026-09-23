(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const progressBar = $('#progressBar');
  const cursor = $('.cursor-glow');
  const heroPhoto = $('#heroPhoto');

  if (heroPhoto) {
    fetch('profile.jpg.b64')
      .then(r => r.text())
      .then(data => {
        heroPhoto.src = 'data:image/jpeg;base64,' + data.trim();
        heroPhoto.classList.add('is-loaded');
      })
      .catch(() => {});
  }

  window.addEventListener('pointermove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }, {passive:true});

  window.addEventListener('scroll', () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    progressBar.style.width = (max ? window.scrollY / max * 100 : 0) + '%';
  }, {passive:true});

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        if (entry.target.matches('.stat-number')) animateCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.18});
  $$('.reveal, .stat-number').forEach(el => io.observe(el));

  function animateCount(el) {
    const target = Number(el.dataset.target || 0);
    if (target > 100) { el.textContent = target; return; }
    const start = performance.now(), duration = 950;
    const tick = now => {
      const p = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const logs = ['loading project memory…','checking the repo trail…','testing visual hierarchy…','shipping another iteration…','ready for inspection.'];
  let logIndex = 0;
  setInterval(() => { logIndex=(logIndex+1)%logs.length; $('#buildLog').textContent=logs[logIndex]; }, 1700);

  $$('.project-object').forEach(btn => btn.addEventListener('click', () => openProject(btn.dataset.project)));

  const modal = $('#projectModal'), modalTitle=$('#modalTitle'), modalDescription=$('#modalDescription'), modalTags=$('#modalTags'), modalIndex=$('#modalIndex'), modalType=$('#modalType'), modalEyebrow=$('#modalEyebrow'), modalLink=$('#modalLink');

  const projects = {
    skin: {
      title:'Skin Disease Detection', index:'PROJECT / 01', type:'GITHUB BUILD', eyebrow:'CNN-based medical image classification',
      description:'An educational decision-support prototype for dermoscopic skin-lesion classification. The repository documents a Flask web application using a CNN for binary benign/malignant classification, with preprocessing, training/evaluation workflows, confidence output, training graphs and a confusion matrix. It explicitly states that the system is not a medical diagnosis tool.',
      tags:['Python','TensorFlow / Keras','CNN','Flask','OpenCV / PIL','scikit-learn'],
      link:'https://github.com/B-G-Giridharan/Skin-disease-detection'
    },
    routing: {
      title:'Link-State Routing Simulator', index:'PROJECT / 02', type:'GITHUB BUILD', eyebrow:'Interactive networking systems lab',
      description:'A browser-based simulator for link-state routing concepts: topology discovery, LSA generation and flooding, LSDB construction, Dijkstra shortest-path calculation, route reconstruction and routing-table generation. The repository documents SVG-based network rendering, animation, local persistence and step-by-step execution.',
      tags:['JavaScript','SVG','Dijkstra','LSA / LSDB','OSPF / IS-IS','LocalStorage'],
      link:'https://github.com/B-G-Giridharan/Link-State-Routing-Simulator'
    },
    cpu: {
      title:'CPU Optimization', index:'PROJECT / 03', type:'GITHUB BUILD', eyebrow:'ML-assisted CPU scheduling simulator',
      description:'A CPU scheduling simulator that collects process statistics from one or more machines and serves a Flask dashboard. The repository documents live process metrics, device filtering, FCFS versus ML-oriented scheduling analysis, MySQL persistence and remote data collection over a network.',
      tags:['Python','Flask','MySQL','psutil','pandas','scikit-learn'],
      link:'https://github.com/B-G-Giridharan/CPU_Optimization'
    },
    brain: {
      title:'Brain Tumor Detection', index:'PROJECT / 04', type:'GITHUB BUILD', eyebrow:'Volumetric MRI analysis',
      description:'An AI-powered medical-imaging project for tumor detection, segmentation and visualization from volumetric MRI data. The repository documents preprocessing, model inference, postprocessing, 2D slice visualisation, 3D visualization and a 3D U-Net / MONAI-oriented architecture.',
      tags:['Python','3D U-Net','MONAI','NumPy','MRI','3D Visualisation'],
      link:'https://github.com/B-G-Giridharan/Brain_tumor_detection'
    },
    safe: {
      title:'RIT Safe Walk', index:'PROJECT / 05', type:'GITHUB BUILD', eyebrow:'Smart campus safety platform',
      description:'A TypeScript React application focused on campus safety workflows. The repository includes a dashboard, emergency SOS flow, safety status, safe-walk functionality, location-oriented screens, reporting, support, QR scanning and reusable UI components built with a Vite-based React stack.',
      tags:['React 18','TypeScript','Vite','React Router','Tailwind CSS','Radix UI'],
      link:'https://github.com/B-G-Giridharan/safe_walk'
    }
  };

  function openProject(key) {
    const p=projects[key]; if(!p) return;
    modalTitle.textContent=p.title; modalIndex.textContent=p.index; modalType.textContent=p.type; modalEyebrow.textContent=p.eyebrow; modalDescription.textContent=p.description;
    modalTags.innerHTML=p.tags.map(t=>'<span>'+t+'</span>').join('');
    modalLink.href=p.link;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  $$('[data-close-modal]').forEach(el=>el.addEventListener('click',closeProject));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProject();});
  function closeProject(){modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}

  $$('.magnetic').forEach(btn=>{
    btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.16;const y=(e.clientY-r.top-r.height/2)*.16;btn.style.transform='translate('+x+'px,'+y+'px)';});
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });

  const stage=$('#roomStage');
  if(stage){
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;stage.style.transform='perspective(1100px) rotateY('+(x*-3)+'deg) rotateX('+(y*2)+'deg)';});
    stage.addEventListener('pointerleave',()=>stage.style.transform='');
  }

  const sound=$('#soundToggle');
  sound.addEventListener('click',()=>{sound.classList.toggle('on');sound.setAttribute('aria-pressed',sound.classList.contains('on')?'true':'false');});
})();
