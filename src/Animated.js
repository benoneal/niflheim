import {Children} from 'react'
import {
  nextReducer,
  createTransitionHook,
  clone
} from './shared'

const transitionState = ({
  previous,
  children,
  setLeaving,
  setLeft,
  duration
}) => {
  const nextChildren = Children.toArray(children).reduce(nextReducer, {})

  Children.toArray(previous).forEach((child, i) => {
    if (!nextChildren[child.key]) {
      setLeaving(child.key, child, i)
      setTimeout(() => setLeft(child.key), duration)
    }
  })
}

const applyClasses = ({leaving, children, options: {reverse = false, ...classes}}) =>
  Children.map(children, child => {
    const c = `${leaving[child.key] ? 'exiting' : 'entering'}${reverse ? '_reverse' : ''}`
    return clone(child, classes[c] || c)
  })

export default createTransitionHook(transitionState, applyClasses)
