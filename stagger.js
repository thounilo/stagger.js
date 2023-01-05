import { dataset, each, isIntersecting, shouldShowOnce, querySelector } from './stuff'
/**
 * @param {IntersectionObserverEntry} entry 
 * @param {IntersectionObserver} observer 
 * @param {import('./options').Options} defaults
 */
export function handleStagger(entry, observer, defaults) {
    /**
     * Debugging
    */
    // isIntersecting(entry)
    //     ? console.log('%cEntering viewport: ' + `io-animation ${dataset(entry, 'ioStagger')}`, "color: skyblue")
    //     : console.log('%cLeaving viewport: ' + `io-animation ${dataset(entry, 'ioStagger')}`, "color: tomato")

    const animClass = dataset(entry, 'ioStagger')

    if (!isIntersecting(entry) && !shouldShowOnce(entry)) {

        for (let child of entry.target.children) {
            child.classList.remove(defaults.animationClass, animClass)
        }

        entry.target.classList.remove(defaults.animationClass, animClass)

        return
    }

    if (isIntersecting(entry) && shouldShowOnce(entry)) {

        /**@type {any} promises*/
        let promises = []

        for (let child of entry.target.children) {
            child.classList.add(defaults.animationClass, animClass)
            child.getAnimations().forEach((animation) => promises.push(animation.finished))
        }

        entry.target.classList.add(defaults.staggerClass, defaults.staggerPlayState)

        Promise.all(promises)
            .then(() => observer.unobserve(entry.target))
            .catch((err) => console.error(err.message))

        return
    }

    if (isIntersecting(entry)) {
        for (let child of entry.target.children) {
            child.classList.add(defaults.animationClass, animClass)
        }
        entry.target.classList.add(defaults.staggerClass, defaults.staggerPlayState)
    }
}
/**
 * @param {import('./options.js').options} defaults
 */
export function StaggerObserver(defaults) {
    /**
     * 
     * @param {IntersectionObserverEntry[]} entries 
     * @param {IntersectionObserver} observer 
     */
    let handler = (entries, observer) => {
        each(entries, (/** @type {IntersectionObserverEntry} el */ el) => {
            handleStagger(el, observer, defaults)
        })
    }

    let staggerObserver = new IntersectionObserver(handler, { threshold: defaults.threshold })

    each(
        querySelector(defaults.staggerSelector),
        /**
         * @param {HTMLElement} el
         */
        (el) => {
            each(
                el.children,
                (child, index) => {
                    if (!child.attributeStyleMap.has('--io-stagger-index')) {
                        child.attributeStyleMap.set('--io-stagger-index', index)
                    }
                })
            staggerObserver.observe(el)
        }
    )

    return staggerObserver
}