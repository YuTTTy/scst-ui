module.exports = {
  title: 'SCST',

  /**
   * 是否展示设置按钮
   */
  showSettings: true,

  /**
   * 是否展示Tags标签
   */
  tagsView: true,

  /**
   * 是否固定Header
   */
  fixedHeader: true,

  /**
   * 是否展示侧边栏Logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
