export const getSizes = (itemSize, itemPerPage, from, length, viewportWidth) => {
  const end = Math.min(from + itemPerPage * 2 + 1, length)
  const start = Math.max(from - itemPerPage, 0)
  let offsetLeft = (from - start) * itemSize
  const visibleEndIndex = from + itemPerPage
  if (visibleEndIndex === length) {
    const totalSize = (end - start) * itemSize
    offsetLeft = totalSize - viewportWidth
  }

  return {
    visibleStartIndex: from,
    visibleEndIndex: visibleEndIndex,
    end,
    start,
    offsetLeft
  }
}

export const getAnimatingOffset = (
  itemSize,
  itemPerPage,
  from,
  length,
  viewportWidth,
  nextPosition
) => {
  const { start, end } = getSizes(
    itemSize,
    itemPerPage,
    from,
    length,
    viewportWidth
  )

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

export const getItemPerPage = (viewportWidth, itemSize) => {
  return Math.floor(viewportWidth / itemSize)
}

export default {
  getItemPerPage,
  getSizes,
  getAnimatingOffset
}