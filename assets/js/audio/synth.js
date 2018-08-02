import Tone from 'tone'
import presets from './presets'

export default {
  // --- Private vars
  _context: null,
  _synth: null,
  _output: null,
  _preset: null,
  _chord: null,
  // --- Public methods
  init (context, preset = 0) {
    this._context = context
    this._preset = presets[preset].synth

    this._output = this._context.createGain()
    this._output.gain.value = 0.5

    this._synth = new Tone.PolySynth(8, Tone.Synth)
    this._synth.set(this._preset.params)
    this._synth.connect(this._output)
  },
  connect (node) { 
    this._output.connect(node) 
  },
  updatePreset (preset) {
    this._preset = presets[preset].synth
    this._synth.set(this._preset.params)
  },
  updateNote (chord) {
    if (this._chord !== this._preset.notes[chord]) {
      this._synth.triggerRelease(this._chord)
      this._chord = this._preset.notes[chord]
      this._synth.triggerAttack(this._chord)
    }
  }
}