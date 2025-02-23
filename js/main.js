const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonsSection = document.querySelector('#wheel-buttons'); 
const performanceBtn = document.querySelector('#performance-btn');
const totalPrice = document.querySelector('#totalprice');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckbox = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';
const selectedOptions = {
    'Performance Wheels' : false,
    'Performance Package' : false,
    'Full Self-Driving' : false,
};

const pricing = {
    'Performance Wheels': 2500,
    'Performance Package': 5000,
    'Full Self-Driving' : 8500,
    'Accessories': {
        'Center Console Trays' : 35,
        'Sunshade': 105,
        'All-Weather Interior Liners': 225,
    },
};

//update total price in th ui
const updateTotalPrice = () =>{
    //resetting the current price to base price
    currentPrice=basePrice;

    if(selectedOptions['Performance Wheels']) {
        currentPrice += pricing['Performance Wheels'];
    }

    if(selectedOptions['Performance Package']) {
        currentPrice += pricing['Performance Package'];
    }

    if(selectedOptions['Full Self-Driving']) {
        currentPrice += pricing['Full Self-Driving'];
    }

    accessoryCheckbox.forEach((checkbox) => {
        const accessoryLabel = checkbox.closest('label').querySelector('span').textContent.trim();

        const accessoryPrice = pricing['Accessories'][accessoryLabel]

        //add to current price if accessory is selected
        if(checkbox.checked){
            currentPrice += accessoryPrice;
        }
    });
    //updating the total price in ui
    totalPrice.textContent = `$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();
}

// updation of payment breakdown based on the current price
const updatePaymentBreakdown = () =>{
    //calculate the down payment
    const downPayment= currentPrice*0.1;
    downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

    //calculate loan details (to assume 60 month load and  3% interest rate)
    const loanMonth= 60;
    const interestRate= 0.03;

    const loanAmount = currentPrice-downPayment;
    //monthly payment The formula is: P*(r(1+r)^n) / ((1+r)^n - 1)
    const monthlyInterestRate = interestRate/12;
    const monthlyPayment = (loanAmount * (monthlyInterestRate * Math.pow(1+monthlyInterestRate,loanMonth))) / (Math.pow(1+monthlyInterestRate,loanMonth)-1);

    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
}

//To handle top bar on scroll
const handleScroll = () =>{
    const atTop = window.scrollY === 0;
    topBar.classList.toggle('visible-bar', atTop);
    topBar.classList.toggle('hidden-bar', !atTop);
};

//Image Mapping
const exteriorImages = {
    'Stealth Grey' : './images/model-y-stealth-grey.jpg',
    'Pearl White' : './images/model-y-pearl-white.jpg',
    'Deep Blue' : './images/model-y-deep-blue-metallic.jpg',
    'Solid Black' : './images/model-y-solid-black.jpg',
    'Ultra Red' : './images/model-y-ultra-red.jpg',
    'Quick Silver' : './images/model-y-quicksilver.jpg',
};

const interiorImages = {
    'Dark':'./images/model-y-interior-dark.jpg',
    'Light':'./images/model-y-interior-light.jpg',
};

//to handle the color change
const handleColorButtonClick = (event) =>{
    let button;


    if(event.target.tagName === 'IMG'){
        button = event.target.closest('button');
    }
    else if(event.target.tagName === 'BUTTON'){
        button = event.target;
    }

    if(button){
        const buttons = event.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');
        
        //change exterior image
        if(event.currentTarget === exteriorColorSection){
            selectedColor= button.querySelector('img').alt;
            updateExteriorImage();      
        }

        //change interior image
        if(event.currentTarget === interiorColorSection){
            const color = button.querySelector('img').alt;
            interiorImage.src = interiorImages[color];
        }
    }
};

//update exterior image based on color and wheels
const updateExteriorImage = () =>{
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorKey = selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorKey].replace('.jpg', `${performanceSuffix}.jpg`)
}

//wheel selection
const handleWheelButtonClick = (event) =>{
   if(event.target.tagName === 'BUTTON'){
        const buttons=document.querySelectorAll('#wheel-buttons button');  
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700','text-white'));

        event.target.classList.add('bg-gray-700', 'text-white' )

        selectedOptions['Performance Wheels'] = event.target.textContent.includes('Performance');
        updateExteriorImage();

        updateTotalPrice();
   }
};

//performance package selection
const handlePerformanceButtonClick = () => {
    const isSelected=performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    selectedOptions['Performance Package'] = isSelected;
    //update selected options
    updateTotalPrice();
}

//full self driving section
const fullSelfDrivingChange = () => {
    const isSelected=fullSelfDrivingCheckbox.checked;
    selectedOptions['Full Self-Driving'] = isSelected;
    updateTotalPrice();
};  

//handle accessory checkbox
accessoryCheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change', () => updateTotalPrice());
});

//Initial update price
updateTotalPrice();

// all the event listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColorButtonClick);
interiorColorSection.addEventListener('click', handleColorButtonClick);
wheelButtonsSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click', handlePerformanceButtonClick); 
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);