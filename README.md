## 使用
```bash
  git clone  https://github.com/HuangZhiming-the-Great/simple-Pomodoro.git
  cd SIMPLE-POMODORO
  yarn // 安装依赖包
  yarn try // 开启热测试
```

## 演进方案
### - 第一版严格按照React官方推荐的信息流动来。
  我理解的react官方的世界观是这样的：
    UI只不过是数据的另一种表现而已。所以首先是要建立一个数据集，
    然后写下这些数据的变化规律（产生变化的函数），
    接着就是具体的将数据转变成UI的显示性工作。
#### 还拥有的bug：
～～1. 有时候还会出现不能正常播放音乐的情况。
    
    > 可能是文件夹在进行文件操作的时候，audio再对音乐文件进行操作会出错。～～
  
  > 这个是对文件的操作有些生疏。
    
～～2. 如果是在electron里面，本地音频文件也无法直接播放。

    > 不过，可以参考一下[这个链接](https://blog.csdn.net/qq_39050445/article/details/105066444)。
    
    这个问题确实有一些难搞！不过我还是把它解决了:-)
    
    主要问题是main在引入的时候用的是ES6的import语句。
    在参考了别人关于audio的mp3播放器以后，好像别人刻意的在import方面使用ES5的语句。所以我尝试了很多关于其它是不是文件导入等其它原因以后，更改了语句为ES5.就可以播放了！
    不过这个也不是全部的原因.后来我又安装了electron-prebuilt-compiler@8.2.0(要求我必须安装这个版本的库),结果又出现了之前的问题.发现原来是之前最开始的报错有问题.是一个关于x-require.js的文件里用了过期的函数导致的.～～
  
  > 这个是对<input>标签的一些属性和返回的值不太了解，网上的各种回答又极其不负责和不专业。通过浏览mdn的“https://developer.mozilla.org/zh-CN/docs/Web/API/FileList”，解决问题。

- 3. 如果之前有存储音乐文件设置，那么软件加载后<input>还是显示没有选择文件。

## 打包
- 1. 打包跑起来
  这一步就是简单的跑起来。只是希望能够做出一个安装包就好。
  由于之前使用electron-forge打包出现无法播放声音的问题。所以这次使用的是electron-builder。
  ```bash
  yarn global add electron-builder//全局安装electron-builder
  electron-builder --version //查看版本，确定是否安装成功
  cd my-project-repository//进入到自己要打包的文件夹下
  electron-builder -l//打包成linux系统下的运行程序
  //由于我还是对打包的参数不太了解所以就只能这么打包，最后打包出来会在dist文件夹下生成一个可以直接运行的appimage程序。算是能够解决基本要求。

## 关于electron的问题
  ~~1. 由于我对electron 的了解还不够，所以对使用electron-store还是失败了，我转而将改进变成了客户输入音乐到index.js文件里的state中，所以每次启动程序，用户之前的设置都是没有的。~~
  > 已经通过学习官方的教程和github上的小例子学会并理解了electron-store的数据存储和使用。
