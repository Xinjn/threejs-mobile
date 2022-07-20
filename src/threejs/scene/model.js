// 引入Three.js
import * as THREE from "three/build/three.module.js";
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 热点标注精灵
import { CreatePointsTag } from "./Points.js";
// 通过CSS2DObject把HTML元素包装为一个类似网格模型Mesh的three.js模型对象
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

/**
 * 声明模型组
 */
var model = new THREE.Group(); //声明一个组对象，用来添加加载成功的三维场景
var loader = new GLTFLoader(); //创建一个GLTF加载器
var mobilePhoneMesh = null; //指向手机网格模型Mesh
var sprite = null; //热点标注精灵sprite

/**
 * 手机模型
 */
// 1.加载环境贴图
var textureCube = new THREE.CubeTextureLoader()
  .setPath("./model/envMap/")
  .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

// 2. 加载手机模型
loader.load("./model/手机.glb", function (gltf) {
  // 3.加载热点标注精灵
  // 模型中包含两个空对象分别对应手机前后摄像头的位置，主要是为了方便读取摄像头的世界坐标
  var frontObject3D = gltf.scene.getObjectByName("后置摄像头位置");
  sprite = CreatePointsTag(frontObject3D);
  sprite.position.x -= 6; //向右侧稍微偏移，不要叠加在相机上
  sprite.position.z -= 4; //根据sprite大小平移，避免任意观察角度精灵插入到相机内
  model.add(sprite); // 把sprite中的所有模型添加到model组对象中

  // 4. 根据手机节点名称.name找到对应模型对象（找到手机Mesh）
  var mesh = gltf.scene.getObjectByName("手机");
  mobilePhoneMesh = mesh; // 导出手机网格模型Mesh数据

  // 多个半透明对象叠加，three.js渲染的时候很可能出现问题，可以尝试手动排序解决
  mesh.renderOrder = 0; //renderOrder小的先渲染
  sprite.renderOrder = 1;

  // 5.设置纹理贴图
  // 纹理贴图加载器
  var texLoader = new THREE.TextureLoader();
  // mesh.material：设置手机Mesh材质
  mesh.material = new THREE.MeshStandardMaterial({
    // color:0xffffff,
    metalness: 1.0, //Mesh表面金属度，默认值0.5
    roughness: 1.0, //Mesh表面粗糙度，默认值0.5
    map: texLoader.load("./model/basecolor.png"), //颜色贴图
    // 金属度、粗糙度贴图表示的值会和金属度、粗糙度分别相乘
    roughnessMap: texLoader.load("./model/roughness.png"), //粗糙度贴图
    metalnessMap: texLoader.load("./model/metallic.png"), //金属度贴图
    // 相机镜头等位置需要设置半透明效果(设置alphaMap和transparent属性)
    alphaMap: texLoader.load("./model/opacity.png"), //alpha贴图

    normalMap: texLoader.load("./model/normal.png"), //法线贴图
    transparent: true, //使用alphaMap，注意开启透明计算
    envMap: textureCube, //设置pbr材质环境贴图，渲染效果更好
    envMapIntensity: 0.5, //设置环境贴图对模型表面影响程度
  });
  // 纹理朝向texture.flipY
  mesh.material.map.flipY = false;
  mesh.material.normalMap.flipY = false;
  mesh.material.metalnessMap.flipY = false;
  mesh.material.roughnessMap.flipY = false;
  mesh.material.alphaMap.flipY = false;

  // 6.把gltf.scene中的所有模型添加到model组对象中
  model.add(gltf.scene);

  // 7.动画：设置标注精灵Sprite波动，提示用户点击
  var s = 0.0;
  function waveAnimation() {
    //设置产品模型旋转动画
    s += 0.01;
    if (s < 0.5) {
      sprite.scale.x = 6 * (1 + s);
      sprite.scale.y = 6 * (1 + s);
    } else if (s >= 0.5 && s < 1.0) {
      sprite.scale.x = 6 * (2 - s);
      sprite.scale.y = 6 * (2 - s);
    } else {
      s = 0.0;
    }

    requestAnimationFrame(waveAnimation); //请求再次执行函数waveAnimation
  }
  waveAnimation();

  // 8. 创建一个HTML元素作为标签标注相机对应sprite对象
  // 选择id为camera的一个HTML元素作为标签标注相机对象热点位置
  var div = document.getElementById("camera");
  div.style.visibility = "visible";
  //div元素包装为CSS2模型对象CSS2DObject
  var label = new CSS2DObject(div);
  // 设置HTML元素标签在three.js世界坐标中位置
  label.position.copy(sprite.position);
  model.add(label);
});

export {
  model, // 手机模型
  mobilePhoneMesh, // 手机网格模型Mesh
  sprite, // 精灵图
};
