<template>
    <div v-if="error === null">
       <p v-if = "stream === null">
         Please allow acces to your camera when prompted
       </p>
         <video class="video" v-bind:src="stream" ref="video" autoplay></video>
         <canvas class="canvas" ref="canvas" ></canvas>

         <pre class="ascii" ref="ascii" id="ascii">

         </pre>
         <button type="button" name="button" onclick="copy.js">save</button>
         <br>
         <textarea class="ascii" name="name" rows="150" cols="150" id="copy"></textarea>

    </div>
    <div v-else>
      {{ error }}
    </div>
</template>

<script>
import ascii from '../modules/ascii'
import asciiSave from '../modules/copy'
export default {
  data () {
    return {
      //where out errors will be held
      error: null,
      //where our stream will be held
      stream: null,
      //for html canvas
      context: null,
      //ascii options
      ascii: {
        contrast: 30,
        fps: 30
      }
    }
  },
  methods: {
    //access webcam
    initVideo () {
      navigator.getUserMedia({
        //we want video but not audio
        video: true,
        audio: false
      }, (stream) => {
        //get the webcam stream
        this.stream = window.URL.createObjectURL(stream)

        this.bootCanvas().then(() => {
          this.startAsciiRendering()
        })
        //throw error if failed
      }, this.setError)
    },
    startAsciiRendering () {
      setInterval(() => {
        this.context.drawImage(
          this.$refs.video,
           0,
           0,
           this.$refs.canvas.width,
           this.$refs.canvas.height
         )

         //draw ascii
         this.drawAscii()

      }, Math.round(1000 / this.ascii.fps))
    },
    drawAscii () {
      this.$refs.ascii.innerHTML = ascii.fromCanvas(this.$refs.canvas, {
        contrast: this.ascii.contrast
      })
    },
    bootCanvas () {
      return new Promise((resolve, reject) => {

        // console.log(this.$refs)
        this.context = this.$refs.canvas.getContext('2d')
        // console.log(this.context)
        //video dimensions
        this.$refs.canvas.width = 200
        this.$refs.canvas.height = 150
        resolve()
      })


    },
    //errors
    setUnsupported () {
      this.error = 'Your browser does not support video :(';
    },
    setError () {
      this.error = 'Something went wrong, try refreshing the page';
    }
  },
  //mounted = when page loads
  mounted () {
    //check if able to get webcam
    if (navigator.getUserMedia) {
      this.initVideo()
    } else  {
      this.setUnsupported()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  html, body
    width: 100%
    height: 100%
    margin: 0
    padding: 0

  .video
    width: 200px
    position: fixed
    top: 0
    left: 0
    z-index: 1

  .canvas
    display: none

  .ascii
    font-family: 'Courier New', 'Courier', monospace
    font-size: 10px
    line-height: 9px
    letter-spacing: -1.5px
    text-align: left
    margin: 0
</style>
