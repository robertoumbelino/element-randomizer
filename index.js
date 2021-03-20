/**
 * Pipe function.
 * Amazing.
 */
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

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
 * Setup.
 */
const setup = () => ({})

/**
 * Play song.
 */
const playSong = data => {
  const song = document.getElementById('song')
  if (song.paused) song.play()
  return data
}

/**
 * Play sound to new element.
 */
const playNewElementSoundEffect = data => {
  const newElementSound = new Audio('./sounds/new.mp3')
  newElementSound.play()
  return data
}

/**
 * Increase counter quantity.
 */
const increaseCounter = data => {
  counter.innerHTML = +counter.innerHTML + 1
  return data
}

/**
 * Set is poop.
 */
const setIsPoop = data => {
  const isPoop = +counter.innerHTML % 5 === 0
  return { ...data, isPoop }
}

/**
 * Randomize a size from element.
 */
const generateSize = data => {
  const size = randomizeNumber(50, 20)
  return { ...data, size }
}

/**
 * Create a element.
 */
const createElement = data => {
  /**
   * Extract values.
   */
  const { size, isPoop } = data

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

  /**
   * Create an element.
   */
  const element = document.createElement('div')

  if (isPoop) {
    element.innerHTML = '<i class="fas fa-poo"></i>'
    element.className = ''
    element.style.color = '#654321'
    element.style.position = 'absolute'
    element.style.fontSize = sizeInPx

    /**
     * Defining a random position to start.
     */
    element.style.top = formatToPx(randomizeNumber(bodyRect.height))
    element.style.left = formatToPx(randomizeNumber(bodyRect.width))

    return { ...data, element }
  }

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

  return { ...data, element }
}

/**
 * Append element in screen.
 */
const appendElement = data => {
  /**
   * Extract values.
   */
  const { element } = data

  elementsContainer.appendChild(element)
  return data
}

/**
 * Moviment axis in screen from element.
 */
const setRandomAxis = data => {
  const randomX = randomizeNumber(2, 1) === 2 ? MOVIMENT.RIGHT : MOVIMENT.LEFT
  const randomY = randomizeNumber(2, 1) === 2 ? MOVIMENT.DOWN : MOVIMENT.UP
  const axis = { x: randomX, y: randomY }

  return { ...data, axis }
}

/**
 * Randomize a speed from element.
 */
const setSpeed = data => {
  const speed = randomizeNumber(2)
  return { ...data, speed }
}

/**
 * Looping element.
 */
const generateElementLooping = data => {
  /**
   * Extract values.
   */
  const { axis, element, speed, isPoop, size } = data

  const interval = setInterval(() => {
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
     * Collision.
     */
    const isCollidedTop = rect.top <= 0
    const isCollidedLeft = rect.left <= 0
    const isCollidedBottom = rect.top >= bodyRect.height - size
    const isCollidedRigth = rect.left >= bodyRect.width - size

    /**
     * Is stop interval.
     */
    const isStopInterval =
      isPoop &&
      (isCollidedTop || isCollidedLeft || isCollidedBottom || isCollidedRigth)

    /**
     * Stop interval becase the poop collided in the wall
     */
    if (isStopInterval) return clearInterval(interval)

    /**
     * Validation to change axis.
     */
    if (isCollidedTop) axis.y = MOVIMENT.DOWN
    if (isCollidedLeft) axis.x = MOVIMENT.RIGHT
    if (isCollidedBottom) axis.y = MOVIMENT.UP
    if (isCollidedRigth) axis.x = MOVIMENT.LEFT
  }, 1)

  return data
}

/**
 * Cycle element.
 */
const runElement = pipe(
  setup,
  playSong,
  playNewElementSoundEffect,
  increaseCounter,
  setIsPoop,
  generateSize,
  createElement,
  appendElement,
  setRandomAxis,
  setSpeed,
  generateElementLooping
)

/**
 * Click event from button.
 * Used to generate a element.
 */
document
  .getElementById('generate-element-button')
  .addEventListener('click', runElement)

document.body.addEventListener('keyup', ({ key }) => {
  if (key === 'Enter') runElement()
})

/**
 * Update body dimensions.
 */
window.addEventListener(
  'resize',
  () => (bodyRect = document.body.getBoundingClientRect())
)
