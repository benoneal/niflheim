import React, {Children} from 'react'
import {withStateHandlers, mapProps} from 'recompose'

const {values} = Object
const {max} = Math

export const triggerForceUpdates = withStateHandlers({updates: 0}, {
  forceUpdate: ({updates}) => () => ({updates: updates + 1})
})

export const nextReducer = (acc, child) => ({...acc, [child.key]: child})

const iter = (limit, fn) => {
  for (let i = 0; i <= limit; i++) {
    fn(i)
  }
}

const zip = (into, first, second) => i => {
  first[i] && into.push(first[i])
  second[i] && into.push(second[i])
}

const nextFreeIndex = (map, index) => {
  let nextSafeIndex = -1
  let count = 1
  while (nextSafeIndex < 0) {
    nextSafeIndex = !map[index] 
      ? index 
      : !map[index + count++]
        ? index + count
        : nextSafeIndex
  }
  return nextSafeIndex
}

export const zipLeaving = ({
  leaving,
  children
}) => {
  const currentChildren = Children.toArray(children)
  const allChildren = []
  const currentKeys = currentChildren.map(({key}) => key)
  let maxIndex = currentChildren.length
  let offset = 0

  const leavingMap = values(leaving()).reduce((acc, {child, index}) => {
    if (currentKeys.includes(child.key)) return acc

    const insertAt = nextFreeIndex(acc, index + offset)

    maxIndex = max(insertAt, maxIndex)
    offset = insertAt - index
    return ({...acc, [insertAt]: child})
  }, {})

  iter(maxIndex, zip(allChildren, leavingMap, currentChildren))

  return {
    children: allChildren
  }
}

export const cleanProps = mapProps(({
  updates,
  forceUpdate,
  setLeaving,
  setLeft,
  setJustEntered,
  duration,
  ...props
}) => props)

export const Wrapper = ({As = React.Fragment || 'div', children, ...props}) => 
  <As {...props}>{children}</As>
