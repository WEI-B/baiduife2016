/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city=document.getElementById("aqi-city-input").value;
	var value=document.getElementById("aqi-value-input").value;
	var rCity=/^([\u4e00-\u9fa5]+)|([a-zA-Z]+)$/;
	var rValue = /^\d+$/;
	
	if(city==""){
		alert("请输入城市信息！");
		return false;
	}else if(value==""){
		alert("请输入空气质量！");
		return false;
	}else if(!rCity.test(city)){
		alert("城市为中英文！");
		return false;
	}else if(!rValue.test(value)){
		alert("空气质量为数字！");
		return false;
	}
	aqiData[city]=value;
	return aqiData;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var table=document.getElementById("aqi-table");
	table.innerHTML = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
	var arr = [];
	for (var city in aqiData) 
	{
	   arr.push('<tr><td>'+city+'</td><td>'+aqiData[city]+'</td><td><button>删除</button></td></tr>');
	}
    table.innerHTML = arr.join('');
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(e) {
  // do sth.
  e=e||window.event;
  var target=e.srcElement||e.target;
  if(target.nodeName.toLowerCase()=="button"){
	var city=target.parentNode.previousSibling.previousSibling.innerHTML;
	delete aqiData[city];
    target.parentNode.parentNode.remove();
  }
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  document.getElementById("add-btn").addEventListener("click",addBtnHandle);
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	document.getElementById("aqi-table").addEventListener("click",delBtnHandle);

}

init();