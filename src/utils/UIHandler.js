const UIHandler = {
  initSlider(sliderSelector, options) {
    const slider = document.querySelector(sliderSelector);
    let { initialValue = 0, handlerFn } = options;
    slider.value = initialValue;

    slider.addEventListener('input', (event) => {
      const value = parseFloat(event.target.value);
      handlerFn(event, value);
    });
  },
};

export default UIHandler;
