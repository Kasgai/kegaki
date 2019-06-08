'use strict';

let data = [];

let startTime = new Date();

let conditions = [
	{id:0,text:"1組の平行な辺があるか"},
	{id:1,text: "頂点は三つか"},
	{id:2,text:"3辺の長さは等しいか"},
	{id:3,text:"2辺の長さが等しいか"},
	{id:4,text:"4辺の長さが等しいか"},
	{id:5,text:"直角があるか"},
	{id:6,text:"2組の平行な辺があるか"}
];

let targets = [
	{id:0,name: "四角形",
		condition:{
			0: false,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false
		}},
	{id:1,name: "正三角形",
		condition: {
			0: false,
			1: true,
			2: true,
			3: true,
			4: false,
			5: false,
			6: false
	}},
	{id:2,name: "直角二等辺三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: true,
			4: false,
			5: true,
			6: false
		}},
	{id:3,name: "二等辺三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: true,
			4: false,
			5: false,
			6: false
		}},
	{id:4,name: "直角三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: false,
			4: false,
			5: true,
			6: false
		}},
	{id:5,name: "三角形",
		condition: {
			0: false,
			1: true,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false
		}},
	{id:6,name: "正方形",
		condition: {
			0: true,
			1: false,
			2: true,
			3: true,
			4: true,
			5: true,
			6: true
		}},
	{id:7,name: "ひし形",
		condition: {
			0: true,
			1: false,
			2: true,
			3: true,
			4: true,
			5: false,
			6: true
		}},
	{id:8,name: "長方形",
		condition: {
			0: true,
			1: false,
			2: false,
			3: true,
			4: false,
			5: true,
			6: true
		}},
	{id:9,name: "平行四辺形",
		condition: {
			0: true,
			1: false,
			2: false,
			3: true,
			4: false,
			5: false,
			6: true
		}},
	{id:10,name: "台形",
		condition: {
			0: true,
			1: false,
			2: false,
			3: false,
			4: false,
			5: false,
			6: false
		}}
];

let template = {
	"result":{w:50,h:50, type:"result", active:false},
	"condition":{w:150,h:50,type:"condition",active:false}
};

var blueCircleIcon;
var blueCircle;
var conditionImage;
var assets;

let canvasWidth;
let canvasHeight;

var judgement = null;

var rectRef;

var isAvailableContainer = false;
var isAvailableCenterRect = false;
var isAvailableLeftRect = false;
var isAvailableRightRect = false;
var resultImages;
var hoverHanteiButton = false;

var projectId;

var selectedSidePanelTab;


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...
      
    } else {
      // User is signed out.
      // ...
      window.location.href = '../login.html';
    }
  });

  function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showLeftSideMenu(selected) {
	$("#leftSidePanelList").empty();
	selectedSidePanelTab = selected;
	var data;
	if(selectedSidePanelTab == 0)
	{
		$("#selectorContainer .selectorButton:first").addClass("selectorButton-selected");
		$("#selectorContainer .selectorButton:nth-child(2)").removeClass("selectorButton-selected");
		data = conditions;
	}
	else {
		$("#selectorContainer .selectorButton:nth-child(2)").addClass("selectorButton-selected");
		$("#selectorContainer .selectorButton:first").removeClass("selectorButton-selected");
		data = targets;
	}

	for (var item in data) {
		$("#leftSidePanelList").append('<li class="leftSidePanelListItem"  onmousedown=" addNewObj('+data[item].id+');">'+ (selectedSidePanelTab == 0 ? data[item].text : "<img class='targetItemImage' src='asset/"+ data[item].id +".png'>") +'</li>')
	}
}

// init
function setup(){

	projectId = getParam("id");
	if(!projectId || projectId == "")
	{
		//プロジェクトidが無い場合
		return
	}

	showLeftSideMenu(0);

	firebase.database().ref("projects/"+projectId).once("value")
        .then(function(snapshot) {
		   console.log(JSON.parse(snapshot.child("code").val()));
		   
        });

	canvasWidth = $("#container-ext").width();
	canvasHeight = $("#container-ext").height();
	let canvas = createCanvas(canvasWidth,canvasHeight);
	canvas.parent("canvas");
	textAlign(CENTER, CENTER);

	conditionImage = loadImage("../asset/orangeRect.png");
	assets = {"condition":conditionImage};
	resultImages = [loadImage("asset/0.png"),loadImage("asset/1.png"),loadImage("asset/2.png"),loadImage("asset/3.png"),loadImage("asset/4.png"),loadImage("asset/5.png"),loadImage("asset/6.png"),loadImage("asset/7.png"),loadImage("asset/8.png"),loadImage("asset/9.png"),loadImage("asset/10.png")];
	

}

// drawing graphics
function draw(){
	clear();

	drawClassifySeparate();
	data.forEach(function(obj){showObject(obj)});

	
}

function drawClassifySeparate()
{
	noFill();

	rectRef = {x: $("#leftSidePanel").width() + 25,y:25, w:canvasWidth - $("#leftSidePanel").width() - 50, h:canvasHeight - 50};
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

function saveToServer(isValidate) {
	unValidated();
	let stop = new Date();
	let outputData = $.extend([], data);
	let simpleStruct = getSimpleStructData(outputData);
	firebase.database().ref("projects/"+projectId + "/kegaki/log").push({
		code:JSON.stringify(simpleStruct),
		datetime: firebase.database.ServerValue.TIMESTAMP,
		hantei: hantei(),
		isValidate: isValidate,
		time: (stop.getTime() - startTime.getTime()) / 1000
	});
	firebase.database().ref("projects/"+projectId + "/kegaki/save").update({
		code:JSON.stringify(simpleStruct),
		datetime: firebase.database.ServerValue.TIMESTAMP,
		hantei: hantei(),
		isValidate: isValidate,
		time: (stop.getTime() - startTime.getTime()) / 1000
	});
	console.log("saved");
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
}

function validate() {
	saveToServer(true);
	$("#startButton").animate({"top":-$("#startButton").height(),"opacity":0},{duration: "normal",easing: "swing"});
	$("#validateButtonRope").animate({"top":-$("#startButton").height(),"opacity":0}, "normal","swing" ,function() {
		if(hantei()) {
			$("#validateResult").attr("src","asset/succeeded.png");
		}
		else {
			$("#validateResult").attr("src","asset/failed.png");
		}
		$("#validateResult").css({"top":-$("#validateResult").height()});
		$("#validateResult").fadeIn("normal").animate({"top":70},{duration: "normal",easing: "swing"});
		$("#validateButtonRope").animate({"top":0,"opacity":100},{duration: "normal",easing: "swing"});
	});
	
}

function unValidated() {
	$("#startButton").css({"top":70,opacity:1});
	$("#validateResult").hide();
}

function addNewObj(id) {
	$("#leftSidePanel").hide();
	if(selectedSidePanelTab == 0) {
		let n = conditions[id];
		let condition = jQuery.extend(true,{},template["condition"]);
		condition.title = n.text;
		condition.id = n.id;
		condition.x = mouseX - 20;
		condition.y = mouseY - 20;
		data.push(condition);
		mousePressed();
	}else {
		let n = targets[id];
		let result = jQuery.extend(true, {}, template["result"]);
			result.title = n.name;
			result.id = n.id;
			result.x = mouseX - 20;
			result.y = mouseY - 20;
			data.push(result);
			mousePressed();
	}
}

function hantei(){

		let outputData = $.extend([], data);

		let simpleStruct = getSimpleStructData(outputData);

		if(simpleStruct.condition1 && simpleStruct.condition2){
			//bothにある全ては両方満たす
			simpleStruct.both.forEach(function(e){
				if(!targets.find(n => n.id == e.id).condition[simpleStruct.condition1.id] || !targets.find(n => n.id == e.id).condition[simpleStruct.condition2.id]) return false;
			});
			//condition1にある全てはcondition1を満たす
			simpleStruct.condition1Elem.forEach(function(e){
				if(!targets.find(n => n.id == e.id).condition[simpleStruct.condition1.id]) return false;
			});
			//condition2にある全てはcondition2を満たす
			simpleStruct.condition2Elem.forEach(function(e){
				if(!targets.find(n => n.id == e.id).condition[simpleStruct.condition2.id]) return false;
			});
			//そこに入らないもの全ては両方満たさない
			for(var i = 0; i < targets.length; i++)
			{
				if(simpleStruct.condition2Elem.filter(x => x.id == i).length == 0 && simpleStruct.condition1Elem.filter(x => x.id == i).length == 0 && simpleStruct.both.filter(x => x.id == i).length == 0)
				{
					if(targets.find(n => n.id == i).condition[simpleStruct.condition2.id] || targets.find(n => n.id == i).condition[simpleStruct.condition1.id]) return false;
				}
			}

		}else {
			return false;
		}

		return true;
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

	$("#leftSidePanel").show();

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
					data = data.filter(n => n != obj);
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
					data = data.filter(n => n != obj);
				}

			}
			saveToServer(false);
			unValidated();
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

$(document).ready(function(){
	$(window).on("beforeunload",function(e){
		let stop = new Date();
		let outputData = $.extend([], data);
		let simpleStruct = getSimpleStructData(outputData);
		firebase.database().ref("projects/"+projectId + "/kegaki/sessions/").push({
			code:JSON.stringify(simpleStruct),
			datetime: firebase.database.ServerValue.TIMESTAMP,
			hantei: hantei(),
			time: (stop.getTime() - startTime.getTime()) / 1000
		});
	});
  });