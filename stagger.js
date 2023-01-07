import { dataset, each, isIntersecting, shouldShowOnce, querySelector } from './stuff.js'
/**
 * @param {IntersectionObserverEntry} entry 
 * @param {IntersectionObserver} observer 
 * @param {import('./options').Options} defaults
 */
export function handleStagger(entry, observer, defaults) {

    const animClass = dataset(entry, 'ioStagger')

    if (!isIntersecting(entry) && !shouldShowOnce(entry)) {

        for (let child of entry.target.children) {
            child.classList.remove(defaults.animationTriggerClass, animClass)
        }

        entry.target.classList.remove(defaults.animationTriggerClass, animClass)

        return
    }

    if (isIntersecting(entry) && shouldShowOnce(entry)) {

        /**@type {any} promises*/
        let promises = []

        for (let child of entry.target.children) {
            child.classList.add(defaults.animationTriggerClass, animClass)
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
            child.classList.add(defaults.animationTriggerClass, animClass)
        }
        entry.target.classList.add(defaults.staggerClass, defaults.staggerPlayState)
    }
}

/**
 * @param {import('./types.js').Options} defaults
 */
export function StaggerObserver(defaults) {
    /**
     * @type {import('./types').handler}
     */
    let handler = (entries, observer) => {
        each(entries, (el) => {
            handleStagger(el, observer, defaults)
        })
    }

    let staggerObserver = new IntersectionObserver(handler, { threshold: defaults.threshold })
    
    each(
        querySelector(defaults.staggerSelector),
        (el) => {
            each(
                el?.children,
                (child, index) => {
                    if(!(child instanceof HTMLElement)) return

                    if (!child.attributeStyleMap.has('--io-index')) {
                        child.attributeStyleMap.set('--io-index', index)
                    }
                    if(el.dataset?.ioStaggerChildren) {
                        console.log(el.dataset?.ioStaggerChildren);
                        child.classList.add(el.dataset?.ioStaggerChildren)
                    }
                })
            staggerObserver.observe(el)
        }
    )

    return staggerObserver
}