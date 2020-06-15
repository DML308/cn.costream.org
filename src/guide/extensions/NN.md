---
title: 神经网络层
type: guide
order: 42

---
## sequential结构

### sequential文法

为了便于在COStream中快速构建深度学习中前馈神经网络的训练程序，引入sequential结构，它基于顺序模型描述神经网络的架构。

sequential的结构主要由sequential的头部和sequential的主体组成，BNF表示如：
```
sequentialHead	::= ID '=' 'sequential' '(' streamID +, ')' '(' expr* ')'

sequentialBody	::='{'
                        layerStmts+
                    '}'

layerStmt ::= 'add' layerID '(' expr* ')' ';'

layerStmts ::= layerStmt 'add' layerID '(' expr* ')' ';'
             | layerStmt;
```

sequential的头部包括两个部分：第一部分是训练模型时的输入流列表，列表中依次是由训练数据集、训练标签集构成的数据流；第二部分是模型的训练参数列表，编译器将按照1.输入数据的大小,2.学习率,3.批量数,4.损失函数,5.参数初始化方法的顺序解析列表中的参数。

sequential的主体内是操作语句，主要通过add操作符确定顺序模型内神经网络层线性堆叠的顺序。

如

```
stream<double x> res, data, label;

res = sequential (data, label) (input_shape, learning_rate, batch_size,loss，initializer) {
  add layerID1(…);
  add layerID2(…);
  add layerID3(…);
};
```

目前sequential结构中，支持的神经网络层类型，及其支持的参数项如下表：

|神经网络层类型| layerID | 参数项 | 备注 |
| --- | --- | --- | --- | 
| 全连接层 | Dense | units, use_bias | units为整数; use_bias为0或1; |
| 二维卷积层 | Conv2D | filters, kernel_size, strides, use_bias | filters为整数; kernel_size、 strides为整数或2个整数表示的元组; use_bias为0或1; | 
| 二维最大池化层 | MaxPooling2D | pool_size | pool_size为整数 |
| 二维平均池化层 | AveragePooling2D | pool_size | pool_size为整数 |
| 激活层 | Activation |  activation | activation为字符串，目前仅支持 "relu", "sigmoid", "softmax" |
| Dropout层 | Dropout | rate | rate为区间(0, 1]内的浮点数 |

目前sequential结构中，支持的训练参数项的值如下表：

| 训练参数项 | 值 | 备注 |
| --- | --- | --- |
| input_shape | 整数 或 3个整数表示的元组 | 元组内数据格式遵循channel_last原则 |
| learning_rate | 浮点数 | 浮点数的区间为(0, 1] |
| batch_size | 整数 | 必须设置batch_size大于编译器划分后的阶段数 |
| loss | 字符串 | 目前仅支持"variance"(默认值), "crossEntropy" |
| initializer | 浮点数或字符串或元组 | 支持将模型内所有参数初始化为设置的浮点数，默认初始化为0；支持按照默认值调用字符串所表示的方法；支持按照指定值调用初始化方法，例('gaussRandom', 0, 1),元组内第一项为方法名，其余项为调用时参数；|

### sequential结构展开后的数据流图

sequential结构用于描述前馈神经网络的架构，COStream编译器在编译过程中将其展开成数据流图。对于一个具有2个layer的sequential结构，其展开后的数据流图如下图：

![PART-NN-1.png](https://i.loli.net/2020/06/15/l1j67f5SmIRUKt2.png)

训练数据集构成的数据流data，经过copy计算节点复制后，生成2条相同的输出流，分别传递给layer1在正向传播和反向传播中对应的计算节点FComp1和BComp1。正向传播过程中，每一层的计算结果逐层正向传递。因此FComp1的输出流将流向layer2在正向传播对应的计算节点FComp2。layer2是模型中的最后一层，其计算结果即为模型的预测值。预测值与标签集数据流流向lossComp计算节点，计算出损失函数关于预测值的梯度。在反向传播过程中，损失函数关于每一层输入的梯度逐层反向传递，该梯度依赖于反向传入的梯度和计算Jaccobian矩阵所需的数据。因此lossComp和FComp1的输出流均流向layer2在反向传播中对应的计算节点BComp2，同理BComp2的输出流和data均流向BComp1，最终BComp1输出损失函数关于训练数据的梯度。

### sequential结构的编译方法

COStream编译sequential结构的流程图如下图：
![PART-NN-2.png](https://i.loli.net/2020/06/15/c21vtCBr3oPIAya.png)

源程序经过词、语法分析得到一棵语法生成树，sequential结构以sequentialNode节点保存在该语法树中。在数据流图展开的过程中，从Main Composite遍历整棵语法树，当遍历到类型为Sequential的节点时，构建一个新的compositeNode，该compositeNode的主体内是模型的训练过程。
为了实现上述compositeNode的主体，首先通过双向链表构建层上下文，在获得层上下文后，才能进一步根据layer的配置参数，顺序地对每一层layer初始化。对于包含参数的layer，如全连接层、卷积层，以全局的多维数组声明其权值矩阵。接着按照下一章节即将介绍的生成layer对应的正向、反向计算节点的方法，顺序遍历sequentialNode中的layerNode列表，逐层生成正向计算节点，然后根据训练参数中的loss参数项，生成loss计算节点，再逆序遍历layerNode列表，逐层生成反向计算节点。对于重复使用到的数据流，编译器将生成copy计算节点对其进行复制。因此上述正向、反向计算节点只需考虑计算本身，而不需要考虑数据的流向，最后由编译器根据预期的数据流图，声明一系列数据流连接上述计算节点。如此得到compositeNode的主体，主体内是数据流的声明语句与计算节点的调用语句。
用得到的compositeNode替换语法生成树中的sequentialNode，完成sequential结构的展开过程，接下来由COStream编译器将语法树转化为静态数据流图即可。

### 生成layer对应的计算节点的方法

经初始化后的layerNode中已经保存了充足的信息，可以确定layer在正向、反向传播中对应的计算，因此可以由编译器生成相关计算节点，但是需要充分挖掘计算中的并行性，生成粒度合适的计算节点。

#### 全连接层

对于正向传播，全连接层中的神经元之间不存在数据依赖关系，因此可以将计算以单个神经元为单位拆分成与全连接层内神经元数量一致的子计算，并且利用splitjoin结构实现数据并行，假设该全连接层中的神经元数量为n，可以得到如下图所示的数据流图：
![PART-NN-3-1.png](https://i.loli.net/2020/06/15/fDzr4VtgE2mlvoq.png)

对于反向传播，同样可以将计算拆分成多个子计算，子计算的数量与全连接层上一层中神经元数量一致，假设该全连接层中的神经元数量为m，由于子计算依赖多个数据流，因此由编译器生成special_spit(roundrobin)和special_spit(duplicate)，分别用于对正向输入流切片和对反向输入流复制，并分发给m个子计算节点，最后由生成的special_join合并数据，可以得到如下图所示的数据流图：
![PART-NN-3-2.png](https://i.loli.net/2020/06/15/brunOXTcRZAPLSq.png)

#### 卷积层

对于正向传播，卷积层中的每个卷积核上的卷积运算之间不存在数据依赖关系，因此可以将计算以拆分成与卷积层内卷积核数量一致的子计算，并且利用splitjoin结构实现数据并行，假设卷积核数量为3，可以得到如下图所示的数据流图：
![PART-NN-3-3.png](https://i.loli.net/2020/06/15/hwKRkysHYP6gj4v.png)

对于反向传播，计算并输出损失函数关于输入各通道上的数据的梯度，由于各通道上的计算之间不存在数据依赖，存在数据并行。假设卷积层中卷积核的通道数为3，则在计算节点内，反向输入流先流入负责对其进行膨胀和扩展的计算节点，再由编译器生成两个special_spit(duplicate)，分别用于对正向输入流和经膨胀和扩展的反向输入复制，并分发给3个单通道上卷积运算的计算节点，可以得到如下图所示的数据流图：
![PART-NN-3-4.png](https://i.loli.net/2020/06/15/CwrNZbMluk2iPU5.png)

#### 池化层

对于正向传播，池化层中每个输入通道上的池化运算之间不存在数据依赖关系，因此可以将计算以拆分成与输入通道数数量一致的子计算，并且利用splitjoin结构实现数据并行，假设输入通道数数量为3，可以得到如下图所示的数据流图：
![PART-NN-3-5.png](https://i.loli.net/2020/06/15/6nFhYZr4JD9Oiol.png)

对于反向传播，计算并输出损失函数关于输入各通道上的数据的梯度，由于各通道上的计算之间不存在数据依赖，存在数据并行。假设该池化层中输入数据的通道数是3，则计算节点内，由编译器生成两个special_spit(roundrobin)，分别用于对正向输入流和反向输入切片，并分发给3个单通道上池化运算的计算节点，可以得到如下图所示的数据流图：
![PART-NN-3-6.png](https://i.loli.net/2020/06/15/MFdv7N41VwsczOC.png)

### 组内同步组件异步的参数更新方法

为便于说明软件流水线并行执行过程，假设COStream编译器将图1所示的数据流图中的计算节点，按照从正向传播到反向传播过程中的执行顺序，依次划分到独立的A~E阶段。阶段间的数据依赖关系如下：A阶段不依赖其他阶段，B阶段依赖于A阶段，C阶段依赖于B阶段，D阶段依赖于C阶段，E阶段依赖于B阶段和D阶段，F阶段依赖于A阶段和E阶段。
下图展示了软件流水执行过程，某一阶段得到计算所需的所有数据才执行运算，能通过阶段差消除同一流水周期中不同阶段在并行执行时的耦合。因此在1~5流水周期中存在等待状态的阶段，这是流水线的填充过程，在第6~10流水周期所有的阶段都会被执行，这是流水线的稳态执行过程，在第11~15流水周期所有阶段逐步执行完毕，这是流水线的排空过程。
![PART-NN-4-1.png](https://i.loli.net/2020/06/15/4h5itgJLjBb7X19.png)
下图展示了软件流水执行过程中权值矩阵变量上的读写冲突。B、C 阶段中包含全连接层正向计算节点，其纹理代表访问的权值矩阵版本，E、F 阶段中包含全连接层反向计算节点，其纹理代表更新后的权值矩阵版本。由于权值矩阵以全局变量的形式保存在程序中，在第5个流水周期，C 阶段访问第二层全连接层的权值矩阵和E 阶段更新第二层全连接层的权值矩阵在不同线程上并行运行，造成C 阶段访问到初始的和第一次更新后的，两种版本的权值矩阵，得到错误的正向传播结果，造成本次训练迭代整体错误。因此只有方框圈出的第1、2次训练迭代，在正向传播中不存在访问多个版本的权值矩阵的问题。
![PART-NN-4-2.png](https://i.loli.net/2020/06/15/4dgqMtJ5kTsf3cp.png)
下图展示了组内同步组间异步更新参数的过程，设置训练模型的批量数是7，在第8、9流水周期，阶段B、C分别完成第一次批量迭代，因此在第9，10流水周期，阶段B、C分别开始访问另一组参数。在第11流水周期，阶段E更新第二层的权值矩阵时，其在正向传播过程对应的阶段C已经开始迭代训练另一组权值矩阵，不会出现权值参数版本不一致的问题。同理在第12流水周期，阶段F更新第一层的权值矩阵时，其在正向传播过程对应的阶段B也已经开始迭代训练另一组权值矩阵，不会出现权值参数版本不一致的问题。
![PART-NN-4-3.png](https://i.loli.net/2020/06/15/QPm9FAse4u3bjWc.png)

## 参考

[Keras的Sequential模型API](https://keras-zh.readthedocs.io/models/sequential/)
[卷积层反向传播中的计算](https://medium.com/@mayank.utexas/backpropagation-for-convolution-with-strides-8137e4fc2710)