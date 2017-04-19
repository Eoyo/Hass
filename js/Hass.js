class Hass{
	constructor(obj){
		//url urls obj
		this.complete=false;
		this.doc_ready=function (){};
		this.urls=[];
		switch(typeof obj){
			case 'object':
				switch(typeof obj.url){
					case 'string':this.urls.push(obj.url);break;
					case 'array' :this.urls=obj.url;break;
					default:
						throw new Error("Can't get url!!");
				}
				obj.ready&&(this.doc_ready=obj.ready);
				break;
			case 'string':
				this.urls.push(obj.url);break;
			default:
				throw new Error("Can't get url!!");
		}
		urls.concat(url);
		var hass=[];
	}
}
Hass.complete=false;
Hass.isinited=false;
Hass.ready=function(){}
Hass.render=function (strs){
	function analy(str){
		console.log(str);
		var len=str.length;
		var temptext="";
		var node={};
		var lastnode=[];
		var nodelist=[];
		for(var i=0;i<len;i++){
			var st=str[i];
			if(st=='\t'||st==' '||st=='\n'||st=='\r'){
				continue;
			}
			if(st=='('){
				console.log('stop');
				var s=state;
			}
			var change=fork(st);
			if(change){
				switch(lstate){
					case 0:
						analyhead(temptext,node);
						temptext="";break;
					case 1:
						lastnode.push(node);
						node.child||(node.child=[]);
						var onechild={};
						node.child.push(onechild);
						node=onechild;//child 为当前node;
						analyhead(temptext,onechild);
						temptext="";break;
					case '#':
						var last=lastnode.pop();
						node.content=temptext;
						var aimnode=node;
						if(last){node = last;lstate=1;cstate=0}//回到上一层;
						else{nodelist.push(node);}//结束了;
						temptext="";
						break;
					case 7:  //
						if(temptext=="") aimnode.values="";
						else{
							aimnode.values=JSON.parse('['+temptext+']');
						}
						temptext="";
						aimnode=null;
						popstate();
						break;
				}
			}
			else{
				temptext+=st;
			}
		}
		return nodelist;
	}
	function analyhead(str,node){ //state : 1,2,3
		var len=str.length+1;
		var temptext="";
		var temppart=[];
		var tempnum=[];
		node.numbers=0;
		for(var i=0;i<len;i++){
			var change=fork(str[i]);
			if(change){
				//debugger;
				switch(lstate){
					case 0:
						node.times=temptext;
						break;
					case 1:
						node.name=temptext;
						break;
					case 2:
						if(has_$){
							temptext+=' ';
							if(temptext)temppart.push(temptext);
							node.part.classname?node.part.classname.concat(temppart):node.part.classname=temppart;
							temppart=[];
							if(tempnum.length>0){
								node.num.classname?node.num.classname.concat(tempnum):node.num.classname=tempnum;
							}
							tempnum=[];
						}
						else{
							node.classname?node.classname+=temptext+" ":node.classname=temptext+" ";
						}
						break;
					case 3:
						if(temppart.length){//当前属性有一个$
							node.part.id=temppart;
							node.num.id=tempnum;
						}
						node.id=temptext;
						break;
					case 4:analyattr(temptext,node);break;
					case 10:
						if(!node.part) node.part={};
						if(!node.num) node.num={};
						var has_$=true; //整个node有一个$;
						if(temptext)temppart.push(temptext);
						temppart.push('$');
						//debugger;
						tempnum.push(node.numbers++);
						break;
				}
				temptext="";
			}else{
				temptext+=str[i];
			}
		}
		popstate();
		cstate=0;lstate=1;
	}
	function analyattr(str,node){
		var len=str.length;
		var attr={};
		node.attr=attr;
		var name,value;
		var temptext="";
		for(var i=0;i<len;i++){
			var change=fork(str[i]);
			if(change){
				switch(lstate){
					case 6:name=temptext;break;
					case 5:attr[name]=temptext;break;
				}
				temptext="";
			}else{
				temptext+=str[i];
			}
		}
	}
	function fork(str){
		switch(true){
			case str==undefined:
				lstate=cstate;
				return true;
			case cstate==11:
				if(str==')'){
					lstate=7;
					return true;
				}
				return false;
			case cstate==8:   //8,9 状态不被特殊处理;
				switch(str){
					case '"':
						popstate();
						lstate=8;
						return true;
				}
				return false;
			case cstate==9:
				if(str=='\''){
					popstate();
					lstate=9;
					return true;
				}
				return false;
			case str=='"':
				pushstate();
				cstate=lstate=8;
				return true;
			case str=='\'':
				pushstate();
				cstate=lstate=9;
				return true;
			case cstate==0:
				switch(str){
					case '{':
						if(lstate==1){addstate(1);lstate=1;}
						else{addstate(1);}
						return true;
						break;
					case '}':
						lstate='#';
						return true;
						break;
					case '(':
						pushstate();
						lstate=11;cstate=11; //优先于"";
						return true;
				}
				break;
			case 1<=cstate&&cstate<=3:
				switch(str){
					case '*':
						lstate=0;
						return true;
					case '.':
						changestate(2);
						return true;
					case '#':
						changestate(3);
						return true;
					case '[':
						changestate(4);
						return true;
					case '$':
						lstate=10;
						return true;
				}
				break;
			case 4==cstate:
				if(str==']'){
					changestate(6);//开始识别括号[] 里的内容
					return true;
				}
				break;
			case 5<=cstate&&cstate<=6:
				switch(str){
					case ':':
						changestate(5);
						return true;
					case ';':
						changestate(6);
						return true;
					case '\"':
					case '\'':
				}
				break;
		}
		return false;
		
	}
	function addstate(a){//记录l c 状态
		lstate=cstate;
		cstate=a;
		state.push(lstate);//0
		state.push(cstate);//1
	}
	function pushstate(){//记录l c 状态
		state.push(lstate);//0
		state.push(cstate);//1
	}
	function popstate(){
		cstate=state.pop();//0
		lstate=state.pop();//1
	}
	function changestate(a){
		lstate=cstate;
		cstate=a;
	}
	function createDoc(node,time){
		node.getvalues=initfunc(node);
		evaluate(node,time);
		var doc=document.createElement(node.name);
		if(node.classname!==undefined)doc.className=node.classname;
		if(node.id!==undefined)doc.id=node.id;
		for(var i in node.attr){
			doc.setAttribute(i,node.attr[i]);
		}
		if(node.content){
			doc.innerHTML=node.content;
		}
		var len=node.child?node.child.length:0;
		for(var j=0;j<len;j++){
			var times=+node.child[j].times||1;
			for (var i=0;i<times;i++){
				node.child[j].partime=time;
				doc.appendChild(createDoc(node.child[j],i));
			}
		}
		return doc;
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
					str+=node.getvalues(num[k++],time);
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

	var res=[];
	var state=['#'];//end state is '#'
	var cstate=0;
	var lstate='#';
	var obj=analy(strs);//analy 后:
//	debugger;
	for(var k=0;k<obj.length;k++){
		var times=obj[k].times||1;
		obj[k].partime=0;
//		if(obj[k].values){
//			if (classof(obj[k].values[0])!=="Array"){//第一个不是Array;
//				obj[k].values=[obj[k].values]; //升维
//			}
//		}
		for (var i=0;i<times;i++){
			res.push(createDoc(obj[k],i));
		}
		return res;
	}
}
Hass.addhtml=function (htmls){
	console.log(Hass.complete,htmls);//htmls doc 
	var len=htmls.length;
	for(let i=0;i<len;i++){
		var onep=document.createElement('div');
		onep.setAttribute('id','Hass-div-'+i);
		document.getElementsByTagName("body")[0].append(onep);
		for(var j=0;j<htmls[i].length;j++){
			onep.appendChild(htmls[i][j]);
		}
	};
	Hass.ready();
}
Hass.getHass=function(urls,that){//获得的结果,最后给that处理;
	var len=urls.length;
	var currenti=0;
	var htmls=[];
	for(let i=0;i<len;i++){
		$.ajax({
			type:"get",
			dataType:"text",
			url:urls[i],
			success:function(data){
				htmls.push(Hass.render(data));
				currenti++;
				if(currenti>=len){
					that.complete=true;
					that.addhtml(htmls);
				}
			},
			async:true
		});
	}
}
Hass.init=function(...url){
	if(Hass.isinited){return Hass;}
	Hass.isinited=true;
	var urls=[];
	$('hass').each(function(){
		urls.push(this.getAttribute('url'));
	});
	urls.concat(url);  
	Hass.getHass(urls,Hass)
	return Hass;
}
var seey=10;
$(document).ready(function(){
	$('hass').css("display","none");
	if(!Hass.isinited)Hass.init();
});
