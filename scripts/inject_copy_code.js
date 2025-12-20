// 这是一个 Hexo 注入脚本
// 作用：自动给代码块添加“一键复制”按钮，包含样式和交互逻辑

hexo.extend.injector.register('body_end', () => {
  return `
  <script>
    // 等待页面加载完成
    document.addEventListener('DOMContentLoaded', function() {
      // 1. 找到所有的代码块 (Hexo 默认渲染为 figure.highlight)
      const codeBlocks = document.querySelectorAll('figure.highlight');

      codeBlocks.forEach(block => {
        // 2. 创建复制按钮
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerText = '复制';
        
        // 3. 把按钮加到代码块里
        block.appendChild(button);

        // 4. 处理点击事件
        button.addEventListener('click', () => {
          // 找到代码内容 (Hexo 的代码在 td.code pre 或者 pre 中)
          let code = '';
          const codeContainer = block.querySelector('td.code pre') || block.querySelector('pre');
          
          if (codeContainer) {
            code = codeContainer.innerText; // 获取纯文本
          }

          // 执行复制到剪贴板
          if (navigator.clipboard && code) {
            navigator.clipboard.writeText(code).then(() => {
              // 复制成功的反馈
              button.innerText = '已复制!';
              button.classList.add('copied');
              
              // 2秒后恢复原状
              setTimeout(() => {
                button.innerText = '复制';
                button.classList.remove('copied');
              }, 2000);
            }).catch(err => {
              console.error('复制失败:', err);
              button.innerText = '失败';
            });
          } else {
            // 降级处理（针对旧浏览器）
            const textarea = document.createElement('textarea');
            textarea.value = code;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            button.innerText = '已复制!';
            setTimeout(() => { button.innerText = '复制'; }, 2000);
          }
        });
      });
    });
  </script>

  <style>
    /* 这里的 CSS 控制按钮长什么样 */
    
    /* 1. 让代码块变成相对定位，方便按钮定位 */
    figure.highlight {
      position: relative !important;
    }

    /* 2. 按钮的样式 */
    .copy-code-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      
      background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #666;
      
      font-size: 12px;
      padding: 4px 8px;
      cursor: pointer;
      z-index: 100;
      transition: all 0.2s;
      
      /* 手机端防误触优化 */
      opacity: 0.6; 
    }

    /* 鼠标悬停或者是点击后变清晰 */
    .copy-code-btn:hover, .highlight:hover .copy-code-btn {
      opacity: 1;
      background: #fff;
    }

    /* 3. 复制成功后的绿色样式 */
    .copy-code-btn.copied {
      background: #4caf50;
      color: white;
      border-color: #4caf50;
    }
  </style>
  `;
});
