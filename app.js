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
})();

/* ------------------------------------------------------------
   How-it-works story (id="how"). No timer: the sticky phone's
   screen is driven entirely by which .fstep is nearest the
   center of the viewport as the visitor scrolls, so reading
   speed sets the pace, not a clock.
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

/* ------------------------------------------------------------
   NEW — "See it unify" (#unify). Independent IIFE, new ids only.
   Click a channel to simulate an incoming message: it "flies"
   into the unified inbox, shows a typing indicator, then an AI
   reply — demonstrating both "every channel, one inbox" and
   "answered automatically" in a single interaction. Also runs a
   gentle auto-fire loop while the section is on screen.
   ------------------------------------------------------------ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stage = document.getElementById("unifyStage");
  var inbox = document.getElementById("unifyInbox");
  var rows = document.getElementById("unifyRows");
  var countEl = document.getElementById("unifyCount");
  var avgEl = document.getElementById("unifyAvg");
  var emptyMsg = document.getElementById("unifyEmpty");
  if (!stage || !inbox || !rows) return;

  var MSGS = {
    ig: { label: "Instagram", text: "Do you ship to Canada?", reply: "Yes! $6 flat rate, 4–6 business days 🇨🇦" },
    tt: { label: "TikTok", text: "how much is this?", reply: "$49 with free shipping this week!" },
    wa: { label: "WhatsApp", text: "Can I reorder the same one?", reply: "Done — same order, on its way 🙌" },
    sms: { label: "SMS", text: "Is this true to size?", reply: "Runs true to size — happy to help if unsure!" },
    call: { label: "Call", text: "Missed call — asked about bulk pricing", reply: "Called back — sent a bulk pricing sheet 📄" },
    mail: { label: "Email", text: "Following up on my order", reply: "Shipped this morning — tracking sent!" }
  };
  var srcKeys = Object.keys(MSGS);
  var times = [];

  function fire(key, btn) {
    var data = MSGS[key];
    if (!data) return;
    if (emptyMsg) { emptyMsg.remove(); emptyMsg = null; }

    var color = btn ? getComputedStyle(btn).getPropertyValue("--c").trim() : "";

    if (!reduced && btn) {
      try {
        var stageRect = stage.getBoundingClientRect();
        var srcRect = btn.getBoundingClientRect();
        var dstRect = inbox.getBoundingClientRect();
        var flyer = document.createElement("span");
        flyer.className = "unify-flyer";
        if (color) flyer.style.setProperty("--c", color);
        var startX = srcRect.left + srcRect.width / 2 - stageRect.left - 7;
        var startY = srcRect.top + srcRect.height / 2 - stageRect.top - 7;
        flyer.style.left = startX + "px";
        flyer.style.top = startY + "px";
        stage.appendChild(flyer);
        var endX = dstRect.left + dstRect.width / 2 - stageRect.left - 7;
        var endY = dstRect.top - stageRect.top + 8;
        requestAnimationFrame(function () {
          flyer.style.transform = "translate(" + (endX - startX) + "px," + (endY - startY) + "px) scale(.4)";
          flyer.style.opacity = "0";
        });
        setTimeout(function () { flyer.remove(); }, 620);
      } catch (err) { /* ignore, skip flight */ }
    }

    if (btn) {
      btn.classList.add("pulse");
      setTimeout(function () { btn.classList.remove("pulse"); }, 500);
    }

    var appearDelay = reduced ? 0 : 460;
    setTimeout(function () {
      inbox.classList.add("hit");
      setTimeout(function () { inbox.classList.remove("hit"); }, 500);

      var row = document.createElement("div");
      row.className = "urow";
      if (color) row.style.setProperty("--c", color);
      row.innerHTML =
        '<span class="urow-new">new</span>' +
        '<span class="urow-dot"></span>' +
        '<span class="urow-body"><b>' + data.label + '</b><span>' + data.text + '</span></span>' +
        '<span class="urow-status typing">typing<span class="urow-typedots"><i></i><i></i><i></i></span></span>';
      rows.prepend(row);
      rows.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });

      var newBadge = row.querySelector(".urow-new");
      setTimeout(function () {
        if (!newBadge) return;
        newBadge.classList.add("fade");
        setTimeout(function () { newBadge.remove(); }, reduced ? 0 : 400);
      }, reduced ? 0 : 2400);

      var replySec = 4 + Math.floor(Math.random() * 10);
      var typeDelay = reduced ? 0 : 850;
      setTimeout(function () {
        var st = row.querySelector(".urow-status");
        st.className = "urow-status replied";
        st.textContent = "AI · " + replySec + "s";
        row.querySelector(".urow-body span").textContent = data.reply;

        times.push(replySec);
        if (countEl) countEl.textContent = String(times.length);
        if (avgEl) {
          var avg = Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length);
          avgEl.textContent = avg + "s";
        }
        while (rows.children.length > 6) rows.removeChild(rows.lastChild);
      }, typeDelay);
    }, appearDelay);
  }

  document.querySelectorAll(".src-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { fire(btn.dataset.src, btn); });
  });

  if (reduced) {
    fire("tt", document.querySelector('.src-btn[data-src="tt"]'));
  } else if ("IntersectionObserver" in window) {
    var timer = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!timer) {
            fire(srcKeys[Math.floor(Math.random() * srcKeys.length)], document.querySelector(".src-btn"));
            timer = setInterval(function () {
              var key = srcKeys[Math.floor(Math.random() * srcKeys.length)];
              fire(key, document.querySelector('.src-btn[data-src="' + key + '"]'));
            }, 3800);
          }
        } else if (timer) {
          clearInterval(timer);
          timer = null;
        }
      });
    }, { threshold: 0.35 });
    io.observe(stage);
  }
})();

/* ------------------------------------------------------------
   NEW — "Human vs AI" race (#race). Independent IIFE, new ids
   only. Runs once automatically the first time the section is
   scrolled into view (replayable via button); under
   prefers-reduced-motion it renders the finished end-state
   immediately instead of animating.
   ------------------------------------------------------------ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var humanCol = document.getElementById("raceHuman");
  var aiCol = document.getElementById("raceAI");
  var humanFastEl = document.getElementById("humanFast");
  var humanStuckEl = document.getElementById("humanStuck");
  var aiFastEl = document.getElementById("aiFast");
  var aiStuckEl = document.getElementById("aiStuck");
  var scoreHumanAvgEl = document.getElementById("scoreHumanAvg");
  var scoreAiAvgEl = document.getElementById("scoreAiAvg");
  var scoreHumanStuckEl = document.getElementById("scoreHumanStuck");
  var scoreAiStuckEl = document.getElementById("scoreAiStuck");
  var replayBtn = document.getElementById("raceReplay");
  var section = document.getElementById("race");
  if (!humanCol || !aiCol) return;

  function flashBump(el) {
    var box = el && el.parentElement;
    if (!box) return;
    box.classList.remove("bump");
    void box.offsetWidth;
    box.classList.add("bump");
  }
  function formatMinSec(totalSec) {
    var mm = Math.floor(totalSec / 60), ss = totalSec % 60;
    return mm > 0 ? (mm + "m " + (ss < 10 ? "0" : "") + ss + "s") : (ss + "s");
  }

  var MSGS = [
    { c: "#dd2a7b", text: "Do you ship to Canada?", ai: 6, human: { label: "0m 55s" } },
    { c: "#111111", text: "how much is this?", ai: 9, human: { label: "1m 20s" } },
    { c: "#25d366", text: "Can I reorder the same one?", ai: 5, human: { label: "2m 05s" } },
    { c: "#38bdf8", text: "Is this true to size?", ai: 11, human: { label: "4m 40s" } },
    { c: "#6366f1", text: "Missed call about bulk pricing", ai: 8, human: { label: "6m 15s" } },
    { c: "#f43f5e", text: "Following up on my order", ai: 7, human: { stuck: true } },
    { c: "#dd2a7b", text: "Any discount codes right now?", ai: 12, human: { stuck: true } },
    { c: "#111111", text: "is this back in stock?", ai: 6, human: { label: "14m 50s" } },
    { c: "#25d366", text: "Wrong size arrived, help?", ai: 10, human: { stuck: true } },
    { c: "#38bdf8", text: "Can you confirm my address?", ai: 9, human: { stuck: true } }
  ];

  var timers = [];
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  function humanLabelSeconds(label) {
    var m = /(\d+)m\s+(\d+)s/.exec(label);
    return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 9999;
  }
  function addRow(container, text, color, statusText, statusClass) {
    var row = document.createElement("div");
    row.className = "rrow";
    row.style.setProperty("--c", color);
    row.innerHTML = '<span class="rrow-dot"></span><span class="rrow-text">' + text + '</span><span class="rrow-status ' + statusClass + '">' + statusText + "</span>";
    container.appendChild(row);
    return row;
  }

  function run(instant) {
    clearTimers();
    humanCol.innerHTML = "";
    aiCol.innerHTML = "";
    var humanFast = 0, humanStuck = 0, aiFast = 0;
    var humanTimes = [], aiTimes = [];
    humanFastEl.textContent = "0"; humanStuckEl.textContent = "0"; aiFastEl.textContent = "0";
    scoreHumanAvgEl.textContent = "—"; scoreAiAvgEl.textContent = "—";
    scoreHumanStuckEl.textContent = "0"; scoreAiStuckEl.textContent = "0";

    function updateHumanAvg() {
      if (!humanTimes.length) return;
      var avgSec = Math.round(humanTimes.reduce(function (a, b) { return a + b; }, 0) / humanTimes.length);
      scoreHumanAvgEl.textContent = formatMinSec(avgSec);
      flashBump(scoreHumanAvgEl);
    }
    function updateAiAvg() {
      if (!aiTimes.length) return;
      var avg = Math.round(aiTimes.reduce(function (a, b) { return a + b; }, 0) / aiTimes.length);
      scoreAiAvgEl.textContent = avg + "s";
      flashBump(scoreAiAvgEl);
    }

    MSGS.forEach(function (m, i) {
      var arrival = instant ? 0 : i * 380;

      timers.push(setTimeout(function () {
        var row = addRow(aiCol, m.text, m.c, "Replying…", "waiting");
        timers.push(setTimeout(function () {
          var st = row.querySelector(".rrow-status");
          st.className = "rrow-status doneAI";
          st.textContent = "Replied · " + m.ai + "s";
          aiFast++;
          aiFastEl.textContent = String(aiFast);
          aiTimes.push(m.ai);
          updateAiAvg();
        }, instant ? 0 : 450));
      }, arrival));

      timers.push(setTimeout(function () {
        var row = addRow(humanCol, m.text, m.c, "Waiting…", "waiting");
        if (m.human.stuck) {
          timers.push(setTimeout(function () {
            var st = row.querySelector(".rrow-status");
            st.className = "rrow-status stuck";
            st.textContent = "Still waiting";
            humanStuck++;
            humanStuckEl.textContent = String(humanStuck);
            scoreHumanStuckEl.textContent = String(humanStuck);
            flashBump(scoreHumanStuckEl);
          }, instant ? 0 : 800));
        } else {
          timers.push(setTimeout(function () {
            var st = row.querySelector(".rrow-status");
            st.className = "rrow-status done";
            st.textContent = "Replied · " + m.human.label;
            var secs = humanLabelSeconds(m.human.label);
            if (secs < 60) {
              humanFast++;
              humanFastEl.textContent = String(humanFast);
            }
            humanTimes.push(secs);
            updateHumanAvg();
          }, instant ? 0 : 800 + i * 210));
        }
      }, arrival));
    });
  }

  if (replayBtn) replayBtn.addEventListener("click", function (e) { e.preventDefault(); run(reduced); });

  if (reduced) {
    run(true);
  } else if ("IntersectionObserver" in window && section) {
    var ran = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !ran) {
          ran = true;
          run(false);
        }
      });
    }, { threshold: 0.3 });
    io.observe(section);
  } else {
    run(true);
  }
})();
