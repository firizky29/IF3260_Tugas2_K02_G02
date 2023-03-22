import WebGL2Handler from './utils/classes/WebGL2Handler.js';
import Converter from './utils/Converter.js';
import UIHandler from './utils/UIHandler.js';

const webgl2 = new WebGL2Handler(document.querySelector('canvas')).init();
const state = {
  model: { vertices: [], colors: [] },
  translation: [0, 0, 0],
  rotation: [
    Converter.degToRad(0),
    Converter.degToRad(0),
    Converter.degToRad(0),
  ],
  scale: [1, 1, 1],
};
const renderSettings = {
  primitiveType: webgl2.getGl().TRIANGLES,
  drawCounter: state.model.vertices.length,
};

const eventHandler = {
  updatePosition(index) {
    return (event, value) => {
      state.translation[index] = value;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateRotation(index) {
    return (event, value) => {
      const angleInDegrees = value;
      const angleInRadians = Converter.degToRad(angleInDegrees);
      state.rotation[index] = angleInRadians;
      webgl2.clearBuffer().render(renderSettings, state);
    };
  },

  updateScale(index) {
    return (event, value) => {
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
          console.log(JSON.parse(content));
          state.model = JSON.parse(content);
          renderSettings.drawCounter = state.model.vertices.length;
          webgl2
            .clearBuffer()
            .setVertices(state.model.vertices)
            .setColors(state.model.colors)
            .render(renderSettings, state);
        };
      };
      input.click();
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

webgl2
  .clearBuffer()
  .setVertices(state.model.vertices)
  .setColors(state.model.colors)
  .render(renderSettings, state);
