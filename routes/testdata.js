var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res) {
	var data;debugger
	console.log(req.body.action);
	switch(req.body.action){
		case 'checklogin':
			data = {code:200,msg:'',data:[]};
		break;
		case 'getnotecode':
			data = {code:200,msg:'',data:[{notecode:7785}]};
		break;
		case 'register':
			data = {code:200,msg:'',data:[]};
		break;
		case 'getprovince':
			data= {code:200,msg:'',data:[{province:'?????'}]};
		break;
		case 'getcity':
			data= {code:200,msg:'',data:[{city:'?????'}]};
		break;
		case 'getcounty':
			data= {code:200,msg:'',data:[{county:1,countyname:'????'}]};
		break;
		case 'getschool':
			data= {code:200,msg:'',data:[{schoolid:1,schoolname:'???Сѧ'}]};
		break;
		case 'setteacherpassword':
			data= {code:200,msg:'',data:[]};
		break;
		case 'getteacherinfo':
			data= {code:200,msg:'',data:[{"turename":"jack","credits":"88","headpic":"http://shimg.focus.cn/upload/photos/11706/HOhRVKCE.gif","sex":39,"mobilephone":"13900139000","xkname":"?ѧ","schoolname":"??ƽСѧ","email":"789632@qq.com","province":"?????","city":"????","countyname":"??ƽ?","address":"xxxxxx","xklist":[{"xkid":2,"xkname":"数学"}]}]};
		break;
		case 'savebaseinfo':
			data= {code:200,msg:'',data:[]};
		break;
		// case 'getteachinfo':
		// 	data= {code:200,msg:'',data:[]};
		// break;
		case 'saveteachinfo':
			data= {code:200,msg:'',data:[]};
		break;
		case 'huoqupigailiebiao':
			data= {code:200,msg:'',data:[
{

	"allpage":6,
			"classidlist":[{
				"gradename":"5??",
				"classname":"226??",
				"classybz":"33",
				"classysj":"44",
				"classypg":"55",
				"classwpg":"66",
				"wrongtilist":[{
					"realname":"??????",
					"wringtinum":"5"
				},{
					"realname":"?????",
					"wringtinum":"7"
					}]
				},
				{
				"gradename":"5??",
				"classname":"226??",
				"classybz":"33",
				"classysj":"44",
				"classypg":"55",
				"classwpg":"66",
				"wrongtilist":[{
					"realname":"??????",
					"wringtinum":"5"
				},{
					"realname":"?????",
					"wringtinum":"7"
					}]
				},{
				"gradename":"5??",
				"classname":"226??",
				"classybz":"33",
				"classysj":"44",
				"classypg":"55",
				"classwpg":"66",
				"wrongtilist":[{
					"realname":"??????",
					"wringtinum":"5"
				},{
					"realname":"?????",
					"wringtinum":"7"
					}]
				}],
				"pigailist":[
					{
						"tchwlogid":1,
						"gradename":"5??",
						"classname":"8??",
						"lhname":"???1????????????????????????",
						"publishtime":"2016/05/18",
						"subendtime":"2016/10/02   14:21",
						"weijiao":"30",
						"ypg":"20",
						"wpg":"10"
					},{
						"tchwlogid":2,
						"gradename":"222",
						"classname":"333",
						"lhname":"444",
						"publishtime":"2016/05/17",
						"subendtime":"20160520",
						"weijiao":"30",
						"ypg":"20",
						"wpg":"10"
					},{
						"tchwlogid":3,
						"gradename":"222",
						"classname":"333",
						"lhname":"444",
						"publishtime":"2016/05/15",
						"subendtime":"20160520",
						"weijiao":"30",
						"ypg":"20",
						"wpg":"10"
					}
				]
}

			]};
		break;
		case 'getteacherclasslist':
			data= {code:200,msg:'',data:[{
				"schoolname":"11",
				"classid":"22",
				"teachername":"33",
				"classname":"44"
				
			}]};
		break;

	}
 	res.send(data);
});

module.exports = router;