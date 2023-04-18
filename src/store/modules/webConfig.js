export default {
  namespaced: true,
  state: localStorage.getItem('bbcWebConfigData') ? JSON.parse(localStorage.getItem('bbcWebConfigData')) : {
    bsLoginLogoImg: null,
    bsLoginBgImg: null,
    bsCopyright: null,
    bsTitleContent: null,
    bsTitleImg: null,
    bsMenuTitleOpen: null,
    bsMenuTitleClose: null
  },
  mutations: {
    addData (state, webConfigDataForm) {
      localStorage.setItem('bbcWebConfigData', JSON.stringify(webConfigDataForm || '{}'))
      document.title = webConfigDataForm.bsTitleContent || ''

      let facicon = document.querySelector('link[rel="icon"]')
      if (facicon !== null) {
        facicon.href = webConfigDataForm.bsTitleImg
      } else {
        facicon = document.createElement('link')
        facicon.rel = 'icon'
        facicon.href = webConfigDataForm.bsTitleImg
        document.head.appendChild(facicon)
      }
    }
  }
}
