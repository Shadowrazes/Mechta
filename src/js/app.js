import BurgerMenu from './BurgerMenu.js';

const isMobile = document.documentElement.clientWidth <= 640;
const isTablet = document.documentElement.clientWidth <= 1200;
const isLaptop = document.documentElement.clientWidth <= 1440;
const isDesktop = document.documentElement.clientWidth > 1440;

function isWebp() {
    // Проверка поддержки webp
    const testWebp = (callback) => {
        const webP = new Image();

        webP.onload = webP.onerror = () => callback(webP.height === 2);
        webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    // Добавление класса _webp или _no-webp для HTML
    testWebp((support) => {
        const className = support ? 'webp' : 'no-webp';
        document.querySelector('html').classList.add(className);
        console.log(support ? 'webp поддерживается' : 'webp не поддерживается');
    });
}

isWebp();

const InsertPostContents = () => {
	const headers = [];
	const indexes = [0];
	const articleContent = document.querySelector('.post__content');
	// функция для получения предыдущего header
	const getPrevHeader = (diff = 0) => {
	  if ((indexes.length - diff) === 0) {
		return null;
	  }
	  let header = headers[indexes[0]];
	  for (let i = 1, length = indexes.length - diff; i < length; i++) {
		header = header.contains[indexes[i]];
	  }
	  return header;
	}
	// функция для добавления item в headers
	const addItemToHeaders = (el, diff) => {
	  let header = headers;
	  if (diff === 0) {
		header = indexes.length > 1 ? getPrevHeader(1).contains : header;
		indexes.length > 1 ? indexes[indexes.length - 1]++ : indexes[0]++;
	  } else if (diff > 0) {
		header = getPrevHeader().contains;
		indexes.push(0);
	  } else if (diff < 0) {
		const parentHeader = getPrevHeader(Math.abs(diff) + 1);
		for (let i = 0; i < Math.abs(diff); i++) {
		  indexes.pop();
		}
		header = parentHeader ? parentHeader.contains : header;
		parentHeader ? indexes[indexes.length - 1]++ : indexes[0]++;
	  }
	  header.push({ el, contains: [] });
	}
	// сформируем оглавление страницы для вставки его на страницу
	let html = '';
	const createTableOfContents = (items) => {
	  html += '<ol>';
	  for (let i = 0, length = items.length; i < length; i++) {
		const url = `${location.href.split('#')[0]}#${items[i].el.id}`;
		html += `<li><a href="${url}">${items[i].el.textContent}</a>`;
		if (items[i].contains.length) {
		  createTableOfContents(items[i].contains);
		}
		html += '</li>';
	  }
	  html += '</ol>';
	}

	if(articleContent){
	  const contentsList = document.querySelector('.post__contents-list');
	  if(contentsList){
		// добавим заголовки в headers
		articleContent.querySelectorAll('h2, h3, h4').forEach((el, index) => {
			if (!el.id) {
			el.id = `id-${index}`;
			}
			if (!index) {
			addItemToHeaders(el);
			return;
			}
			const diff = el.tagName.substring(1) - getPrevHeader().el.tagName.substring(1);
			addItemToHeaders(el, diff);
		});

		createTableOfContents(headers);
		contentsList.insertAdjacentHTML('afterbegin', html);
	  }
	}
}

function CallbackFormInit(){
    let forms = document.querySelectorAll('form');

    if(forms.length > 0){
        forms.forEach((form) =>{
            let phoneInputs = form.querySelectorAll('input[name="phone"]');

            if(phoneInputs.length > 0) {
                phoneInputs.forEach((phoneInput) => {
                    const phoneMask = new IMask(phoneInput, {
                        mask: "+{7} (000) 000-00-00",
                    });

                    phoneInput.addEventListener('input', (event) => {
                        event.preventDefault();
                
                        if (!phoneMask.masked.isComplete) {
                            phoneInput.classList.add("uk-form-danger");
                        } 
                        else {
                            phoneInput.classList.remove("uk-form-danger");
                        }
                    });

                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                
                        if (!phoneMask.masked.isComplete){
                            return;
                        }
						
						let formData = {};
						let inputs = form.querySelectorAll('input:not([type="submit"]), textarea');
						if(inputs.length > 0) {
							inputs.forEach((input) => {
								formData[input.getAttribute('name')] = input.value;
							})
						}

                        let successPopupNode = document.querySelector('#callback-popup__success');
						UIkit.modal(successPopupNode).show();

						// jQuery.ajax({
						// 	url: '/wp-admin/admin-ajax.php',
						// 	method: 'post',
						// 	data: {
						// 		action: 'sendForm',
						// 		data: JSON.stringify(formData)
						// 	},
						// 	success: function(data){
						// 		let successPopupNode = document.querySelector('#success-popup');
						// 		UIkit.modal(successPopupNode).show();
						// 	}
						// });
                    })
                })
            }
        })
    };
}

function LoadMapOnScroll(){
    let isMapAppend = false;
	let mapNode = document.querySelector('.map');
	if(mapNode) {
		document.addEventListener('scroll', (event) => {
			if(!isMapAppend) {
				if(window.scrollY > 1000) {
					let script = document.createElement('script');
					
					script.src = 'https://nalogsib.ru/wp-content/themes/NalogSib/js/map.js';
					script.type = 'text/javascript';
					
					mapNode.append(script);
					isMapAppend = true;
				}
			}
		});
	}
}

function InitCenteredSliders(){
    let centeredSliders = document.querySelectorAll('.slider_centered');
    if(centeredSliders.length > 0){
        centeredSliders.forEach((centeredSlider) =>{
            UIkit.slider(centeredSlider, {
                center: true
            });
            let lastSlide = document.querySelector('.slider_centered__item_center');
            UIkit.util.on(centeredSlider, 'itemshown', (event) => {
                lastSlide.classList.remove('slider_centered__item_center');
                event.target.classList.add('slider_centered__item_center');
                lastSlide = event.target;
            })
        })
    };
}

function CheckCheckBox(){
	let checks = document.querySelectorAll('.checkbox-form');
	checks.forEach((checkbox) =>{
		let form = checkbox.closest('form');
		let button = form.querySelector('button[type="submit"]');
		if (form && button)
		{
			button.classList.toggle('button__noactive');
			checkbox.addEventListener('click', (event) => {
				button.classList.toggle('button__noactive');
			});
		}
	});
}

function AddRangeSliders() {
	let slider_price = document.querySelector('.hypothec__input-price');
	let slider_contribution = document.querySelector('.hypothec__input-contribution');
	let slider_term = document.querySelector('.hypothec__input-term');
  
	let ui_slider_price = noUiSlider.create(slider_price, {
	  start: 4480000,
	  connect: true,
	  range: {
		'min': 4480000,
		'max': 8194000
	  },
	  step: 1
	});
	let ui_slider_contribution = noUiSlider.create(slider_contribution, {
	  start: 15,
	  connect: true,
	  range: {
		'min': 15,
		'max': 100
	  },
	  step: 1
	});
	let ui_slider_term = noUiSlider.create(slider_term, {
	  start: 10,
	  connect: true,
	  range: {
		'min': 1,
		'max': 30
	  },
	  step: 1
	});
  
	let text_price = document.querySelector(".hypothec__input-text-price");
	let text_contribution = document.querySelector(".hypothec__input-text-contribution");
	let text_term = document.querySelector(".hypothec__input-text-term");
	let text_percent = document.querySelector(".hypothec__input-text-percent");
	
	let price;
	text_price.addEventListener("change", function() {
	  ui_slider_price.set(parseFloat(this.value));
	});
  
	text_contribution.addEventListener("change", function() {
	  ui_slider_contribution.set(parseFloat(this.value));
	});
  
	text_term.addEventListener("change", function() {
	  ui_slider_term.set(parseInt(this.value));
	});

	ui_slider_price.on('update', function(values, handle) {
		text_price.value = Math.round(values[handle]);
		price = Math.round(values[handle]);
	});
	
	ui_slider_contribution.on('update', function(values, handle) {

		let contributionPercentage = values[handle]; 
		let contributionPrice = (price * contributionPercentage) / 100; // Вычисляем цену, которая является процентом первоначального взноса от цены
		text_contribution.value = contributionPrice;
		text_percent.value = Math.round(values[handle]) + "%";
	});

	ui_slider_term.on('update', function(values, handle) {
	text_term.value = Math.round(values[handle]);
	});


		// Функция для пересчета ежемесячного платежа и его обновления
	function updateMonthlyPayment(bank) {
		const percent = parseFloat(bank.querySelector('.hypothec__bank-percent').textContent);
		const monthlyRate = percent / 12 / 100;
		
		const loanAmount = ui_slider_price.get() - ((ui_slider_price.get() * ui_slider_contribution.get()) / 100);
		const term = ui_slider_term.get() * 12;
		const rate =  (1 + monthlyRate) ** term;

		const monthlyPayment = (loanAmount * monthlyRate * rate) / (rate - 1)//(1 - Math.pow(1 + monthlyRate, term));
		const formattedPayment = monthlyPayment.toFixed(0);

		bank.querySelector('.hypothec__bank-price').textContent = Math.round(formattedPayment) + " руб. /мес";
	}

	// Получаем все блоки с классом hypothec__bank
	const banks = document.querySelectorAll('.hypothec__bank');

	// Обработчик события для ползунка цены
	ui_slider_price.on('update', () => {
		banks.forEach(bank => {
			updateMonthlyPayment(bank);
		});
	});

	// Обработчик события для ползунка первоначального взноса
	ui_slider_contribution.on('update', () => {
		banks.forEach(bank => {
			updateMonthlyPayment(bank);
		});
	});

	// Обработчик события для поля ввода срока кредита
	ui_slider_term.on('update', () => {
		banks.forEach(bank => {
			updateMonthlyPayment(bank);
		});
	});
  }

document.addEventListener('DOMContentLoaded', (event) => {
    CallbackFormInit();
    InitCenteredSliders();
	CheckCheckBox();
	AddRangeSliders();
    // particlesJS.load('particles-slider', 'static/ParticlesJSON/GreenHexagons.json');

    // Содержание статьи по заголовкам
    // InsertPostContents();

    // Прогрузка карты при скролле
    // LoadMapOnScroll()

    if(isTablet) {
        const burgerNode = document.querySelector('.burger');
        new BurgerMenu(burgerNode);
    }
})