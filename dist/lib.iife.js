(() => {
  // stuff.js
  var isBrowser = () => {
    try {
      return !!(window && window?.document);
    } catch (e) {
      return false;
    }
  };
  var querySelector = (selector) => Array.from(document.querySelectorAll(selector) ?? []);
  function each(iterable, callback) {
    if (!iterable)
      return;
    if (iterable instanceof NodeList || iterable instanceof HTMLCollection) {
      iterable = Array.from(iterable);
    }
    iterable.forEach((el, i) => callback(el, i));
    return iterable;
  }
  var dataset = (entry, key) => entry?.target?.dataset?.[key] ?? "";
  var isIntersecting = (entry) => entry?.isIntersecting && entry?.intersectionRatio > 0;
  var shouldShowOnce = (entry) => entry?.target?.dataset?.hasOwnProperty?.("ioOnce");
  function addClass(el, ...args) {
    each(args, (arg) => {
      let classes = typeof arg === "string" && arg.split(" ") || arg instanceof Array && arg || [];
      el.classList.add(...classes);
    });
  }
  function removeClass(el, ...args) {
    each(args, (arg) => {
      let classes = typeof arg === "string" && arg.split(" ") || arg instanceof Array && arg || [];
      el.classList.remove(...classes);
    });
  }

  // stagger.js
  function handleStagger(entry, observer, defaults) {
    const animClass = dataset(entry, "ioStagger");
    if (!isIntersecting(entry) && !shouldShowOnce(entry)) {
      for (let child of entry.target.children) {
        child.classList.remove(defaults.animationClass, animClass);
      }
      entry.target.classList.remove(defaults.animationClass, animClass);
      return;
    }
    if (isIntersecting(entry) && shouldShowOnce(entry)) {
      let promises = [];
      for (let child of entry.target.children) {
        child.classList.add(defaults.animationClass, animClass);
        child.getAnimations().forEach((animation) => promises.push(animation.finished));
      }
      entry.target.classList.add(defaults.staggerClass, defaults.staggerPlayState);
      Promise.all(promises).then(() => observer.unobserve(entry.target)).catch((err) => console.error(err.message));
      return;
    }
    if (isIntersecting(entry)) {
      for (let child of entry.target.children) {
        child.classList.add(defaults.animationClass, animClass);
      }
      entry.target.classList.add(defaults.staggerClass, defaults.staggerPlayState);
    }
  }
  function StaggerObserver(defaults) {
    let handler = (entries, observer) => {
      each(entries, (el) => {
        handleStagger(el, observer, defaults);
      });
    };
    let staggerObserver = new IntersectionObserver(handler, { threshold: defaults.threshold });
    each(querySelector(defaults.staggerSelector), (el) => {
      each(el.children, (child, index) => {
        if (!child.attributeStyleMap.has("--io-stagger-index")) {
          child.attributeStyleMap.set("--io-stagger-index", index);
        }
      });
      staggerObserver.observe(el);
    });
    return staggerObserver;
  }

  // appear.js
  function showAndDestroyAppear(entry, observer) {
    addClass(entry.target, "io-animation", dataset(entry, "ioAppear"));
    let animations = entry.target.getAnimations().map((animation) => animation.finished);
    Promise.all(animations).then(() => {
      observer.unobserve(entry.target);
    });
  }
  function handleAppear(entry, observer) {
    if (!isIntersecting(entry) && !shouldShowOnce(entry)) {
      removeClass(entry.target, "io-animation", dataset(entry, "ioAppear"));
      return;
    }
    if (shouldShowOnce(entry)) {
      void showAndDestroyAppear(entry, observer);
      return;
    }
    addClass(entry.target, "io-animation", dataset(entry, "ioAppear"));
  }
  function AppearObserver(defaults) {
    let appearObserver = new IntersectionObserver((entries, observer) => {
      each(entries, (el) => {
        handleAppear(el, observer);
      });
    }, { threshold: defaults.threshold });
    each(querySelector(defaults.appearSelector), (el) => appearObserver.observe(el));
    return appearObserver;
  }

  // options.js
  var options = {
    animation: "fade-in",
    animationClass: "io-animation",
    duration: 1e3,
    delay: 0,
    threshold: [0.2],
    staggerClass: "io-stagger",
    staggerPlayState: "io-stagger-play",
    staggerSelector: "[data-io-stagger]",
    appearSelector: "[data-io-appear]"
  };

  // index.js
  function init() {
    if (isBrowser()) {
      StaggerObserver(options);
      AppearObserver(options);
    }
  }
  var stagger_default = init;
})();
