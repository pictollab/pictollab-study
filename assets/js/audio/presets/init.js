export default {
  synth: {
    notes: [
      [ 'C4', 'E4', 'G4', 'C5' ],
      [ 'C4', 'E4', 'G4', 'B5' ],
      [ 'C4', 'E4', 'F4', 'C5' ]
    ],
    params: {
      "portamento" : 0.0,
      "oscillator": {
          "type": "sine"
      },
      "envelope": {
          "attack": 2,
          "decay": 1,
          "sustain": 1,
          "release": 2
      }
    }
  },
  effects: [
  //   { type: 'PitchShift',  params: { 
  //     wet: 0, 
  //     pitch: 2, 
  //     windowSize: 0.04, 
  //     delayTime: 0.03, 
  //     feedback: 0.5 
  // }},
  { type: 'Vibrato', params: {
      wet: 0, 
      frequency: 2.3, 
      depth: 0.4, 
      type: 'triangle'
  }},
  { type: 'Chorus', params: { 
      wet: 0,
      delayTime: 3.5,
      depth: 0.7, 
      spread: 180,
      type: 'sine' 
  }},
  // { type: 'FeedbackDelay', params: {
  //     wet: 0,
  //     delayTime: '8n', 
  //     feedback: 0.4
  // }},
  { type: 'JCReverb', params: {
      wet: 0.5,
      roomSize: 0.95,
      dampening: 1200
  }}
  ]
}