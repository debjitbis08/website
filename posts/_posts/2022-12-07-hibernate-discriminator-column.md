---
layout: post
title: Gotchas while using @DiscriminatorColumn
---

Here are a few things to keep in mind when using `@DiscriminatorColumn`

1. If you have used this annotation then Hibernate will automatically use the `@DiscriminatorValue` value from the child classes to fill the column value.
2. Do not define the discriminator column as a regular class property. This will cause Hibernate to consider it a new column and you will see errors like `The column index is out of range: n, number of columns: m.`.

Cheers
