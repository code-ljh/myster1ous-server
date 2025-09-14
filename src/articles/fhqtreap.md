### FHQ Treap

FHQ Treap 范浩强 Treap。又称无旋 Treap；

其支持以下操作：

- `INS x` 插入 $x$；
- `DEL x` 删除 $x$；
- `RANK x` 查询 $x$ 排名；
- `KTH x` 查询排名为 $x$ 的元素；
- `PREV x` 查询 $x$ 的前驱；
- `NEXT x` 查询 $x$ 的后继。

这 $6$ 个操作即为经典的平衡树六大操作。每个平衡树都绕不开的一集（确信）。

平衡树即 Balanced (Binary) Search Tree （被）平衡的二叉搜索树。

FHQ Treap 节点定义如下：

- `LSon, RSon` 二叉搜索树节点的左右儿子；
- `Value` 二叉搜索树节点值；
- `Size` 节点子树大小；
- `Priority` 节点优先级。

前三个都是经典的二叉搜索树的东西了，第四个就是 `FHQ-Treap` 维护平衡的关键。

`Priority` 的作用就是确定树的形态。

在理想情况下 `Priority` 全部不同，那么 `Treap` 的形态就是完全确定的。\
因为 `Priority` 最大的节点就是根，其左右子树（根据二叉搜索树的规则定的子树）中又有唯一的 `Priority` 最大的节点。\
因此每一个 `Priority` 序列对应了一个搜索树的形态。

在实现中，我们一般将 `Priority` 设为随机。

#### 无旋 Treap

很多平衡树都有“旋转”这一操作，但是 FHQ Treap 是无旋的平衡树，那么不用旋转它怎么维护性质和平衡呢？

FHQ Treap 有两个独特的操作：

- `SPLIT u val`，把 $u$ 及 $u$ 的子树按照 $\text{val}$ 分裂成两颗树，第一颗包含所有值小于等于 $\text{val}$ 的节点，两棵树都满足 FHQ Treap 的要求（即 `Priority/Value` 的性质）。
- `MERGE u v`，将 $u,v$ 两颗子树合成一个。条件：$u$ 子树的所有节点的值都小于 $v$ 子树。
- （附加操作，可不用）`SPLITSIZE u size`，把 $u$ 分裂成两个子树，其中第一个子树的大小为 $\text{size}$，且第一个子树的所有节点的值均小于第二个。两棵树都满足 FHQ Treap 的要求

有了这三个操作，就可以实现上述所有平衡树的六大操作了：

- `INSERT u`，我们应该先将小于 $u$ 和大于 $u$ 的分裂出来，然后加上新节点合并回去。
- `REMOVE u`，同上，只是分裂后把小于和大于的合并进去即可，不合并要删除的节点也就是删除了。
- `RANK u` 分裂，把所有小于 $u$ 的节点分裂出来，分裂出的树的大小 $+1$ 就是排名。
- `KTH u` 将最小的 $u - 1$ 个节点通过 `SPLITSIZE` 分裂出来，再将剩下的树的最小的 $1$ 个节点 `SPLITSIZE` 出来。
- `PREV u`，将小于 $u$ 的所有节点分裂出来，分裂出来之后再将最大的节点分裂出来。
- `NEXT u`，将大于 $u$ 的所有节点分裂出来，分裂出来之后再将最小的节点分裂出来。

最后四个操作也可以直接用二叉搜索树上查找。

注意 `INSERT` 不能直接 `MERGE 新节点 原来的根`，因为不满足 `MERGE` 的条件。

#### 实现及复杂度证明

六大操作均为常数次的 `SPLIT` 和 `MERGE`，因此只需证明这两个操作的复杂度即可。

##### 分裂操作

递归实现如下：

```c
std::pair<int, int> Split(int u, int val) {
	if (!u) return std::make_pair(0, 0);

	if (T[u].Value <= val) {
		std::pair<int, int> Res(Split(T[u].RSon, val));
		T[u].RSon = Res.first;
		return Pushup(u), std::make_pair(u, Res.second);
	} else {
		std::pair<int, int> Res(Split(T[u].LSon, val));
		T[u].LSon = Res.second;
		return Pushup(u), std::make_pair(Res.first, u);
	}
}
```

其中的 `Pushup` 是从两个直接的儿子算出来本身的 `Size`，即：\
$\text{Size}(u) \gets \text{Size}(u\to\texttt{lson}) + 1 + \text{Size}(u \to \texttt{rson})$；

大概意思就是如果 $\text{val}$ 在 $u$ 的左子树，那么递归到左子树分裂；\
否则在右子树分裂。平平无奇的 $\mathcal{O}(h)$ 单递归。

另外的 `SplitSize`：

```c
std::pair<int, int> SplitSize(int u, int size) {
	if (!u) return std::make_pair(0, 0);

	int leftsize = T[T[u].LSon].Info.Size;
	if (size <= leftsize) {
		std::pair<int, int> Res(SplitSize(T[u].LSon, size));
		T[u].LSon = Res.second;
		return Pushup(u), std::make_pair(Res.first, u);
	} else {
		std::pair<int, int> Res(SplitSize(T[u].RSon, size - leftsize - 1));
		T[u].RSon = Res.first;
		return Pushup(u), std::make_pair(u, Res.second);
	}
}
```

基本类似，只是对 `Value` 的检查变成了对 `T[T[u].LSon].Size` 的检查。

##### 合并操作

```c
int Merge(int u, int v) {
	if (!u || !v) return u + v;

	if (T[u].RandVal < T[v].RandVal) {
		T[v].LSon = Merge(u, T[v].LSon);
		return Pushup(v), v;
	} else {
		T[u].RSon = Merge(T[u].RSon, v);
		return Pushup(u), u;
	}
}
```

同样是单递归，$\mathcal{O}(h)$，因为保证了 $\forall A_u < \forall A_v$，所以很简单。

因此，`FHQ Treap` $q$ 次操作的复杂度便是 $\mathcal{O}(qh)$，$h$ 是树高。

### 例题 $I$

#### P3369,P6136 平衡树模板

直接做即可：

```cpp
#include <bits/stdc++.h>

std::mt19937 rnd(time(0));

struct treap {
	int val, cnt, siz, pri;
	treap *son[2];
	
	treap(int v=0) {
		val = v, cnt = siz = 1;
		son[0] = son[1] = nullptr;
		pri = (rnd() % 100 + 100) % 100;
	}
	
	void pushup() {
		siz = cnt;
		if (son[0]) siz += son[0]->siz;
		if (son[1]) siz += son[1]->siz;
	}
	
	typedef std::tuple<treap*, treap*, treap*> SPLITRES;
	SPLITRES split(int value) {
		if (val == value) {
			treap* a = son[0], *b = son[1];
			son[0] = son[1] = nullptr, pushup();
			return std::make_tuple(a, this, b);
		} else if (val < value) {
			if (!son[1]) {
				return std::make_tuple(this, nullptr, nullptr);
			} else {
				SPLITRES tmp = son[1]->split(value);
				son[1] = std::get<0>(tmp), pushup();
				return std::make_tuple(this, std::get<1>(tmp), std::get<2>(tmp));
			}
		} else {
			if (!son[0]) {
				return std::make_tuple(nullptr, nullptr, this);
			} else {
				SPLITRES tmp = son[0]->split(value);
				son[0] = std::get<2>(tmp), pushup();
				return std::make_tuple(std::get<0>(tmp), std::get<1>(tmp), this);
			}
		}
	}
	
	SPLITRES splitrank(int rank) {
		if (rank > siz) return std::make_tuple(this, nullptr, nullptr);
		int leftsize = 0;
		if (son[0]) leftsize = son[0]->siz;
		if (rank <= leftsize) {
			SPLITRES tmp = son[0]->splitrank(rank);
			son[0] = std::get<2>(tmp), pushup();
			return std::make_tuple(std::get<0>(tmp), std::get<1>(tmp), this);
		} else if (rank <= leftsize + cnt) {
			treap *a = son[0], *b = son[1];
			son[0] = son[1] = nullptr, pushup();
			return std::make_tuple(a, this, b);
		} else {
			SPLITRES tmp = son[1]->splitrank(rank - leftsize - cnt);
			son[1] = std::get<0>(tmp), pushup();
			return std::make_tuple(this, std::get<1>(tmp), std::get<2>(tmp));
		}
	}
	
	static treap* merge(treap *x, treap *y) {
		if (!x) return y;
		if (!y) return x;
		if (x->pri < y->pri) { // y goes onto x
			y->son[0] = treap::merge(x, y->son[0]);
			y->pushup();
			return y;
		} else {
			x->son[1] = treap::merge(x->son[1], y);
			x->pushup();
			return x;
		}
	}
	
	void printree(std::string tab) {
		std::cout << tab << "Treap(" << val << ", " << pri << " [" << cnt << ", " << siz << "])" << std::endl;
		if (son[0]) son[0]->printree(tab + "  L:");
		if (son[1]) son[1]->printree(tab + "  R:");
	}
} *root;

signed main() {
	int operates;
	std::cin >> operates;
	
	for (int i = 1; i <= operates; i++) {
//		std::cout << "Operate " << i << ": ";
		std::string opr; std::cin >> opr;
		
		if (opr == "1") {
			int x; std::cin >> x;
			if (!root) {
				root = new treap(x);
			} else {
				auto res = root->split(x);
				treap *a = std::get<0>(res);
				treap *b = std::get<1>(res);
				treap *c = std::get<2>(res);
				if (b) b->cnt += 1, b->siz += 1;
				else b = new treap(x);
				root = treap::merge(a, b);
//				if (root) root->printree(std::to_string(i) + " >> ");
				root = treap::merge(root, c);			
			}
		} else if (opr == "2") {
			int x; std::cin >> x;
			if (!root) {
				std::cerr << "[Remove] There's no " << x << " exists in the tree.\n";
			} else {
				auto res = root->split(x);
				treap *a = std::get<0>(res);
				treap *b = std::get<1>(res);
				treap *c = std::get<2>(res);
				if (!b || b->cnt == 1) b = nullptr;
				else b->cnt -= 1, b->siz -= 1;
				root = treap::merge(a, b);
				root = treap::merge(root, c);
			}
		} else if (opr == "3") {
			int x; std::cin >> x;
			if (!root) {
				std::cout << "1\n";
			} else {
				auto res = root->split(x);
				treap *a = std::get<0>(res);
				if (a) std::cout << a->siz + 1 << "\n";
				else std::cout << "1\n";
				root = treap::merge(a, std::get<1>(res));
				root = treap::merge(root, std::get<2>(res));
			}
		} else if (opr == "4") {
			int x; std::cin >> x;
			if (!root) {
				std::cout << "-1\n";
			} else {
				auto res = root->splitrank(x);
				std::cout << std::get<1>(res)->val << "\n";
				root = treap::merge(std::get<0>(res), std::get<1>(res));
				root = treap::merge(root, std::get<2>(res));
			}
		} else if (opr == "6") {
			int x; std::cin >> x;
			if (!root) {
				std::cout << "-1\n";
			} else {
				auto res = root->split(x);
				treap *c = std::get<2>(res);
				while (c->son[0]) c = c->son[0];
				std::cout << c->val << "\n";
				root = treap::merge(std::get<0>(res), std::get<1>(res));
				root = treap::merge(root, std::get<2>(res));
			}
		} else if (opr == "5") {
			int x; std::cin >> x;
			if (!root) {
				std::cout << "-1\n";
			} else {
				auto res = root->split(x);
				treap *c = std::get<0>(res);
				while (c->son[1]) c = c->son[1];
				std::cout << c->val << "\n";
				root = treap::merge(std::get<0>(res), std::get<1>(res));
				root = treap::merge(root, std::get<2>(res));
			}
		}
		
//		if (root) root->printree(std::to_string(i) + " >> ");
	}
	
	return 0;
}
```

#### P1533 平衡树+莫队

[莫队学习笔记](/articles/mo-algo)；

本题由于特殊的性质，非常适合莫队。

留给平衡树的是：全局插入/删除，第 $k$ 小。变板子了。

```cpp
#include <bits/stdc++.h>
#define int int64_t

const int N = 1048576;

std::mt19937 Rnd(912);

class FHQTreap {
	public:
		int Value, Size;
		int LSon, RSon;
		int RandVal;

		FHQTreap() {
			Value = Size = 0;
			LSon = RSon = 0;
			RandVal = 912;
		}

		FHQTreap(int V) {
			Value = V;
			Size = 1;
			LSon = RSon = 0;
			RandVal = Rnd();
		}
} T[N];

void Pushup(int u) {
	T[u].Size = 1 + T[T[u].LSon].Size + T[T[u].RSon].Size;
}

std::pair<int, int> Split(int u, int val) {
	if (!u) return std::make_pair(0, 0);

	if (T[u].Value <= val) {
		std::pair<int, int> Res(Split(T[u].RSon, val));
		T[u].RSon = Res.first;
		return Pushup(u), std::make_pair(u, Res.second);
	} else {
		std::pair<int, int> Res(Split(T[u].LSon, val));
		T[u].LSon = Res.second;
		return Pushup(u), std::make_pair(Res.first, u);
	}
}

int Merge(int u, int v) {
	if (!u || !v) return u + v;

	if (T[u].RandVal < T[v].RandVal) {
		T[v].LSon = Merge(u, T[v].LSon);
		return Pushup(v), v;
	} else {
		T[u].RSon = Merge(T[u].RSon, v);
		return Pushup(u), u;
	}
}

std::pair<int, int> SplitSize(int u, int size) {
	if (!u) return std::make_pair(0, 0);

	if (size <= T[T[u].LSon].Size) {
		std::pair<int, int> Res(SplitSize(T[u].LSon, size));
		T[u].LSon = Res.second;
		return Pushup(u), std::make_pair(Res.first, u);
	} else {
		std::pair<int, int> Res(SplitSize(T[u].RSon, size - T[T[u].LSon].Size - 1));
		T[u].RSon = Res.first;
		return Pushup(u), std::make_pair(u, Res.second);
	}
}

void Traverse(int p) {
	if (!p) return;
	if (T[p].LSon) Traverse(T[p].LSon);
	std::cout << T[p].Value << " ";
	if (T[p].RSon) Traverse(T[p].RSon);
} 

class Set {
	private:
		int Root, nodeCnt;
	
	public:
		Set() {
			Root = 0;
			nodeCnt = 0;
		}

		void Insert(int Value) {
			if (!Root) {
				Root = ++nodeCnt;
				T[Root] = FHQTreap(Value);
			} else {
				std::pair<int, int> Q(Split(Root, Value));
				int Node = ++nodeCnt;
				T[Node] = FHQTreap(Value);
				Root = Merge(Q.first, Merge(Node, Q.second));
			}
		}

		void Remove(int Value) {
			std::pair<int, int> Q(Split(Root, Value));
			std::pair<int, int> Q2(Split(Q.first, Value - 1));
			Root = Merge(Q2.first, Q.second);
		}

		int Query(int rank) {
			std::pair<int, int> Q(SplitSize(Root, rank - 1));
			std::pair<int, int> Q2(SplitSize(Q.second, 1));
			Root = Merge(Q.first, Merge(Q2.first, Q2.second));
			return T[Q2.first].Value;
		}

		int Size() {
			return T[Root].Size;
		}

		void PrintSet() {
			Traverse(Root);
			std::cout << std::endl;
		}
} GlobalSet;

class Question {
	public:
		int l, r, id, Rank;

		bool operator<(const Question& A) const& {
			if (l != A.l)
				return l < A.l;
			return r < A.r;
		}
};

int n, q, l, r, A[N];
Question Range[N];
int Ans[N];

int GlobalL, GlobalR;

signed main() {
	std::cin.tie(nullptr);
	std::cin.sync_with_stdio(false);

	std::cin >> n >> q;
	for (int i = 1; i <= n; i++)
		std::cin >> A[i];
	
	for (int i = 1; i <= q; i++)  {
		std::cin >> Range[i].l >> Range[i].r >> Range[i].Rank;
		Range[i].id = i;
	}
	
	std::sort(Range + 1, Range + q + 1);

	GlobalL = Range[1].l;
	GlobalR = Range[1].r;

	for (int i = GlobalL; i <= GlobalR; i++)
		GlobalSet.Insert(A[i]);
	
	Ans[Range[1].id] = GlobalSet.Query(Range[1].Rank);
	for (int i = 2; i <= q; i++) {
		while (GlobalL < Range[i].l) GlobalSet.Remove(A[GlobalL]), GlobalL += 1;
		while (GlobalR < Range[i].r) GlobalR += 1, GlobalSet.Insert(A[GlobalR]);
		Ans[Range[i].id] = GlobalSet.Query(Range[i].Rank);
	}	

	for (int i = 1; i <= q; i++)	
		std::cout << Ans[i] << "\n";

	return 0;
}
```

~~未完待续。。。~~

你将如闪电般归来！

### 替代线段树

动态开点权值线段树一度替代了平衡树——平衡树的六大操作都可以用线段树解决。

那么平衡树能不能做线段树的题呢？当然可以！

#### FHQ Treap 的区间操作

区间操作后，我们自然不能再沿用二叉搜索树的那一套；

就像动态开点权值线段树一样，所以我们不再维护二叉搜索树的规则，连原先的权值也去掉。

对例题理解：[P3850 [TJOI2007] 书架](https://www.luogu.com.cn/problem/P3850)

题目大意：维护一个支持任意位置插入，任意位置读取的数据结构。

显然本题我们不能再维护二叉搜索树的东西了——甚至可供比较的权值都不存在。

那么自然也没有办法 `SPLIT u val`，取而代之的是 `SPLITSIZE u size`；

`MERGE` 不受权值影响，因此仍然可以使用。

我们考虑用 FHQ Treap 的**中序遍历**维护序列。

当插入到 $\text{index}$ 位置的时候，前面 $\text{index} - 1$ 个元素 `SPLITSIZE` 出来，然后全部 `MERGE`。

我们神奇的发现：如果把排名当做下标的话，此时就成功在 $\mathcal{O}(\log n)$ 复杂度内插入了一个元素。

于是那么这道题我们就做完了。

```cpp
#include <bits/stdc++.h>
#define int int64_t

const int N = 262144;

std::mt19937 Rnd(20250912);

class FHQTreap {
	public: int LSon, RSon;
	public: int Size, Priority;
	public: std::string Value;

	public: FHQTreap() {
		LSon = RSon = 0;
		Size = Priority = 0;
		Value = "";
	}

	public: FHQTreap(std::string V) {
		LSon = RSon =0 ;
		Size = 1;
		Priority = Rnd();
		Value = V;
	}
} T[N];

void Pushup(int u) {
	T[u].Size = T[T[u].LSon].Size + 1 + T[T[u].RSon].Size;
}

int Merge(int u, int v) {
	if (!u || !v) return u + v;
	
	if (T[u].Priority < T[v].Priority) {
		T[v].LSon = Merge(u, T[v].LSon);
		return Pushup(v), v;
	} else {
		T[u].RSon = Merge(T[u].RSon, v);
		return Pushup(u), u;
	}
}

std::pair<int, int> SplitSize(int u, int size) {
	if (!u) return std::make_pair(0, 0);

	int ls = T[T[u].LSon].Size;
	if (size <= ls) {
		std::pair<int, int> Res(SplitSize(T[u].LSon, size));
		T[u].LSon = Res.second;
		return Pushup(u), std::make_pair(Res.first, u);
	} else {
		std::pair<int, int> Res(SplitSize(T[u].RSon, size - ls - 1));
		T[u].RSon = Res.first;
		return Pushup(u), std::make_pair(u, Res.second);
	}
}

void Print(int root) {
	if (T[root].LSon) Print(T[root].LSon);
	std::cout << T[root].Value << " ";
	if (T[root].RSon) Print(T[root].RSon);
}

class Treap {
	private: int root, nodecnt;
	public: Treap() {
		root = 0;
		nodecnt = 0;
	}

	public: int Size() { return T[root].Size; }

	public: void Insert(std::string Value, int Index) {
		if (!root) {
			root = ++nodecnt;
			T[root] = FHQTreap(Value);
		} else {
			std::pair<int, int> Res(SplitSize(root, Index));
			int newnode = ++nodecnt;
			T[newnode] = FHQTreap(Value);
			root = Merge(Res.first, Merge(newnode, Res.second));
		}
	}

	public: std::string Query(int Index) {
		std::pair<int, int> Res(SplitSize(root, Index));
		std::pair<int, int> Ans(SplitSize(Res.second, 1));
		std::string RealAns(T[Ans.first].Value);
		root = Merge(Res.first, Merge(Ans.first, Ans.second));
		return RealAns;
	}

	public: void Traverse() {
		Print(root);
		std::cout << ";\n";
	}
} Set;

int n, m, q, pos;
std::string X;

signed main() {
	std::cin.tie(nullptr);
	std::cin.sync_with_stdio(false);

	std::cin >> n;
	for (int i = 1; i <= n; i++) {
		std::cin >> X;
		Set.Insert(X, Set.Size());
	}

	// Set.Traverse();
	std::cin >> m;
	for (int i = 1; i <= m; i++) {
		std::cin >> X >> pos;
		Set.Insert(X, pos);
	}

	std::cin >> q;
	for (int i = 1; i <= q; i++) {
		std::cin >> pos;
		std::cout << Set.Query(pos) << "\n";
	}

	return 0;
}
```

FHQ Treap 的区间操作的精髓就是 **排名即下标**，无论 Treap 的结构怎么变，**中序遍历永不变**。

因此中序遍历就是序列，区间 `SPLITSIZE` 即可。

准备替代线段树（滑稽）。

伏笔回收：`Pushup(u)` 这个直接借用 `Segmentree` 的名词。

`Pushup(u)` 能 Pushup Size 自然也能 Pushup 别的。上例题！

#### [P1110 [ZJOI2007] 报表统计](https://www.luogu.com.cn/problem/P1110)

题意：你需要支持一个数据结构，单点插入，全局查询 `MIN_GAP` 和 `MIN_SORTED_GAP`；

- `MIN_GAP` 最小的相邻两个元素的差（绝对值）；
- `MIN_SORTED_GAP` 最小的任意两个元素的差（绝对值）；
- `INSERT u idx` 任意位置插入。

`MIN_SORTED_GAP` 这个感觉貌似很难维护，但是不难发现如果只是插入的话 `MIN_SORTED_GAP` 只减不加。因此全局维护一个 `std::set`，每次插入一个数的时候访问比她小的最大的和比她大的最小的元素，更新全局答案即可。

伏笔回收：`Pushup(u)` 中本题维护 `last, first`(用于计算 `min-gap`) 和 `min-gap`。

Pushup 函数：

```c
class TreapInfo {
	public: int Size;
	public: int First, Last;
	public: int MinGap;

	...

	public: TreapInfo operator+(const TreapInfo& O) const& {
		if (Size == 0) return O;
		if (O.Size == 0) return (*this);

		TreapInfo Res;
		Res.Size = Size + O.Size;
		Res.First = First;
		Res.Last = O.Last;
		Res.MinGap = std::min(MinGap, O.MinGap);
		Res.MinGap = std::min(Res.MinGap, std::abs(Last - O.First));
		return Res;
	}
};
...

void Pushup(int u) {
	T[u].Info = T[T[u].LSon].Info;
	T[u].Info = T[u].Info + TreapInfo(T[u].Value);
	T[u].Info = T[u].Info + T[T[u].RSon].Info;
}
```

和线段树非常相似，只不过多了一个根节点需要合并信息。

这个完了之后基本这题就没啥难点了。

就算是区间查询 `MIN-GAP` 我们也能做，快出加强版（滑稽）

```cpp
#include <bits/stdc++.h>
#define int int64_t

const int N = 1048576;
const int INF = 1ll << 55;

class TreapInfo {
	public: int Size;
	public: int First, Last;
	public: int MinGap;

	public: TreapInfo() {
		Size = 0;
		First = Last = INF;
		MinGap = INF;
	}

	public: TreapInfo(int V) {
		First = Last = V;
		MinGap = INF;
		Size = 1;
	}

	public: TreapInfo operator+(const TreapInfo& O) const& {
		if (Size == 0) return O;
		if (O.Size == 0) return (*this);

		TreapInfo Res;
		Res.Size = Size + O.Size;
		Res.First = First;
		Res.Last = O.Last;
		Res.MinGap = std::min(MinGap, O.MinGap);
		Res.MinGap = std::min(Res.MinGap, std::abs(Last - O.First));
		return Res;
	}
};

std::mt19937 Rnd(20250912);

class TreapNode {
	public: int LSon, RSon;
	public: int Value;
	public: TreapInfo Info;
	public: int Priority;

	public: TreapNode() {
		LSon = RSon = 0;
		Priority = Rnd(); 
		Value = INF;
		Info = TreapInfo();
	}

	public: TreapNode(int val) {
		Value = val;
		Info = TreapInfo(val);
		Priority = Rnd();
		LSon = RSon = 0;
	}
} T[N];

int root, nodecnt;

void Pushup(int u) {
	T[u].Info = T[T[u].LSon].Info;
	T[u].Info = T[u].Info + TreapInfo(T[u].Value);
	T[u].Info = T[u].Info + T[T[u].RSon].Info;
}

std::pair<int, int> SplitSize(int u, int size) {
	if (!u) return std::make_pair(0, 0);

	int leftsize = T[T[u].LSon].Info.Size;
	if (size <= leftsize) {
		std::pair<int, int> Res(SplitSize(T[u].LSon, size));
		T[u].LSon = Res.second;
		return Pushup(u), std::make_pair(Res.first, u);
	} else {
		std::pair<int, int> Res(SplitSize(T[u].RSon, size - leftsize - 1));
		T[u].RSon = Res.first;
		return Pushup(u), std::make_pair(u, Res.second);
	}
}

int Merge(int u, int v) {
	if (!u || !v) return u + v;

	if (T[u].Priority < T[v].Priority) {
		T[v].LSon = Merge(u, T[v].LSon);
		return Pushup(v), v;
	} else {
		T[u].RSon = Merge(T[u].RSon, v);
		return Pushup(u), u;
	}
}

int n, q;
int A[N], Fw[N];

void FwModify(int pos, int val) {
	for (; pos <= n; pos += pos & -pos)
		Fw[pos] += val;
}

int FwQuery(int pos) {
	int sum = 0;
	for (; pos; pos -= pos & -pos)
		sum += Fw[pos];
	return sum;
}

void PrintTreap(int root) {
	if (!root) return ;
	PrintTreap(T[root].LSon);
	std::cerr << T[root].Value << " ";
	PrintTreap(T[root].RSon);
}

std::multiset<int> Set1;
int migap = INF;

void PrintOut() {
	std::cerr << "----(Tree)----;\n";
	PrintTreap(root);
	std::cerr << ";\nMin Sorted Gap: " << migap << ";\n";
	std::cerr << "Min Gap: " << T[root].Info.MinGap << ";\n"; 
}

signed main() {
	std::cin.tie(nullptr);
	std::cin.sync_with_stdio(false);

	auto Insert = [] (int x, int y) {
		// std::cerr << "----(INSERT " << x << ", " << y << ")----;\n";
		// for (auto i : Set1) std::cerr << i << " ";
		// std::cerr << ";\n";

		auto X = Set1.insert(y);

 		if (X != Set1.begin()) 
			migap = std::min(migap, y - *std::prev(X));
		auto Nxt = std::next(X);
		if (Nxt != Set1.end())
			migap = std::min(migap, *Nxt - y);
		
		if (!root) {
			root = ++nodecnt;
			T[root] = TreapNode(y);
		} else {
			std::pair<int, int> Res(SplitSize(root, x - 1));
			int newnode = ++nodecnt;
			T[newnode] = TreapNode(y);
			root = Merge(Res.first, Merge(newnode, Res.second));
		}
	};

	std::cin >> n >> q;
	for (int i = 1; i <= n; i++) {
		std::cin >> A[i];
		FwModify(i, 1);
		Insert(FwQuery(i), A[i]);
	}

	// PrintOut();

	while (q -- ) {
		std::string opr;
		std::cin >> opr;

		if (opr == "MIN_SORT_GAP") {
			std::cout << migap << "\n";
		} else if (opr == "MIN_GAP") {
			std::cout << T[root].Info.MinGap << "\n";
		} else {
			int x, y;
			std::cin >> x >> y;
			FwModify(x, 1);
			Insert(FwQuery(x), y);
		}
	}

	return 0;
}
```




