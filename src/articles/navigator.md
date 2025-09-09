## 导航器

当前支持的 API：

|API|作用|
|:--|:--|
|`get /`                  | 获取 `home` 网页        |
|`get /articles`           | 获取 `article-list` 网页      |
|`get /articles/{id}`      | 获取 `article-{id}` 网页      | 
|`get /categories/{path*}`| 获取 `categories-path` 网页   |
|`get /tags`              | 获取 `tags-list` 网页         |
|`get /tags/{id}`         | 获取 `tags-{id}` 网页         |
|`get /applications/`     | 获取 `applications-list` 网页 |
|`get /applications/{id}` | 获取 `applications-{id}` 网页 |
|`get /edit/articles`|进入后台主页面|
|`get /edit/articles/:id`|进入后台编辑 id 页面|
|`post /edit/articles/post/:id`|执行修改 id 文章|
|`post /edit/articles/delete/:id`|执行修改删除 id 文章