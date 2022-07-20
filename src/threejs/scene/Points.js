/* 热点标注精灵 */
// 引入Three.js
import * as THREE from "three/build/three.module.js";

function CreatePointsTag(obj) {
  // 1.加载精灵图配置
  var spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("./assets/光点.png"), //设置精灵纹理贴图
    transparent: true,
  });
  // 2. 精灵模型+背景透明png贴图实现光点效果
  var sprite = new THREE.Sprite(spriteMaterial);
  // 3.大小设置
  sprite.scale.set(6, 6, 1);

  /* 位置设置 */
  // 4.声明3D位置向量
  var pos = new THREE.Vector3();
  // 5.获取参数obj的世界坐标
  obj.getWorldPosition(pos);
  // 6.光点位置设置
  sprite.position.copy(pos);

  return sprite;
}
export { CreatePointsTag };
