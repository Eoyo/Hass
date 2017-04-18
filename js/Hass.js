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
		for(var i=0;i<len;i++){
			var change=fork(str[i]);
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
						if(last){node = last;}//回到上一层;
						else{return node;}//结束了;
						temptext="";
						break;
				}
			}
			else{
				temptext+=str[i];
			}
		}
		return node;
	}
	function analyhead(str,node){ //state : 1,2,3
		var len=str.length;
		var temptext="";
		for(var i=0;i<len;i++){
			var change=fork(str[i]);
			if(change){
				switch(lstate){
					case 1:
						if(cstate==1){ // 没改变cstate;
							node.times=temptext;
						}
						else{
							node.name=temptext;
						}
						break;
					case 2:node.classname?node.classname+=temptext+" ":node.classname=temptext+" ";break;
					case 3:node.id=temptext;break;
					case 4:analyattr(temptext,node);break;
				}
				temptext="";
			}else{
				temptext+=str[i];
			}
		}
		switch(cstate){
			case 1:node.name=temptext;break;
			case 2:node.classname?node.classname+=temptext+" ":node.classname=temptext+" ";break;
			case 3:node.id=temptext;break;
		}
		popstate();
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
				}
				break;
			case 1<=cstate||cstate<=3:
				switch(str){
					case '*':
						lstate=1;
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
					case ']':
						changestate(6);
						return true;
				}
				break;
			case 4<=cstate||cstate<=6:
				switch(str){
					case ':':
						changestate(5);
						return true;
					case ';':
						changestate(6);
						return true;
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
	function popstate(){
		lstate=state.pop();//1
		cstate=state.pop();//0
	}
	function changestate(a){
		lstate=cstate;
		cstate=a;
	}
	function createDoc(obj){
		var doc=document.createElement(obj.name);
		doc.className=obj.classname;
		doc.id=obj.id;
		doc.setAttribute(obj.attr);
		if(!obj.content){
			doc.innerHTML=obj.content;
		}
		var len=obj.child?0:obj.child.length;
		for(var j=0;j<len;j++){
			var times=obj.child[j].times||1;
			for (var i=0;i<times;i++){
				doc.appendChild(createDoc(obj.child[j]))
			}
		}
		return doc;
	}
	var res=[];
	for(var i=0;i<strs.length;i++){
		var state=['#'];//end state is '#'
		var cstate=0;
		var lstate='#';
		var obj=analy(strs[i]);
		var times=obj.times||1;
		for (var i=0;i<times;i++){
			res.push(createDoc(obj));
		}
	}
	return res;
}
Hass.addhtml=function (htmls){
	console.log(htmls);
	var len=htmls.length;
	for(let i=0;i<len;i++){
		var onep=document.createElement('div');
		onep.setAttribute('id','Hass-div-'+i);
		document.getElementsByTagName("body")[0].append(onep);
		onep.outerHTML=htmls[i];
	};
	Hass.ready();
}
Hass.getHass=function(urls,that){
	var len=urls.length;
	var currenti=0;
	var texts=[];
	for(let i=0;i<len;i++){
		$.ajax({
			type:"get",
			dataType:"text",
			url:urls[i],
			success:function(data){
				texts.push(data);
				currenti++;
				if(currenti>=len){
					that.addhtml(Hass.render(texts));
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

$(document).ready(function(){
	$('hass').css("display","none");
	if(!Hass.isinited)Hass.init();
});
