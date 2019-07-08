import {
  Children,
  cloneElement,
  useCallback,
  useReducer,
  useMemo
} from 'react'

const {values} = Object
const {max} = Math

export const clone = (child, className) => cloneElement(child, {className: cx(child.props.className, className)})

const cx = (...args) => args.filter(Boolean).join(' ')

const transitionHandlers = {
  previous: (state, previous) => ({...state, previous}),
  leaving: ({leaving, ...state}, key, child, index) => ({...state, leaving: {...leaving, [key]: {child, index}}}),
  left: ({leaving, ...state}, key) => {
    const {[key]: _, ...newLeaving} = leaving
    return {...state, leaving: newLeaving}
  },
  entering: ({entering, ...state}, key, bool) => {
    if (bool) return ({...state, entering: {...entering, [key]: bool}})
    const {[key]: _, ...newEntered} = entering
    return {...state, entering: newEntered}
  }
}

const reducer = (state, [action, ...args]) => transitionHandlers[action](state, ...args)

export const nextReducer = (acc, child) => ({...acc, [child.key]: child})

const iter = (limit, fn) => {
  let i = -1
  while(++i <= limit) fn(i)
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

const zipLeaving = (
  leaving,
  children
) => {
  const currentChildren = Children.toArray(children)
  const allChildren = []
  const currentKeys = currentChildren.map(({key}) => key)
  let maxIndex = currentChildren.length
  let offset = 0

  const leavingMap = values(leaving).reduce((acc, {child, index}) => {
    if (currentKeys.includes(child.key)) return acc

    const insertAt = nextFreeIndex(acc, index + offset)

    maxIndex = max(insertAt, maxIndex)
    offset = insertAt - index
    return ({...acc, [insertAt]: child})
  }, {})

  iter(maxIndex, zip(allChildren, leavingMap, currentChildren))

  return allChildren
}

const createSetter = (action, dispatch) => useCallback((...args) => dispatch([action, ...args]), [])

export const createTransitionHook = (transitionState, applyClasses) => (children, {duration = 500, ...options}) => {
  const [{previous, entering, leaving}, dispatch] = useReducer(reducer, {previous: children, entering: {}, leaving: {}})
  const setPrevious = createSetter('previous', dispatch)
  const setEntering = createSetter('entering', dispatch)
  const setLeaving = createSetter('leaving', dispatch)
  const setLeft = createSetter('left', dispatch)
  if (children !== previous) {
    transitionState({previous, children, setLeaving, setLeft, setEntering, duration})
    setPrevious(children)
  }
  return useMemo(_ => applyClasses({leaving, entering, children: zipLeaving(leaving, children), options}), [entering, leaving, children])
}
