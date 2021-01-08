import {Children} from 'react'
import {
  nextReducer,
  createTransitionHook,
  clone
} from './shared'

const {values} = Object

const transitionState = ({
  previous,
  children,
  setLeaving,
  setLeft,
  setEntering,
  duration
}) => {
  const nextChildren = Children.toArray(children).reduce(nextReducer, {})

  Children.toArray(previous).forEach((child, i) => {
    if (!nextChildren[child.key]) {
      setLeaving(child.key, child, i)
      setTimeout(() => setLeft(child.key), duration)
    } else {
      delete nextChildren[child.key]
    }
  })

  values(nextChildren).forEach(({key}) => {
    setEntering(key, true)
    setTimeout(() => setEntering(key), 1)
  })
}

const applyClasses = ({leaving, entering, children, options: {reverse = false, ...classes}}) =>
  Children.map(children, child => {
    const t = ['before_enter', 'after_exit']
    const c = leaving.get(child.key) ? t.reverse()[+reverse] : entering.get(child.key) ? t[+reverse] : 'entered'
    return clone(child, classes[c] || c)
  })

export default createTransitionHook(transitionState, applyClasses)
