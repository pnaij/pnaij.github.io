# pnaij.github.io

静态 demo 集合。站点根路径不提供首页（访问 `/` 返回 404），只通过具体 demo 的地址访问。

## 在线 demo

| Demo | 访问地址 |
| --- | --- |
| Lumen | https://pnaij.github.io/demos/lumen/ |

## 新增一个 demo

1. 在 `demos/` 下新建目录，例如 `demos/my-demo/`。
2. 放入 `index.html`，以及该 demo 自己的 `css/`、`js/`、`assets/`，页面内一律使用相对路径。
3. 推送 `master` 后访问 `https://pnaij.github.io/demos/my-demo/`。

## 约定

- 每个 demo 一个独立目录，互不共享文件，删掉整个目录即可下线。
- 根目录用 `.nojekyll` 关闭 Jekyll，因此没有自动生成的首页；根路径返回 404。
- `robots.txt` 禁止搜索引擎抓取，demo 页面也带 `noindex`。
- 仓库是公开的：不提供首页只是“不主动列出”，并非访问控制。不要放密钥、个人信息或任何敏感内容。
