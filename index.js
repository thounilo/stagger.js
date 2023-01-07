
import { StaggerObserver } from './stagger.js'
import { AppearObserver } from './appear.js'
import { isBrowser } from './stuff.js'
import { options } from './defaults.js'


function init() {
    if (isBrowser()) {
        StaggerObserver(options)
        AppearObserver(options)
    }
}

export { StaggerObserver, AppearObserver } 
export default init