import * as THREE from 'three';
import { Hands     } from '@mediapipe/hands/hands';
import { FaceMesh  } from '@mediapipe/face_mesh/face_mesh';

//
// Hands
//
const handsProc = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});

handsProc.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const MAX_HAND_POINT = 21;
var fingers = [ new Array(MAX_HAND_POINT), new Array(MAX_HAND_POINT)];
for(let i=0; i<MAX_HAND_POINT; i++)
{
  fingers[0][i] = new THREE.Vector2();
  fingers[1][i] = new THREE.Vector2();
}

var hands = [ new THREE.Vector2(), new THREE.Vector2()];

// Hands results
function onHandsResults(results)
{
  for (let f = 0; f < fingers[0].length; f++)
    fingers[0][f].x = fingers[0][f].y = 
    fingers[1][f].x = fingers[1][f].y = 0;
    
  hands[0].x = hands[0].y = hands[1].x = hands[1].y = 0;
  
  try
  {
    if (results.multiHandLandmarks && results.multiHandedness)
    {
      for (let h = 0; h < results.multiHandLandmarks.length; h++)
      {
          if( !results.multiHandLandmarks[h] )
            continue;
          for (let f = 0; f < results.multiHandLandmarks[h].length; f++)
          {
            if(!results.multiHandLandmarks[h][f])
              continue;
            
            fingers[h][f].x = results.multiHandLandmarks[h][f].x;
            fingers[h][f].y = 1 - results.multiHandLandmarks[h][f].y;

            hands[h].x += fingers[h][f].x;
            hands[h].y += fingers[h][f].y;
          }
      }

      hands[0].x /= MAX_HAND_POINT;
      hands[0].y /= MAX_HAND_POINT;
      hands[1].x /= MAX_HAND_POINT;
      hands[1].y /= MAX_HAND_POINT;
    }
  
  } catch(e)
  {
      console.error(e); 
  }
}

handsProc.onResults(onHandsResults);

//
// Face
//
const faceProc = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});

faceProc.setOptions({
  maxNumFaces: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

const MAX_FACE_POINT = 468;
var face = [];
for(let i=0; i<MAX_FACE_POINT; i++)
{
  face[i] = new THREE.Vector2();
}

var needsDraw = false;

// Face results
function onFaceMeshResults(results)
{
  needsDraw = false;
  if (results.multiFaceLandmarks)
  {
    for (const landmarks of results.multiFaceLandmarks)
    {
      needsDraw = true;      
      for (let i=0; i<MAX_FACE_POINT; i++ )
      {
          face[i].x = landmarks[i].x;
          face[i].y = 1 - landmarks[i].y;
      }
    }
  }
}

faceProc.onResults(onFaceMeshResults);

export { handsProc, faceProc, fingers, hands, face, needsDraw };