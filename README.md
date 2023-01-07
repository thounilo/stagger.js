# Simple stagger animations

## Usage
```js
import init from './index.js'
init()
```

It will look for all elements with the `data-io-stagger` attribute and apply the stagger animation to them.
`data-io-stagger` takes a string of the animation name. The animation name is the name of the css class that will be applied to the elements.


```html
<section data-io-stagger="fade-in-slide-up" data-io-once>
    <div>Stuff</div>
    <div>More</div>
    <div>Stufff</div>
</section>
```

Using `data-io-once` will only apply the animation once. Otherwise, it will apply the animation on every pass.

It uses simple css animations to apply the animations. You can have to add your own animations to the css file and include to you page.

`.io-animation` and `io-stagger-play` is the class that is applied to the element.

```css
[data-io-stagger], [data-io-appear] {
  --animation-name: none;
  --animation-duration: 800ms;
  --animation-fill-mode: forwards;
  --animation-direction: normal;
  --animation-stagger-delay: 25ms;
  --animation-appear-delay: 250ms;
  --animation-timing-function: cubic-bezier(0.36, 0, 0.66, -0.56);
}

.io-animation {
  animation: var(--animation-name);
  animation-duration: var(--animation-duration);
  animation-fill-mode: var(--animation-fill-mode);
  animation-direction: var(--animation-direction);
}
```

For example you can use amazing work of Adam [open-props.style](https://open-props.style/#animations) to create your own animations.

```css
@import (reference);
.my-slide-fade {
  animation:
    var(--animation-fade-out) forwards,
    var(--animation-slide-out-down);
  animation-timing-function: var(--ease-squish-3);
  animation-duration: 1s;
}
```
