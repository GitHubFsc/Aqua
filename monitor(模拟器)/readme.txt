模拟器配置
1. 修改模拟器的config.ini文件
   ## 是否启用外挂UI
      test-external-ui = yes
   ## 外挂UI地址，即机顶盒UI在PC上的路径
      test-external-ui-localpath = E:\iPanel doc\uia
2. 码流配置-- 修改模拟器的ipanel_windevice.ini文件
   #delivery,指定频点和文件名映射
   #频点数量，一个频点对应一个TS码流
     transport.interface[0].delivery = 1
   #每一个频点的TS码流在PC上的路径（下面是315频点码流的配置）
     transport.interface[0].delivery[0] = 315 :: D:\TS\315_0708_100314.ts

修改完成后即可双击EIS_IPANEL_EMBEDDED.exe启动