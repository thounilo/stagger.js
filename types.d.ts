type Iterable = Array<any> | Object

export interface Options {
    /**
     * Name of the animation class
     */
    animation: string
    /**
     * Class to add to the element when it is in view
     */
    animationTriggerClass: string
    /**
     * Duration of the animation
     */
    animationDuration: string
    /**
     * Delay of the animation
     */
    animationDelay: string
    /**
    * Options to pass into the IntersectionObserver
    *  @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#parameters
    */
    observerOptions: IntersectionObserverInit
    /**
     * Animation is paused by default, this class is added to the element when the animation is played
     */
    staggerPlayState: string
    /**
     * querySelector for stagger parent element that should stagger when in view
     */
    staggerSelector: string
    /**
     * querySelector for element that should appear when in view
     */
    appearSelector: string
}

export function each<T extends Iterable>(iterable: T[] | T, callback: (el: T, i: number) => void): void
export function handler(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void