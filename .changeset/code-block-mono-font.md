---
'bili-ui': patch
---

CodeBlock 的等宽字体栈改为优先 `Cascadia Code`，并修复高亮 token 与行号被全局 `[class^="bili-"]` 字体重置覆盖、导致代码正文实际回退为界面字体的问题；文档站的围栏代码块与行内代码同步使用同一等宽栈。
