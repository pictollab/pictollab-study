<template>
  <v-layout id="picto-app" v-touch="{ left: () => swipe('L'), right: () => swipe('R') }">
    <v-dialog v-model="preview" max-width="750px">
      <picto-app-preview 
        ref="preview"
        v-on:close="preview = false"
      />
    </v-dialog>

    <div :class="$store.getters.filter">
      <video ref="camera" autoplay muted/>
    </div>

    <picto-app-controls
      :muted="muted"
      v-on:capture="capture"
      v-on:mute="muted = !muted"
    />
  </v-layout>
</template>

<script>
import PictoAppControls from '~/components/PictoApp/Controls'
import PictoAppPreview from '~/components/PictoApp/Preview'

import AudioEngine from '~/assets/js/audio/base'

import analyseImage from '~/assets/js/image/analyse'

export default {
  // Do not forget this little guy
  name: '',
  // share common functionality with component mixins
  mixins: [],
  // compose new components
  extends: {},
  // component properties/variables
  props: {},
  // variables
  data () {
    return {
      constraints: {
        audio: false,
        video: {
          facingMode: 'environment'
        }
      },
      muted: false,
      preview: false,
      stream: null,
      timeoutID: 0
    }
  },
  computed: {},
  // when component uses other components
  components: {
    PictoAppControls,
    PictoAppPreview
  },
  // methods
  watch: {
    muted () {
      this.muted 
        ? this.$store.dispatch('audio/blur')
        : this.$store.dispatch('audio/focus')
    },
    preview () {
      if (this.preview) {
        this.$refs.camera.pause()
      } else {
        this.$refs.camera.play()
      }
    }
  },
  methods: {
    analyse () {
      const rgb = analyseImage(document.querySelector('video'))

      this.$store.dispatch('audio/rgb', rgb)
      this.timeoutID = setTimeout(() => this.analyse(), 1000)
    },
    capture () {
      this.preview = true
      this.$store.dispatch('log/event', { type: 'capture' })
      this.$refs.preview.draw(this.$refs.camera)
    },
    swipe (direction) {
      switch (direction) {
        case 'L':
          this.$store.commit('FILTER_NEXT')
          this.$store.dispatch('audio/nextPreset')
          this.$store.dispatch('log/event', { type: 'preset', class: this.$store.getters.filter })
          break
        case 'R':
          this.$store.commit('FILTER_PREV')
          this.$store.dispatch('audio/prevPreset')
          this.$store.dispatch('log/event', { type: 'preset', class: this.$store.getters.filter })
          break
      }
    }
  },
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {
    this.muted = false

    this.$store.commit('FILTER_RESET')

    if (process.browser) {
      navigator.mediaDevices.getUserMedia(this.constraints)
        .then(stream => {
          this.stream = stream
          this.$refs.camera.srcObject = this.stream
          this.timeoutID = setTimeout(() => this.analyse(), 1000)

          if (!this.$store.getters.audio.isActive()) {
            this.$store.dispatch('audio/init')
            this.$store.dispatch('audio/focus')
          } else {
            this.$store.dispatch('audio/resetPreset')
            this.$store.dispatch('audio/focus')
          }
        })
        .catch(error => console.log(error))
    }
  },
  beforeDestroy () {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID)
    }
    if (this.stream) {
      this.stream
        .getTracks()
        .forEach(track => track.stop())
    }
    if (this.$store.getters.audio.isActive()) {
      this.$store.dispatch('audio/blur')
    }
  }
}
</script>

<style>
#picto-app {
  height: 100vh;
  overflow: hidden;
}

#picto-app video {
  height: 100vh;
  object-fit: cover;
  width: 100vw;
}
</style>