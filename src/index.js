import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'

const getSizes = (itemSize, itemPerPage, from, length, viewportWidth) => {
  const end = Math.min(from + itemPerPage * 2 + 1, length)
  const start = Math.max(from - itemPerPage, 0)
  let offsetLeft = (from - start) * itemSize
  const visibleEndIndex = from + itemPerPage
  if (visibleEndIndex === length) {
    offsetLeft = offsetLeft - (viewportWidth - offsetLeft)
  }

  return {
    visibleStartIndex: from,
    visibleEndIndex: visibleEndIndex,
    end,
    start,
    offsetLeft
  }
}

const getAnimatingOffset = (itemSize, itemPerPage, from, length, viewportWidth, nextPosition) => {
  const { start, end, visibleEndIndex } = getSizes(itemSize, itemPerPage, from, length, viewportWidth)

  if (length - nextPosition <= itemPerPage) {
    const totalSize = (end - start) * itemSize
    return totalSize - viewportWidth
  }

  let offsetIndex = 0
  for (let i = start; i < end; i++) {
    if (nextPosition === i) {
      break
    }

    offsetIndex++
  }

  return offsetIndex * itemSize
}

class VirtualList extends PureComponent {
  constructor() {
    super()
    this.state = {
      itemPerPage: 0,
      from: 0,
      cursor: 0,
      viewportWidth: 0
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

    const itemPerPage = Math.floor(container.offsetWidth / itemSize)

    this.setState({
      itemPerPage,
      viewportWidth: container.offsetWidth
    })
  }

  goBack = () => {
    const { length, itemSize } = this.props
    const { itemPerPage, from, viewportWidth } = this.state
    const prevValue = Math.max(from - itemPerPage, 0)
    const nextStyle = getSizes(itemSize, itemPerPage, prevValue, length, viewportWidth)

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
    const { itemPerPage, from, viewportWidth } = this.state
    const nextStart = Math.min(from + itemPerPage, length - itemPerPage)

    const animatingOffset = getAnimatingOffset(itemSize, itemPerPage, from, length, viewportWidth, nextStart)
    const nextStyle = getSizes(itemSize, itemPerPage, nextStart, length, viewportWidth)

    this.list.style.transform = `translateX(-${animatingOffset}px)`
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
    const { itemPerPage, from, viewportWidth } = this.state

    const { end, offsetLeft, start, visibleStartIndex } = getSizes(
      itemSize,
      itemPerPage,
      from,
      length,
      viewportWidth
    )

    const style = {
      width: itemSize * length,
      transform: `translateX(-${offsetLeft}px)`
    }

    const visibleBound = Math.min(length, visibleStartIndex + itemPerPage)
    let items = []
    for (let i = start; i < end; i++) {
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
