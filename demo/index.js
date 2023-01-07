(() => {
    // lib/stuff.js
    var isBrowser = () => {
      try {
        return !!(window && window?.document);
      } catch (e) {
        return false;
      }
    };
    var querySelector = (selector) => Array.from(document.querySelectorAll(selector) || []);
    function each(iterable, callback) {
      if (!iterable)
        return;
      if (iterable instanceof NodeList || iterable instanceof HTMLCollection || iterable instanceof Array) {
        [...iterable].forEach((el, i) => callback(el, i));
      }
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
  
    // lib/stagger.js
    function handleStagger(entry, observer, defaults) {
      const animClass = dataset(entry, "ioStagger");
      if (!isIntersecting(entry) && !shouldShowOnce(entry)) {
        for (let child of entry.target.children) {
          child.classList.remove(defaults.animationTriggerClass, animClass);
        }
        entry.target.classList.remove(defaults.animationTriggerClass, animClass);
        return;
      }
      if (isIntersecting(entry) && shouldShowOnce(entry)) {
        let promises = [];
        for (let child of entry.target.children) {
          child.classList.add(defaults.animationTriggerClass, animClass);
          child.getAnimations().forEach((animation) => promises.push(animation.finished));
        }
        entry.target.classList.add(defaults.staggerClass, defaults.staggerPlayState);
        Promise.all(promises).then(() => observer.unobserve(entry.target)).catch((err) => console.error(err.message));
        return;
      }
      if (isIntersecting(entry)) {
        for (let child of entry.target.children) {
          child.classList.add(defaults.animationTriggerClass, animClass);
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
        each(el?.children, (child, index) => {
          if (!(child instanceof HTMLElement))
            return;
          if (!child.attributeStyleMap.has("--io-index")) {
            child.attributeStyleMap.set("--io-index", index);
          }
          if (el.dataset?.ioStaggerChildren) {
            console.log(el.dataset?.ioStaggerChildren);
            child.classList.add(el.dataset?.ioStaggerChildren);
          }
        });
        staggerObserver.observe(el);
      });
      return staggerObserver;
    }
  
    // lib/appear.js
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
  
    // lib/defaults.js
    var options = {
      animation: "fade-in-slide-up",
      animationTriggerClass: "io-animation",
      animationDuration: 1e3,
      animationDelay: 0,
      observerOptions: {},
      staggerClass: "io-stagger",
      staggerPlayState: "io-stagger-play",
      staggerSelector: "[data-io-stagger]",
      appearSelector: "[data-io-appear]"
    };
  
    // lib/index.js
    function init() {
      if (isBrowser()) {
        StaggerObserver(options);
        AppearObserver(options);
      }
    }
    var lib_default = init;
  })();
  