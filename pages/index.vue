<template>
  <v-container fill-height>
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <h2>About this study</h2>
          </v-card-title>
          <v-card-text>
            <p>In this study you will be asked to test a mobile web application that turns images in to sound – a process called image sonification. We are interested in the creative potential image sonification has to allow anyone to create interesting sounds and music. By participating in this study you will be helping us develop our sound producing algorithm to enhance creativity and be easier to use.</p>
            <p>After a brief period of familiarising yourself with the application, you will be given some simple tasks to complete that involve interacting with the app in order to give us an indication of how easy or difficult the it is to use. This will be followed by some short informal interview questions to gather your thoughts and understanding of the application. For completeness, you will be given some extra information on how the application works and then asked to complete the tasks again.</p>
            <p>How long you take to complete each task will be recorded as well as any observations or comments you might make during each task. The informal interview will be audio recorded and later transcribed.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn nuxt @click.native="accept">I Understand</v-btn>
          </v-card-actions>
        </v-card> 
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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

    }
  },
  computed: {},
  // when component uses other components
  components: {},
  // methods
  watch: {},
  methods: {
    accept () {
      this.$store.dispatch('log/event', { type: 'connect' })
      this.$router.push('/app')
    }
  },
  // component Lifecycle hooks
  beforeCreate () {},
  mounted () {}
}
</script>

<style>
  
</style>