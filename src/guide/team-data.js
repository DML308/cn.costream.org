/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
	a = a.concat([])
	if (window.location.hostname === 'localhost') {
		return a
	}
	var j, x, i
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i)
		x = a[i - 1]
		a[i - 1] = a[j]
		a[j] = x
	}
	return a
}

var team = [{
	name: '于俊清',
	title: 'Professor of DML',
	city: 'Wuhan, China',
	languages: ['zh', 'en'],
	github: null,
	img: '/images/YuJunqing.jpg',
	work: {
		role: 'Professor',
		org: 'HUST DML'
	},
	reposOfficial: [
		'多核计算与流编译', '基于内容的视频分析', '网络安全与大数据处理'
	],
	links: [
		'http://faculty.hust.edu.cn/yujunqing/zh_CN/index.htm'
	]
}]

team = team.concat(shuffle([ //shuffle 函数打乱了后续成员的顺序
	{
		name: '陈名韬',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'lhcmt',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream GPU'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/lhcmt'
		]
	},
	{
		name: '王兆吉',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'PixelWang',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream Benchmark'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/PixelWang'
		]
	},
	{
		name: '李平然',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'blendTree',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream Dynamic scheduling'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/blendTree'
		]
	},
	{
		name: '李新星',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en', 'jp'],
		github: 'lxx2013',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - Graphic', '前端'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'http://setsuna.wang'
		]
	},
	{
		name: '杨飞',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'innocanca',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - JPEG'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/innocanca'
		]
	},
	{
		name: '余冰清',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'yu583497794',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - Tensorflow'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/yu583497794'
		]
	},
	{
		name: '彭昊',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'PHaoGhost',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream', 'Linux'
		],
		//      reposPersonal: [
		//        
		//      ],
		links: [
			'https://github.com/PHaoGhost'
		]
	},
	{
		name: '陈珍',
		title: 'Master of DML',
		city: 'Shenzhen, China',
		languages: ['zh', 'en'],
		github: null,
		img: '/images/Chenzhen.jpg',
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
	   		'COStream - HEVC'
	   	]
	},
	{
		name: '莫斌生',
		title: 'Member of DML',
		city: 'Hangzhou, China',
		languages: ['zh', 'en'],
		github: 'mobinsheng',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - H265'
		],
	      	reposPersonal: [
			'HEVC','vs-x264-project'
	      	],
		links: [
			'https://github.com/mobinsheng'
		]
	},
	{
		name: '王玉钊',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'xingzheziran',
		twitter: null,
		work: {
			role: 'PhD',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream Cloud version'
		],
// 	      	reposPersonal: [
// 			'HEVC','vs-x264-project'
// 	      	],
		links: [
			'https://github.com/xingzheziran'
		]
	},
	{
		name: '杨瑞瑞',
		title: 'Master of DML',
		city: 'Beijing, China',
		languages: ['zh', 'en'],
		github: null,
		img: 'https://i.loli.net/2018/07/05/5b3dac2fcafc4.png',
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
	   		'COStream - CPU/GPU异构集群'
	   	]
	},
	{
		name: '杨胜哲',
		title: 'Master of DML',
		city: 'Guangzhou, China',
		languages: ['zh', 'en'],
		github: null,
		img: 'https://i.loli.net/2018/07/08/5b41bbd7459ff.jpg',
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
	   		'COStream - Dynamic Scheduling'
	   	]
	},
	{
		name: '杨燕',
		title: 'Master of DML',
		city: 'Beijing, China',
		languages: ['zh', 'en'],
		github: null,
		img: 'https://i.loli.net/2018/07/08/5b422ec5b0f42.png',
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
	   		'COStream - Eclipse Plugin'
	   	]
	},
	{
		name: '朱亮',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'xingzhexiaozhu',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - Big Data'
		],
	      	reposPersonal: [
			'DASCAN','MovieRecommendation'
	      	],
		links: [
			'https://github.com/xingzhexiaozhu'
		]
	},
	{
		name: '黄业兴',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'zzNire',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream.前端'
		],
	      	reposPersonal: [
			'HTML-MusicPlayer'
	      	],
		links: [
			'https://github.com/zzNire'
		]
	},
	{
		name: '李雅兰',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'yaerlan',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - Big Data','前端'
		],
		links: [
			'https://github.com/yaerlan'
		]
	},
	{
		name: '李妍',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'GalaxyYan',
		twitter: null,
		work: {
			role: 'Master',
			org: 'HUST DML'
		},
		reposOfficial: [
			'COStream - 前端'
		],
		links: [
			'https://github.com/GalaxyYan'
		]
	},
	{       
		name: '上官剑斌',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'yours8899',
		twitter: null,
		work: {
			role: 'postgraduate',
			org: 'HUST DML'
		},
		links: [
			'https://github.com/yours8899'
		]
		
	},
	{       
		name: '杨璐珲',
		title: 'Member of DML',
		city: 'Wuhan, China',
		languages: ['zh', 'en'],
		github: 'GabriellaMS',
		twitter: null,
		work: {
			role: 'postgraduate',
			org: 'HUST DML'
		},
		links: [
			'https://github.com/GabriellaMS'
		]
		
	},
	
]))
