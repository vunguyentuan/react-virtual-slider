import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

const getSizes = (itemSize, itemPerPage, from, length) => {
  const end = Math.min(from + itemPerPage * 2, length - 1)
  let visibleStartIndex = Math.max(0, from)
  if (end - from < itemPerPage) {
    visibleStartIndex = end - from
  }

  const bufferLeft = Math.max(visibleStartIndex - itemPerPage, 0)
  const offsetLeft = (visibleStartIndex - bufferLeft) * itemSize

  return {
    visibleStartIndex,
    end,
    bufferLeft,
    offsetLeft
  }
}

class VirtualList extends PureComponent {
  constructor() {
    super()
    this.state = {
      itemPerPage: 0,
      from: 0,
      cursor: 0
    }
  }

  scrollTo = index => {
    if (index === this.state.from) return
    this.setState({
      from: index
    })
  }

  componentDidMount() {
    this.container = findDOMNode(this)
    this.calculateItemPerPage(this.props, this.container)

    window.addEventListener(
      'resize',
      this.calculateItemPerPage.bind(null, this.props, this.container)
    )
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.calculateItemPerPage.bind(null, this.props, this.container)
    )
  }

  calculateItemPerPage = (props, container) => {
    const { itemSize } = props

    const itemPerPage = Math.round(container.offsetWidth / itemSize)

    this.setState({
      itemPerPage
    })
  }

  goBack = () => {
    const { length, itemSize } = this.props
    const { itemPerPage, from } = this.state
    const prevValue = Math.max(from - itemPerPage, 0)
    const nextStyle = getSizes(itemSize, itemPerPage, prevValue, length)

    this.list.style.transform = `translateX(0px)`
    this.list.style.transition = 'transform 0.5s ease'
    const doSetState = () => {
      this.list.removeEventListener('transitionend', doSetState)
      this.list.style.transition = 'none'
      this.list.style.transform = `translateX(-${nextStyle.offsetLeft}px)`
      this.scrollTo(prevValue)
    }

    this.list.addEventListener('transitionend', doSetState)
  }

  goNext = () => {
    const { length, itemSize } = this.props
    const { itemPerPage, from } = this.state
    const nextStart = from + itemPerPage

    const { offsetLeft } = getSizes(itemSize, itemPerPage, from, length)
    const nextStyle = getSizes(itemSize, itemPerPage, nextStart, length)

    this.list.style.transform = `translateX(-${offsetLeft + nextStyle.offsetLeft}px)`
    this.list.style.transition = 'transform 0.5s ease'
    const doSetState = () => {
      this.list.removeEventListener('transitionend', doSetState)
      this.list.style.transition = 'none'
      this.list.style.transform = `translateX(-${nextStyle.offsetLeft}px)`
      this.scrollTo(nextStart)
    }
    this.list.addEventListener('transitionend', doSetState)
  }

  render() {
    const { length, itemSize, itemRenderer, containerStyle } = this.props
    const { itemPerPage, from } = this.state

    const { end, offsetLeft, bufferLeft, visibleStartIndex } = getSizes(
      itemSize,
      itemPerPage,
      from,
      length
    )

    const style = {
      width: itemSize * length,
      transform: `translateX(-${offsetLeft}px)`
    }

    const visibleBound = Math.min(length - 1, visibleStartIndex + itemPerPage)
    let items = []
    for (let i = bufferLeft; i < end; i++) {
      if (i < visibleStartIndex) {
        console.log('buffer left', i)
      } else if (i < visibleBound) {
        console.log('visible', i)
      } else {
        console.log('buffer right', i)
      }

      items.push(itemRenderer(i, i))
    }

    return (
      <div className="slider-container" style={containerStyle}>
        <div style={style} ref={node => (this.list = node)}>
          {items}
        </div>
      </div>
    )
  }
}

export default VirtualList
