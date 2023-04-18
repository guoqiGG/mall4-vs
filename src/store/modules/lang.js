export default {
  namespaced: true,
  state: {
    langList: [], // 语言列表
    langName: '', // 当前所选语言名称
    language: ''
  },
  mutations: {
    updateLang (state, langInfo) {
      const {langItemList, name, language} = langInfo
      const lang = localStorage.getItem('bbcLang')
      const langList = langItemList.filter(f => !f.hide) // 过滤掉隐藏的语言
      // 当前语言存在语言列表中
      let isExist = false
      // 是否已缓存语言
      if (lang) {
        for (const it of langList) {
          if (it.language === lang) {
            state.language = it.language
            state.langName = it.name
            isExist = true
            break
          }
        }
      }
      // 当前无缓存语言或当前缓存语言不在语言列表时
      if (!lang || !isExist) {
        state.langName = name
        state.language = language
        localStorage.setItem('bbcLang', language)
        // window.location.reload()
      }
      state.langList = langList
    },
    switchLang (state, langInfo) {
      const {name, language} = langInfo
      state.language = language
      state.langName = name
      localStorage.setItem('bbcLang', language)
    }
  }
}
