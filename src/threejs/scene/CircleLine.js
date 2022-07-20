// 引入Three.js
import * as THREE from "three/build/three.module.js";

/**
 * 声明模型组
 */
var CircleLine = new THREE.Group(); //线模型和720符号父对象

/**
 * 圆弧线条模型
 */
// 1.声明一个几何体对象BufferGeometry
var geometry = new THREE.BufferGeometry();
// 2.配置圆弧数据
var R = 50; //圆弧半径
var arc = new THREE.ArcCurve(
  0, // 圆弧坐标原点x
  0, // 圆弧坐标原点y
  R,
  Math.PI / 2 + Math.PI / 6, // 圆弧起始角度:2 * Math.PI
  Math.PI / 2 - Math.PI / 6 // 圆弧起始角度:2 * Math.PI
);
// 3.getPoints是基类Curve的方法，返回一个vector2对象作为元素组成的数组
var points = arc.getPoints(50); //分段数50，返回51个顶点
// 4.setFromPoints方法从points中提取数据改变几何体的顶点位置数据.attributes.position
geometry.setFromPoints(points);
// 5.材质对象
var material = new THREE.LineBasicMaterial({
  color: 0xffffff, //线条颜色
});
// 6.线条模型对象
var line = new THREE.Line(geometry, material);
// 7.绕x轴旋转90度
line.rotateX(Math.PI / 2);
// 8. 传入模型组
CircleLine.add(line);

/**
 * 字体模型
 */
// 1. 声明字体加载器
var loader = new THREE.FontLoader();
// 2.THREE.FontLoader加载字体
loader.load("./fonts/helvetiker_bold.typeface.json", function (font) {
  // 材质对象
  var material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  // 3.generateShapes()：获得字符'720°'的轮廓顶点坐标
  var Shapes = font.generateShapes(
    "720°", //内容
    10 //10)控制字符大小
  );
  // 4.通过多个多边形轮廓生成字体
  var geometry = new THREE.ShapeGeometry(Shapes);
  // 5.字体贴图
  var textMesh = new THREE.Mesh(geometry, material);
  textMesh.position.z = R;
  textMesh.position.x = -12;
  // 8. 传入模型组
  CircleLine.add(textMesh);
});

// 调整位置：平移到产品的底部
CircleLine.position.y -= 78;

export { CircleLine };
