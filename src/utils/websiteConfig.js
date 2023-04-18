// 网站配置默认信息
const configDefInfo = {
  // 登录logo
  bsLoginLogoImg: require('@/assets/img/website-config/login-logo.png'),
  // 登录背景
  bsLoginBgImg: require('@/assets/img/website-config/login-bg.jpg'),
  // 版权声明-中文
  bsCopyright: 'Copyright © 2018-2099 广州蓝海创新科技有限公司',
  // 标题文本-中文
  bsTitleContent: '蓝海-商家端',
  // 网站标题图标
  bsTitleImg: require('@/assets/img/website-config/title-icon.png'),
  // 菜单栏顶部图标
  bsTopBarIcon: require('@/assets/img/website-config/menu-top-icon.png'),
  // 菜单展开文本-中文
  bsMenuTitleOpen: '蓝海商城-商家端',
  // 菜单收缩文本-中文
  bsMenuTitleClose: '蓝海'
}

// 添加图片域名
function addDomain (path) {
  const resourcesUrl = process.env.VUE_APP_RESOURCES_URL
  if (!path || /^https?:\/\//.test(path)) {
    return path
  } else {
    return resourcesUrl + path
  }
}

// 格式化配置信息
const formatConfigInfo = function (config) {
  const data = {}
  config = JSON.parse(JSON.stringify(config))
  // 检测图片是否携带域名
  config.bsLoginLogoImg = addDomain(config.bsLoginLogoImg)
  config.bsLoginBgImg = addDomain(config.bsLoginBgImg)
  config.bsTitleImg = addDomain(config.bsTitleImg)
  config.bsTopBarIcon = addDomain(config.bsTopBarIcon)
  // 为空使用默认配置
  data.bsLoginLogoImg = config.bsLoginLogoImg || configDefInfo.bsLoginLogoImg
  data.bsLoginBgImg = config.bsLoginBgImg || configDefInfo.bsLoginBgImg
  data.bsCopyright = config.bsCopyright || configDefInfo.bsCopyright
  data.bsTitleContent = config.bsTitleContent || configDefInfo.bsTitleContent
  data.bsTitleImg = config.bsTitleImg || configDefInfo.bsTitleImg
  data.bsTopBarIcon = config.bsTopBarIcon || configDefInfo.bsTopBarIcon
  data.bsMenuTitleOpen = config.bsMenuTitleOpen || configDefInfo.bsMenuTitleOpen
  data.bsMenuTitleClose = config.bsMenuTitleClose || configDefInfo.bsMenuTitleClose
  return Object.assign(config, data)
}

export {configDefInfo, formatConfigInfo}
