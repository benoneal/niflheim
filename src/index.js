import React from 'react'
import useAnimated from './Animated'
import useTransitioned from './Transitioned'

export {
  useAnimated,
  useTransitioned
}

export const Animated = ({As = React.Fragment, children, ...options}) =>
  <As>{useAnimated(children, options)}</As>

export const Transitioned = ({As = React.Fragment, children, ...options}) =>
  <As>{useTransitioned(children, options)}</As>
