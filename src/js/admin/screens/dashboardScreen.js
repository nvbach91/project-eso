let currentPickerId = '';
App.dailyAggregates = { "start": 20190401, "end": 20190623, "revenueByTax": { "0": 794, "10": 84, "15": 8494.1, "21": 3195.41 }, "revenueSentToORS": { "0": 0, "10": 0, "15": 0, "21": 0 }, "revenueByGroup": { "8": 212.9, "9": 204, "10": 2125.3, "11": 636.81, "12": 84, "13": 288, "14": 642 }, "revenueByEmployee": { "demo": 12527.51, "abc": 40 }, "revenueByPaymentMethod": { "cash": 12147.51, "card": 320, "cheque": 100 }, "revenueByForeignCurrency": {}, "round": 0.49, "canceledRevenues": { "2": -20, "not_plu": -2817.7 }, "canceledRevenuesByEmployee": { "demo": -2837.7, "abc": 0 }, "soldCntByEan": { "0": 49, "1": 14, "2": 25, "3": 35, "4": 44, "5": 13, "6": 5, "7": 11, "8": 11, "9": 5, "30": 9, "31": 1, "32": 3, "33": 1, "54": 3, "55": 1, "56": 1, "57": 1, "333": 40, "9115": 2, "105713": 4, "not_plu": 185, "034": 5, "035": 1, "036": 1 }, "hourlyTotalSales": { "0": 656.5, "1": 21, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 60, "11": 89, "12": 167, "13": 560, "14": 237.4, "15": 2403.7, "16": 339, "17": 90, "18": 0, "19": 736.3, "20": 6732.41, "21": -73.79999999999998, "22": 18, "23": 531 }, "hourlyTransCnt": { "0": 13, "1": 3, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, "10": 1, "11": 2, "12": 6, "13": 10, "14": 5, "15": 7, "16": 5, "17": 1, "18": 0, "19": 2, "20": 19, "21": 4, "22": 1, "23": 6 }, "nProductsSold": 470, "nTransactions": 85 };

const onDateSelect = App.debounce((date) => {
  const startDatePicker = App.datePickerInstances[0];
  const endDatePicker = App.datePickerInstances[1];
  if (startDatePicker.getDate() > endDatePicker.getDate()) {
    if (currentPickerId === 'datepicker-start') {
      endDatePicker.setDate(date);
    } else if (currentPickerId === 'datepicker-end') {
      startDatePicker.setDate(date);
    }
  } else {
    console.log('START', moment(startDatePicker.getDate()).format(App.formats.date));
    console.log('  END', moment(endDatePicker.getDate()).format(App.formats.date));
  }
}, 10);

App.renderDashboardScreen = () => {
  App.destroyDatePickers();
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">Dashboard</div>
      <div class="cp-control">
        <button class="btn btn-primary date-nav" id="date-prev"><i class="material-icons">keyboard_arrow_left</i></button>
        <button class="btn btn-primary datepicker-btn" data-id="datepicker-start"><i class="material-icons">date_range</i></button>
        <input type="text" class="form-control datetimepicker-input" id="datepicker-start">
        <button class="btn btn-primary datepicker-btn" data-id="datepicker-end"><i class="material-icons">date_range</i></button>
        <input type="text" class="form-control datetimepicker-input" id="datepicker-end">
        <button class="btn btn-primary date-nav" id="date-next"><i class="material-icons">keyboard_arrow_right</i></button>
      </div>
    </div>
  `);
  App.jControlPanelHeader.replaceWith(header);
  App.jControlPanelHeader = header;
  App.bindDatePicker({ id: 'datepicker-start', onSelect: onDateSelect, onOpen: () => currentPickerId = 'datepicker-start' });
  App.bindDatePicker({ id: 'datepicker-end', onSelect: onDateSelect, onOpen: () => currentPickerId = 'datepicker-end' });
  header.find('.date-nav').click(function () {
    currentPickerId = '';
    const newDate = App.datePickerInstances[0].getDate();
    if ($(this).attr('id') === 'date-next') {
      newDate.setDate(newDate.getDate() + 1);
      if (newDate <= new Date()) {
        App.datePickerInstances[0].setDate(newDate);
        App.datePickerInstances[1].setDate(newDate);
      }
    } else {
      newDate.setDate(newDate.getDate() - 1);
      App.datePickerInstances[0].setDate(newDate);
      App.datePickerInstances[1].setDate(newDate);
    }
  });
  renderDashboard();
  //App.fetchAggregates().done(renderDashboard).fail(clearDashboard);
};

const renderDashboard = () => {
  const dashboard = $(`
    <div class="dashboard">
      <div class="btn db-card" id="db-total-revenue">
        <div class="db-value">${(42147).formatMoney()}</div>
        <div class="db-label">Total revenue</div>
      </div>
      <div class="btn db-card" id="db-transactions">
        <div class="db-value">142</div>
        <div class="db-label">Sales total</div>
      </div>
      <div class="btn db-card" id="db-sold-products">
        <div class="db-value">${74}</div>
        <div class="db-label">Products sold</div>
      </div>
      <div class="db-card" id="db-hourly-chart">
        <canvas></canvas>
      </div>
      <div class="btn db-card" id="db-average-revenue">
        <div class="db-value">${(321).formatMoney()}</div>
        <div class="db-label">Average revenue</div>
      </div>
      ${generateRevenuesByVat()}
      ${generateRevenuesByGroup()}
      ${generateTopSoldCard()}
    </div>
  `);
  App.jControlPanelBody.replaceWith(dashboard);
  App.jControlPanelBody = dashboard;
  renderHourlyChart(dashboard.find('#db-hourly-chart canvas'));
};

const clearDashboard = () => {
  const dashboard = $(`<div>Something went wrong</div>`);
  App.jControlPanelBody.replaceWith(dashboard);
  App.jControlPanelBody = dashboard;
};

const renderHourlyChart = (container) => {
  if (typeof Chart === 'function') {
    const data = {
      labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      datasets: [{
        data: mapHourlyValues(App.dailyAggregates.hourlyTotalSales),
        label: 'Hourly total revenues',
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,0.4)'
      }, {
        data: mapHourlyValues(App.dailyAggregates.hourlyTransCnt),
        label: 'Hourly transactions count',
        yAxisID: 'y-axis-2',
        backgroundColor: 'rgba(192,75,75,0.4)',
        borderColor: 'rgba(192,75,75,0.4)'
      }]
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          { type: 'linear', 'id': 'y-axis-1', display: true, position: 'left' },
          { type: 'linear', 'id': 'y-axis-2', display: true, position: 'right' }
        ]
      }
    };
    new Chart(container, {
      type: 'bar',
      data: data,
      options: options
    });
  }
};

const mapHourlyValues = (hourly) => {
  if (!hourly) {
    return [];
  }
  const result = [];
  const hours = Object.keys(hourly).map((hour) => {
    return parseInt(hour);
  }).sort((a, b) => a - b);
  const maxHour = (hours[hours.length - 1] || 0) + 1;
  for (let i = 0; i < maxHour; i++) {
    if (typeof hourly[i] !== 'number') {
      hourly[i] = 0;
    }
    result.push(+hourly[i].toFixed(2));
  }
  return result;
};

const generateTopSoldCard = () => {
  const card = `
    <div class="db-card" id="db-top-sold">
      <div class="db-label">Top products</div>
      ${Object.keys(App.dailyAggregates.soldCntByEan).map((ean) => {
    return `
          <div class="db-item">
            <div class="di-label">${ean}</div>
            <div class="di-value">${App.dailyAggregates.soldCntByEan[ean]}</div>
          </div>
        `;
  }).join('')}
    </div>
  `
  return card;
};
const generateRevenuesByVat = () => {
  const card = `
    <div class="btn db-card" id="db-revenues-by-vat">
      <div class="db-label">Revenues by VAT</div>
      ${Object.keys(App.dailyAggregates.revenueByTax).map((taxRate) => {
    return `
          <div class="db-item">
            <div class="di-label">${taxRate} %</div>
            <div class="di-value">${App.dailyAggregates.revenueByTax[taxRate].formatMoney()}</div>
          </div>
        `;
  }).join('')}
    </div>
  `
  return card;
};
const generateRevenuesByGroup = () => {
  const card = `
    <div class="btn db-card" id="db-revenues-by-group">
      <div class="db-label">Revenues by groups</div>
      ${Object.keys(App.dailyAggregates.revenueByGroup).map((group) => {
    return `
          <div class="db-item">
            <div class="di-label">${group}</div>
            <div class="di-value">${App.dailyAggregates.revenueByGroup[group].formatMoney()}</div>
          </div>
        `;
  }).join('')}
    </div>
  `
  return card;
};