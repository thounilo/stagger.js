import { addClass, dataset, isIntersecting, removeClass, shouldShowOnce, each, querySelector } from './stuff.js'

function showAndDestroyAppear(entry, observer) {
    addClass(
        entry.target,
        'io-animation',
        dataset(entry, 'ioAppear')
    )

    let animations = entry.target.getAnimations()
        .map((animation) => animation.finished)

    Promise.all(animations).then(() => {
        observer.unobserve(entry.target)
    })
}
/**
 * 
 * @param {IntersectionObserverEntry} entry 
 */
export function handleAppear(entry, observer) {

    if (!isIntersecting(entry) && !shouldShowOnce(entry)) {
        removeClass(entry.target, 'io-animation', dataset(entry, 'ioAppear'))
        return
    }

    if (shouldShowOnce(entry)) {
        void showAndDestroyAppear(entry, observer)
        return
    }

    addClass(
        entry.target,
        'io-animation',
        dataset(entry, 'ioAppear')
    )
}


/**
 * 
 * @param {options} defaults 
 * @returns 
 */
export function AppearObserver(defaults) {
    /**
     * * Appear animations
    */
    let appearObserver = new IntersectionObserver((entries, observer) => {
        each(entries, (el) => {
            handleAppear(el, observer)
        })
    }, { threshold: defaults.threshold })

    each(
        querySelector(defaults.appearSelector),
        (el) => appearObserver.observe(el)
    )
    return appearObserver
}