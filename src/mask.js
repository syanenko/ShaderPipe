import * as THREE from 'three';

// Mask prepare
const MAX_POINTS = 18;
const NUM_TRIANGLES = 6;
const positions = new Float32Array( MAX_POINTS * 3 );
var normals     = new Float32Array( NUM_TRIANGLES * 3 * 3 );
var colors      = new Float32Array( NUM_TRIANGLES * 3 * 3 );
// var uvs         = new Float32Array( NUM_TRIANGLES * 3 * 2 );

// colors
var color = new THREE.Color();
for(let t=0; t<NUM_TRIANGLES; t++)
{
  let c = t << 3; 
  color.setRGB( 1, 0, 0 );
  colors[c++] = color.b;
  colors[c++] = color.g;
  colors[c++] = color.r;
  
  color.setRGB( 0, 1, 0 );
  colors[c++] = color.b;
  colors[c++] = color.g;
  colors[c++] = color.r;
  
  color.setRGB( 0, 0, 1 );
  colors[c++] = color.b;
  colors[c++] = color.g;
  colors[c++] = color.r;
}

// uvs
/*
uvs[0] = 0;
uvs[1] = 1;
*/

var maskGeom = new THREE.BufferGeometry();
maskGeom.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
maskGeom.setAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
maskGeom.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
// maskGeom.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
maskGeom.setDrawRange( 0, 19);

const maskMat = new THREE.MeshPhongMaterial( { vertexColors: true } );
var mask = new THREE.Mesh(maskGeom, maskMat);
mask.position.z = -1;

// Marks
const marksMat = new THREE.PointsMaterial( { color: 0x00FF00, size: 4.0 } );
var marks = new THREE.Points( maskGeom, marksMat );

// Masks points
const maskPoints = [[152, 313, 83, 164, 37, 267], // Beard and mustache
                    [101, 23, 110, 330, 339, 253, 444, 333, 443, 224, 223, 104], // Eyes
                    [101, 23, 110, 330, 339, 253, 444, 333, 443, 224, 223, 104, 152, 313, 83, 164, 37, 267], // Daemon
                    [9, 337, 108]];

export {mask, marks, maskPoints};
