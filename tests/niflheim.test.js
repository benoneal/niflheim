import React from 'react'
import {renderToString} from 'react-dom/server'
import {configure, mount} from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import {Animated, Transitioned} from '../src'

configure({adapter: new Adapter()})

const compString = (Comp, items) => renderToString(
  <Comp>
    {items.map(x => <div key={x} className={`test_${x}`}>{x}</div>)}
  </Comp>
)

const createWrapper = (Comp, items) => class TestWrapper extends React.Component {
  state = {items}
  render = () => (
    <Comp>
      {this.state.items.map(x => <div key={x} className={`test_${x}`}>{x}</div>)}
    </Comp>
  )
}

const compMounted = (Comp, items) => {
  const Wrapper = createWrapper(Comp, items)
  return mount(<Wrapper />)
}

describe('Niflheim', () => {
  describe('Transitioned', () => {
    it('works', () => {
      const html = compString(Transitioned, ['a', 'b', 'c'])
      expect(html).toBe('<div class="test_a entered">a</div><div class="test_b entered">b</div><div class="test_c entered">c</div>')
    })

    it('renders entering and exiting components', () => {
      const wrapper = compMounted(Transitioned, ['a', 'b', 'c'])
      expect(wrapper.html()).toBe('<div class="test_a entered">a</div><div class="test_b entered">b</div><div class="test_c entered">c</div>')

      wrapper.setState({items: ['a', 'c']})
      expect(wrapper.html()).toBe('<div class="test_a entered">a</div><div class="test_b after_exit">b</div><div class="test_c entered">c</div>')

      wrapper.setState({items: ['a', 'c', 'd']})
      expect(wrapper.html()).toBe('<div class="test_a entered">a</div><div class="test_b after_exit">b</div><div class="test_c entered">c</div><div class="test_d before_enter">d</div>')

      wrapper.setState({items: []})
      expect(wrapper.html()).toBe('<div class="test_a after_exit">a</div><div class="test_b after_exit">b</div><div class="test_c after_exit">c</div><div class="test_d after_exit">d</div>')
    })
  })

  describe('Animated', () => {
    it('works', () => {
      const html = compString(Animated, ['a', 'b', 'c'])
      expect(html).toBe('<div class="test_a entering">a</div><div class="test_b entering">b</div><div class="test_c entering">c</div>')
    })

    it('renders entering and exiting components', () => {
      const wrapper = compMounted(Animated, ['a', 'b', 'c'])
      expect(wrapper.html()).toBe('<div class="test_a entering">a</div><div class="test_b entering">b</div><div class="test_c entering">c</div>')

      wrapper.setState({items: ['a', 'c']})
      expect(wrapper.html()).toBe('<div class="test_a entering">a</div><div class="test_b exiting">b</div><div class="test_c entering">c</div>')

      wrapper.setState({items: ['a', 'c', 'd']})
      expect(wrapper.html()).toBe('<div class="test_a entering">a</div><div class="test_b exiting">b</div><div class="test_c entering">c</div><div class="test_d entering">d</div>')

      wrapper.setState({items: []})
      expect(wrapper.html()).toBe('<div class="test_a exiting">a</div><div class="test_b exiting">b</div><div class="test_c exiting">c</div><div class="test_d exiting">d</div>')
    })
  })
})
