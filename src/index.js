import React, { PureComponent } from 'react'
import { findDOMNode } from 'react-dom'
import { getSizes, getItemPerPage, getAnimatingOffset } from './utils'

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
    const { startAction, endAction, length}  = this.props
    const { itemPerPage } = this.state

    if (index === 0) {
      startAction && startAction()
    }

    if (index === length - itemPerPage) {
      endAction && endAction()
    }

    if (index === this.state.from) return

    this.setState({
      from: index
    })
    this.list.removeEventListener('transitionend', this.lastTransitionendAction)
    this.lastTransitionendAction = null
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
    const viewportWidth = container.offsetWidth
    const itemPerPage = getItemPerPage(viewportWidth, itemSize)

    this.setState({
      itemPerPage,
      viewportWidth
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
      this.list.style.transition = 'none'
      this.list.style.transform = `translateX(-${nextStyle.offsetLeft}px)`
      this.scrollTo(prevValue)
    }

    if (this.lastTransitionendAction) {
      this.list.removeEventListener("transitionend", this.lastTransitionendAction)
    }
    this.list.addEventListener('transitionend', doSetState)
    this.lastTransitionendAction = doSetState
  }

  goNext = () => {
    const { length, itemSize } = this.props
    const { itemPerPage, from, viewportWidth } = this.state
    const nextStart = Math.min(from + itemPerPage, length - itemPerPage)

    const nextStyle = getSizes(itemSize, itemPerPage, nextStart, length, viewportWidth)
    const animatingOffset = getAnimatingOffset(itemSize, itemPerPage, from, length, viewportWidth, nextStart)

    this.list.style.transform = `translateX(-${animatingOffset}px)`
    this.list.style.transition = 'transform 0.5s ease'
    const doSetState = () => {
      this.list.style.transition = 'none'
      this.list.style.transform = `translateX(-${nextStyle.offsetLeft}px)`
      this.scrollTo(nextStart)
    }

    if (this.lastTransitionendAction) {
      this.list.removeEventListener("transitionend", this.lastTransitionendAction)
    }
    this.list.addEventListener('transitionend', doSetState)
    this.lastTransitionendAction = doSetState
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
      transform: `translateX(-${offsetLeft}px)`,
      willChange: 'transform'
    }

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
