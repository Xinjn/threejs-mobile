/* 渲染摄像机 */

// 引入Three.js
import * as THREE from "three";
// 引入Three.js扩展库
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 渲染HTML元素标签的渲染器CSS2DRenderer
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// width和height用来设置Three.js输出Canvas画布尺寸，同时用来辅助设置相机渲染范围
var width = window.innerWidth; //窗口文档显示区的宽度
var height = window.innerHeight; //窗口文档显示区的高度

/**
 * 透视投影相机设置
 */
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
var camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
camera.position.set(292, 223, 185); //相机在Three.js三维坐标系中的位置
camera.lookAt(0, 0, 0); //相机指向Three.js坐标系原点

/**
 * 创建渲染器对象
 */
var renderer = new THREE.WebGLRenderer({
  antialias: true, //开启锯齿
});
renderer.setPixelRatio(window.devicePixelRatio); //设置设备像素比率,防止Canvas画布输出模糊。
renderer.setSize(width, height); //设置渲染区域尺寸
// renderer.setClearColor(0xffffff, 1); //设置背景颜色
// renderer.domElement表示Three.js渲染结果,也就是一个HTML元素(Canvas画布)
// document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

/**
 * 创建控件对象  控件可以监听鼠标的变化，改变相机对象的属性
 */
// 旋转：拖动鼠标左键
// 缩放：滚动鼠标中键
// 平移：拖动鼠标右键
var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; //禁止右键拖拽
// 缩放范围限制
controls.minDistance = 200; //相机距离观察目标点极小距离——模型最大状态
controls.maxDistance = 500; //相机距离观察目标点极大距离——模型最小状态

/**
 * 文本渲染对象：创建一个CSS2渲染器CSS2DRenderer
 */
var labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
// 相对标签原位置位置偏移大小
labelRenderer.domElement.style.top = "20px";
labelRenderer.domElement.style.left = "240px"; //HTML标签尺寸宽度一半
// //设置.pointerEvents=none，以免模型标签HTML元素遮挡鼠标选择场景模型
// labelRenderer.domElement.style.pointerEvents = 'none';//不执行，默认情况下，弹出标签后整个界面都不能操作
document.body.appendChild(labelRenderer.domElement);
/* 初始不渲染HTML标签，鼠标点击后在渲染出来 */
labelRenderer.domElement.style.display = "none";

/**
 * onresize 事件会在窗口被调整大小时发生
 */
window.onresize = function () {
  // 重置渲染器输出画布canvas尺寸
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
  // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
  camera.updateProjectionMatrix();

  // 实时改变文本对象的位置
  labelRenderer.setSize(window.innerWidth, window.innerHeight);

  // 实时改变颜色元素的位置
  var div = document.getElementById("color");
  div.style.left = (window.innerWidth - 314) / 2 + "px";
};

export {
  renderer, // 渲染器渲染器对象
  camera, // 摄像机对象
  labelRenderer, // 文本渲染器对象
};
