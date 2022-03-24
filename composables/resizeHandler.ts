export function setupResizeHandler (
  resizeableElement: HTMLElement,
  resizeHandle: HTMLElement,
  callback?: () => void
) {
  const minPaneSize = 150
  const maxPaneSize = 1000
  resizeableElement.style.setProperty('--max-height', `${maxPaneSize}px`)
  resizeableElement.style.setProperty('--min-height', `${minPaneSize}px`)

  let clearListeners: AbortController | undefined

  function setPaneHeight (height: number) {
    resizeableElement.style.setProperty('--resizeable-height', `${height - 10}px`)
  }

  function mouseDragHandler (moveEvent: MouseEvent) {
    moveEvent.preventDefault()

    if (moveEvent.buttons !== 1) {
      clearListeners?.abort()
      return
    }

    callback()
    setPaneHeight(moveEvent.pageY)
  }

  function startDragging (event: MouseEvent) {
    event.preventDefault()

    clearListeners = new AbortController()

    document.addEventListener('mousemove', mouseDragHandler, { signal: clearListeners.signal })
    document.addEventListener('blur', () => {
      clearListeners?.abort()
    }, { once: true, signal: clearListeners.signal })
  }

  resizeHandle.addEventListener('mousedown', startDragging)
}
