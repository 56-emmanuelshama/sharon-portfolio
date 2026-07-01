
(function(){
  "use strict";
 
  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();
 
  // ---- Scroll progress + nav shadow + to-top button ----
  var progress = document.getElementById('chart-progress');
  var navEl = document.getElementById('siteNav');
  var toTop = document.getElementById('toTop');
 
  function onScroll(){
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
 
    navEl.classList.toggle('scrolled', scrollTop > 12);
    toTop.classList.toggle('show', scrollTop > 500);
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
 
  toTop.addEventListener('click', function(){
    window.scrollTo({top:0, behavior:'smooth'});
  });
 
  // ---- Mobile menu ----
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', function(){
    var isOpen = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
 
  // ---- Active nav link on scroll ----
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = document.querySelectorAll('.nav-link');
  function updateActiveLink(){
    var scrollPos = window.scrollY + 140;
    var currentId = null;
    sections.forEach(function(sec){
      if(scrollPos >= sec.offsetTop){ currentId = sec.getAttribute('id'); }
    });
    navAnchors.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + currentId);
    });
  }
  document.addEventListener('scroll', updateActiveLink, {passive:true});
  updateActiveLink();
 
  // ---- Reveal on scroll ----
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }
 
  // ---- Animated stat counters ----
  var statNums = document.querySelectorAll('.stat-num');
  var statsAnimated = false;
  function animateStats(){
    if(statsAnimated) return;
    statsAnimated = true;
    statNums.forEach(function(el){
      var target = parseInt(el.getAttribute('data-target'), 10) || 0;
      var countEl = el.querySelector('.count');
      var duration = 1400;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progressRatio = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progressRatio, 3);
        countEl.textContent = Math.floor(eased * target).toLocaleString();
        if(progressRatio < 1){ requestAnimationFrame(step); }
        else { countEl.textContent = target.toLocaleString(); }
      }
      requestAnimationFrame(step);
    });
  }
  var statStrip = document.querySelector('.stat-strip');
  if('IntersectionObserver' in window && statStrip){
    var statObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ animateStats(); statObserver.disconnect(); }
      });
    }, {threshold:0.4});
    statObserver.observe(statStrip);
  } else {
    animateStats();
  }
 
  // ---- Animated skill bars ----
  var bars = document.querySelectorAll('.bar-fill');
  if('IntersectionObserver' in window){
    var barObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.getAttribute('data-width') + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.4});
    bars.forEach(function(b){ barObserver.observe(b); });
  } else {
    bars.forEach(function(b){ b.style.width = b.getAttribute('data-width') + '%'; });
  }
 
  // ---- Contact form validation ----
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
 
  function setError(id, msg){
    var el = document.getElementById('err-' + id);
    if(el) el.textContent = msg;
  }
  function validEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
 
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('fname').value.trim();
    var email = document.getElementById('femail').value.trim();
    var message = document.getElementById('fmessage').value.trim();
    var ok = true;
 
    setError('fname',''); setError('femail',''); setError('fmessage','');
 
    if(name.length < 2){ setError('fname','Please enter your full name.'); ok = false; }
    if(!validEmail(email)){ setError('femail','Please enter a valid email address.'); ok = false; }
    if(message.length < 10){ setError('fmessage','Please add a bit more detail (10+ characters).'); ok = false; }
 
    if(!ok){
      status.className = '';
      status.style.display = 'none';
      return;
    }
 
    status.textContent = 'Thanks, ' + name.split(' ')[0] + '! Sharon has received your message and will reply to ' + email + ' shortly.';
    status.className = 'ok';
    form.reset();
  });
 
})();