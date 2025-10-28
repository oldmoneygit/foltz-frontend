(() => {
	const init = (section) => {
		let sectionNumbers;

		if (document.currentScript) {
			sectionNumbers = document.currentScript.parentElement;
		} else {
			sectionNumbers = section;
		}

		if (!sectionNumbers || !sectionNumbers.classList.contains('section-numbers')) return;

		/* A number of simbols after comma */
		const getNumberLengthAfterComma = (x, symbol) => 
			x.toString().includes(symbol) ? x.toString().split(symbol).pop().length : 0;

		const getNumbers = () => {
			const odometerElems = sectionNumbers.querySelectorAll(".numbers-card__number");
			const regex = /[0-9]*[.,\s]?[0-9]*[.,\s]?[0-9]*[.,\s]?[0-9]+/g;
			let nums = [];

			odometerElems.forEach((el) => {
				nums.push(el.getAttribute("data-content").trim().match(regex));
			});

			return nums.flat(1);
		};

		const initNumbers = () => {
			const odometerElems = sectionNumbers.querySelectorAll(".numbers-card__number");
			const regex = /[0-9]*[.,\s]?[0-9]*[.,\s]?[0-9]*[.,\s]?[0-9]+/g;

			odometerElems.forEach((el) => {
				el.innerHTML = el
					.getAttribute("data-content")
					.replace(regex, `<span class="js-num">$&</span>`);
			});
		};

		let od = [];
		const numbers = getNumbers();

		const initAnimation = () => {
			sectionNumbers.querySelectorAll(".js-num").forEach((num, i) => {
				let odometerNumber = numbers[i];
				let iterator = 0;
				let digitsLength = "";
				let format = "d";

				if ((odometerNumber.toString().indexOf('.') != -1) 
					&& (odometerNumber.toString().indexOf('.') < odometerNumber.toString().indexOf(',') ||
					odometerNumber.toString().indexOf(',') == -1)) {
					iterator = getNumberLengthAfterComma(odometerNumber, '.');
					if (iterator > 2) {
						if (odometerNumber.toString().includes(',')) {
							iterator = getNumberLengthAfterComma(odometerNumber, ',');
							format = '(.ddd),'
						}
						else {
							iterator = 0;
							format = '(.ddd),dd'
						}
					}
					else 
						format = '(ddd).'
				}

				if ((odometerNumber.toString().indexOf(',') != -1) 
				&& (odometerNumber.toString().indexOf(',') < odometerNumber.toString().indexOf('.') ||
					odometerNumber.toString().indexOf('.') == -1)) {
					if (odometerNumber.toString().includes('.')) {
						iterator = getNumberLengthAfterComma(odometerNumber, '.');
						format = '(,ddd).'
					}
					else {
						format = '(,ddd)'
					}
				}
				
				if (odometerNumber.toString().indexOf(' ') != -1) {
					format = '( ddd),dd'
				}

				for (let i = 0; i < iterator; i++) {
					digitsLength += "d";
				}

				format = format + digitsLength;

				od[i] = new Odometer({
					el: num,
					format: format,
					theme: "default",
					value: odometerNumber.replace(/[0-9]+/, "0"),
				});
			});
		};

		const initSlider = () => {
			let numbersSlider;
			let navigation;
			let pagination;

			numbersSlider = sectionNumbers.querySelector(".js-slider-numbers");

			navigation = sectionNumbers.querySelector(".numbers__navigation");
			pagination = sectionNumbers.querySelector(".numbers__pagination");

			if (numbersSlider) {
				const numbersSwiper = new Swiper(numbersSlider, {
					slidesPerView: 1,
					spaceBetween: 1,
					loop: true,
					navigation: {
						nextEl: navigation?.querySelector(".swiper-button-next"),
						prevEl: navigation?.querySelector(".swiper-button-prev"),
					},
					pagination: {
						el: pagination,
						clickable: true,
					},
					on: {
						slideChangeTransitionStart: function () {
							const odometerNumber = numbers[this.activeIndex].replaceAll(' ', '');

							od[this.el.querySelector('.swiper-slide-active').dataset.swiperSlideIndex].update(0);
							od[this.el.querySelector('.swiper-slide-active').dataset.swiperSlideIndex].update(odometerNumber);
						},
					},
				});
			}
		};

		const initSection = () => {
			const sectionObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.querySelectorAll(".js-num").forEach((num, i) => {
							const odometerNumber = numbers[i].replaceAll(' ', '');
							od[i].update(odometerNumber);
						});
					} else {
						entry.target.querySelectorAll(".js-num").forEach((num, i) => {
							od[i].update(0);
						});
					}
				});
			});
			
			sectionObserver.observe(sectionNumbers.querySelector('.numbers__outer'));

			const sectionResizeObserver = new ResizeObserver((entries) => {
				const [entry] = entries;
				const sliders = entry.target.querySelectorAll(".js-slider-numbers");

				if (sliders.length != 0) {
					sliders.forEach((slider) => {
						if (slider.swiper) slider.swiper.destroy();
					});
				}

				initSlider(sectionNumbers);
			});

			initNumbers();
			initAnimation();

			sectionResizeObserver.observe(sectionNumbers);
		};

		initSection();
		initSlider();
	};

	init();

	document.addEventListener("shopify:section:load", function (section) {
		init(section.target);
	});
})();