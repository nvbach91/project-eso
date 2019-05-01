require('./config.js');
require('./utils.js');
require('./components/localStorage.js');
require('./components/standbyScreen.js');
require('./components/orderScreen.js');
require('./components/checkoutScreen.js');
require('./components/diningChoiceScreen.js');
require('./components/finishScreen.js');
require('./components/header.js');
require('./components/main.js');
require('./components/footer.js');
require('./components/cart.js');

App.connect = () => {
  App.settings = { 
    name: 'The Elusive Camel',
    carouselInterval: 20000, 
    currency: { code: 'CZK', symbol: 'Kč' }, 
    activityTimeout: 60000, // if the app is idle for this amount of time, an activity check dialog will appear
    activityCheckTimeout: 25000, // if the app is idle for this amount of time after the check appeared, the app will reset
  };
  App.categories = {
    '0': { name: 'Soups', img: 'bg09_hjz6no' },
    '1': { name: 'Beers', img: 'bg10_coyfml' },
    '2': { name: 'Beverages', img: 'bg07_wrsdxe' },
    '3': { name: 'Coffees', img: 'bg04_i3fq68' },
    '4': { name: 'Menus', img: 'bg06_gmmeqj' },
    '5': { name: 'Burgers', img: 'bg01_mog1lh' },
    '6': { name: 'Rice', img: 'bg05_osoyo0' },
    '7': { name: 'Noodles', img: 'bg02_komziq' },
    '8': { name: 'Wraps', img: 'bg03_tdlabn' },
    '9': { name: 'Fasties', img: 'bg08_hsajsa' },
    '00': { name: 'Soups', img: 'bg09_hjz6no' },
    '11': { name: 'Beers', img: 'bg10_coyfml' },
    '22': { name: 'Beverages', img: 'bg07_wrsdxe' },
    '33': { name: 'Coffees', img: 'bg04_i3fq68' },
    '44': { name: 'Menus', img: 'bg06_gmmeqj' },
    '55': { name: 'Burgers', img: 'bg01_mog1lh' },
    '66': { name: 'Rice', img: 'bg05_osoyo0' },
    '77': { name: 'Noodles', img: 'bg02_komziq' },
    '88': { name: 'Wraps', img: 'bg03_tdlabn' },
    '99': { name: 'Fasties', img: 'bg08_hsajsa' },
  };
  App.products = {
    "0": {
      "name": "swallow grass",
      "price": "142.00",
      "img": "bg09_hjz6no",
      "category": "2"
    },
    "1": {
      "name": "freight dream",
      "price": "142.00",
      "img": "bg10_coyfml",
      "category": "2"
    },
    "2": {
      "name": "comfort veil",
      "price": "112.00",
      "img": "bg07_wrsdxe",
      "category": "7"
    },
    "3": {
      "name": "equinox faint",
      "price": "172.00",
      "img": "bg04_i3fq68",
      "category": "4"
    },
    "4": {
      "name": "cunning voyage",
      "price": "156.00",
      "img": "bg06_gmmeqj",
      "category": "3"
    },
    "5": {
      "name": "trolley bus",
      "price": "171.00",
      "img": "bg01_mog1lh",
      "category": "2"
    },
    "6": {
      "name": "scandal shark",
      "price": "181.00",
      "img": "bg05_osoyo0",
      "category": "0"
    },
    "7": {
      "name": "primary die",
      "price": "162.00",
      "img": "bg02_komziq",
      "category": "7"
    },
    "8": {
      "name": "capital top",
      "price": "131.00",
      "img": "bg03_tdlabn",
      "category": "0"
    },
    "9": {
      "name": "service pull",
      "price": "119.00",
      "img": "bg08_hsajsa",
      "category": "8"
    },
    "11": {
      "name": "reactor deer",
      "price": "242.00",
      "img": "bg10_coyfml",
      "category": "5"
    },
    "22": {
      "name": "freedom cherry",
      "price": "212.00",
      "img": "bg07_wrsdxe",
      "category": "2"
    },
    "33": {
      "name": "recruit kneel",
      "price": "272.00",
      "img": "bg04_i3fq68",
      "category": "4"
    },
    "44": {
      "name": "dribble suburb",
      "price": "256.00",
      "img": "bg06_gmmeqj",
      "category": "3"
    },
    "55": {
      "name": "overall oak",
      "price": "271.00",
      "img": "bg01_mog1lh",
      "category": "2"
    },
    "66": {
      "name": "cabinet pass",
      "price": "281.00",
      "img": "bg05_osoyo0",
      "category": "7"
    },
    "77": {
      "name": "release cope",
      "price": "262.00",
      "img": "bg02_komziq",
      "category": "0"
    },
    "88": {
      "name": "penalty sniff",
      "price": "231.00",
      "img": "bg03_tdlabn",
      "category": "1"
    },
    "99": {
      "name": "clothes walk",
      "price": "219.00",
      "img": "bg08_hsajsa",
      "category": "0"
    },
    "111": {
      "name": "fortune linen",
      "price": "342.00",
      "img": "bg10_coyfml",
      "category": "6"
    },
    "522": {
      "name": "skilled jaw",
      "price": "312.00",
      "img": "bg07_wrsdxe",
      "category": "8"
    },
    "633": {
      "name": "academy marine",
      "price": "372.00",
      "img": "bg04_i3fq68",
      "category": "6"
    },
    "666": {
      "name": "husband wander",
      "price": "381.00",
      "img": "bg05_osoyo0",
      "category": "9"
    },
    "744": {
      "name": "glasses salmon",
      "price": "356.00",
      "img": "bg06_gmmeqj",
      "category": "3"
    },
    "777": {
      "name": "overeat duck",
      "price": "362.00",
      "img": "bg02_komziq",
      "category": "1"
    },
    "855": {
      "name": "whisper porter",
      "price": "371.00",
      "img": "bg01_mog1lh",
      "category": "2"
    },
    "1111": {
      "name": "chapter betray",
      "price": "442.00",
      "img": "bg10_coyfml",
      "category": "1"
    },
    "5222": {
      "name": "soprano maze",
      "price": "412.00",
      "img": "bg07_wrsdxe",
      "category": "5"
    },
    "6333": {
      "name": "attract pot",
      "price": "472.00",
      "img": "bg04_i3fq68",
      "category": "4"
    },
    "6666": {
      "name": "inflate salad",
      "price": "481.00",
      "img": "bg05_osoyo0",
      "category": "0"
    },
    "7444": {
      "name": "channel sight",
      "price": "456.00",
      "img": "bg06_gmmeqj",
      "category": "3"
    },
    "7777": {
      "name": "fashion lazy",
      "price": "462.00",
      "img": "bg02_komziq",
      "category": "0"
    },
    "8555": {
      "name": "recycle manage",
      "price": "471.00",
      "img": "bg01_mog1lh",
      "category": "7"
    },
    "8888": {
      "name": "adviser class",
      "price": "431.00",
      "img": "bg03_tdlabn",
      "category": "1"
    },
    "9999": {
      "name": "serious heal",
      "price": "419.00",
      "img": "bg08_hsajsa",
      "category": "0"
    },
    "22222": {
      "name": "partner drama",
      "price": "512.00",
      "img": "bg07_wrsdxe",
      "category": "2"
    },
    "33333": {
      "name": "density chief",
      "price": "572.00",
      "img": "bg04_i3fq68",
      "category": "4"
    },
    "44444": {
      "name": "drawing seller",
      "price": "556.00",
      "img": "bg06_gmmeqj",
      "category": "3"
    },
    "55555": {
      "name": "musical pair",
      "price": "571.00",
      "img": "bg01_mog1lh",
      "category": "2"
    },
    "66666": {
      "name": "wrestle ditch",
      "price": "581.00",
      "img": "bg05_osoyo0",
      "category": "7"
    },
    "77777": {
      "name": "kinship oppose",
      "price": "562.00",
      "img": "bg02_komziq",
      "category": "0"
    },
    "88888": {
      "name": "offense panel",
      "price": "531.00",
      "img": "bg03_tdlabn",
      "category": "1"
    },
    "00": {
      "name": "produce retire",
      "price": "242.00",
      "img": "bg09_hjz6no",
      "category": "2"
    },
    "000": {
      "name": "bathtub shrink",
      "price": "342.00",
      "img": "bg09_hjz6no",
      "category": "2"
    },
    "0000": {
      "name": "address cousin",
      "price": "442.00",
      "img": "bg09_hjz6no",
      "category": "2"
    }
  };
  return $.when();
};

App.render = () => {
  App.renderModal();
  App.renderSpinner();
  App.renderHeader();
  App.renderMain();
  App.renderFooter();
};

App.init = () => {
  App.activeTabPosition = 0;
  App.currentSlidePosition = 0;
  App.activityCheckInterval = 0;
  App.isCheckingActivity = false;
  App.connect().done(() => {
    App.loadLocalStorage();
    App.paymentMethod = 'card';
    App.jContainer = $('#app');
    App.jHeader = $('#header');
    App.jMain = $('#main');
    App.jFooter = $('#footer');
    App.jSpinner = $('#spinner');
    App.jModal = $('#modal');
    App.render();
  });
};
