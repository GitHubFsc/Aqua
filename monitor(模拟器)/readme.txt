ģ��������
1. �޸�ģ������config.ini�ļ�
   ## �Ƿ��������UI
      test-external-ui = yes
   ## ���UI��ַ����������UI��PC�ϵ�·��
      test-external-ui-localpath = E:\iPanel doc\uia
2. ��������-- �޸�ģ������ipanel_windevice.ini�ļ�
   #delivery,ָ��Ƶ����ļ���ӳ��
   #Ƶ��������һ��Ƶ���Ӧһ��TS����
     transport.interface[0].delivery = 1
   #ÿһ��Ƶ���TS������PC�ϵ�·����������315Ƶ�����������ã�
     transport.interface[0].delivery[0] = 315 :: D:\TS\315_0708_100314.ts

�޸���ɺ󼴿�˫��EIS_IPANEL_EMBEDDED.exe����