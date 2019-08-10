'use strict';

import * as THREE from "/build/three.module.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

//variables Globales
var container;
var sceneWidth, sceneHeight;
var scene;
var renderer;
var camera;
var controls;
var cube;

init();

function init() {

  createScene();
  update();

}

function createScene() {

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  //Escena

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  //Render

  renderer = new THREE.WebGLRenderer( { antialias:true, alpha:true  } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( sceneWidth, sceneHeight );

  //Canvas
  container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );


  //Camara
  camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, 1, 1000);
  camera.position.set( 0, 50, 200 );

  //Luces

  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 0, 10 );
  scene.add(light);

  var hemi = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
  hemi.position.set( 0, 0, 5);
  scene.add( hemi );

  //Controles
  controls = new OrbitControls( camera, renderer.domElement );
  controls.update();

  //Crear Sol
  var cubeGeo = new THREE.IcosahedronGeometry( 100, 1 );
  cubeGeo.computeFlatVertexNormals();
  var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xee1122 } );
  cube = new THREE.Mesh( cubeGeo, cubeMaterial );
  cube.position.z -= 500;
  scene.add( cube );
  createPlane()

}

function createPlane() {

  var group = new THREE.Group();
  const planeBlack = new THREE.PlaneGeometry( 1200, 1200, 1, 1 );
  const planeGeo = new THREE.PlaneGeometry( 1000, 1000, 32, 32 );
  planeBlack.rotateX( -Math.PI /2 );
  planeGeo.rotateX( -Math.PI /2 );
  var vertices = planeGeo.vertices;

  for( let i = 0; i < vertices.length; i++) {

    vertices[ i ].y  = ( Math.random() > 0.8 ) ? Math.random() * 100 : 0;

  }

  planeGeo.faces.forEach( ( value ) => {

    const i = planeGeo.vertices[ value.a ];
    const j = planeGeo.vertices[ value.b ];
    const k = planeGeo.vertices[ value.c ];

    const maximo = Math.max( i.y, j.y, k.y );

    if( maximo > 1 ) return value.color.set( 0x00ccaf);
    value.color.set( 0xff0000 );

  } );

  planeGeo.verticesNeedUpdate = true;
  planeGeo.colorsNeedUpdate = true;

  const material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, wireframe: true});
  const material2 = new THREE.MeshBasicMaterial( { color: 0x000000 } );

  var mesh = new THREE.Mesh( planeGeo, material );

  group.add( new THREE.Mesh( planeBlack, material2 ) );
  group.add( mesh );
  scene.add( group );

}

function update(){

  requestAnimationFrame( update );
  render();

}

function render(){

  controls.update();
  camera.position.z += Math.sin( Math.cos( 10 ) ) / 10;
  camera.position.x += Math.cos( Math.sin( 10 ) ) / 10;
  //camera.position.y -= Math.sin( Math.cos( 10 ) ) / 10;
  camera.lookAt( cube.position )
  console.log( renderer.info.render.calls );
  renderer.render( scene, camera );

}
