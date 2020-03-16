#if 0

#elif defined(PORT_ALILINUX)

#elif defined(PORT_AML8726M3)
#	if 0
#	elif defined(CONFIG_ADVANCED_AML8726M3_TEST_90085)
#	endif

#elif defined(PORT_ARM926)
#	if 0
#	elif defined(CONFIG_ADVANCED_ARM926_QINGDAO_90047)
#	elif defined(CONFIG_ADVANCED_ARM926_TEST_80061)
#	elif defined(CONFIG_VANE_HI3110_YINHE_80035)
#	elif defined(CONFIG_VANE_HI3716M_TEST)
#	endif

#elif defined(PORT_BCM7019)

#elif defined(PORT_BCM7229)

#elif defined(PORT_BCM7230)

#elif defined(PORT_BCM97214)

#elif defined(PORT_BCM97230)

#elif defined(PORT_BCM97401)

#elif defined(PORT_BCM97405)
#	if 0
#	elif defined(CONFIG_ADVANCED_BCM97405_SHANGHAI_90061)
#	elif defined(CONFIG_VANE_BCM97405_TEST_80014)
#	elif defined(CONFIG_VANE_BCM97405_TEST_80020)
#	elif defined(CONFIG_VANE_BCM97401_TEST_80030)
#	elif defined(CONFIG_VANE_INNER_TEST)
#	elif defined(CONFIG_VANE_INNER_TEST3)
#	elif defined(CONFIG_VANE_TEST_AUTO_PROJECT)
#	endif

#elif defined(PORT_BCM97435)

#elif defined(PORT_CSM1800)

#elif defined(PORT_HI3110)
#	if 0
#	elif defined(CONFIG_ADVANCED_ARM926_JIANGSU_90051)
#	elif defined(CONFIG_ADVANCED_CT_HI3110_90065)
#	elif defined(CONFIG_ADVANCED_HI3110_TEST_80068)
#	elif defined(CONFIG_ADVANCED_HI3110_TEST_80071)
#	elif defined(CONFIG_ADVANCED_HI3110_TEST_80074)
#		undef USE_IPSP_MODULE
#		undef USE_IPSP_PLAYER
#		undef USE_STOCK
#		undef USE_STOCK_VERSION
#	elif defined(CONFIG_ADVANCED_HI3110_TEST_80075)
#	elif defined(CONFIG_VANE_ARM926_GUANGDONG_80024)
#	elif defined(CONFIG_VANE_HI3110_HENAN_80033)
#	elif defined(CONFIG_VANE_HI3110_JIULIAN_90014)
#	elif defined(CONFIG_VANE_HI3110_JIULIAN_90015)
#	elif defined(CONFIG_VANE_HI3716H_IPANEL)
#	endif

#elif defined(PORT_HI3716M)

#elif defined(PORT_M3701C)

#elif defined(PORT_MSTARLIN)

#elif defined(PORT_MT8612)

#elif defined(PORT_MT8652)
#	if 0
#	elif defined(CONFIG_ADVANCED_MTK8652_SHANGHAI_90059)
#	elif defined(CONFIG_ADVANCED_MTK8652_TEST_80062)
#	elif defined(CONFIG_VANE_MTK8652_TEST_80038)
#	endif

#elif defined(PORT_MT8653)

#elif defined(PORT_MTK8652)

#elif defined(PORT_PNX8473)

#elif defined(PORT_RTD1283ES)

#elif defined(PORT_SIGMA)
#	if 0
#	elif defined(CONFIG_VANE_SIGMA_TEST_80028)
#	endif

#elif defined(PORT_SMP8654)

#elif defined(PORT_ST7162)

#elif defined(PORT_STLINUX)
#	if 0
#	elif defined(CONFIG_VANE_ST7108_TEST)
#	elif defined(CONFIG_VANE_STLINUX_BEIJINGGDSW_90011)
#	endif

#elif defined(PORT_TRIDENT)
#	if 0
#	elif defined(CONFIG_ADVANCED_TRIDENT_TEST_80063)
#	endif

#elif defined(PORT_VISX)

#else	
#	error "platform NOT defined."

#endif


