import React from 'react'
import {renderToString} from 'react-dom/server'
import {describe, it} from 'mocha'
import assert from 'assert'
import {Animated, Transitioned} from '../src'

const subject = (Comp, items) => renderToString(
  <Comp>
    {items.map(x => <div key={x} className={`test_${x}`}>{x}</div>)}
  </Comp>
)

describe('Niflheim', () => {
  it('Animated works', () => {
    const html = subject(Animated, ['a', 'b', 'c'])
    assert(html === '<div class="test_a entering">a</div><div class="test_b entering">b</div><div class="test_c entering">c</div>')
  })
  it('Transitioned works', () => {
    const html = subject(Transitioned, ['a', 'b', 'c'])
    assert(html === '<div class="test_a entered">a</div><div class="test_b entered">b</div><div class="test_c entered">c</div>')
  })
})
