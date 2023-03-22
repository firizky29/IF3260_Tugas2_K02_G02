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

	initRadio(radioSelector, options) {
		const radio = document.querySelector(radioSelector);
		let { initialValue = 0, handlerFn } = options;
		radio.value = initialValue;

		radio.addEventListener('change', (event) => {
			const value = event.target.value;
			handlerFn(event, value);
		});
	},

	initButton(buttonSelector, options) {
		const button = document.querySelector(buttonSelector);
		let { handlerFn } = options;

		button.addEventListener('click', (event) => {
			handlerFn(event);
		});
	}
};

export default UIHandler;
