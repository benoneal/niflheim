import React from 'react'
import {renderToString} from 'react-dom/server'
import {describe, it} from 'mocha'
import {mount} from 'enzyme'
import assert from 'assert'
import {Animated, Transitioned} from '../src'

const compString = (Comp, items) => renderToString(
  <Comp>
    {items.map(x => <div key={x} className={`test_${x}`}>{x}</div>)}
  </Comp>
)

// Enzyme does not support Fragments, so rendering wrapper as div to pass tests
const createWrapper = (Comp, items) => class TestWrapper extends React.Component {
  state = {items}
  render = () => (
    <Comp As={'span'}>
      {this.state.items.map(x => <div key={x} className={`test_${x}`}>{x}</div>)}
    </Comp>
  )
}

const compMounted = (Comp, items) => {
  const Wrapper = createWrapper(Comp, items)
  return mount(<Wrapper />)
}

describe('Niflheim', () => {
  describe('Animated', () => {
    it('works', () => {
      const html = compString(Animated, ['a', 'b', 'c'])
      assert(html === '<div class="test_a entering">a</div><div class="test_b entering">b</div><div class="test_c entering">c</div>')
    })
    it('renders entering and exiting components', () => {
      const wrapper = compMounted(Animated, ['a', 'b', 'c'])
      assert(wrapper.html() === '<span><div class="test_a entering">a</div><div class="test_b entering">b</div><div class="test_c entering">c</div></span>')

      wrapper.setState({items: ['a', 'c']})
      assert(wrapper.html() === '<span><div class="test_a entering">a</div><div class="test_b exiting">b</div><div class="test_c entering">c</div></span>')

      wrapper.setState({items: ['a', 'c', 'd']})
      assert(wrapper.html() === '<span><div class="test_a entering">a</div><div class="test_b exiting">b</div><div class="test_c entering">c</div><div class="test_d entering">d</div></span>')

      wrapper.setState({items: []})
      assert(wrapper.html() === '<span><div class="test_a exiting">a</div><div class="test_b exiting">b</div><div class="test_c exiting">c</div><div class="test_d exiting">d</div></span>')
    })
  })

  describe('Transitioned', () => {
    it('works', () => {
      const html = compString(Transitioned, ['a', 'b', 'c'])
      assert(html === '<div class="test_a entered">a</div><div class="test_b entered">b</div><div class="test_c entered">c</div>')
    })
    it('renders entering and exiting components', () => {
      const wrapper = compMounted(Transitioned, ['a', 'b', 'c'])
      assert(wrapper.html() === '<span><div class="test_a entered">a</div><div class="test_b entered">b</div><div class="test_c entered">c</div></span>')

      wrapper.setState({items: ['a', 'c']})
      assert(wrapper.html() === '<span><div class="test_a entered">a</div><div class="test_b after_exit">b</div><div class="test_c entered">c</div></span>')

      wrapper.setState({items: ['a', 'c', 'd']})
      assert(wrapper.html() === '<span><div class="test_a entered">a</div><div class="test_b after_exit">b</div><div class="test_c entered">c</div><div class="test_d before_enter">d</div></span>')

      wrapper.setState({items: []})
      assert(wrapper.html() === '<span><div class="test_a after_exit">a</div><div class="test_b after_exit">b</div><div class="test_c after_exit">c</div><div class="test_d after_exit">d</div></span>')
    })
  })
})
