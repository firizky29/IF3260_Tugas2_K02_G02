import WebGL2Handler from './utils/classes/WebGL2Handler.js';
import Converter from './utils/Converter.js';
import UIHandler from './utils/UIHandler.js';

let webgl2 = new WebGL2Handler(document.querySelector('canvas')).init();
let state = {
  model: { vertices: [], colors: [], normals: [] },
  translation: [0, 0, 0],
  rotation: [
    Converter.degToRad(0),
    Converter.degToRad(0),
    Converter.degToRad(0),
  ],
  animation_rotation: [
    Converter.degToRad(0),
    Converter.degToRad(0),
    Converter.degToRad(0),
  ],
  scale: [1, 1, 1],
  projectionType: 'orthographic',
  useLighting: true,
  fudgeFactor: 0,
  obliqueTetha: 0,
  obliquePhi: 0,
  cameraRadius: 1.3,
  cameraRotation: Converter.degToRad(0),
  animation: false,
};
const renderSettings = {
  primitiveType: webgl2.getGl().TRIANGLES,
  drawCounter: state.model.vertices.length,
};

const eventHandler = {
  updatePosition(index) {
    return (event, value) => {
      state.animation = false;
      state.translation[index] = value;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateRotation(index) {
    return (event, value) => {
      state.animation = false;
      const angleInDegrees = value;
      const angleInRadians = Converter.degToRad(angleInDegrees);
      state.rotation[index] = angleInRadians;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateScale(index) {
    return (event, value) => {
      state.animation = false;
      state.scale[index] = value;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  openModel() {
    return (event) => {
      var input = document.createElement('input');
      input.type = 'file';
      input.setAttribute('accept', 'application/json, .txt');
      input.onchange = (e) => {
        var file = e.target.files[0];

        if (!file) {
          return;
        }

        
        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        
        reader.onload = (readerEvent) => {
          var content = readerEvent.target.result;
          content = JSON.parse(content);
          // set all to default
          state.model = content    
          renderSettings.drawCounter = content.vertices.length;
          const toDefault = document.querySelector('button#toDefault')
          toDefault.click();

          webgl2.destroy();
          webgl2 = new WebGL2Handler(document.querySelector('canvas')).init();
          
          webgl2
            .clearBuffer()
            .setVertices(state.model.vertices)
            .setColors(state.model.colors)
            .setNormals(state.model.normals)
            .render(renderSettings, state);
        };
      };
      input.click();
    };
  },

  updateProjectionType() {
    return (event) => {
      state.projectionType = event.target.value;

      if (state.projectionType === 'perspective') {
        state.fudgeFactor = 0.3;
      } else {
        state.fudgeFactor = 0;
      }

      if (state.projectionType === 'oblique') {
        state.obliqueTetha = Converter.degToRad(63.5);
        state.obliquePhi = Converter.degToRad(63.5);
      } else {
        state.obliqueTetha = 0;
        state.obliquePhi = 0;
      }

      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateShadingState() {
    return (event) => {
      state.useLighting = event.target.checked;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateCameraRadius() {
    return (event, value) => {
      state.cameraRadius = value;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateCameraRotation() {
    return (event, value) => {
      state.cameraRotation = Converter.degToRad(value);
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  toDefaultButtonHandler() {
    return (event) => {
      const initialState = {
        translation: [0, 0, 0],
        rotation: [
          Converter.degToRad(0),
          Converter.degToRad(0),
          Converter.degToRad(0),
        ],
        animation_rotation: [
          Converter.degToRad(0),
          Converter.degToRad(0),
          Converter.degToRad(0),
        ],
        scale: [1, 1, 1],
        projectionType: 'orthographic',
        useLighting: true,
        fudgeFactor: 0,
        obliqueTetha: 0,
        obliquePhi: 0,
        cameraRadius: 1.3,
        cameraRotation: Converter.degToRad(0),
        animation: false,
      };
      document.querySelector('#projection').value = initialState.projectionType;
      document.querySelector('#shading').value = initialState.useLighting;
      document.querySelector('#cameraRadius').value = initialState.cameraRadius;
      document.querySelector('#cameraRotation').value =
        initialState.cameraRotation;
      document
        .querySelectorAll('.translation')
        .forEach((el, idx) => (el.value = initialState.translation[idx]));
      document
        .querySelectorAll('.rotation')
        .forEach((el, idx) => (el.value = initialState.rotation[idx]));
      document
        .querySelectorAll('.scaling')
        .forEach((el, idx) => (el.value = initialState.scale[idx]));

      state = { ...initialState, model: state.model}
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },
};

UIHandler.initSlider('#tx', {
  initialValue: state.translation[0],
  handlerFn: eventHandler.updatePosition(0),
});

UIHandler.initSlider('#ty', {
  initialValue: state.translation[1],
  handlerFn: eventHandler.updatePosition(1),
});

UIHandler.initSlider('#tz', {
  initialValue: state.translation[2],
  handlerFn: eventHandler.updatePosition(2),
});

UIHandler.initSlider('#rx', {
  initialValue: state.rotation[0],
  handlerFn: eventHandler.updateRotation(0),
});

UIHandler.initSlider('#ry', {
  initialValue: state.rotation[1],
  handlerFn: eventHandler.updateRotation(1),
});

UIHandler.initSlider('#rz', {
  initialValue: state.rotation[2],
  handlerFn: eventHandler.updateRotation(2),
});

UIHandler.initSlider('#sx', {
  initialValue: state.scale[0],
  handlerFn: eventHandler.updateScale(0),
});

UIHandler.initSlider('#sy', {
  initialValue: state.scale[1],
  handlerFn: eventHandler.updateScale(1),
});

UIHandler.initSlider('#sz', {
  initialValue: state.scale[2],
  handlerFn: eventHandler.updateScale(2),
});

UIHandler.initButton('#model', {
  handlerFn: eventHandler.openModel(),
});

UIHandler.initRadio('#projection', {
  initialValue: state.projectionType,
  handlerFn: eventHandler.updateProjectionType(),
});

UIHandler.initCheckbox('#shading', {
  initialValue: state.useLighting,
  handlerFn: eventHandler.updateShadingState(),
});

UIHandler.initSlider('#cameraRadius', {
  initialValue: state.cameraRadius,
  handlerFn: eventHandler.updateCameraRadius(),
});

UIHandler.initSlider('#cameraRotation', {
  initialValue: state.cameraRotation,
  handlerFn: eventHandler.updateCameraRotation(),
});

UIHandler.initButton('button#toDefault', {
  handlerFn: eventHandler.toDefaultButtonHandler(),
});



webgl2
  .clearBuffer()
  .setVertices(state.model.vertices)
  .setColors(state.model.colors)
  .setNormals(state.model.normals)
  .render(renderSettings, state);

const saveToJSON = () => {
  let { vertices, colors, normals } = state.model;

  const json = JSON.stringify({ vertices, colors, normals });
  const data = new Blob([json], { type: 'text/plain' });
  const textFile = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.setAttribute('download', 'shapes.json');
  link.href = textFile;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
document.getElementById('save').addEventListener('click', saveToJSON);

const startAnimation = () => {
  state.animation = true;
  webgl2.clearBuffer().renderAnimation(renderSettings, state);
}
document.getElementById('animate').addEventListener('click', startAnimation);

const stopAnimation = () => {
  state.animation = false;
  webgl2.clearBuffer().renderAnimation(renderSettings, state);
}
document.getElementById('stop_animate').addEventListener('click', stopAnimation);

