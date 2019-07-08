# Niflheim

A tiny, simple, and reliable way to animate mounting and unmounting components in React, with the abiity to reverse the direction of animation as required.

## How to use

Install via `npm i niflheim`.

Choose whether you are going to be animating via the css `transition` property, or via css `animation`, and use the corresponding Niflheim Component to wrap the children you want to animate (`Transitioned` vs `Animated`).

As with all implementations of mounting transitions: *ALL CHILDREN REQUIRE A UNIQUE MEANINGFUL `key`*

## Example

```js
import {Animated, Transitioned} from 'niflheim'

// 'key' prop is essential
// Requires that your stylesheet contains classes for:
// .entering .exiting .before_enter .entered .after_exit
// Or you can provide your own classes (see API below)

const Suggestions = ({items}) =>
  <Animated As={'ul'}>
    {items.map(({name, id}) =>
      <li key={id} className={'listItem'}>{name}</li>
    )}
  </Animated>

const Autocomplete = ({items, category, query}) =>
  <Transitioned>
    <Suggestions
      key={category}
      items={items.filter(({name}) => name.includes(query))}
    />
  </Transitioned>

// When 'category' changes, the Suggestions view will transition out and a new one will transition in
// When the query is updated, items that are filtered out will animate out from the list
```

### Shared API

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| As | string or Component | React.Fragment | What the children will be wrapped with |
| reverse | boolean | false | Whether the animation should be run in reverse |
| duration | number | 500 | How long your transition/animation takes (this should exactly match the duration + delay defined in your styles) |

### Animated API

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| entering | className string | 'entering' | The class applied when the component mounts |
| entering_reverse | className string | 'entering_reverse' | The class applied when the component mounts |
| exiting | className string | 'exiting' | The class applied when the component unmounts
| exiting_reverse | className string | 'exiting_reverse' | The class applied when the component unmounts |

It's worth noting that the `entering` classes are not removed until the component unmounts, so your css animation should not loop. If you don't plan on reversing your animation, you can ignore the `_reverse` props.

### Transitioned API

| Prop | Type | Default | Effect |
| --- | --- | --- | --- |
| before_enter | className string | 'before_enter' | The class applied for 1ms when the component mounts |
| entered | className string | 'entered' | The class applied 1ms after the component mounts (triggering the transition) |
| after_exit | className string | 'after_exit' | The class applied when the component unmounts (triggering the transition) |

Due to how css transitions work, your transition classes should define what the component should look like at the above points in time.

### Hooks API

Niflheim also exports two hooks: `useTransitioned` and `useAnimated`.

```
import {useTransitioned, useAnimated} from 'niflheim'

const Component = ({prev, next, children}) => {
  const animatedChildren = useAnimated(children, {reverse: next < prev})
  return <div>{animatedChildren}</div>
}
```
