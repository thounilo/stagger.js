/**
 * Checks if the code can run in a browser
 * @returns {boolean}
 */
export const isBrowser = () => {
    try {
        return !!(window && window?.document)
    } catch (e) {
        return false
    }
}
/**
 * 
 * Returns an `Array` of elements from a CSS selector
 * @param {string} selector - Any valid CSS selector
 * @returns {Array<HTMLElement>} - Always array of HTMLElements or empty array
 * 
 */
export const querySelector = (selector) =>  Array.from(document.querySelectorAll(selector) || [])

/**
 * Simplify looping over a NodeList or HTMLCollection
 * @type {import('./types.js').each} iterable 
 * @returns 
*/
export function each(iterable, callback) {

    if (!iterable) return 

    if (iterable instanceof NodeList || iterable instanceof HTMLCollection || iterable instanceof Array) {
        [...iterable].forEach((el, i) => callback(el, i))
    }
}
/**
 * 
 * Check if the element has a dataset attribute and return it
 * @param {IntersectionObserverEntry} entry
 * @param {string} key 
 * @returns {string}
 * 
 */
export const dataset = (entry, key) => entry?.target?.dataset?.[key] ?? ''
/**
 * 
 * Check if element is intersecting
 * @param {IntersectionObserverEntry} entry 
 * 
 */
export const isIntersecting = (entry) => entry?.isIntersecting && entry?.intersectionRatio > 0
/**
 * 
 * Check if element has data-io-once attribute
 * @param {IntersectionObserverEntry} entry 
 * 
 */
export const shouldShowOnce = (entry) => entry?.target?.dataset?.hasOwnProperty?.('ioOnce')

/**
 * Add one or more classes to an element
 * @param {Element} el 
 * @param  {...Array<string>|string} args 
 */
export function addClass(el, ...args) {
    each(args, arg => {
        let classes = 
        (typeof arg === 'string' && arg.split(' '))
            || (arg instanceof Array && arg) 
            || []
        el.classList.add(...classes)
    })
}

/**
 * Remove one or more classes from element
 * @param {Element} el 
 * @param  {...Array<string>|string} args 
 */
export function removeClass(el, ...args) {
    each(args, arg => {
        let classes = (typeof arg === 'string' && arg.split(' '))
            || (arg instanceof Array && arg) 
            || []
        el.classList.remove(...classes)
    })
}