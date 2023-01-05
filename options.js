/**
 * Default options for the library
 * @typedef {options} Options
 * @param {String} options.animation - Animation name
 * @param {String} options.animationClass - Animation class
 * @param {Number} options.duration - Animation duration
 * @param {Number} options.delay - Animation delay
 * @param {[Number]} options.threshold - Animation threshold
 * @param {String} options.staggerClass - Stagger class
 * @param {String} options.staggerPlayState - Stagger play state
 * @param {String} options.staggerSelector - Stagger selector
 * @param {String} options.appearSelector - Appear selector
 */
export const options = {
    animation: 'fade-in',
    animationClass: 'io-animation',
    duration: 1000,
    delay: 0,
    threshold: [.2],
    staggerClass: 'io-stagger',
    staggerPlayState: 'io-stagger-play',
    staggerSelector: '[data-io-stagger]',
    appearSelector: '[data-io-appear]',
}