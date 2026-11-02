/**
 * MTD Icon 图标查询工具
 *
 * 用法：
 *   node scripts/icon.js query <关键词>        # 语义搜索，返回匹配的图标名
 *   node scripts/icon.js validate <图标名>      # 验证图标名是否合法
 *   node scripts/icon.js list                  # 输出全量合法图标名列表
 *
 * 在 SKILL 工作流中使用图标前，必须先通过本脚本确认图标名合法性。
 */

// ─────────────────────────────────────────────
// 全量合法图标名（来源：组件库 iconfont 字体文件，唯一权威来源）
// ─────────────────────────────────────────────
const ICON_TYPES = [
  'adaptation-screen','add','add_4px','add_5px','add-circle','add-circle-fill_4px',
  'add-circle-fill_5px','add-message','add-message-fill','add-square-fill','add-square-o',
  'addmini','airplayvideo','align-center','align-justify','align-left','align-right',
  'alipay','alphabetically','amazon','android','annex','antenna','antenna_4px','antenna_5px',
  'apple','archery','archery-fill','areachart','areachart-o','arrow-down','arrow-down_4px',
  'arrow-down_5px','arrow-left','arrow-left_4px','arrow-left_5px','arrow-right',
  'arrow-right_4px','arrow-right_5px','arrow-up','arrow-up_4px','arrow-up_5px','at',
  'at_4px','at_5px','avatar-add','avatar-add-fill','avatar-fill','avatar-group',
  'avatar-group-fill','avatar-group-o','avatar-o','avatar-o_4px','avatar-o_5px','badge',
  'badge-fill','bag','bag-fill','bank-card-fill','bankcard','bankcard_4px','bankcard_5px',
  'bar-chart','bar-chart-fill','barcode','barcode_4px','barcode_5px','barschart',
  'barschart-o','basket','basket_4px','basket_5px','bell','bell-o','bell-o_4px','bell-o_5px',
  'bell-slash-fill','bill','bill-fill','bolt','bolt-fill','book','book-fill','briefcase',
  'briefcase-fill','broom','calculator','calculator-o','calendar','calendar-o',
  'calendar-o_4px','calendar-o_5px','camera','camera_4px','camera_5px','camera-fill',
  'cancel-circle','cancel-circle_4px','cancel-circle_5px','cancel-circle-fill','cardholder',
  'cardholder_4px','cardholder_5px','cardview','cart','cart_4px','cart_5px','cart-fill',
  'cashier','cashier-fill','category-search','category-search_4px','category-search_5px',
  'check','check_4px','check_5px','check-thick','checkbox-checked','checkbox-checked-o',
  'checkbox-indetermina','checkbox-indetermina-o','checkbox-unchecked','checkmini','chrome',
  'circle-o','cleaner-format','clock-lightning','clock-lightning_4px','clock-lightning_5px',
  'close','close_4px','close_5px','closemini','cloud-fill','cloud-o','code-off','code-on',
  'collapse','color-fill','colorfont','comment','comment-fill','comment-o','comment-q-fill',
  'comment-write','comment-write_4px','comment-write_5px','compactview','compress',
  'compress-fill','contacts','contacts-fill','cooking-o','cooperation','cooperation-fill',
  'copy','copy-o','coupon','coupon_4px','coupon_5px','couponpackage','couponpackage_4px',
  'couponpackage_5px','customer','customer-o','customer-o_4px','customer-o_5px','cycle',
  'database-fill','database-o','delete','delete-o','delete-o_4px','delete-o_5px',
  'delete-selected-row','delete-selectedcolumn','delivery-order','delivery-order-fill',
  'demonstration','dialogue-o','dislike','dislike_4px','dislike_5px','dislike-fill','down',
  'down_4px','down_5px','down-thick','down-thick_4px','down-thick_5px','download-o',
  'download-o_4px','download-o_5px','drill-down-fill','drill-down-o','dropbox','edit',
  'edit-o','edit-o_4px','edit-o_5px','education','education-fill','ellipsis','ellipsis_4px',
  'ellipsis_5px','emoji','emoji_4px','emoji_5px','emoji-shortvideo','emoji-shortvideo_4px',
  'emoji-shortvideo_5px','enlarge','error-circle','error-o','error-o_4px','error-o_5px',
  'exchange','exchange_4px','exchange_5px','exit-fullscreen-o','exit-fullscreen-o_4px',
  'exit-fullscreen-o_5px','expand','export-o','export-o_4px','export-o_5px','expression',
  'expression_4px','expression_5px','expression-add-o','fabulous','fabulous_4px',
  'fabulous_5px','fabulous-fill','facebook','fapiao-char','fapiao-char_4px','fapiao-char_5px',
  'fapiao-upload','fapiao-upload-fill','fast-backward','fast-backward_4px','fast-backward_5px',
  'fast-downword','fast-downword_4px','fast-downword_5px','fast-forward','fast-forward_4px',
  'fast-forward_5px','fast-upword','fast-upword_4px','fast-upword_5px','feedback',
  'feedback_4px','feedback_5px','female','female_4px','female_5px','file-add','file-export',
  'file-export-fill','file-fill','file-import','file-import-fill','file-o','file-send',
  'file-send-fill','file-warning','file-warning-fill','filebox-o','filter','filter-o',
  'filter-o_4px','filter-o_5px','find-o','flame','flame-fill','flashlight-off',
  'flashlight-off_4px','flashlight-off_5px','flashlight-on','flashlight-on_4px',
  'flashlight-on_5px','floor','floor-fill','flowchart-o','focus-add-o','focus-fill',
  'focus-finish-o','focus-o','folder','folder-fill','folder-list','folder-list-fill',
  'footprints','footprints_4px','footprints_5px','form','format-thin','formatbold',
  'forward-o','fullscreen-o','fullscreen-o_4px','fullscreen-o_5px','funnel-chart',
  'funnel-chart-fill','github','globe','google','h1','h2','hand-upward','hand-upward-fill',
  'handle','header-column','header-line','hierarchy-fill','hierarchy-o','history','home',
  'home-o','home-o_4px','home-o_5px','horizontal-screen','horizontal-screen_4px',
  'horizontal-screen_5px','html5','id-card','id-card-fill','ie','import-export-o',
  'info-circle','info-circle-o','info-circle-o_4px','info-circle-o_5px','insert-column-left',
  'insert-column-right','insert-row-down','insert-row-up','instructions','instructions-fill',
  'invoice-o','invoice-fill','italic','jigsaw','jigsaw-fill','jumpout-o','keyboard','lab-o',
  'label','laser-pen','lattice','left','left_4px','left_5px','left-thick','left-thick_4px',
  'left-thick_5px','like_3px','like_4px','like_5px','like-fill','line','link-o','list-bulleted',
  'list-numbered','list-view','load','location','location-circle-o','location-circle-o_4px',
  'location-circle-o_5px','location-o','location-o_4px','location-o_5px','location-point-o',
  'location-point-o_4px','location-point-o_5px','lock-fill','lock-o','log-out','lookup',
  'lookup-fill','mail-fill','mail-o','mail-o_4px','mail-o_5px','male','male_4px','male_5px',
  'map','map_4px','map_5px','map-fill','mark-o','market-fill','market-o','market-o_4px',
  'market-o_5px','meetingroom','meetingroom-fill','meh','meh-o','menu-point','menus-o',
  'menus-o_4px','menus-o_5px','merge-cells','message-r-point','message-r-point_4px',
  'message-r-point_5px','message-s-point','message-s-point_4px','message-s-point_5px',
  'micrify','microphone','microphone_4px','microphone_5px','microphone-slash',
  'microphone-slash_4px','microphone-slash_5px','mindmap-o','minus','minus_4px','minus_5px',
  'money-circle','money-circle-fill','monitor','monitor-fill','monitor-video',
  'monitor-video-fill','more','more-circle','more-circle-fill','more-circle-o-fill','mosaic',
  'mute-fill','mute-o','mute-o_4px','mute-o_5px','new-folde-fill','newfolde','nonetwork',
  'nosign','note','note_4px','note_5px','note-fill','notebook-add','notebook-add-fill',
  'notebook-data-fill','notebook-data-o','notebook-fill','notebook-import-fill',
  'notebook-import-o','notebook-o','notebook-o_4px','notebook-o_5px','order-warning',
  'order-warning_4px','order-warning_5px','order-warning-fill','originalsize','page-fill',
  'page-lookup','page-lookup-fill','page-o','paint','paperplane','paperplane-fill',
  'paperplane-vertical','paperplane-vertical-fill','paste-code-fill','paste-code-o','phone',
  'picture','picture_4px','picture_5px','picture-fail','picture-fail-fill','picture-fill',
  'picture-square','picture-square-fill','piechart','piechart-o','play','play-fill','point',
  'positive-sequence','positive-sequence_4px','positive-sequence_5px','present','present_4px',
  'present_5px','present-fill','price','price-fill','printing','printing-fill','provisional',
  'qq','qrcode','qrcode_4px','qrcode_5px','qubiezhen_fujian','question-circle',
  'question-circle-o','question-circle-o_4px','question-circle-o_5px','question-mark',
  'questionmini','quote','radio-unchecked','read','redo','redpacket','redpacket_4px',
  'redpacket_5px','refresh','refresh_4px','refresh_5px','refresh-o','refresh-o_4px',
  'refresh-o_5px','refund','refund_4px','refund_5px','removemini','renewal','research',
  'research_4px','research_5px','reverse-order','reverse-order_4px','reverse-order_5px',
  'review','review-fill','right','right_4px','right_5px','right-thick','right-thick_4px',
  'right-thick_5px','rotate','ruler-pen','ruler-pen-o','sad','sad-o','save','save-o',
  'schedule','schedule-fill','search','search_4px','search_5px','serikeethrough','setting',
  'setting_4px','setting_5px','setting-fill','shape','share','share-2','share-arrow',
  'share-arrow_4px','share-arrow_5px','share-arrow-fill','share-o','shengyidai','shield',
  'shield-fill','shield-star','shield-star-fill','shield-success','shield-success_4px',
  'shield-success_5px','shield-success-fill','shield-warning','shield-warning-fill',
  'shoppingcart-add','shoppingcart-add_4px','shoppingcart-add_5px','shoppingcart-add-fill',
  'shuffl-playback','slack','slash','slider-settings','smile','smile-o','sort',
  'sort-up-and-down-o','sortupanddown-o','square-stack-up','square-stack-up_4px',
  'square-stack-up_5px','square-stack-up-fill','star','star-half','star-o','star-o_4px',
  'star-o_5px','sub-association','sub-association-fill','subscript','success-circle',
  'success-o','success-o_4px','success-o_5px','superscript','table','table-fill',
  'table-property-editing','tailoring','taxrate','taxrate-fill','telephone','telephone_4px',
  'telephone_5px','telephone-down-fill','telephone-fill','telephonevolume-fill','template',
  'text-bgcolor','textformat','textformat-print','theme','theme-o','time','time_3oclock',
  'time_3oclock-o','time_3oclock-o_4px','time_3oclock-o_5px','time-countdown-o','time-o',
  'time-o_4px','time-o_5px','toc','top','top_4px','top_5px','total-association',
  'total-association-fill','triangle-down','triangle-left','triangle-right','triangle-up',
  'trophy','trophy-fill','truck-fill','tuanhaohuo','tuanhaohuo_4px','tuanhaohuo_5px',
  'twitter','unbell','underlined','undo-o','unlink-o','unlock','unlock-fill','unmerge-cells',
  'up','up_4px','up_5px','up-thick','up-thick_4px','up-thick_5px','upload-cloud-fill',
  'upload-cloud-o','vertical-center','vertical-down','vertical-up','video','video_4px',
  'video_5px','video_add','video_add_4px','video_add_5px','video-fill','visibility-off-o',
  'visibility-off-o_4px','visibility-off-o_5px','visibility-on-fill','visibility-on-o',
  'visibility-on-o_4px','visibility-on-o_5px','volume','volume-fill','volume-slash',
  'volume-slash_4px','volume-slash_5px','volume-slash-fill','volume1','volume1_4px',
  'volume1_5px','volume1-fill','volume2','volume2_4px','volume2_5px','volume2-fill','volume3',
  'volume3-fill','wallet','wallet_4px','wallet_5px','warning','warning-circle',
  'warning-circle-o','warning-circle-o_4px','warning-circle-o_5px','warning-triangle-fill',
  'warning-triangle-o','warning-triangle-o_4px','warning-triangle-o_5px','warningmini',
  'wechatpay','weibo','weixin','wifi-fill','wifi-o','wifi-slash-fill','xiaotuanbi',
  'xiaotuanbi_4px','xiaotuanbi_5px',
];

// ─────────────────────────────────────────────
// 中文语义映射表
// key: 中文关键词（支持多个，空格分隔）
// value: 对应的合法图标名（按推荐度排序，首选在前）
// ─────────────────────────────────────────────
const SEMANTIC_MAP = [
  // 通用操作
  { zh: '新增 添加 增加 创建 加号',          icons: ['add', 'add-circle', 'add-square-fill', 'add-square-o'] },
  { zh: '删除 移除 清除 垃圾桶',              icons: ['delete', 'delete-o'] },
  { zh: '编辑 修改 写作',                    icons: ['edit', 'edit-o'] },
  { zh: '搜索 查找 查询 检索',               icons: ['search', 'find-o', 'category-search'] },
  { zh: '复制 拷贝',                         icons: ['copy', 'copy-o'] },
  { zh: '刷新 重载 更新',                    icons: ['refresh', 'refresh-o'] },
  { zh: '下载',                              icons: ['download-o'] },
  { zh: '上传',                              icons: ['upload-cloud-o', 'upload-cloud-fill'] },
  { zh: '导出 输出',                         icons: ['export-o', 'file-export', 'file-export-fill'] },
  { zh: '导入 输入',                         icons: ['file-import', 'file-import-fill', 'import-export-o'] },
  { zh: '保存',                              icons: ['save', 'save-o'] },
  { zh: '撤销 回退',                         icons: ['undo-o'] },
  { zh: '重做 前进',                         icons: ['redo'] },
  { zh: '关闭 取消 叉',                      icons: ['close'] },
  { zh: '确认 完成 勾选 打勾 对号',           icons: ['check', 'check-thick'] },
  { zh: '减少 减号',                         icons: ['minus'] },
  { zh: '更多 省略 三个点',                  icons: ['more', 'more-circle', 'more-circle-fill', 'ellipsis'] },
  { zh: '排序 顺序',                         icons: ['sort', 'sort-up-and-down-o'] },
  { zh: '过滤 筛选',                         icons: ['filter', 'filter-o'] },
  { zh: '旋转',                              icons: ['rotate'] },
  { zh: '交换 切换',                         icons: ['exchange'] },
  { zh: '分享',                              icons: ['share', 'share-o', 'share-arrow', 'share-arrow-fill'] },
  { zh: '复制链接 外链',                     icons: ['link-o', 'unlink-o'] },
  { zh: '全屏 放大屏幕',                     icons: ['fullscreen-o', 'enlarge'] },
  { zh: '退出全屏 缩小屏幕',                 icons: ['exit-fullscreen-o', 'compress', 'compress-fill'] },

  // 方向/箭头
  { zh: '向上 上箭头',                       icons: ['arrow-up', 'up', 'up-thick', 'triangle-up', 'fast-upword'] },
  { zh: '向下 下箭头',                       icons: ['arrow-down', 'down', 'down-thick', 'triangle-down', 'fast-downword'] },
  { zh: '向左 左箭头',                       icons: ['arrow-left', 'left', 'left-thick', 'triangle-left', 'fast-backward'] },
  { zh: '向右 右箭头',                       icons: ['arrow-right', 'right', 'right-thick', 'triangle-right', 'fast-forward'] },
  { zh: '置顶 回到顶部',                     icons: ['top'] },
  { zh: '展开',                              icons: ['expand', 'drill-down-fill'] },
  { zh: '折叠 收起',                         icons: ['collapse'] },

  // 状态/反馈
  { zh: '成功 正确',                         icons: ['success-circle', 'success-o', 'check-thick'] },
  { zh: '错误 失败 出错',                    icons: ['error-circle', 'error-o', 'cancel-circle', 'cancel-circle-fill'] },
  { zh: '警告 注意 提醒',                    icons: ['warning', 'warning-circle', 'warning-circle-o', 'warning-triangle-fill', 'warning-triangle-o'] },
  { zh: '信息 提示',                         icons: ['info-circle', 'info-circle-o'] },
  { zh: '问题 帮助 疑问',                    icons: ['question-circle', 'question-circle-o', 'question-mark'] },
  { zh: '加载 loading',                      icons: ['load'] },

  // 用户/账号
  { zh: '用户 头像 人员 人',                 icons: ['avatar-fill', 'avatar-o', 'customer', 'customer-o'] },
  { zh: '添加用户 新增人员',                 icons: ['avatar-add', 'avatar-add-fill'] },
  { zh: '用户组 团队 多人',                  icons: ['avatar-group', 'avatar-group-fill', 'avatar-group-o'] },
  { zh: '联系人 通讯录',                     icons: ['contacts', 'contacts-fill'] },
  { zh: '身份证 证件',                       icons: ['id-card', 'id-card-fill'] },
  { zh: '锁 加锁 锁定',                      icons: ['lock-fill', 'lock-o'] },
  { zh: '解锁',                              icons: ['unlock', 'unlock-fill'] },
  { zh: '退出 登出',                         icons: ['log-out'] },
  { zh: '男 性别男',                         icons: ['male'] },
  { zh: '女 性别女',                         icons: ['female'] },

  // 通知/消息
  { zh: '通知 铃铛 提醒',                    icons: ['bell', 'bell-o'] },
  { zh: '关闭通知 消音 免打扰',              icons: ['bell-slash-fill', 'unbell', 'mute-fill', 'mute-o'] },
  { zh: '评论 消息 聊天',                    icons: ['comment', 'comment-fill', 'comment-o', 'dialogue-o'] },
  { zh: '邮件 邮箱',                         icons: ['mail-fill', 'mail-o'] },
  { zh: '@提及',                             icons: ['at'] },
  { zh: '消息标记 角标',                     icons: ['badge', 'badge-fill', 'message-r-point', 'message-s-point'] },
  { zh: '发送 纸飞机',                       icons: ['paperplane', 'paperplane-fill', 'paperplane-vertical'] },

  // 文件/文档
  { zh: '文件 文档',                         icons: ['file-fill', 'file-o'] },
  { zh: '新建文件 添加文件',                 icons: ['file-add'] },
  { zh: '发送文件',                          icons: ['file-send', 'file-send-fill'] },
  { zh: '文件警告',                          icons: ['file-warning', 'file-warning-fill'] },
  { zh: '文件夹',                            icons: ['folder', 'folder-fill', 'folder-list', 'folder-list-fill', 'filebox-o'] },
  { zh: '页面 文章',                         icons: ['page-fill', 'page-o', 'page-lookup'] },
  { zh: '笔记本 本子',                       icons: ['notebook-fill', 'notebook-o', 'notebook-add', 'notebook-add-fill'] },
  { zh: '附件',                              icons: ['annex'] },
  { zh: '模板',                              icons: ['template'] },
  { zh: '说明 指引',                         icons: ['instructions', 'instructions-fill'] },
  { zh: '发票',                              icons: ['invoice-fill', 'invoice-o', 'fapiao-char', 'fapiao-upload'] },

  // 数据/图表
  { zh: '柱状图 条形图',                     icons: ['bar-chart', 'bar-chart-fill', 'barschart', 'barschart-o'] },
  { zh: '面积图 折线图',                     icons: ['areachart', 'areachart-o'] },
  { zh: '饼图',                              icons: ['piechart', 'piechart-o'] },
  { zh: '漏斗图',                            icons: ['funnel-chart', 'funnel-chart-fill'] },
  { zh: '层级 树形',                         icons: ['hierarchy-fill', 'hierarchy-o'] },
  { zh: '思维导图',                          icons: ['mindmap-o'] },
  { zh: '流程图',                            icons: ['flowchart-o'] },
  { zh: '数据库',                            icons: ['database-fill', 'database-o'] },
  { zh: '表格',                              icons: ['table', 'table-fill'] },
  { zh: '目录 大纲',                         icons: ['toc', 'list-view'] },

  // 设置/工具
  { zh: '设置 配置',                         icons: ['setting', 'setting-fill'] },
  { zh: '自定义 个性化',                     icons: ['slider-settings'] },
  { zh: '主题 换肤',                         icons: ['theme', 'theme-o'] },
  { zh: '画笔 涂色',                         icons: ['paint', 'color-fill'] },
  { zh: '尺子 标尺',                         icons: ['ruler-pen', 'ruler-pen-o'] },
  { zh: '清除 清洁',                         icons: ['broom'] },
  { zh: '计算器',                            icons: ['calculator', 'calculator-o'] },
  { zh: '代码',                              icons: ['code-on', 'code-off'] },
  { zh: '工具箱 公文包',                     icons: ['briefcase', 'briefcase-fill'] },

  // 时间/日历
  { zh: '日历 日期',                         icons: ['calendar', 'calendar-o'] },
  { zh: '时间 时钟',                         icons: ['time', 'time-o', 'time-countdown-o'] },
  { zh: '历史记录 操作历史',                 icons: ['history'] },
  { zh: '日程 计划',                         icons: ['schedule', 'schedule-fill'] },

  // 位置/地图
  { zh: '位置 定位 地点',                    icons: ['location', 'location-o', 'location-point-o', 'location-circle-o'] },
  { zh: '地图',                              icons: ['map', 'map-fill'] },
  { zh: '楼层 楼栋',                         icons: ['floor', 'floor-fill'] },

  // 商业/电商
  { zh: '购物车',                            icons: ['cart', 'cart-fill', 'shoppingcart-add', 'shoppingcart-add-fill'] },
  { zh: '购物袋 商品',                       icons: ['bag', 'bag-fill'] },
  { zh: '价格 标签',                         icons: ['price', 'price-fill', 'label'] },
  { zh: '优惠券 券',                         icons: ['coupon', 'couponpackage'] },
  { zh: '红包',                              icons: ['redpacket'] },
  { zh: '钱包',                              icons: ['wallet'] },
  { zh: '金额 货币 钱',                      icons: ['money-circle', 'money-circle-fill'] },
  { zh: '银行卡',                            icons: ['bank-card-fill', 'bankcard'] },
  { zh: '账单 订单',                         icons: ['bill', 'bill-fill', 'delivery-order', 'delivery-order-fill'] },
  { zh: '收银 结账',                         icons: ['cashier', 'cashier-fill'] },
  { zh: '退款',                              icons: ['refund'] },
  { zh: '续费',                              icons: ['renewal'] },
  { zh: '卡片持有人',                        icons: ['cardholder'] },
  { zh: '市场 商城',                         icons: ['market-fill', 'market-o'] },
  { zh: '运货 卡车',                         icons: ['truck-fill'] },

  // 媒体/内容
  { zh: '图片 照片 图像',                    icons: ['picture', 'picture-fill', 'picture-square', 'picture-square-fill'] },
  { zh: '视频 影片',                         icons: ['video', 'video-fill', 'monitor-video', 'monitor-video-fill'] },
  { zh: '相机 拍照',                         icons: ['camera', 'camera-fill'] },
  { zh: '播放',                              icons: ['play', 'play-fill'] },
  { zh: '音量 声音',                         icons: ['volume', 'volume-fill', 'volume1', 'volume2', 'volume3'] },
  { zh: '静音',                              icons: ['volume-slash', 'volume-slash-fill'] },
  { zh: '麦克风 录音',                       icons: ['microphone'] },
  { zh: '关闭麦克风',                        icons: ['microphone-slash'] },

  // 导航/布局
  { zh: '首页 主页',                         icons: ['home', 'home-o'] },
  { zh: '菜单 导航',                         icons: ['menus-o', 'menu-point'] },
  { zh: '列表视图',                          icons: ['list-view', 'cardview', 'compactview'] },
  { zh: '横屏',                              icons: ['horizontal-screen'] },

  // 社交/评价
  { zh: '点赞 喜欢',                         icons: ['like-fill', 'like_4px'] },
  { zh: '踩 不喜欢',                         icons: ['dislike', 'dislike-fill'] },
  { zh: '收藏 星星',                         icons: ['star', 'star-o', 'star-half'] },
  { zh: '评价 点评',                         icons: ['review', 'review-fill'] },
  { zh: '关注',                              icons: ['focus-fill', 'focus-o', 'focus-add-o'] },
  { zh: '表情',                              icons: ['smile', 'smile-o', 'meh', 'meh-o', 'sad', 'sad-o'] },
  { zh: '奖杯 荣誉',                         icons: ['trophy', 'trophy-fill'] },

  // 安全/权限
  { zh: '盾牌 安全',                         icons: ['shield', 'shield-fill'] },
  { zh: '安全认证 盾牌星',                   icons: ['shield-star', 'shield-star-fill'] },
  { zh: '安全成功',                          icons: ['shield-success', 'shield-success-fill'] },
  { zh: '安全警告',                          icons: ['shield-warning', 'shield-warning-fill'] },

  // 打印/设备
  { zh: '打印',                              icons: ['printing', 'printing-fill'] },
  { zh: '显示器 屏幕',                       icons: ['monitor', 'monitor-fill'] },
  { zh: '手机 电话',                         icons: ['phone', 'telephone', 'telephone-fill'] },
  { zh: '键盘',                              icons: ['keyboard'] },
  { zh: '二维码',                            icons: ['qrcode'] },
  { zh: '条形码',                            icons: ['barcode'] },
  { zh: 'wifi 无线网络',                     icons: ['wifi-fill', 'wifi-o', 'wifi-slash-fill'] },

  // 教育/研究
  { zh: '教育 学习',                         icons: ['education', 'education-fill'] },
  { zh: '研究 实验',                         icons: ['research', 'lab-o'] },
  { zh: '合作 协作',                         icons: ['cooperation', 'cooperation-fill'] },
  { zh: '反馈',                              icons: ['feedback'] },
  { zh: '阅读 查看',                         icons: ['read', 'lookup', 'lookup-fill'] },
  { zh: '笔记 备注',                         icons: ['note', 'note-fill'] },
  { zh: '书 书本',                           icons: ['book', 'book-fill'] },

  // 第三方品牌
  { zh: '支付宝',                            icons: ['alipay'] },
  { zh: '微信 微信支付',                     icons: ['weixin', 'wechatpay'] },
  { zh: '微博',                              icons: ['weibo'] },
  { zh: 'qq',                                icons: ['qq'] },
  { zh: 'github',                            icons: ['github'] },
  { zh: 'google',                            icons: ['google'] },
  { zh: 'facebook',                          icons: ['facebook'] },
  { zh: 'twitter',                           icons: ['twitter'] },
  { zh: 'android',                           icons: ['android'] },
  { zh: 'apple ios',                         icons: ['apple'] },

  // 其他常用
  { zh: '闪电 快速',                         icons: ['bolt', 'bolt-fill', 'clock-lightning'] },
  { zh: '火焰 热门',                         icons: ['flame', 'flame-fill'] },
  { zh: '全球 国际 语言',                    icons: ['globe'] },
  { zh: '条纹 线条',                         icons: ['line'] },
  { zh: '标记 记号',                         icons: ['mark-o'] },
  { zh: '礼物 礼品',                         icons: ['present', 'present-fill'] },
  { zh: '拼图 插件',                         icons: ['jigsaw', 'jigsaw-fill'] },
  { zh: '表单',                              icons: ['form'] },
  { zh: '刷新循环',                          icons: ['cycle'] },
  { zh: '显示 可见',                         icons: ['visibility-on-fill', 'visibility-on-o'] },
  { zh: '隐藏 不可见',                       icons: ['visibility-off-o'] },
];

// ─────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────

/** 验证图标名是否合法 */
function validate(iconName) {
  return ICON_TYPES.includes(iconName);
}

/**
 * 语义搜索：输入中文关键词，返回推荐的合法图标名
 * @param {string} keyword - 中文或英文关键词
 * @returns {{ recommended: string[], alternatives: string[] }}
 */
function query(keyword) {
  const kw = keyword.toLowerCase().trim();
  const recommended = new Set();
  const alternatives = new Set();

  // 1. 先精确匹配合法图标名（英文直接搜索）
  ICON_TYPES.forEach(name => {
    if (name === kw || name.replace(/_\d+px$/, '') === kw) {
      recommended.add(name);
    }
  });

  // 2. 语义映射匹配（中文关键词）
  SEMANTIC_MAP.forEach(({ zh, icons }) => {
    const zhKeywords = zh.split(/\s+/);
    const isMatch = zhKeywords.some(k => k.includes(kw) || kw.includes(k));
    if (isMatch) {
      icons.forEach((icon, idx) => {
        if (idx === 0) recommended.add(icon);
        else alternatives.add(icon);
      });
    }
  });

  // 3. 英文模糊匹配（按图标名包含关键词）
  if (recommended.size === 0) {
    ICON_TYPES.forEach(name => {
      const baseName = name.replace(/_\d+px$/, '');
      if (baseName.includes(kw) || kw.includes(baseName)) {
        alternatives.add(name);
      }
    });
  }

  // 过滤掉带 _4px/_5px/_3px 后缀的变体（AI 无需关心像素变体）
  const filterVariants = (set) =>
    [...set].filter(name => !/_\d+px$/.test(name) && !/_\d+px$/.test(name));

  return {
    recommended: filterVariants(recommended),
    alternatives: filterVariants([...alternatives].filter(x => !recommended.has(x))),
  };
}

// ─────────────────────────────────────────────
// CLI 入口
// ─────────────────────────────────────────────
const [,, cmd, ...args] = process.argv;

if (cmd === 'validate') {
  const iconName = args[0];
  if (!iconName) {
    console.error('用法: node scripts/icon.js validate <图标名>');
    process.exit(1);
  }
  if (validate(iconName)) {
    console.log(`✅ "${iconName}" 是合法的图标名`);
  } else {
    console.log(`❌ "${iconName}" 不是合法的图标名`);
    // 尝试给出相似的推荐
    const similar = ICON_TYPES.filter(t => {
      const base = iconName.replace(/-o$|-fill$/, '');
      return t.startsWith(base) || t.includes(base);
    }).slice(0, 5);
    if (similar.length > 0) {
      console.log(`   你是否想用: ${similar.join(' / ')}`);
    }
    process.exit(1);
  }

} else if (cmd === 'query') {
  const keyword = args.join(' ');
  if (!keyword) {
    console.error('用法: node scripts/icon.js query <关键词>');
    process.exit(1);
  }
  const result = query(keyword);
  if (result.recommended.length === 0 && result.alternatives.length === 0) {
    console.log(`未找到与 "${keyword}" 相关的图标，请尝试其他关键词`);
    console.log('可用关键词示例：搜索、删除、用户、通知、日历、设置、地图...');
  } else {
    if (result.recommended.length > 0) {
      console.log(`推荐图标: ${result.recommended.join(' / ')}`);
    }
    if (result.alternatives.length > 0) {
      console.log(`备选图标: ${result.alternatives.slice(0, 8).join(' / ')}`);
    }
  }

} else if (cmd === 'list') {
  // 输出不含像素变体的基础图标名列表
  const baseIcons = [...new Set(ICON_TYPES.map(n => n.replace(/_\d+px$/, '')))];
  console.log(baseIcons.join('\n'));
  console.log(`\n共 ${baseIcons.length} 个基础图标`);

} else {
  console.log(`
MTD Icon 图标查询工具

用法:
  node scripts/icon.js query <关键词>     语义搜索图标
  node scripts/icon.js validate <图标名>  验证图标名是否合法
  node scripts/icon.js list              列出所有基础图标名

示例:
  node scripts/icon.js query 搜索
  node scripts/icon.js query 删除
  node scripts/icon.js query 通知
  node scripts/icon.js validate search
  node scripts/icon.js validate search-o
`);
}

module.exports = { ICON_TYPES, validate, query };
