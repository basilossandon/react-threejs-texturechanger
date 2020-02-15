import React, {useState} from "react";
import * as THREE from "three";

// Loaders
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// Controllers
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Models & Textures
import sillaGltf from './Silla.glb';
import sillaFbx from './Silla.fbx';

import brownLeather from './fabric.jpg';
import blueTexture from './azul.jpg';
import redTexture from './rojo.jpg';
import blackText from './black.png';


export default function App() {

// Init scene, render & camera
var scene = new THREE.Scene();
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

  // Lights

var ambientLight = new THREE.AmbientLight(0xcccccc, 0.1);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 0.7);
camera.add(pointLight);
scene.add(camera);

var light = new THREE.HemisphereLight( 0xbbbbff, 0x444422 );
scene.add( light );


// Load textures 
const textureLoader = new THREE.TextureLoader();
const leather = textureLoader.load(brownLeather);
const blue = textureLoader.load(blueTexture);
const red = textureLoader.load(redTexture);
const black = textureLoader.load(blackText);
const textures = [black,blue,red];

// Load model with initial textures
const loader = new GLTFLoader();
var chair;
loader.load(sillaGltf, function (gltf) {
  console.log(gltf);
  var mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });

  
  chair = gltf.scene 
  chair.position.set(-2,0,0);
  chair.traverse( function ( child ) {
    if ( child.isMesh ){
      child.material.map = leather;
    }
  });
  console.log('animations: ', gltf.animations[0])
  scene.add( gltf.scene );
  mixer = new THREE.AnimationMixer( gltf );
      mixer.clipAction( gltf.animations[ 0 ] ).play();
      animate();
  }, undefined, function ( error ) {
  console.error( error );
});

const loader2 = new FBXLoader();
var chair2;
loader2.load(sillaFbx, function (gltf) {
console.log(gltf);
  var mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
  chair2 = gltf.scene;
  scene.add( chair2 );
}, undefined, function ( error ) {
  console.error( error );
});



    
// Begin render
var animate = function () {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();
var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

      
// Raycast mouse to select child object
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener( 'mousemove', onMouseMove, false );
var canvas = document.getElementsByTagName('canvas');
canvas = canvas[0];
canvas.addEventListener('click', onCanvasClick);


// Change textures

var indexBack = 0;
function changeBackSeatTexture(){
  console.log("change backrest");
  chair.traverse( function ( child ) {
    if ( child.isMesh ) {
      if(child.name === "respaldar_2"){
        child.material.map = textures[indexBack];
        indexBack = indexBack + 1;
        if (indexBack > textures.length-1){
          indexBack = 0;
        }
      }
    }
  }
)};

var indexSeat = 0;
function changeSeaterTexture(){
console.log("change seat");
chair.traverse( function ( child ) {
  if ( child.isMesh ) {
    if(child.name === "Asiento_2"){
      child.material.map = textures[indexSeat];
      indexSeat = indexSeat + 1;
      if (indexSeat > textures.length-1){
        indexSeat = 0;
      }
    }
  }
}
)};

function onCanvasClick(){
  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
	// calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( scene.children, true );
  if(intersects.length){
    if(intersects[0].object.userData.name){
      var intersectedObject = intersects[0].object.userData.name;
      console.log(intersectedObject);

      if(intersectedObject === 'Asiento_2'){
        changeSeaterTexture();
        }
      if(intersectedObject === 'respaldar_2'){
        changeBackSeatTexture();
      }
      }
    }
  }
    return (
      <div/>
    )
  }


