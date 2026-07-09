/* Base360 landing page — interactions (no dependencies) */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Hero story stepper ---------- */
  var STEP_MS = 4200;
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var screens = Array.prototype.slice.call(document.querySelectorAll(".screen"));
  var caption = document.getElementById("phone-caption");
  var storySection = document.getElementById("how");
  if (!steps.length || !screens.length) return;

  var captions = [
    "A comment lands on your TikTok post — the moment most brands miss.",
    "The AI agent answers publicly in seconds, then opens a DM.",
    "The AI handles the whole conversation in your brand's voice.",
    "Mia is now a high-intent lead in the CRM — with full context.",
    "An AI voice call walks her through the product.",
    "Enrolled, nurtured — and converted. No one lifted a finger."
  ];

  document.documentElement.style.setProperty("--step-ms", STEP_MS + "ms");

  var current = 0;
  var timer = null;
  var running = false;

  function show(index) {
    current = index;
    steps.forEach(function (step, i) {
      step.classList.toggle("active", i === index);
      step.classList.toggle("done", i < index);
      if (i === index) {
        // restart the progress bar animation
        var bar = step.querySelector(".step-bar span");
        if (bar) {
          bar.style.animation = "none";
          void bar.offsetWidth;
          bar.style.animation = "";
        }
      }
    });
    screens.forEach(function (screen, i) {
      screen.classList.toggle("on", i === index);
    });
    if (caption) caption.textContent = captions[index] || "";
  }

  function next() { show((current + 1) % steps.length); }

  function start() {
    if (running || reducedMotion) return;
    running = true;
    timer = setInterval(next, STEP_MS);
  }

  function stop() {
    running = false;
    if (timer) { clearInterval(timer); timer = null; }
  }

  steps.forEach(function (step, i) {
    step.addEventListener("click", function () {
      show(i);
      stop();
      start(); // reset the cadence from the clicked step
    });
  });

  // Only auto-play while the story section is on screen
  show(0);
  if ("IntersectionObserver" in window) {
    var storyIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.25 }
    );
    if (storySection) storyIO.observe(storySection);
  } else {
    start();
  }

  // Pause while the user is reading / hovering the steps
  var stepsList = document.getElementById("steps");
  if (stepsList) {
    stepsList.addEventListener("mouseenter", stop);
    stepsList.addEventListener("mouseleave", start);
  }
})();

/* ------------------------------------------------------------
   Scroll-paced alternative to the hero story (id="how-scroll").
   No timer: the sticky phone's screen is driven entirely by
   which .fstep is nearest the center of the viewport as the
   visitor scrolls, so reading speed sets the pace, not a clock.
   Fully independent of the autoplay logic above — separate class
   names, separate ids, nothing shared but the .reveal fade-in.
   ------------------------------------------------------------ */
(function () {
  "use strict";

  var fsteps = Array.prototype.slice.call(document.querySelectorAll(".fstep"));
  var fscreens = Array.prototype.slice.call(document.querySelectorAll(".fscreen"));
  var railDots = Array.prototype.slice.call(document.querySelectorAll(".fs-rail span"));
  var caption = document.getElementById("fsCaption");
  if (!fsteps.length || !fscreens.length) return;

  var captions = [
    "A comment lands — this is the moment most brands never see.",
    "Answered in public, then moved to DM while it's still warm.",
    "The AI keeps answering for as long as the customer has questions.",
    "Now a high-intent lead, with the whole conversation attached.",
    "A real voice call, without anyone on the team dialing out.",
    "Nurtured until it closes — or until they say no thanks."
  ];

  function activate(index) {
    fsteps.forEach(function (el, i) { el.classList.toggle("active", i === index); });
    fscreens.forEach(function (el, i) { el.classList.toggle("on", i === index); });
    railDots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === index);
      dot.classList.toggle("done", i < index);
    });
    if (caption) caption.textContent = captions[index] || "";
  }

  activate(0);

  if ("IntersectionObserver" in window) {
    var current = 0;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var index = parseInt(entry.target.getAttribute("data-fstep"), 10);
          if (!isNaN(index) && index !== current) {
            current = index;
            activate(index);
          }
        });
      },
      { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
    );
    fsteps.forEach(function (el) { io.observe(el); });
  }
})();
