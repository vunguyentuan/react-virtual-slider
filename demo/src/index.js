import React, { Component } from "react"
import { render } from "react-dom"

import VirtualSlider from "../../src"

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomColor() {
  const red = getRandomIntInclusive(0, 255)
  const green = getRandomIntInclusive(0, 255)
  const blue = getRandomIntInclusive(0, 255)

  return `rgb(${red}, ${green}, ${blue})`
}

const styles = {
  item: {
    width: 151,
    height: 188,
    display: "inline-block"
  },
  container: {
    overflow: "hidden"
  }
}

class Demo extends Component {
  renderItem = (index, key) => {
    return (
      <div key={key} style={{ ...styles.item, backgroundColor: randomColor() }}>
        {index}
      </div>
    )
  }

  handlePrev = () => {
    this.slider.goBack()
  }

  handleNext = () => {
    this.slider.goNext()
  }

  goToFirst = () => {
    this.slider.scrollTo(0)
  }

  goto = position => {
    this.slider.scrollTo(position)
  }

  handleStart = () => {
    console.log("start")
  }

  handleEnd = () => {
    console.log("end")
  }

  render() {
    return (
      <div>
        <h1>react-virtual-slider Demo</h1>
        <h1>TOTAL: 50,000 items</h1>
        <VirtualSlider
          ref={slider => (this.slider = slider)}
          itemRenderer={this.renderItem}
          itemSize={151}
          length={30}
          containerStyle={styles.container}
          startAction={this.handleStart}
          endAction={this.handleEnd}
        />

        <button onClick={this.handlePrev}>Prev</button>
        <button onClick={this.handleNext}>Next</button>
        <button onClick={this.goToFirst}>FIRST</button>
        <button onClick={this.goto.bind(null, 500)}>500th item</button>
      </div>
    )
  }
}

render(<Demo />, document.querySelector("#demo"))
