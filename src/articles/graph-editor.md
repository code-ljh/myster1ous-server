## [Graph-Editor for code-ljh.github.io](/applications/graph-editor)

图模拟器。之 模拟现实。

- 力的模拟（Force）

当前使用的模型：

|力的类型|触发条件|大小|
|:---:|:--:|:--:|
|电磁力|$u,v\in V$|$M/\text{dist}^2(u,v)$|
|弹性力|$(u,v)\in E$|$N\times(L-\text{dist}(u,v))$|
|中心引力|$u\in V$|$G/\text{dist}^2(u,O)$|
|边阻|$(u,v)\in E$|$u,v\gets V_u\times R_1,V_v\times R_1$|
|点自由阻|$u \in V$|$u \gets R^{\vert V\vert-1}$|
|层力|$\text{tree mode}$|$N\times(\text{Layer}-u)$|

## 当前支持的功能

|语法|描述|
|:-|:-|
|`u`|固定 $u$|
|`u v`|加边 $(u,v)$|
|`/font-size u`|字体大小 $u$|
|`/outline u`|点周线宽度 $u$|
|`/tree-mode`|进入树模式|
|`/directed`|进入有向图模式|
|`u v w`|加带边权的边|
|`$nv u w`|给 $u$ 加入点权|
|$\text{click}$|拖拽节点|
|$\text{ctrl click}$|固定/取消固定节点|