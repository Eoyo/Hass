/*var arg={
	name:"liumiao"
};
var obj={
	attr:arg
}
values=[1,2,3];
//字符窜属性没语义的;
console.log(obj['attr.name']);*/
/*var dg;
 * 
 * typeof new Array()  ==>object;
switch(dg){//switch 是严格匹配的
	case false:console.log("three");break;
	case "":console.log("one");break;
	case 0:console.log("two");break;
}*/
var node={
	name:"",
	content:"haaho",
	part:{
		name:['abc','$','dsfe'],
		content:['haaho','$'],
	},
	times:4,
	num:{
		name:[0],
		content:[1],
	},
//	values:[45,['$$','%%%','^^^^^','&&&']],
}
function classof(o){
	if(o===null) return "Null";
	if(o===undefined) return "Undefined";
	return Object.prototype.toString.call(o).slice(8,-1);
}
function initfunc(node){
	var values=node.values;
	switch(values){
		case undefined: //按父节点的方式
			return function(num,time){
				node.ctime=node.partime*node.times+time;//evaluate:partime
				return node.ctime;
			}
			break;
		case "": //按默认的方式
			return function(num,time){
				return node.ctime=time;
			}
			break;
	}
	return function (num,time){
		switch(values[num]){
			case undefined: //按父节点的方式
				node.ctime=node.partime*node.times+time;
				return node.ctime;//evaluate:partime
			default:
				node.ctime=time;
				if(classof(values[num])=="Array"){
					if(values[num][time]==undefined){//缺少值时;
						return "";  //空字符;
					}
					return values[num][time];
				}
				else{//按基础值的方式
					return values[num]+time;
				}
		}
	};
}
function evaluate(node,time){ //赋值一次
	function explain(node,at,time){
		if(classof( node.part[at] ) == 'Array'){
			var part=node.part[at];
			var num=node.num[at];//看到的第几个 $;
		}else{
			return;//no $
		}
		var str="";
		var k=0;
		for(var i=0;i<part.length;i++){
			if('$'==part[i]){
				str+=getvalues(num[k++],time);
			}else{
				str+=part[i];
			}
		}
		node[at]=str;
	}
	for (var at in node.part){
		explain(node,at,time);
	}
}

var getvalues=initfunc(node);
node.partime=0;
for(var i=0;i<node.times;i++){
	evaluate(node,i);
	console.log(node.name,node.content);
}
