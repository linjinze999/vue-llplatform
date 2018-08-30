<template>
  <div class="error-box" id="error-box">
    <div style="position: absolute; z-index: 9999; top: 20%; left: 48%;">
      <el-button type="success">返回首页</el-button>
    </div>
    <canvas id="background" style="z-index: 0; position: absolute; top:0px; left: 0px"></canvas>
    <canvas id="world" style="z-index: 2; position: absolute; top:0px; left: 0px"></canvas>
    <div>
      <div class="cloud x1"></div>
      <!-- Time for multiple clouds to dance around -->
      <div class="cloud x2"></div>
      <div class="cloud x3"></div>
      <div class="cloud x4"></div>
      <div class="cloud x5"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppError404',
  mounted: () => {
    /* eslint-disable */
    (function () {
      var lastTime = 0
      var vendors = ['ms', 'moz', 'webkit', 'o']
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
          || window[vendors[x] + 'CancelRequestAnimationFrame']
      }

      if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
          var currTime = new Date().getTime()
          var timeToCall = Math.max(0, 16 - (currTime - lastTime))
          var id = window.setTimeout(function () {
              callback(currTime + timeToCall)
            },
            timeToCall)
          lastTime = currTime + timeToCall
          return id
        }

      if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
          clearTimeout(id)
        }
    }())

    function Wave () {
      var CANVARS = document.getElementById('error-box')
      console.log(CANVARS)
      var WIDTH = window.innerWidth
      var HEIGHT = window.innerHeight
      var WAVE_DETAIL = Math.round(WIDTH / 40)
      var DENSITY = 0.95
      var AIR_DENSITY = 1.02
      var WATER_DENSITY = 1.08
      var FRICTION = 0.9
      var AREA_OF_EFFECT = 100
      var MOUSE_PULL_SPEED = 0.162
      var IMPULSE_INTERVAL = 2000
      var NUM_BUBBLES = 40
      var DIVING_FORCE = 40
      var DISSOLVED_BUBBLE_SIZE = 20
      var CHAR_DISTANCE = 120

      var waves, bubbles, textArray, characters, images //Arrays
      var canvas, context, img, idleTime = 0
      var letters = ['4', '0', '4']
      var setTimeUpdate = null
      var impulseTimeUpdate = null
      var bubblesUpdate = null
      var shortestDist = 1000
      var index = 0
      var isMouseDown = false
      var mouseCoordinate

      var mousePos = {x: 0, y: 0}
      var mouseSpeed = {x: 0, y: 0}
      var oldMousePos = {x: 0, y: 0}

      this.Init = function (canvasID) {
        canvas = document.getElementById(canvasID)
        canvas.setAttribute('width', window.innerWidth)
        canvas.setAttribute('height', window.innerHeight)
        context = canvas.getContext('2d')

        var world = document.getElementById('background')
        world.width = window.innerWidth
        world.height = window.innerHeight
        var ctx = world.getContext('2d')
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, '#c9dbe9')
        gradient.addColorStop(1, '#fff')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        waves = []
        bubbles = []
        textArray = []
        characters = []
        images = new Array(letters.length)

        for (var i = 0; i < letters.length; i++) {
          var textPosition = WIDTH / 2 - (letters.length * CHAR_DISTANCE) / 2
          var txt = new Text(letters[i], textPosition + (i * CHAR_DISTANCE), HEIGHT / 2,
            (Math.random() * 3) + 5, (-Math.random() * 10) + 5)
          images[i] = new Image()
          images[i].src = characters[i]
          textArray.push(txt)
        }

        for (i = 0; i < WAVE_DETAIL; i++) {
          waves.push({
            x: WIDTH / (WAVE_DETAIL - 4) * (i - 2),
            y: HEIGHT * .2,
            original: {x: 0, y: HEIGHT * .5},
            velocity: {x: 0, y: Math.round(Math.random() * 3) + 5},
            force: {x: 0, y: 0},
            mass: 10
          })
        }

        this.draw()
        this.ResizeCanvas()
        bubblesUpdate = window.setInterval(this.CreateBubbles, 800)
        impulseTimeUpdate = window.setInterval(this.InjectImpulse, IMPULSE_INTERVAL)

        CANVARS.addEventListener('mousemove', MouseMove)

        CANVARS.addEventListener('mousedown', function (e) {
          var pos = {x: 0, y: 0}
          isMouseDown = true
          var mouseCoordinate = getMousePosition(e)
          for (var i = 0; i < bubbles.length; i++) {
            var bubble = bubbles[i]
            if (( mouseCoordinate.x > bubble.x &&
                mouseCoordinate.x < bubble.x + bubble.size) &&
              ( mouseCoordinate.y > bubble.y &&
                mouseCoordinate.y < bubble.y + bubble.size)) {
              index = bubbles.indexOf(bubble, 0)
              pos.x = mouseCoordinate.x
              pos.y = mouseCoordinate.y
              break
            }
          }

          if (isMouseDown &&
            pos.x < bubbles[index].x + bubbles[index].size &&
            pos.x > bubbles[index].x &&
            pos.y < bubbles[index].y + bubbles[index].size &&
            pos.y > bubbles[index].y)
            DissolveBubble(index)
        })

        CANVARS.addEventListener('mouseup', function (e) {
          isMouseDown = false
        })

      }

      this.draw = function () {
        var self = this
        this.UpdateCanvas()
        setTimeUpdate = window.requestAnimationFrame(function () {
          self.draw()
        })
      }

      this.UpdateCanvas = function (e) {
        var linearGradient = context.createLinearGradient(0, HEIGHT * .3, 0, HEIGHT)
        linearGradient.addColorStop(0, '#4BB8F0')
        linearGradient.addColorStop(1, 'rgba(38,85,139,0.5)')

        context.clearRect(0, 0, WIDTH, HEIGHT)
        context.fillStyle = linearGradient
        context.beginPath()
        context.moveTo(waves[0].x, waves[0].y)

        var i = 0
        var length = waves.length
        var previous, current, next
        for (; i < length; i++) {

          previous = waves[i - 1]
          current = waves[i]
          next = waves[i + 1]

          if (previous != null && next != null) {
            var force = 0
            force -= DENSITY * (previous.y - current.y)
            force += DENSITY * (current.y - next.y)
            force += DENSITY / 15 * (current.y - current.original.y)

            current.velocity.y -= (force / previous.mass) + current.force.y
            current.force.y *= FRICTION
            current.velocity.y *= FRICTION
            current.y += current.velocity.y

            var distanceFromMouse = GetDistanceBetween(current, mousePos)
            if (distanceFromMouse < AREA_OF_EFFECT) {
              var dist = GetDistanceBetween({x: current.original.x, y: current.original.y}, mousePos)
              mouseSpeed.x *= 0.95
              mouseSpeed.y *= 0.95

              current.force.y += (MOUSE_PULL_SPEED * (1 - (dist / AREA_OF_EFFECT)) * mouseSpeed.y) * .4
            }
            context.quadraticCurveTo(previous.x, previous.y, previous.x + (current.x - previous.x) / 2, previous.y + (current.y - previous.y) / 2)
          }
        }

        context.lineTo(waves[waves.length - 1].x, waves[waves.length - 1].y)
        context.lineTo(WIDTH, HEIGHT)
        context.lineTo(0, HEIGHT)
        context.lineTo(waves[0].x, waves[0].y)

        context.fill()
        idleTime++
        for (i = 0; i < bubbles.length; i++) {
          var bubble = bubbles[i]
          var wave = FindClosestWave(bubble)
          var dist = GetDistanceBetween(wave, mousePos)
          bubble.velocity.y /= (bubble.y > wave.y) ? WATER_DENSITY : AIR_DENSITY
          bubble.velocity.y -= (bubble.y > wave.y) ? (1 / bubble.mass) : (-(wave.y - bubble.y) * 0.01) / bubble.mass
          bubble.y += bubble.velocity.y

          bubble.velocity.x /= Math.min(1.95, Math.max(1.98, Math.random()))
          bubble.velocity.x += (bubble.velocity.x < 0) ?
            Math.max(bubble.velocity.x, -0.8 / bubble.mass) :
            Math.min(bubble.velocity.x, 0.8 / bubble.mass)
          bubble.x += bubble.velocity.x
          bubble.draw()

          if (bubble.x + bubble.size > WIDTH) {
            bubble.velocity.x *= -.82
          }
          if (bubble.x - bubble.size < 0) {
            bubble.velocity.x *= -.82
          }

          if (dist < AREA_OF_EFFECT)
            bubble.velocity.x += (mousePos.y < oldMousePos.y) ?
              MOUSE_PULL_SPEED * ( (AREA_OF_EFFECT - dist) / AREA_OF_EFFECT ) * 1 / bubble.mass * mouseSpeed.x :
              MOUSE_PULL_SPEED * ( (AREA_OF_EFFECT - dist) / AREA_OF_EFFECT ) * 1 / bubble.mass * -mouseSpeed.x

          if (bubble.dissolved) {

            var j = 0
            while (bubble.children.length < bubble.dissolvedBubbleSize) {
              var smallBubble = new Bubble(bubble.x, bubble.y, Math.random() * bubble.dissolvedBubbleSize,
                {x: (Math.random() * 20) - 10, y: -Math.random() * 10},
                (Math.random() * bubble.dissolveSize) + bubble.dissolveSize * .5)
              bubble.children.push(smallBubble)
            }

            var smallBubblesLength = bubble.children.length
            for (; j < smallBubblesLength; j++) {
              var smallBubble = bubble.children[j]
              bubble.size = smallBubble.size
              smallBubble.x += smallBubble.velocity.x
              smallBubble.y += smallBubble.velocity.y

              smallBubble.velocity.x /= 1.02
              smallBubble.velocity.y += 0.35
              smallBubble.size /= 1.1

              context.moveTo(bubble.x + smallBubble.x, bubble.y + bubble.y)
              smallBubble.draw()
            }
          }
        }

        (function (window) {
          var force, angle, r = 0, i = 0
          var length = textArray.length

          for (i = 0; i < length; i++) {
            context.save()
            var letter = textArray[i]
            var closestWave = FindClosestWave(letter)
            letter.vy /= (letter.py > closestWave.y) ? WATER_DENSITY : AIR_DENSITY

            var dx = mousePos.x - letter.sx
            var dy = mousePos.y - letter.sy
            var distSQ = Math.sqrt(dx * dx + dy * dy)
            if (distSQ < 150) {
              dx = mousePos.x - letter.px
              dy = mousePos.y - letter.py

              force = 1 - distSQ / 250
              angle = Math.atan2(dy, dx)
              letter.vx += Math.cos(angle) * force
              letter.vy += Math.sin(angle) * force
            } else {
              letter.vx += (letter.sx - letter.px) * 0.01
              letter.vy += (letter.sy - letter.py) * 0.01
            }
            letter.px += letter.vx
            letter.py += letter.vy
            letter.vx *= 0.975
            letter.vy *= 0.975

            context.translate(letter.px, letter.py)
            var dwx = letter.px - closestWave.x
            var dwy = letter.py - closestWave.y
            var dsq = Math.sqrt(dwx * dwx + dwy * dwy)
            var a = Math.atan2(dwy, dwx)
            if (dsq < 100) {
              if (letter.vx < 0 && letter.vy < 0) {
                context.translate(letter.px + 50, letter.py + 50)
                context.rotate((Math.sin(a) * 0.65 * dsq) * Math.PI / 180)
                context.translate(letter.px - 50, letter.py - 50)
              } else {
                context.translate(letter.px + 50, letter.py + 50)
                context.rotate((-Math.sin(a) * 0.65 * dsq) * Math.PI / 180)
                context.translate(letter.px - 50, letter.py - 50)
              }
            }
            context.rotate((Math.sin(a) * 0.65 * dsq) * Math.PI / 180)

            context.drawImage(images[i], 0, 0)
            context.restore()
          }
        })(window)
      }

      this.InjectImpulse = function (e) {
        if ((idleTime > 7) || (mouseSpeed.x < 4 || mouseSpeed.y < 4)) {
          CANVARS.removeEventListener('mousemove', this)
          var force = 2
          var random = Math.random()
          RandomWave(WIDTH * random, random * ((force / 4) + force))
        }
      }

      this.CreateBubbles = function () {
        if (bubbles.length > NUM_BUBBLES) {
          var i = 0
          if (bubbles[i].dissolved) {
            for (; i < bubbles.length; i++) {
              if (bubbles[i].dissolved == false) {
                bubbles[i].size = DISSOLVED_BUBBLE_SIZE
                DissolveBubble(i)
                break
              }
            }
          } else {
            DissolveBubble(i)
          }
        }

        var minSize = 20
        var maxSize = 36
        var size = minSize + Math.random() * (maxSize - minSize) / 2
        var bubble = new Bubble(maxSize + (Math.random() * (WIDTH - maxSize)),
          HEIGHT - maxSize,
          size, {x: (Math.random() * DIVING_FORCE) - DIVING_FORCE / 2, y: 0},
          (size / maxSize) + 1)
        bubbles.push(bubble)
      }

      this.ResizeCanvas = function (e) {
        var WIDTH = window.innerWidth
        var HEIGHT = window.innerHeight

        canvas.width = WIDTH
        canvas.height = HEIGHT

        for (var i = 0; i < WAVE_DETAIL; i++) {
          waves[i].x = WIDTH / (WAVE_DETAIL - 4) * (i - 2),
            waves[i].y = HEIGHT * .5

          waves[i].original.x = waves[i].x
          waves[i].original.y = waves[i].y
        }
      }

      function Text (character, px, py, vx, vy) {
        var pos = 0
        if ((character == null || character == undefined) &&
          typeof character !== 'string') {
          character.concat(textArray)
        }

        this.character = character
        this.px = px
        this.py = py
        this.vx = vx
        this.vy = vy
        this.sx = this.px
        this.sy = this.py

        if (letters.contains(character)) {
          pos = letters.indexOf(character)
          var data = 'data:image/svg+xml,' +
            '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\'>' +
            '<foreignObject width=\'100%\' height=\'100%\'>' +
            '<div xmlns=\'http://www.w3.org/1999/xhtml\' style=\'font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 180px; font-weight:bold\'>' +
            '<span style=\'color:rgb(32,124,202); opacity: 0.8; -webkit-text-stroke-color: white; -webkit-text-stroke-width: 2px\'>' + letters[pos] + '</span>' +
            '</div>' +
            '</foreignObject>' +
            '</svg>'
          characters.push(data)
        }
      }

      Array.prototype.contains = function (elt) {
        var i = this.length
        while (i--) {
          if (this[i] === elt)
            return true
        }
        return false
      }

      function Bubble (x, y, size, velocity, mass) {
        this.x = x
        this.y = y
        this.size = size
        this.mass = mass
        this.velocity = velocity
        this.dissolved = false
        this.dissolvedBubbleSize = DISSOLVED_BUBBLE_SIZE
        this.children = []

        this.draw = function () {
          context.fillStyle = '#rgba(38,85,139,1)'
          context.beginPath()
          context.arc(this.x, this.y, this.size, 0, Math.PI * 2, true)
          context.closePath()
          context.fill()
        }
      }

      function FindClosestWave (point) {
        var closestWave = 200
        var index = 0

        var length = waves.length
        for (var i = 0; i < length; i++) {
          var dist = GetDistanceBetween(point, waves[i])
          if (closestWave > dist) {
            closestWave = dist
            index = i
          }
        }
        return waves[index]
      }

      function DissolveBubble (index) {
        var i = 0
        var bubble = bubbles[index]
        if (bubble.dissolved == false) {
          bubble.dissolved = true

          setTimeout(function () {
            for (; i < bubbles.length; i++) {
              if (bubble == bubbles[i]) {
                bubbles.splice(i, 1)
                break
              }
            }
          }, 1000)
        }
      }

      function MouseMove (e) {
        idleTime = 0

        mouseSpeed.x = Math.max(Math.min(mousePos.x - e.clientX, 40), -40)
        mouseSpeed.y = Math.max(Math.min(mousePos.y - e.clientY, 40), -40)

        mousePos.x = e.clientX
        mousePos.y = e.clientY
        oldMousePos.x = mousePos.x
        oldMousePos.y = mousePos.y
      }

      function RandomWave (position, force) {
        //var wave = waves.shuffle();
        var wave = waves[Math.floor(position / WIDTH * (Math.random() * waves.length))]

        if (wave) {
          wave.force.y += force
          wave.force.y *= FRICTION
        }
      }

      function GetDistanceBetween (p1, p2) {
        var posX = p2.x - p1.x
        var posY = p2.y - p1.y
        return Math.sqrt(posX * posX + posY * posY)
      }

      Array.prototype.shuffle = function () {
        var i = this.length
        var j, temp
        while (--i) {
          j = Math.random() * (i + 1)
          temp = this[j]
          this[j] = this[i - 1]
          this[i - 1] = temp
        }
      }

      function getMousePosition (e) {
        var x, y

        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop

        this.__defineGetter__('xpos', function () {
          return x
        })
        this.__defineGetter__('ypos', function () {
          return y
        })
        return {
          x: this.xpos,
          y: this.ypos
        }
      }

      HTMLCanvasElement.prototype.getMousePosition = getMousePosition

    }

    var wave = new Wave()
    wave.Init('world')

    window.onresize = function () {
      wave.ResizeCanvas()
    }
  }
}
</script>

<style scoped>
.error-box {
  background-color: #ffffff;
  overflow: hidden;
}

/* Source for the clouds
http://thecodeplayer.com/walkthrough/pure-css3-animated-clouds-background */
.cloud {
  width: 200px;
  height: 60px;
  background: #fff;

  border-radius: 200px;
  -moz-border-radius: 200px;
  -webkit-border-radius: 200px;

  position: relative;
}

.cloud:before, .cloud:after {
  content: '';
  position: absolute;
  background: #fff;
  width: 100px;
  height: 80px;
  position: absolute;
  top: -15px;
  left: 10px;

  border-radius: 100px;
  -moz-border-radius: 100px;
  -webkit-border-radius: 100px;

  -webkit-transform: rotate(30deg);
  transform: rotate(30deg);
  -moz-transform: rotate(30deg);
}

.cloud:after {
  width: 120px;
  height: 120px;
  top: -55px;
  left: auto;
  right: 15px;
}

/*Time to animate*/
.x1 {
  -webkit-animation: moveclouds 40s linear infinite;
  -moz-animation: moveclouds 40s linear infinite;
  -o-animation: moveclouds 40s linear infinite;
}

/*variable speed, opacity, and position of clouds for realistic effect*/
.x2 {
  left: 200px;

  -webkit-transform: scale(0.6);
  -moz-transform: scale(0.6);
  transform: scale(0.6);
  opacity: 0.6; /*opacity proportional to the size*/

  /*Speed will also be proportional to the size and opacity*/
  /*More the speed. Less the time in 's' = seconds*/
  -webkit-animation: moveclouds 120s linear infinite;
  -moz-animation: moveclouds 120s linear infinite;
  -o-animation: moveclouds 120s linear infinite;
}

.x3 {
  left: -250px;
  top: -200px;

  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  transform: scale(0.8);
  opacity: 0.8; /*opacity proportional to the size*/

  -webkit-animation: moveclouds 60s linear infinite;
  -moz-animation: moveclouds 60s linear infinite;
  -o-animation: moveclouds 60s linear infinite;
}

.x4 {
  left: 470px;
  top: -250px;

  -webkit-transform: scale(0.75);
  -moz-transform: scale(0.75);
  transform: scale(0.75);
  opacity: 0.75; /*opacity proportional to the size*/

  -webkit-animation: moveclouds 80s linear infinite;
  -moz-animation: moveclouds 80s linear infinite;
  -o-animation: moveclouds 80s linear infinite;
}

.x5 {
  left: -150px;
  top: -150px;

  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  transform: scale(0.8);
  opacity: 0.8; /*opacity proportional to the size*/

  -webkit-animation: moveclouds 100s linear infinite;
  -moz-animation: moveclouds 100s linear infinite;
  -o-animation: moveclouds 100s linear infinite;
}

@-webkit-keyframes moveclouds {
  0% {
    margin-left: 1000px;
  }
  100% {
    margin-left: -1000px;
  }
}

@-moz-keyframes moveclouds {
  0% {
    margin-left: 1000px;
  }
  100% {
    margin-left: -1000px;
  }
}

@-o-keyframes moveclouds {
  0% {
    margin-left: 1000px;
  }
  100% {
    margin-left: -1000px;
  }
}
</style>
