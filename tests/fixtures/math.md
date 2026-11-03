---
layout: post
title: MathJax rendering checks
description: Inline, display, numbered, wide, and extended-font equations.
date: TEST_PUBLISHED_AT
permalink: /test-math
usemathjax: true
comments: false
---

Inline math: $$x^2 + y^2 = z^2$$.

$$
\frac{1}{2} + \alpha
$$

$$
\begin{equation}
E=mc^2
\end{equation}
$$

<div id="wide-equation" markdown="1">

$$
\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6} = \frac{2n^3+3n^2+n}{6} = \frac{n^3}{3}+\frac{n^2}{2}+\frac{n}{6}
$$

</div>

<div id="dynamic-font-equation" markdown="1">

$$
\mathbb{R} \subset \mathbb{C}
$$

</div>

```tex
$$ x^2 $$
\begin{equation} literal \end{equation}
```

Inline code: `\(x^2\)` and `$5.00` stay literal.

