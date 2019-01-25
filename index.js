'use strict';

let data = [];

let template = {
	"result":{w:50,h:50, type:"result", active:false},
	"condition":{w:150,h:50,type:"condition",active:false}
};

let results = [
	{id:0,title: "四角形"},{id:1, title: "正三角形"},{id:3,title: "二等辺三角形"},{id:4,title: "直角三角形"},{id:5,title: "三角形"},
	{id:6,title: "正方形"},{id:7,title: "ひし形"},{id:2,title: "直角二等辺三角形"},{id:8,title: "長方形"},{id:9,title: "平行四辺形"},{id:10,title: "台形"}
];

let conditions = [
	{id:0,title:"1組の平行な辺があるか"},{id:1,title: "頂点は三つか"},{id:2 ,title:"3辺の長さは等しいか"},{id:3,title:"2辺の長さが等しいか"},{id:4,title:"4辺の長さが等しいか"},
	{id:5,title:"直角があるか"},{id:6,title:"2組の平行な辺があるか"}
];

var input;

let resultAndCondition = [
	[false,false,false,false,false,false,false],//0
	[false,true,true,true,false,false,false],//1
	[false,true,false,true,false,true,false],//2
	[false,true,false,true,false,false,false],//3
	[false,true,false,false,false,true,false],//4
	[false,true,false,false,false,false,false],//5
	[true,false,true,true,true,true,true],//6
	[true,false,true,true,true,false,true],//7ひしがた
	[true,false,false,true,false,true,true],//8
	[true,false,false,true,false,false,true],//9平行四辺形
	[true,false,false,false,false,false,false]//10台形
];

var blueCircleIcon;
var blueCircle;
var conditionImage;
var assets;

let canvasWidth;
let canvasHeight;

var hanteiButtonRect;
var judgement = null;

var rectRef;

var isAvailableContainer = false;
var isAvailableCenterRect = false;
var isAvailableLeftRect = false;
var isAvailableRightRect = false;
var resultImages;
var hoverHanteiButton = false;

// init
function setup(){


	input = createInput();
	input.position(100, document.documentElement.clientHeight - 50);

	canvasWidth = document.documentElement.clientWidth;
	canvasHeight = document.documentElement.clientHeight;
	createCanvas(canvasWidth,canvasHeight);
	textAlign(CENTER, CENTER);

	
	results.forEach(
		function(n,index){
			let result = jQuery.extend(true, {}, template["result"]);
			result.title = n.title;
			result.id = n.id;
			result.x = 50 + index * 100;
			result.y = 50;
			result.defaultX = 50 + index * 100;
			result.defaultY = 50;
			data.push(result);
		}
	);

	conditions.forEach(function(n,index){
		let condition = jQuery.extend(true,{},template["condition"]);
		condition.title = n.title;
		condition.id = n.id;
		condition.x = 50 + index * 175;
		condition.y = 150;
		condition.defaultX = 50 + index * 175;
		condition.defaultY = 150;
		data.push(condition);
	});

	blueCircle = loadImage("asset/blueCircle.png");
	blueCircleIcon = loadImage("asset/smallCircle.png");
	conditionImage = loadImage("asset/orangeRect.png");
	assets = {"result":blueCircle,"resultIcon":blueCircleIcon,"condition":conditionImage};
	resultImages = [loadImage("asset/resultbg0.png"),loadImage("asset/resultbg1.png"),loadImage("asset/resultbg2.png"),loadImage("asset/resultbg3.png"),loadImage("asset/resultbg4.png"),loadImage("asset/resultbg5.png"),loadImage("asset/resultbg6.png"),loadImage("asset/resultbg7.png"),loadImage("asset/resultbg8.png"),loadImage("asset/resultbg9.png"),loadImage("asset/resultbg10.png")];
	

}

// drawing graphics
function draw(){
	clear();

	fill(0);
	textSize(18);
	text("名前:", 50,document.documentElement.clientHeight - 50)

	drawClassifySeparate();
	data.forEach(function(obj){showObject(obj)});
	drawStockRect();

	if(judgement == true)
	{
		textSize(50);
		fill(100,200,50);
		text("正解", document.documentElement.clientWidth - 100, document.documentElement.clientHeight - 100);
	}
	else if(judgement == false)
	{
		fill(200,100,100);
		textSize(50);
		text("不正解", document.documentElement.clientWidth - 100, document.documentElement.clientHeight - 100);
	}

	
}

function drawStockRect()
{
	noFill();
	stroke(50, 50, 50);
	rect(25,25, results.length * 100 + 50, 100);
	rect(25,135,conditions.length * 175 + 50, 75);
	if(hoverHanteiButton)
	{
		fill(255);
	}
	else {
		fill(255,100,100);
	}
	hanteiButtonRect = {x:results.length * 100 + 100,y:25,w:100,h:100};
	rect(results.length * 100 + 100 ,25, 100 , 100);
	fill(50);
	textSize(30);
	let texPosition = getRectCenter(results.length * 100 + 100 ,25, 100 , 100);
	text("判定",texPosition.x,texPosition.y);
}

function drawClassifySeparate()
{
	noFill();

	rectRef = {x:25,y:225, w:canvasWidth - 50, h:canvasHeight - 250};
	stroke(0);
	if(isAvailableContainer){
		stroke(255,100,100);
	}
	rect(rectRef.x,rectRef.y,rectRef.w,rectRef.h);

	stroke(0);
	if(isAvailableLeftRect){
		stroke(255,100,100);
	}
	//leftrect
	beginShape();
	vertex(rectRef.w / 8 * 3 + rectRef.x, rectRef.y + rectRef.h - rectRef.h / 10 * 2);
	vertex(rectRef.w / 8 + rectRef.x, rectRef.y + rectRef.h - rectRef.h / 10 * 2);
	vertex(rectRef.w / 8 + rectRef.x, rectRef.y + rectRef.h / 10);
	vertex(rectRef.w / 8 * 5 + rectRef.x, rectRef.y + rectRef.h / 10);
	vertex(rectRef.w / 8 * 5 + rectRef.x, rectRef.y + rectRef.h / 10 * 2);
	endShape();

	stroke(0);
	if(isAvailableLeftRect || isAvailableCenterRect){
		stroke(255,100,100);
	}
	//中央左
	beginShape();
	vertex(rectRef.w / 8 * 5 + rectRef.x, rectRef.y + rectRef.h / 10 * 2);
	vertex(rectRef.w / 8 * 3 + rectRef.x, rectRef.y + rectRef.h / 10 * 2)
	vertex(rectRef.w / 8 * 3 + rectRef.x, rectRef.y +rectRef.h - rectRef.h / 10 * 2);
	endShape();

	stroke(0);
	if(isAvailableRightRect || isAvailableCenterRect){
		stroke(255,100,100);
	}
	//中央右
	beginShape();
	vertex(rectRef.w / 8 * 5 + rectRef.x, rectRef.y + rectRef.h / 10 * 2);
	vertex(rectRef.w / 8 * 5 + rectRef.x, rectRef.y +rectRef.h - rectRef.h / 10 * 2)
	vertex(rectRef.w / 8 * 3 + rectRef.x, rectRef.y +rectRef.h - rectRef.h / 10 * 2);
	endShape();

	stroke(0);
	if(isAvailableRightRect){
		stroke(255,100,100);
	}
	//rightrect
	beginShape();
	vertex(rectRef.w / 8 * 3 + rectRef.x, rectRef.y + rectRef.h - rectRef.h / 10 * 2);
	vertex(rectRef.w / 8 * 3 + rectRef.x, rectRef.y + rectRef.h - rectRef.h / 10);
	vertex(rectRef.w / 8 * 7 + rectRef.x, rectRef.y + rectRef.h - rectRef.h / 10);
	vertex(rectRef.w / 8 * 7 + rectRef.x, rectRef.y + rectRef.h / 10 * 2);
	vertex(rectRef.w / 8 * 5 + rectRef.x, rectRef.y + rectRef.h / 10 * 2);
	endShape();

	stroke(0);

}

function getRectCenter(x,y,w,h)
{
	return {x:x+(w/2),y:y+(h/2)};
}

function showObject(obj){

	if(obj.type == "result")
	{
		image(resultImages[obj.id], obj.x, obj.y, obj.w,obj.h);
	}
	else if(assets[obj.type])
	{
		image(assets[obj.type], obj.x, obj.y, obj.w,obj.h);
	}

	if(obj.title && obj.type != "result")
	{
		if(obj.type=="condition")
		{
			textSize(15);
			noStroke();
			fill(0);
		}
		else {
			noStroke();
			textSize(15);
			fill(0);
		}
		
		
		let pos = getRectCenter(obj.x,obj.y,obj.w,obj.h);
		text(obj.title,pos.x,pos.y);
	}
	
}

// when mouse is pressed
function mousePressed(){

	data.forEach(function(obj){
		if(!obj.fixed)
		{
			obj.active = checkTouch(obj.x,obj.y,obj.w,obj.h,mouseX,mouseY);
			if(obj.active)
			{
				data.filter(n =>n !== obj).forEach(function(n){n.active = false});
			}
			obj.touchPosition = getTouchPosition(obj.x,obj.y,mouseX,mouseY);
		}
	});

	if(hoverHanteiButton)
	{
		hantei();
	}
}

function hantei(){
	if(judgement == null)
	{
		

		if(!input || input.value() == null  || input.value() == "")
		{
			alert('名前を入力してください');
			return
		}

		let outputData = $.extend([], data);

		let simpleStruct = getSimpleStructData(outputData);

		judgement = true;
		if(simpleStruct.condition1 && simpleStruct.condition2){
			//bothにある全ては両方満たす
			simpleStruct.both.forEach(function(e){
				if(!(resultAndCondition[e.id][simpleStruct.condition1.id] && resultAndCondition[e.id][simpleStruct.condition2.id]))
				{
					judgement = false;
				}
			});
			//condition1にある全てはcondition1を満たす
			simpleStruct.condition1Elem.forEach(function(e){
				if(!resultAndCondition[e.id][simpleStruct.condition1.id])
				{
					judgement = false;
				}
			});
			//condition2にある全てはcondition2を満たす
			simpleStruct.condition2Elem.forEach(function(e){
				if(!resultAndCondition[e.id][simpleStruct.condition2.id])
				{
					judgement = false;
				}
			});
			//そこに入らないもの全ては両方満たさない
			for(var i = 0; i < resultAndCondition.length; i++)
			{
				if(simpleStruct.condition2Elem.filter(x => x.id == i).length == 0 && simpleStruct.condition1Elem.filter(x => x.id == i).length == 0 && simpleStruct.both.filter(x => x.id == i).length == 0)
				{
					if(resultAndCondition[i][simpleStruct.condition2.id] || resultAndCondition[i][simpleStruct.condition1.id]){
						judgement =  false;
					} 
				}
			}

		}else {
			judgement = false;
		}

		

		defaultDatabase.collection("venn_diagram_answers").add({
			name:input.value(),
			json:JSON.stringify(simpleStruct),
			hantei:judgement
		})
		.then(function(docRef) {
			console.log("Document written with ID: ", docRef.id);
			document.getElementById("defaultCanvas0").toBlob(function(blob){
				defaultStorage.ref().child("venn_diagram_answers/" + docRef.id + ".png").put(blob);
			});
			
		})
		.catch(function(error) {
			console.error("Error adding document: ", error);
		});
	}
}

function getSimpleStructData(obj)
{
	var condition1 = [];
	var condition2 = [];
	var both = [];

	obj.filter(x => x.assign == 1 && x.type == "result").forEach(function(e){
		condition1.push({id:e.id,title:e.title});
	});
	obj.filter(x => x.assign == 2 && x.type == "result").forEach(function(e){
		condition2.push({id:e.id,title:e.title});
	});
	obj.filter(x => x.assign == 3 && x.type == "result").forEach(function(e){
		both.push({id:e.id,title:e.title});
	});
	let con1 = obj.filter(x => x.assign == 1 && x.type == "condition")[0];
	let con2 = obj.filter(x => x.assign == 2 && x.type == "condition")[0];
	var con1Obj = null;
	var con2Obj = null;
	if(con1)
	{
		con1Obj = {id:con1.id,title:con1.title};
	}
	if(con2)
	{
		con2Obj = {id:con2.id,title:con2.title}
	}
	return {condition1: con1Obj,
		condition2:con2Obj,
		condition1Elem:condition1,condition2Elem:condition2,both:both};
}


// when mouse is dragged
function mouseDragged(){

	data.forEach(function(obj){
		if(obj.active)
		{
			obj.x = mouseX - obj.touchPosition.x;
			obj.y = mouseY - obj.touchPosition.y;
			whereAmI(mouseX,mouseY);
		}
	});
	mouseMoved();
}

function mouseMoved(){
	if(checkTouch(hanteiButtonRect.x,hanteiButtonRect.y,hanteiButtonRect.w,hanteiButtonRect.h, mouseX,mouseY)){
		hoverHanteiButton = true;
	}
	else {
		hoverHanteiButton = false;
	}
}

function whereAmI(mousex,mousey)
{
	isAvailableCenterRect = false;
	isAvailableLeftRect = false;
	isAvailableContainer = false;
	isAvailableRightRect = false;

	//大本に入っているかどうか
	isAvailableContainer = checkTouch(rectRef.x,rectRef.y,rectRef.w,rectRef.h,mousex,mousey);
	//左側か
	isAvailableLeftRect = checkTouch(rectRef.w / 8 + rectRef.x, rectRef.y + rectRef.h / 10,
		 rectRef.w / 8 * 4,rectRef.h * 0.7,mousex,mousey);
	//右側か
	isAvailableRightRect = checkTouch(rectRef.w / 8 * 3 + rectRef.x,
		rectRef.y + rectRef.h / 10 * 2,
		rectRef.w / 8 * 4,rectRef.h * 0.7,mousex,mousey);
	
	if(isAvailableLeftRect && isAvailableRightRect){
		isAvailableLeftRect = false;
		isAvailableRightRect = false;
		isAvailableCenterRect = true;
	}
	if(isAvailableCenterRect || isAvailableLeftRect || isAvailableRightRect)
	{
		isAvailableContainer = false;
	}
}


// when mouseclick is released
function mouseReleased(){


	data.forEach(function(obj){
		if(obj.active)
		{
			if(obj.type == "condition")
			{
				if(isAvailableLeftRect)
				{
					let regacy = data.filter(x => x.type == "condition" && x.assign == 1);
					if(regacy.length == 1)
					{
						regacy[0].assign = null;
						regacy[0].x = regacy[0].defaultX;
						regacy[0].y = regacy[0].defaultY;
					}
					obj.assign = 1;
					obj.x = rectRef.w / 8 + rectRef.x + 25;
					obj.y = rectRef.y + rectRef.h / 10 - 25;
				}
				else if(isAvailableRightRect)
				{
					let regacy = data.filter(x => x.type == "condition" && x.assign == 2);
					if(regacy.length == 1)
					{
						regacy[0].assign = null;
						regacy[0].x = regacy[0].defaultX;
						regacy[0].y = regacy[0].defaultY;
					}
					obj.assign = 2;
					obj.x = rectRef.w / 8 * 7 + rectRef.x - 175;
					obj.y = rectRef.y + rectRef.h / 10 * 2 - 25;
				}
				else {
					obj.assign = null;
					obj.x = obj.defaultX;
					obj.y = obj.defaultY;
				}
			}
			else if(obj.type == "result")
			{
				if(isAvailableCenterRect)
				{
					obj.assign = 3;
				}
				else if(isAvailableContainer)
				{
					obj.assign = 0;
				}
				else if(isAvailableLeftRect)
				{
					obj.assign = 1;
				}
				else if(isAvailableRightRect)
				{
					obj.assign = 2;
				}
				else {
					obj.x = obj.defaultX;
					obj.y = obj.defaultY;
					obj.assign = null;
				}

			}
			judgement = null;
		}
	});

	data.forEach(function(obj){
		obj.active = false;
	});

	isAvailableCenterRect = false;
	isAvailableContainer = false;
	isAvailableLeftRect = false;
	isAvailableRightRect = false;
	
}

function checkTouch(x1,y1,w1,h1,mouseX,mouseY)
{
	return (x1 < mouseX && mouseX < (x1 + w1) && y1 < mouseY && mouseY < (y1 + h1));
}

function getTouchPosition(x,y,mouseX,mouseY)
{
	return {x:mouseX-x,y:mouseY-y};
}

function del(obj)
{
	if(obj.isEliminatable == false)
	{
		return;
	}

	 if(obj.child)
	{
		del(obj.child)
	}
	if(obj.yes)
	{
		del(data.filter(n=> n === obj.yes)[0])
	}
	if(obj.no)
	{
		del(data.filter(n=> n === obj.no)[0])
	}
	data = data.filter(n => n != obj);
}