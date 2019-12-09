## Guacamole-client 客户端web端修改

### 为什么要修改这个东西？

由于Guacamole-client客户端采用的是Angular框架做的web端，而且构建完全采用的Maven进行构建，虽然也是个Java web项目，单它的web端并不是那么好用，非常不适合我现在团队的项目进行集成。所以个人考虑将Guacamole-client客户端的web部分剥离，采用vue进行重写。一来可以锻炼一下自己解析web项目的能力，二是彻底分析一下Guacamole-client的所有功能。

