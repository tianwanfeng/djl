按模块存放js文件，根目录只放app.js由首页（home.html）使用
app.js : 主要用于路由定义和angular模块声明

模块目录js文件基本如下：
   |--controllers.js          // controllers也就是存放我们自己的业务文件
   |--directives.js            // 指令文件(指令可共用)
   |--fliters.js                  // 过滤器文件(过滤器可共用)
   |--services.js             //  服务文件(可共用,一般是与服务器交互的服务)