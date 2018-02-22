import React, {Children} from 'react'
import {withStateHandlers} from 'recompose'

const {values} = Object

export const triggerForceUpdates = withStateHandlers({updates: 0}, {
  forceUpdate: ({updates}) => () => ({updates: updates + 1})
})

export const nextReducer = (acc, child) => ({...acc, [child.key]: child})

export const zipLeaving = ({
  leaving,
  children
}) => {
  const leavingMap = values(leaving()).reduce((acc, {child, index}) => ({...acc, [index]: child}), {})
  return {
    children: Children.toArray(children).reduce((acc, child, i) => [
      ...acc,
      leavingMap[i],
      child
    ], []).filter(Boolean)
  }
}

export const Wrapper = ({As = React.Fragment || 'div', children}) => <As>{children}</As>
