import AnimatedHOC from './Animated'
import TransitionedHOC from './Transitioned'
import {Wrapper} from './shared'

export const withAnimatedChildren = AnimatedHOC
export const withTransitionedChildren = TransitionedHOC

export const Animated = withAnimatedChildren(Wrapper)
export const Transitioned = withTransitionedChildren(Wrapper)
