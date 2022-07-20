/* 渲染循环动画 */

import { scene } from "./scene/index.js"; //Three.js三维场景
import { renderer, camera, labelRenderer } from "./RendererCamera.js"; //渲染器对象和相机对象
import { model } from "./scene/model.js"; //手机模型
// GUI
import { guiControls } from "./gui.js";

// 渲染
function render() {
  labelRenderer.render(scene, camera); //渲染HTML标签对象
  renderer.render(scene, camera); //执行渲染操作
  requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();

// 开始循环动画
let rotateFrame = null;
function rotateAnimation() {
  //设置产品模型旋转动画
  // model.rotateY(0.005); //手机绕y轴旋转

  //三维场景绕y轴旋转
  if (guiControls.旋转) {
    scene.rotateY(0.005);
  }
  rotateFrame = requestAnimationFrame(rotateAnimation); //请求再次执行函数rotateAnimation
}
rotateAnimation();

// 停止循环动画
function stopRotateAnimaiton() {
  cancelAnimationFrame(rotateFrame); //手机旋转展示动画停止
}

export { renderer, rotateAnimation, stopRotateAnimaiton };
