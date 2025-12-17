// 这是一个 Hexo 脚本，无需插件，自动计算字数和阅读时间
hexo.extend.filter.register('after_post_render', function(data){
  // 仅在文章页面（post）生效
  if(data.layout === 'post'){
    
    // 1. 简单的字数统计逻辑（移除 HTML 标签后计算长度）
    var contentText = data.content.replace(/<[^>]+>/g,"");
    var wordCount = contentText.length;
    
    // 2. 计算阅读时长（假设每分钟读 300 字）
    var readTime = Math.round(wordCount / 300);
    if (readTime < 1) readTime = 1; // 不足1分钟按1分钟算

    // 3. 构造要显示的 HTML 样式
    // 样式：灰色文字，小字体，居中或靠左，下边距隔开正文
    var statsHtml = '<div style="margin-top: 5px; margin-bottom: 20px; color: #999; font-size: 0.9em; font-family: sans-serif;">' +
                    '<span style="margin-right: 10px;">📊 字数：' + wordCount + '</span>' +
                    '<span>⏱️ 预计阅读：' + readTime + ' 分钟</span>' +
                    '</div>';
    
    // 4. 把统计代码插入到正文的最前面
    data.content = statsHtml + data.content;
  }
  return data;
});
