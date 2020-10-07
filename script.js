import * as THREE from "./three.module.js";

import { OrbitControls } from "./OrbitControls.js";

var camera, scene, renderer;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    150,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.set(0, -400, 600);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  var loader = new THREE.FontLoader();
  loader.load("./helvetiker.json", function (font) {
    var xMid, text;
    var color = 0x40bb4e;
    var matDark = new THREE.LineBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    var matLite = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    var message =
      "Hi, I'm Arshad. \nI'm a developer. \nDrag this text around, \nor contact me: \narshad.e_mail@yahoo.com";
    var shapes = font.generateShapes(message, 80);
    var geometry = new THREE.ShapeBufferGeometry(shapes);
    geometry.computeBoundingBox();
    xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);
    text = new THREE.Mesh(geometry, matLite);
    text.position.z = -150;
    scene.add(text);
    var holeShapes = [];
    for (var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      if (shape.holes && shape.holes.length > 0) {
        for (var j = 0; j < shape.holes.length; j++) {
          var hole = shape.holes[j];
          holeShapes.push(hole);
        }
      }
    }

    shapes.push.apply(shapes, holeShapes);
    var lineText = new THREE.Object3D();
    for (var i = 0; i < shapes.length; i++) {
      var shape = shapes[i];
      var points = shape.getPoints();
      var geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.translate(xMid, 0, 0);
      var lineMesh = new THREE.Line(geometry, matDark);
      lineText.add(lineMesh);
    }

    scene.add(lineText);
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  var controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  renderer.render(scene, camera);
}
