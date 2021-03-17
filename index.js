/**
 * Defining elements.
 */
const song = document.getElementById('song')
let bodyRect = document.body.getBoundingClientRect()
const counter = document.getElementById('counter')
const elementsContainer = document.getElementById('elements-container')

/**
 * Format to randomize.
 */
const elementFormats = ['square', 'circle', 'triangle']

/**
 * Moviments.
 */
const MOVIMENT = { UP: -1, DOWN: 1, LEFT: -1, RIGHT: 1 }

/**
 * Format value to px.
 */
const formatToPx = value => `${value}px`

/**
 * Generic function to randomize a value between maximum and minimum defined.
 */
const randomizeNumber = (max, min = 1) => Math.floor(Math.random() * max + min)

/**
 * Generic function to randomize an item from list.
 */
const randomizeList = list => list[randomizeNumber(list.length, 0)]

/**
 * Generate a random hexadecimal color.
 */
const generateRandomHexadecimalColor = () => {
  const n = (Math.random() * 0xfffff * 1000000).toString(16)
  return '#' + n.slice(0, 6)
}

/**
 * Generate an element.
 */
const generateElement = () => {
  /**
   * Play song.
   */
  if (song.paused) song.play()

  /**
   * Play sound to new element.
   */
  const newElementSound = new Audio('./sounds/new.mp3')
  newElementSound.play()

  /**
   * Increase counter.
   */
  counter.innerHTML = +counter.innerHTML + 1

  /**
   * Create an element.
   */
  const element = document.createElement('div')

  /**
   * Randomize a size from element.
   */
  const size = randomizeNumber(50, 20)

  /**
   * Get a random color.
   */
  const randomHexadecimalColor = generateRandomHexadecimalColor()

  /**
   * Get a random element format.
   */
  const randomElementFormat = randomizeList(elementFormats)

  /**
   * Defining styles from element.
   */
  const sizeInPx = formatToPx(size)
  element.className = randomElementFormat
  element.style.width = sizeInPx
  element.style.height = sizeInPx
  element.style.position = 'absolute'
  element.style.backgroundColor = randomHexadecimalColor

  const isTriangle = randomElementFormat === elementFormats[2]
  if (isTriangle) {
    element.style.borderLeftWidth = formatToPx(size / 2)
    element.style.borderRightWidth = formatToPx(size / 2)
    element.style.borderBottomWidth = formatToPx(size)
    element.style.borderBottomColor = randomHexadecimalColor
  }

  /**
   * Defining a random position to start.
   */
  element.style.top = formatToPx(randomizeNumber(bodyRect.height))
  element.style.left = formatToPx(randomizeNumber(bodyRect.width))

  /**
   * Append element in screen.
   */
  elementsContainer.appendChild(element)

  /**
   * Moviment axis in screen from element.
   */
  const axis = { x: MOVIMENT.RIGHT, y: MOVIMENT.DOWN }

  /**
   * Randomize a speed from element.
   */
  const speed = randomizeNumber(2)

  setInterval(() => {
    /**
     * Extract values.
     */
    const { x, y } = axis

    /**
     * Get position from element.
     */
    const rect = element.getBoundingClientRect()

    /**
     * New position from element.
     */
    const newTop = rect.top + y * speed
    const newLeft = rect.left + x * speed

    /**
     * Set new position from element.
     */
    element.style.top = `${newTop}px`
    element.style.left = `${newLeft}px`

    /**
     * Validation to change axis.
     */
    if (rect.top <= 0) axis.y = MOVIMENT.DOWN
    if (rect.left <= 0) axis.x = MOVIMENT.RIGHT
    if (rect.top >= bodyRect.height - size) axis.y = MOVIMENT.UP
    if (rect.left >= bodyRect.width - size) axis.x = MOVIMENT.LEFT
  }, 1)
}

/**
 * Click event from button.
 * Used to generate a element.
 */
document
  .getElementById('generate-element-button')
  .addEventListener('click', generateElement)

document.body.addEventListener('keyup', ({ key }) => {
  if (key === 'Enter') generateElement()
})

/**
 * Update body dimensions.
 */
window.addEventListener(
  'resize',
  () => (bodyRect = document.body.getBoundingClientRect())
)
