# React Virtual Slider
> A virtual slider for large dataset.

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]
[![License][license-badge]][license]

### Examples available here: [http://vunguyentuan.github.io/react-virtual-slider](http://vunguyentuan.github.io/react-virtual-slider)

![GIF Demo](https://github.com/vunguyentuan/react-virtual-slider/raw/master/demo/DEMO.gif)

Features
---------------
* **Smooth animations** - 60FPS dream 🌈
* **Independent style** - just style it as you like
* **No scrollbar** - yeah, you control the slider by calling goNext, goPrev, scrollTo methods
* **Render large dataset** - no matter how much your data is, it's just works

Installation
---------------

Using [npm](https://www.npmjs.com/package/react-virtual-slider):

    $ npm install react-virtual-slider --save

Or yarn:

    $ yarn add react-virtual-slider

Usage:
---------------
### Basic Example

```
import React, { Component } from 'react'
import { render } from 'react-dom'

import VirtualSlider from 'react-virtual-slider'

const styles = {
  item: {
    width: 151,
    height: 188,
    display: 'inline-block'
  },
  container: {
    overflow: 'hidden',
  }
}

class Demo extends Component {
  renderItem = (index, key) => {
    return (
      <div key={key} style={styles.item}>
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

  render() {
    return (
      <div>
        <VirtualSlider
          ref={slider => this.slider = slider}
          itemRenderer={this.renderItem}
          itemSize={151}
          length={50000}
          containerStyle={styles.container}
        />

        <button onClick={this.handlePrev}>Prev</button>
        <button onClick={this.handleNext}>Next</button>
      </div>
    )
  }
}

render(<Demo/>, document.querySelector('#demo'))
```

That's it! Simple :D



FAQ
---------------
### Running Examples

In root folder:

```
	$ yarn install
	$ yarn start
```

Dependencies
------------
React Virtual Slider has no dependencies. It has the only one peerDependencies: `react`

Reporting Issues
----------------
If believe you've found an issue, please [report it](https://github.com/vunguyentuan/react-virtual-slider/issues) along with any relevant details to reproduce it.

Asking for help
----------------
Please do not use the issue tracker for personal support requests. Instead, use [Gitter](https://gitter.im/react-virtual-slider) or StackOverflow.

Contributions
------------
Yes please! Feature requests / pull requests are welcome.

[build-badge]: https://img.shields.io/travis/vunguyentuan/react-virtual-slider/master.png?style=flat-square
[build]: https://travis-ci.org/vunguyentuan/react-virtual-slider
[npm-badge]: https://img.shields.io/npm/v/react-virtual-slider.png?style=flat-square
[npm]: https://www.npmjs.org/package/react-virtual-slider
[coveralls-badge]: https://img.shields.io/coveralls/vunguyentuan/react-virtual-slider/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/vunguyentuan/react-virtual-slider
[license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000
[license]: https://github.com/vunguyentuan/react-virtual-slider/blob/master/LICENSE