---
title: 矩阵扩展
type: guide
order: 41
---

目前 COStream 语言已支持矩阵扩展, 使用方式与`python`的`numpy`类似, 一个使用矩阵作为数据流 token 的数据流程序例子如下, 该例子中展示了各矩阵接口的调用方法名:
```cpp
// 该文件为矩阵扩展的接口能力展示
import Matrix;

Matrix matrixs[8] = { 
    [ [0,0], [0,0] ],
    [ [1,1], [1,1] ],
    [ [2,2], [2,2] ],
    [ [3,3], [3,3] ],
    [ [4,4], [4,4] ],
    [ [5,5], [5,5] ],
    [ [6,6], [6,6] ],
    [ [7,7], [7,7] ]
};                

composite Main(){
    stream<Matrix x>S,P;
    S=Source(){
        work{
            println("矩阵构造结果:全零矩阵\n",Matrix.zeros(2,2));
            println("矩阵构造结果:全一矩阵\n",Matrix.ones(2,2));
            println("矩阵构造结果:随机矩阵\n",Matrix.random(2,2));
            println("矩阵构造结果:常数矩阵\n",Matrix.constant(2,2,6));
            println("矩阵构造结果:单位矩阵\n",Matrix.identity(2));
            println("矩阵构造结果:矩阵常量\n",[[0,1],[1,0]]);

            S[0].x = matrixs[1];
            S[0].x[1,0] = 0;
            Matrix A = S[0].x;
            println("获取数据流上的矩阵A\n", S[0].x);

            println("A的行数: ", S[0].x.rows());
            println("A的列数: ", S[0].x.cols());
            println("A的秩: ", S[0].x.rank());
            println("A的迹: ", S[0].x.trace());
            println("A的行列式值: ", S[0].x.det());

            println("\n矩阵运算部分:");
            println("A的逆矩阵:\n", A.inverse());
            println("A+1的结果:\n", A+1);
            println("A与其逆矩阵点乘的结果\n", A*A.inverse());

            println("\n矩阵映射部分:");          
            println("A.transpose():\n", A.transpose());  
            println("A.exp():\n", A.exp());  
            println("A.sin():\n", A.sin());  
            println("(A+1).pow():\n", (A+1).pow(2));  
        }
        window{
            S tumbling(1);
        }
    };
    Sink(S){
        work{
            println(S[0].x);
        }
        window{
            S sliding(1,1);
        }
    };
}
```

## 使用矩阵扩展的步骤

### 1. 在数据流程序开头引入矩阵扩展
```cpp
import Matrix;
```
### 2. 编辑数据流程序中的 `composite` `operator` 等
```cpp
import Matrix;
composite Main(){
    
    First(){
        // ...
    };
    Second(){
        // ...
    };
    Third(){
        // ...
    };
}
```
### 3. 声明 token 类型为矩阵的数据流
```cpp
stream<Matrix x>S,P;
```
### 4. 将数据流与 operator 连接, 并设置好窗口大小
```cpp
import Matrix;
composite Main(){
    stream<Matrix x>S,P;
    S = First(){
        // ...
        window{
            S tumbling(10);
        }
    };
    P = Second(S){
        // ...
        window{
            S slding(10,10);
            P tumbling(5);
        }
    };
    Third(P){
        // ...
        window{
            P slding(5,5);
        }
    };
}
```
### 5. 在 operator 的 work 中进行矩阵运算
```cpp
import Matrix;
composite Main(){
    stream<Matrix x>S,P;
    S = First(){
        work{
            int i;
            for(i=0;i<10;i++){
                S[i].x = Matrix.random(28,28); // 向数据流 S 填充10个大小为 28 x 28 的随机矩阵
            }
        }
        window{
            S tumbling(10);
        }
    };
    P = Second(S){
        work{
            int i;
            for(i=0;i<5;i++){
                P[i].x = S[i].x * S[i+1].x;  // 将数据流 S 携带的矩阵两两相乘, 输出到数据流 P
            }
        }
        window{
            S slding(10,10);
            P tumbling(5);
        }
    };
    Third(P){
        // ...
        window{
            P slding(5,5);
        }
    };
}
```
### 6. 额外支持 python 风格的矩阵常量 / 切片操作
```cpp
import Matrix;
composite Main(){
    stream<Matrix x>S,P;
    S = First(){
        // ...
    };
    P = Second(S){
        // ...
    };
    Third(P){
        work{
            Matrix m = [ [1,0], [0,1], [1,1] ];  // 矩阵 m 为 3行 x 2列
            /*                                     m:   1 0
                                                        0 1
                                                        1 1 

                                                   n:   0 1
                                                        1 0 
            */                                                       
            Matrix n = [ [0,1], [1,0] ];         // 矩阵 n 为 2行 x 2列
            Matrix q = m[0:2,:] * n;             // 使用 m 的 2x2 切片与 n 相乘
        }
        window{
            P slding(5,5);
        }
    };
}
```

## 编译器对矩阵的类型推断和检查

COStream矩阵扩展将矩阵或常数的行数和列数构成的组合数据定义为`shape`，如3x2矩阵的`shape`为`[3,2]`，长度为n的行向量的`shape`为`[n,1]`，而自然数常量 1，2，3 等将其`shape`定义为`[1,1]`。一些特定的矩阵运算对参与运算的数据的`shape`有一定要求，例如矩阵乘法A*B要求A的列数等于B的行数，即条件表达式`A.shape[1] == B.shape[0]`的结果为真，否则矩阵乘法会抛出错误。COStream编译器在语义检查阶段对矩阵相关计算的操作数`shape`进行**推断和检查**。目前编译器能正常检测出如以下几种错误:
#### 下标访问错误
```cpp
Matrix m = Matrix.random(28,28);
Matrix n1 = m[0:28,0:28];       // 下标访问正确  
Matrix n2 = m[-1];              // 下标访问错误, 没有-1这一行, 行号范围 0~28(不含28)
Matrix n3 = m[0:28,29];         // 下标访问错误,没有第29列, 也没有第28列,列号范围0~28(不含28)
```

#### 矩阵乘法 shape 错误
```cpp
Matrix m = Matrix.random(1,784);
Matrix n = m.reshape(3,392);   // reshape 失败, 1x784 的矩阵不能 reshape 为 3x392
Matrix n = m.reshape(2,392);   // reshape 成功, n 的 shape 为[2,392]
Matrix weight = Matrix.random(783,100);
Matrix out = m * weight;       // 矩阵乘法错误 1x784 的矩阵无法和 783x100 的矩阵进行点乘
Matrix weight = Matrix.random(784,100);
Matrix out = (m+1) * weight;   // 矩阵乘法成功, 其中 m+1 的结果的 shape 仍为 1x784
```

#### 三元表达式错误
```cpp
Matrix m = Matrix.random(28,28);
Matrix n = Matrix.random(29,29);
Matrix x = cond ? m : n;       // 校验失败, 三元条件表达式的右侧两个操作数应具有相同的 shape
```

#### 二元表达式错误
```cpp
S[0].x   = Matrix.random(28,28);
Matrix n = Matrix.random(29,29);
S[1].x = n;      // 错误, 符号表中已标记数据流 S 携带的矩阵的 shape 为 28x28, 无法将一个 29x29 的值赋给它

int i=0;
Matrix m = i;    // 错误, 不能将 int 类型数据赋值给 Matrix 类型变量

Matrix s = n + S[0].x; // 错误, 加法运算左右两侧的 shape 不相符, 左侧为29x29, 右侧为28x28
```

#### 函数名错误
```cpp
Matrix m = Matrix.random(28,28);
Matrix n = m.transpoose(); // 错误, 矩阵函数 transpoose 不存在, 你是否想使用函数 transpose?
```
需要特别指出的是, COStream 编译器在发现用户调用了非法函数时, 会将该错误函数名与库中内置的函数名进行对比, 选择最接近的函数名报告给用户, 使用的算法为[字符串最小编辑距离算法](https://leetcode-cn.com/problems/edit-distance/)