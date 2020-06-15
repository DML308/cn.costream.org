---
title: 符号表 & 动态执行上下文
type: guide
order: 40

---
## 符号表

符号表是编译技术中的重要一项，用于存储标识符在源码中的信息。COStream中的符号表，不仅包含`变量`信息，还搜集`Stream`、`Composite`结构中包含的信息，来满足COStream在静态数据流图生成过程中对变量值、数据流类型和Composite参数等信息的读写需求，以此来实现`执行上下文`对Composite调用的模拟以及`常量传播`对变量的常量值的计算。

### 变量表

| 表项 | 存储信息 |
| :----- | :----- |
| 表项 | 存储信息 |
| Name | 变量名称 |
| Type | 变量数据类型 |
| Array | 变量是否是数组 |
| Value | 变量值 |

`Name`为变量名，其类型为string，作为红黑树的key值，用于查找变量；`Type`为变量的数据类型，其类型为字符串，用于在取值时根据数据类型来读取对应的常量值；`Array`用于标明此变量是否为数组，其类型为布尔类型；`Value`存储变量的常量值，其类型为Constant类，用于保存整型、浮点数、字符串、数组等不同数据类型的值，其结构如下：

| 成员变量 | 存储信息 |
| :----- | :----- |
| Type | 变量数据类型 |
| IntValue | 存储int类型的值 |
| LongValue | 存储long类型的值 |
| LongLongValue | 存储long long类型的值 |
| DoubleValue | 存储double类型的值 |
| FloutValue | 存储float类型的值 |
| StringValue | 存储string类型的值 |
| BooleanValue | 存储boolean类型的值 |

其中`Type`用于表明存储在Constant类中常量值的数据类型，在取值时根据数据类型来取得对应的常量值。`IntValue`、`LongValue`、`LongLongvalue`和`DoubleValue`等字段用于存储常量值，根据数据类型存储到相应的字段中。

变量表中数组的处理，与一般的数据类型不同，变量表中`Array`字段用来标识该变量是否是数组。当变量为数组时，`Value`使用继承于`Constant`类的`ArrayConstant`类来描述，其结构如下：

| 成员变量 | 存储信息 |
| :----- | :----- |
| Values | 存储数组中的值 |
| ArraySize | 存储数组每一维的大小 |

`Values`是一个类型为`Constant`的动态一维数组，用于存储数组中的值；`ArraySize`为一维数组，存储数组每一维的大小，用于将变量在多维数组中的下标转化为V`alues`一维数组中对应的下标。在处理数组声明语句时，数组维数大小信息被存储到`ArraySize`中，并为每一个初始值生成`Constant`对象添加到`Values`动态数组中。如果不存在初始化语句，则将`Values`数组的长度设置为数组总大小。

### Stream表

| 表项 | 存储信息 |
| :----- | :----- |
| Name | Stream名称 |
| RealName | 初始化为空，如果当前数据流为Composite结构的参数，RealName存储在调用，Composite时真正的数据流名。 |
| StreamType | 数据流中的数据类型 |

`Name`为数据流名称，类型为string；`RealName`类型为string，如果当前数据流为Composite结构的参数，`RealName`则存储Composite调用时数据流参数真正的数据流名，否则为空。`StreamType`存储数据流中数据的类型，为一个指针列表。因为数据流内部数据变量的声明实际存储在变量表中，所以通过指针来指向变量表中对应的变量。`StreamType`用于检测数据流使用的正确性。

### Composite表

| 表项 | 存储信息 |
| :----- | :----- |
| Name | Composite名称 |
| Streams | Composite中的参数数据流 |
| Parameters | Composite中的参数变量 |
| Count | 当前Composite被调用的次数 |

`Name`为Composite名，其类型为string；`Streams`储存Composite结构的数据流参数，其类型为指针列表，因为相关的数据流信息实际保存在Stream表中，所以通过指针指向Stream表中对应的数据流。`Streams`字段用于关联数据流参数和Composite调用时的实际输入输出数据流；`Parameters`保存Composite结构的参数列表，其类型为指针列表，因为相关的参数变量信息实际存储在变量表中，所以通过指针指向变量表中对应的变量。`Parameters`字段能够关联参数和实际调用Composite时传入的值，用于实现执行上下文的模拟；`Count`保存当前Composite被调用的次数，其类型为整数，用于区分多次调用同一个Composite时其内部声明的同名数据流。

## 执行上下文

编译过程都是一般静态的，但为了在静态数据流图生成过程中，明确计算节点的调用情况，需要对Composite调用进行分析，计算出Composite调用传入的参数信息。因此引入了程序运行时的执行上下文概念，在编译过程中模拟Composite的调用情况。

COStream中执行上下文保存两类信息，一类是Composite调用的`参数信息`，一类是`Composite的作用域`。参数信息保存Composite被调用时传入的参数以及输入输出数据流。Composite作用域保存当前Composite的作用域信息。本质上，执行上下文就是Composite调用时根据参数信息生成的作用域，其符号表的变量表保存Composite被调用时的参数信息，数据流表保存输入输出数据流信息。

每当遇到Composite调用都会`生成新的执行上下文`保存参数信息，执行上下文模拟的具体实现步骤如下：

1. 将上层执行上下文推入执行上下文栈中，生成新的执行上下文，并将指针running_top指向当前执行上下文。
2. 初始化执行上下文，保存当前Composite作用域。
3. 解析调用Composite传入的参数数值，得到参数所对应的值，保存在变量表中；解析传入的输入输出数据流，保存到Stream表中数据流参数所对应的RealStream字段中，指明数据流参数所对应的真实数据流。

在解析完当前Composite调用后，进行`执行上下文的回退操作`，包括：

1. 执行上下文栈出栈，得到上一层执行上下文。
2. 将running_top指向上一层执行上下文。通过上述步骤完成对Composite调用的执行上下文模拟，用于常量传播分析。

## 常量传播

在静态数据流图生成的过程中，可使用条件语句和循环语句控制计算节点的调用。条件语句中的判断条件和循环语句中的循环条件中都可能包含变量，为了能在编译过程中明确变量的常量值，来分析出条件语句的判断结果以及循环语句的循环次数，引入了常量传播方法。

一般的常量传播方法只关注简单表达式的计算，而不支持对循环语句的分析。在COStream中，常量传播能够结合执行上下文的模拟，在编译时确定Composite调用传入参数的常量值，并对每次Composite调用进行常量传播分析。在此基础上，常量传播不仅支持对赋值语句的分析，也支持对条件判断语句以及循环语句的分析。在常量传播过程中，根据得到的变量的常量值，对add、splitjoin以及pipeline语句进行分析，通过Composite调用确定`计算节点的调用次数`和`计算节点传递的数据个数`等信息，实现对add、splitjoin以及pipeline语句的展开，来生成静态数据流图。

对于`赋值语句`，常量传播能够分析基本算数运算、逻辑常量、位运算、强制类型转换以及多维数组的读写操作，并在赋值时根据变量类型与运算结果类型进行隐式转换，确保变量类型与常量值的一致性。

对于`条件判断语句`，根据条件语句的判断结果确定程序的执行路径。如果在语句块的解析过程中如果存在Composite调用，则将此Composite调用添加到Composite调用数组中，用于记录在程序执行时会被调用的Composite，以此来确定计算节点的调用次数。

对于`for循环语句`，通过分析循环语句，挖掘每次循环中存在的常量值。具体步骤如下：

1. 分析循环语句的初始条件、结束条件以及循环变量，确定循环次数。
2. 按照循环次数模拟循环内语句的执行，进行常量传播分析。在模拟过程中为每次循环执行生成新的作用域，记录当前循环内变量的常量值。
3. 如果循环语句内存在Composite调用语句，则将Composite调用添加到Composite调用数组中，来确定Composite在循环中被调用的次数。

对于`add语句`，add语句决定了具体调用的Composite，支持传入参数。静态数据流图生成时，若遇到带有参数的add语句，则从执行上下文的符号表中取出各参数的当前值，将该值封装到Composite调用语句中，完成Composite调用语句参数的常量化。

对于`splitjoin和pipeline语句`，splitjoin和pipeline结构分别用于构建串行和并行的子数据流图，内部包含add语句，处理方法为生成Composite调用数组，将内部add语句经分析处理后的Composite调用添加到数组中，来确定splitjoin和pipeline语句内部计算节点的调用次数以及参数值。在解析splitjoin或pipeline结构生成静态数据流图中的节点时，会根据此数组展开splitjoin或pipeline结构。


## 执行上下文和常量传播示例

![FFT部分算法常量传播示例](../img/PART3-1.png)

在图中，左侧为常量传播的过程，右侧为FFT算法的部分代码。图中最左侧是变量n的常量传播过程，其值来自`CombineDFT调用`传入的参数8，并将值传递到for循环语句中。中间部分展示变量j的常量传播过程。j的值随`for循环`的执行而变化。通过对for循环的解析，得出for循环会执行三次。对每一次循环进行模拟，得到每次循环中j的值分别为2、4、8。for循环包含在`pipeline结构`中，且在for循环中包含`CombineDFTX调用`，并传入j作为参数。因此在每一次循环中，常量传播得到的j的值作为参数保存在CombineDFTX调用中，每一次循环中CombineDFTX调用则存储在pipeline结构的`Composite调用数组`中。右侧展示的是变量TN的常量传播过程，其值来自pipeline结构中Composite调用数组的三个`CombineDFTX调用`。通过对三次CombineDFTX调用的解析，为每一次调用生成新的`执行上下文`，执行上下文中保存每次CombineDFTX调用传入的参数值2、4、8作为TN的值。
