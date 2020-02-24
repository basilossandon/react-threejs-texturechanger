import React, { useState } from "react";
import * as THREE from "three";

// Loaders
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Controllers
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Models & Textures
import sillaGltf from './silla.glb';

import brownLeather from './fabric.jpg';
import blueTexture from './azul.jpg';
import redTexture from './rojo.jpg';
import blackText from './black.png';


export default function App() {

  // Init scene, render & camera
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();
  var mixer, animationClip;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  var pixelDensity = 2;
  renderer.setPixelRatio(pixelDensity);
  var camera = new THREE.PerspectiveCamera(75, (window.innerWidth) / (window.innerHeight), 0.1, 1000);
  camera.position.set(0, 6, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.position.z = 5;
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  scene.add(new THREE.GridHelper(500, 100, 0x666666, 0x444444));

  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  var axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Lights

  var ambientLight = new THREE.AmbientLight(0xcccccc, 0.1);
  scene.add(ambientLight);

  var pointLight = new THREE.PointLight(0xffffff, 0.7);
  camera.add(pointLight);
  scene.add(camera);

  var light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
  scene.add(light);


  // Load textures 
  const textureLoader = new THREE.TextureLoader();
  const leather = textureLoader.load(brownLeather);
  const blue = textureLoader.load(blueTexture);
  const red = textureLoader.load(redTexture);
  const black = textureLoader.load(blackText);
  const textures = [black, blue, red];

  // Load model with initial textures and play animations
  var action;
  var action2;
  var action3;

  const loader = new GLTFLoader();
  var chair;
  loader.load(sillaGltf, function (gltf) {
    console.log(gltf);
    chair = gltf.scene;
    gltf.scene.position.set(0, 0, 0);
    mixer = new THREE.AnimationMixer(gltf.scene);
    action = mixer.clipAction(gltf.animations[1]);
    action2 = mixer.clipAction(gltf.animations[2]);

    scene.add(gltf.scene);
  });

  // Begin render
  var animate = function () {
    requestAnimationFrame(animate);
    render();
  }
  var render = function () {
    var delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }
    renderer.render(scene, camera);
  }
  animate();

  // Raycast mouse to select child object
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  window.addEventListener('mousemove', onMouseMove, false);
  var canvas = document.getElementsByTagName('canvas');
  canvas = canvas[0];
  canvas.addEventListener('click', onCanvasClick);


  // Change textures

  var indexBack = 0;
  function changeBackSeatTexture() {
    action2.play();
    chair.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "Back") {
          child.material.map = textures[indexBack];
          indexBack = indexBack + 1;
          if (indexBack > textures.length - 1) {
            indexBack = 0;
          }
        }
      }
    }
    )
  };

  var indexSeat = 0;
  function changeSeaterTexture() {
    action.play();

    chair.traverse(function (child) {
      if (child.isMesh) {
        if (child.name === "Seat") {
          child.material.map = textures[indexSeat];
          indexSeat = indexSeat + 1;
          if (indexSeat > textures.length - 1) {
            indexSeat = 0;
          }
        }
      }
    }
    )
  };



  function onCanvasClick() {
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length) {
      if (intersects[0].object.userData.name) {
        var intersectedObject = intersects[0].object.userData.name;
        console.log(intersectedObject);
        if (intersectedObject === 'Seat') {
          changeSeaterTexture();
        }
        if (intersectedObject === 'Back') {
          changeBackSeatTexture();
        }
      }
    }
  }
  return (
    <div />
  )
}


