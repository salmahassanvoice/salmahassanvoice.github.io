document.addEventListener('DOMContentLoaded', function () {
    initTopBar();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initAudioPlayers();
    initScrollAnimations();
    initPartnersMarquee();
    initContactForm();
    initKnowMore();
    initVideoCarousel();
    initVideoPauseOnPlay();
    initTestimonialCarousel();
    checkFormSuccess();
});

/* ===================================
   Top Bar Smart Hide
   =================================== */
function initTopBar() {
    var topBar = document.querySelector('.top-bar');
    if (!topBar) return;
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
        var curr = window.pageYOffset;
        if (curr > 200 && curr > lastScroll) {
            topBar.classList.add('hidden');
        } else {
            topBar.classList.remove('hidden');
        }
        lastScroll = curr;
    }, { passive: true });
}

/* ===================================
   Navbar
   =================================== */
function initNavbar() {
    var navbar = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');
    var activeId = '';

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        activeId = updateActiveNavLink(navLinks, sections, activeId);
    }, { passive: true });
}

function updateActiveNavLink(navLinks, sections, currentActiveId) {
    var scrollPos = window.scrollY + 120;
    var activeSectionId = '';

    sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
            activeSectionId = id;
        }
    });

    if (!activeSectionId || activeSectionId === currentActiveId) {
        return currentActiveId;
    }

    navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + activeSectionId);
    });

    return activeSectionId;
}

/* ===================================
   Mobile Menu
   =================================== */
function initMobileMenu() {
    var menuBtn = document.getElementById('mobile-menu-btn');
    var navLinks = document.getElementById('nav-links');
    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

/* ===================================
   Smooth Scroll with Dynamic Offset
   =================================== */
function initSmoothScroll() {
    var allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            var navbar = document.getElementById('navbar');
            var navHeight = navbar ? navbar.offsetHeight : 0;
            var offset = navHeight + 15;
            var targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        });
    });
}

/* ===================================
   Audio Players
   =================================== */
var audioInstances = [];

function initAudioPlayers() {
    var players = document.querySelectorAll('.audio-player');

    players.forEach(function (player, index) {
        var playBtn = player.querySelector('.play-btn');
        var progressContainer = player.querySelector('.progress-container');
        var progressBar = player.querySelector('.progress-bar');
        var durationDisplay = player.querySelector('.duration');
        var src = player.getAttribute('data-src');
        var audio = new Audio(src);

        audioInstances[index] = { player: player, playBtn: playBtn, progressBar: progressBar, durationDisplay: durationDisplay, audio: audio };

        audio.addEventListener('loadedmetadata', function () {
            durationDisplay.textContent = formatTime(audio.duration);
        });

        audio.addEventListener('error', function () {
            durationDisplay.textContent = '--:--';
        });

        playBtn.addEventListener('click', function () {
            audioInstances.forEach(function (inst, i) {
                if (i !== index && inst.audio && !inst.audio.paused) {
                    inst.audio.pause();
                    inst.audio.currentTime = 0;
                    inst.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    inst.playBtn.classList.remove('playing');
                    inst.progressBar.style.width = '0%';
                }
            });

            if (audio.paused) {
                audio.play().catch(function () {});
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.classList.add('playing');
            } else {
                audio.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
            }
        });

        audio.addEventListener('timeupdate', function () {
            var progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = progress + '%';
            durationDisplay.textContent = formatTime(audio.currentTime);
        });

        audio.addEventListener('ended', function () {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            playBtn.classList.remove('playing');
            progressBar.style.width = '0%';
            durationDisplay.textContent = formatTime(audio.duration);
        });

        progressContainer.addEventListener('click', function (e) {
            var rect = progressContainer.getBoundingClientRect();
            var pos = (e.clientX - rect.left) / rect.width;
            audio.currentTime = pos * audio.duration;
        });
    });
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

/* ===================================
   Know More Toggle
   =================================== */
function initKnowMore() {
    var btn = document.querySelector('.btn-know-more');
    var content = document.querySelector('.about-more-content');
    if (!btn || !content) return;

    var isArabic = document.documentElement.lang === 'ar';

    btn.addEventListener('click', function () {
        content.classList.toggle('show');
        btn.classList.toggle('expanded');
        if (content.classList.contains('show')) {
            btn.querySelector('span').textContent = isArabic ? 'إخفاء' : 'Show Less';
        } else {
            btn.querySelector('span').textContent = isArabic ? 'اعرف المزيد عني' : 'Know More About Me';
        }
    });
}

/* ===================================
   Video Carousel
   =================================== */
function initVideoCarousel() {
    var track = document.querySelector('.video-carousel-track');
    var slides = document.querySelectorAll('.video-slide');
    var prevBtn = document.querySelector('.videos .video-nav .carousel-arrow.prev');
    var nextBtn = document.querySelector('.videos .video-nav .carousel-arrow.next');
    var dotsContainer = document.querySelector('.videos .video-nav .carousel-dots');
    if (!track || slides.length === 0) return;

    var currentIndex = 0;
    var slidesPerView = getSlidesPerView();

    function getSlidesPerView() {
        if (window.innerWidth < 768) return 1;
        return 2;
    }

    var totalPages = Math.ceil(slides.length / slidesPerView);

    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (var i = 0; i < totalPages; i++) {
            var dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
            dot.addEventListener('click', (function (idx) {
                return function () { goTo(idx); };
            })(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goTo(index) {
        var oldIndex = currentIndex;
        if (index < 0) index = totalPages - 1;
        if (index >= totalPages) index = 0;
        var isWrap = (oldIndex === totalPages - 1 && index === 0) ||
                     (oldIndex === 0 && index === totalPages - 1);
        if (isWrap) {
            track.style.transition = 'none';
        }
        currentIndex = index;
        var pct = -(currentIndex * 100);
        track.style.transform = 'translateX(' + pct + '%)';
        if (isWrap) {
            track.offsetHeight;
            track.style.transition = '';
        }
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });

    buildDots();

    window.addEventListener('resize', function () {
        var newPer = getSlidesPerView();
        if (newPer !== slidesPerView) {
            slidesPerView = newPer;
            totalPages = Math.ceil(slides.length / slidesPerView);
            currentIndex = 0;
            goTo(0);
            buildDots();
        }
    });

    slides.forEach(function (slide) {
        slide.style.minWidth = (100 / slidesPerView) + '%';
    });

    window.addEventListener('resize', function () {
        var spv = getSlidesPerView();
        slides.forEach(function (slide) {
            slide.style.minWidth = (100 / spv) + '%';
        });
    });
}

/* ===================================
   Video Pause on Play
   =================================== */
function initVideoPauseOnPlay() {
    var iframes = document.querySelectorAll('.video-wrapper iframe');
    if (iframes.length === 0) return;

    var players = [];

    iframes.forEach(function (iframe, i) {
        iframe.id = 'yt-player-' + i;
    });

    window.onYouTubeIframeAPIReady = function () {
        iframes.forEach(function (iframe, i) {
            var player = new YT.Player(iframe.id, {
                events: {
                    onStateChange: function (event) {
                        if (event.data === YT.PlayerState.PLAYING) {
                            players.forEach(function (p) {
                                if (p !== player && typeof p.pauseVideo === 'function') {
                                    p.pauseVideo();
                                }
                            });
                        }
                    }
                }
            });
            players.push(player);
        });
    };

    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
}

/* ===================================
   Testimonial Carousel
   =================================== */
function initTestimonialCarousel() {
    var track = document.querySelector('.testimonial-track');
    var slides = document.querySelectorAll('.testimonial-slide');
    var prevBtn = document.querySelector('.testimonial-arrow.prev-test');
    var nextBtn = document.querySelector('.testimonial-arrow.next-test');
    var dotsContainer = document.querySelector('.testimonial-nav .carousel-dots');
    if (!track || slides.length === 0) return;

    var currentIndex = 0;
    var total = slides.length;
    var autoTimer;

    function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', (function (idx) {
                return function () { goTo(idx); resetAuto(); };
            })(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goTo(index) {
        var oldIndex = currentIndex;
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        var isWrap = (oldIndex === total - 1 && index === 0) ||
                     (oldIndex === 0 && index === total - 1);
        if (isWrap) {
            track.style.transition = 'none';
        }
        currentIndex = index;
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        if (isWrap) {
            track.offsetHeight;
            track.style.transition = '';
        }
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.carousel-dot').forEach(function (d, i) {
                d.classList.toggle('active', i === currentIndex);
            });
        }
    }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(function () { goTo(currentIndex + 1); }, 6000);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); resetAuto(); });

    buildDots();
    resetAuto();
}

/* ===================================
   Partners Marquee (De-sync rows)
   =================================== */
function initPartnersMarquee() {
    var reverseTrack = document.querySelector('.partners-track.partners-track-reverse');
    if (!reverseTrack) return;

    var allLogos = Array.from(reverseTrack.querySelectorAll('img.partner-logo'));
    if (allLogos.length < 2) return;

    reverseTrack.style.animationPlayState = 'paused';

    var base = getMarqueeBaseSet(allLogos);
    shuffleInPlace(base);

    reverseTrack.innerHTML = '';
    base.forEach(function (el) { reverseTrack.appendChild(el); });
    base.forEach(function (el) { reverseTrack.appendChild(el.cloneNode(true)); });

    // Randomize starting point so the two rows don't show same logos together.
    var computed = window.getComputedStyle(reverseTrack);
    var duration = parseFloat(computed.animationDuration);
    if (!isNaN(duration) && duration > 0) {
        reverseTrack.style.animationDelay = (-Math.random() * duration).toFixed(2) + 's';
    }

    reverseTrack.offsetHeight; // force reflow
    reverseTrack.style.animationPlayState = '';
}

function getMarqueeBaseSet(logos) {
    if (logos.length % 2 === 0 && isExactDuplicateHalves(logos)) {
        return logos.slice(0, logos.length / 2);
    }

    // Fallback: build a unique set by src.
    var seen = new Set();
    var base = [];
    logos.forEach(function (img) {
        var src = img.getAttribute('src') || '';
        if (!seen.has(src)) {
            seen.add(src);
            base.push(img);
        }
    });
    return base.length ? base : logos.slice();
}

function isExactDuplicateHalves(logos) {
    var half = logos.length / 2;
    for (var i = 0; i < half; i++) {
        if ((logos[i].getAttribute('src') || '') !== (logos[i + half].getAttribute('src') || '')) {
            return false;
        }
    }
    return true;
}

function shuffleInPlace(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
}

/* ===================================
   Scroll Animations
   =================================== */
function initScrollAnimations() {
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // Stagger delays *within* each section (prevents huge delays on later sections).
    var sectionCounts = new Map();
    var stepDelay = 0.04;     // 40ms
    var maxDelay = 0.16;      // cap at 160ms

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        var section = el.closest('section') || document.body;
        var idx = sectionCounts.get(section) || 0;
        var delay = Math.min(idx * stepDelay, maxDelay);
        el.style.transitionDelay = delay + 's';
        sectionCounts.set(section, idx + 1);
        observer.observe(el);
    });
}

/* ===================================
   Contact Form
   =================================== */
function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var isArabic = document.documentElement.lang === 'ar';
        var formData = new FormData(form);
        var data = Object.fromEntries(formData);

        if (!data.name || !data.email || !data.message) {
            showNotification(isArabic ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.', 'error');
            return;
        }

        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(data.email)) {
            showNotification(isArabic ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email.', 'error');
            return;
        }

        var submitBtn = form.querySelector('button[type="submit"]');
        var origText = submitBtn.innerHTML;
        submitBtn.innerHTML = isArabic
            ? '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'
            : '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            var response = await fetch(form.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
            var result = await response.json();

            if (response.ok && result.ok) {
                showNotification(isArabic
                    ? 'شكراً لك! تم إرسال رسالتك بنجاح.'
                    : 'Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                throw new Error('failed');
            }
        } catch (error) {
            if (error.name === 'TypeError') { form.submit(); return; }
            showNotification(isArabic
                ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
                : 'Sorry, something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = origText;
            submitBtn.disabled = false;
        }
    });
}

function checkFormSuccess() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
        var isArabic = document.documentElement.lang === 'ar';
        setTimeout(function () {
            showNotification(isArabic
                ? 'شكراً لك! تم إرسال رسالتك بنجاح.'
                : 'Thank you! Your message has been sent successfully.', 'success');
        }, 500);
        window.history.replaceState({}, document.title, window.location.pathname);
        var sec = document.getElementById('contact');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }
}

function showNotification(message, type) {
    var existing = document.querySelector('.notification');
    if (existing) existing.remove();

    var el = document.createElement('div');
    el.className = 'notification notification-' + type;
    el.innerHTML =
        '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i>' +
        '<span>' + message + '</span>' +
        '<button class="notification-close"><i class="fas fa-times"></i></button>';

    document.body.appendChild(el);

    el.querySelector('.notification-close').addEventListener('click', function () {
        el.style.animation = 'slideOut 0.3s ease';
        setTimeout(function () { el.remove(); }, 300);
    });

    setTimeout(function () {
        if (el.parentElement) {
            el.style.animation = 'slideOut 0.3s ease';
            setTimeout(function () { el.remove(); }, 300);
        }
    }, 5000);
}

