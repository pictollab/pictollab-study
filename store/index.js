// import CircularBuffer from '~/assets/js/utils/CircularBuffer'
import axios from 'axios'
import shortid from 'shortid'
import AudioEngine from '~/assets/js/audio/base'

export const state = () => ({
  endpoint: 'pictollab-log',  
  feed: [],
  filter: {
    active: 0,
    list: [ '', '_1977', 'gingham', 'moon', 'nashville', 'valencia' ]
  },
  log: {
    stats: {
      connectionTime: Date.now(),
      pageVisits: {
        '/': 0,
        '/app': 0,
        '/feed': 0,
        '/art': 0,
        '/data': 0
      },
      interactions: {
        photo: {
          captured: 0,
          uploaded: 0
        },
        filter: {
          none: 1,
          _1994: 0,
          gingam: 0,
          moon: 0,
          nashville: 0,
          valencia: 0,
          total: 1
        }
      }
    },
    timeline: []
  },
  user: {
    browser: {
      name: '',
      version: '',
      isMobile: false,
      OS: ''
    },
    id: shortid.generate()
  }
})

export const mutations = {
  // --- API mutations
  API_SET_ENDPOINT ({ endpoint }, newEndpoint) { endpoint = newEndpoint },
  // --- Client browser information
  BROWSER_SET_NAME ({ user }, name) { user.browser.name = name },
  BROWSER_SET_VERSION ({ user }, version) { user.browser.version = version },
  BROWSER_SET_MOBILE ({ user }, mobile) { user.browser.isMobile = mobile },
  BROWSER_SET_OS ({ user }, OS) { user.browser.OS = OS },
  // --- CSSGram filter
  FILTER_RESET ({ filter }) { filter.active = 0 },
  FILTER_NEXT ({ filter }) { filter.active = ++filter.active % filter.list.length },
  FILTER_PREV ({ filter }) { filter.active = (--filter.active + filter.list.length) % filter.list.length },
  // --- Client image feed
  FEED_PUSH ({ feed }, data) { feed.push(data) },
  // --- Client event log
  LOG_TIMELINE_PUSH ({ log }, data) { log.timeline.push(Object.assign({ timestamp: Date.now() }, data)) },
  LOG_FILTER_CHANGE ({ log }) { log.stats.interactions.filter.total++ },
  LOG_FILTER_INCR ({ log }, name) { log.stats.interactions.filter[name]++ }, 
  LOG_PAGE_VISIT ({ log }, page) { log.stats.pageVisits[page]++ },
  LOG_PHOTO_CAPTURE ({ log }) { log.stats.interactions.photo.captured++ },
  LOG_PHOTO_UPLOAD ({ log }) { log.stats.interactions.photo.uploaded++ },
  LOG_VIDEO_CAPTURE ({ log }) { log.stats.interactions.video.captured++ },
  LOG_VIDEO_UPLOAD ({ log }) { log.stats.interactions.video.uploaded++ },
}

export const actions = {
  // --- Logging API actions
  'api/logEvent' ({ state }, event) { 
    axios.post(`https://${ state.endpoint }.localtunnel.me/log/user/event`, {
      id: state.user.id,
      event
    })
  },
  // --- Audio Engine actions
  'audio/init' ({ dispatch}) { AudioEngine.init() },
  'audio/blur' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.blur() },
  'audio/focus' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.focus() },
  'audio/pause' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.pause() },
  'audio/resume' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.resume() },
  'audio/nextPreset' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.nextPreset() },
  'audio/resetPreset' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.setPreset(0) },
  'audio/setPreset' ({ dispatch }, p) { if (AudioEngine.isActive()) AudioEngine.setPreset(p) },
  'audio/prevPreset' ({ dispatch }) { if (AudioEngine.isActive()) AudioEngine.prevPreset() },
  'audio/rgb' ({ dispatch }, rgb) { if (AudioEngine.isActive()) AudioEngine.mapRGB(rgb) },
  // --- User actions
  'user/consent' ({ commit }) { commit('USER_CONSENT') },
  'user/setBrowser' ({ commit }, { name, version, mobile, os }) {
    commit('BROWSER_SET_NAME', name)
    commit('BROWSER_SET_VERSION', version)
    commit('BROWSER_SET_MOBILE', mobile)
    commit('BROWSER_SET_OS', os)
  },
  // --- Client logging
  'log/event' ({ commit, dispatch, state }, data) {
    let event
    switch (data.type) {
      case 'capture':
        event = { type: 'capture', data: null, timestamp: { client: Date.now() } }
        commit('LOG_PHOTO_CAPTURE')
        commit('LOG_TIMELINE_PUSH', event)
        dispatch('api/logEvent', event)
        break
      case 'connect':
        const { user } = state
        const { browser, id } = user
        event = { type: 'connect', data: null, timestamp: { client: Date.now() } }
        commit('LOG_TIMELINE_PUSH', event)
        dispatch('api/logEvent', event)
        break
      case 'nav':
        event = { type: 'nav', data: data.to, timestamp: { client: Date.now() } }
        commit('LOG_PAGE_VISIT', data.to)
        commit('LOG_TIMELINE_PUSH', event)
        dispatch('api/logEvent', event)
        break
      case 'upload':
        event = { type: 'upload', data: null, timestamp: { client: Date.now() } }
        commit('LOG_PHOTO_UPLOAD')
        commit('LOG_TIMELINE_PUSH', event)
        commit('FEED_PUSH', data.img)
        dispatch('api/logEvent', event)
        break
      case 'preset':
        event = { type: 'preset', data: data.class || 'none', timestamp: { client: Date.now() } }
        commit('LOG_FILTER_CHANGE')
        commit('LOG_FILTER_INCR', data.class)
        commit('LOG_TIMELINE_PUSH', event)
        dispatch('api/logEvent', event)
    }
  }
}

export const getters = {
  audio: () => AudioEngine,
  filter: ({ filter }) => filter.list[filter.active]
}
