import {Children, cloneElement} from 'react'
import {compose, withHandlers, withPropsOnChange, mapProps} from 'recompose'
import cx from 'classnames'

import {
  triggerForceUpdates,
  nextReducer,
  zipLeaving
} from './shared'

const withTransitionStates = withHandlers(() => {
  const leaving = {}
  return {
    leaving: () => () => leaving,
    setLeaving: () => (key, child, index) => {
      leaving[key] = {child, index}
    },
    setLeft: ({forceUpdate}) => (key) => {
      delete leaving[key]
      forceUpdate()
    }
  }
})

const diffChildren = (prev, {
  duration = 500,
  setLeaving,
  setLeft, 
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

  return true
} 

const statusClassNames = ({
  As,
  leaving,

  entering = 'entering',
  entering_reverse = 'entering_reverse',
  exiting = 'exiting',
  exiting_reverse = 'exiting_reverse',

  reverse,
  children,
  ...props
}) => ({
  ...props,
  children: Children.map(children, (child) =>
    leaving().hasOwnProperty(child.key)
      ? cloneElement(child, {className: cx(child.props.className, reverse ? exiting_reverse : exiting)})
      : cloneElement(child, {className: cx(child.props.className, reverse ? entering_reverse : entering)})
  )
})

export default compose(
  triggerForceUpdates,
  withTransitionStates,
  withPropsOnChange(diffChildren, zipLeaving),
  mapProps(statusClassNames)
)
