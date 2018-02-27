import {Children, cloneElement} from 'react'
import {compose, withHandlers, withPropsOnChange, mapProps} from 'recompose'
import cx from 'classnames'

import {
  triggerForceUpdates,
  nextReducer,
  zipLeaving,
  cleanProps
} from './shared'

const {values} = Object

const withTransitionStates = withHandlers(() => {
  const leaving = {}
  const justEntered = {}
  return {
    leaving: () => () => leaving,
    justEntered: () => () => justEntered,
    setLeaving: () => (key, child, index) => {
      leaving[key] = {child, index}
    },
    setLeft: ({forceUpdate}) => (key) => {
      delete leaving[key]
      forceUpdate()
    },
    setJustEntered: ({forceUpdate}) => (key, bool) => {
      if (bool) justEntered[key] = bool 
      if (!bool) {
        delete justEntered[key]
        forceUpdate()
      }
    }
  }
})

const diffChildren = (prev, {
  duration = 500,
  setLeaving,
  setLeft, 
  setJustEntered,
  updates,
  children
} = {}) => {
  if (prev.updates === updates && prev.children === children) return false

  const nextChildren = Children.toArray(children).reduce(nextReducer, {})

  Children.toArray(prev.children).forEach((child, i) => {
    if (!nextChildren[child.key]) {
      setLeaving(child.key, child, i)
      setTimeout(() => setLeft(child.key), duration)
    } else {
      delete nextChildren[child.key]
    }
  })

  values(nextChildren).forEach((child) => {
    setJustEntered(child.key, true)
    setTimeout(() => setJustEntered(child.key), 1)
  })

  return true
} 

const statusClassNames = ({
  updates,
  forceUpdate,

  leaving,
  justEntered,

  before_enter = 'before_enter',
  entered = 'entered',
  after_exit = 'after_exit',

  reverse,
  children,
  ...props
}) => ({
  ...props,
  children: Children.map(children, (child) =>
    leaving().hasOwnProperty(child.key)
      ? cloneElement(child, {className: cx(child.props.className, reverse ? before_enter : after_exit)})
      : justEntered().hasOwnProperty(child.key)
        ? cloneElement(child, {className: cx(child.props.className, reverse ? after_exit : before_enter)})
        : cloneElement(child, {className: cx(child.props.className, entered)})
  )
})

export default compose(
  triggerForceUpdates,
  withTransitionStates,
  withPropsOnChange(diffChildren, zipLeaving),
  mapProps(statusClassNames),
  cleanProps
)
