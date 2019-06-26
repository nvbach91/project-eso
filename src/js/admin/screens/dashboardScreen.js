let currentDatePickerId = '';

const onDateSelect = App.debounce((date) => {
  const startDatePicker = App.datePickerInstances[0];
  const endDatePicker = App.datePickerInstances[1];
  const startDate = startDatePicker.getDate();
  const endDate = endDatePicker.getDate();
  if (startDate > endDate) {
    if (currentDatePickerId === 'datepicker-start') {
      endDatePicker.setDate(date);
    } else if (currentDatePickerId === 'datepicker-end') {
      startDatePicker.setDate(date);
    }
  } else {
    App.fetchAggregates(startDate, endDate).then(() => {
      renderDashboard();
    });
    console.log('START', moment(startDate).format(App.formats.date));
    console.log('  END', moment(endDate).format(App.formats.date));
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
  App.bindDatePicker({ id: 'datepicker-start', onSelect: onDateSelect, onOpen: () => currentDatePickerId = 'datepicker-start' });
  App.bindDatePicker({ id: 'datepicker-end', onSelect: onDateSelect, onOpen: () => currentDatePickerId = 'datepicker-end' });
  header.find('.date-nav').click(function () {
    currentDatePickerId = '';
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
  App.fetchAggregates().done(renderDashboard).fail(clearDashboard);
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
        data: mapHourlyValues(App.aggregates.hourlyTotalSales),
        label: 'Hourly total revenues',
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,0.4)'
      }, {
        data: mapHourlyValues(App.aggregates.hourlyTransCnt),
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
      ${Object.keys(App.aggregates.soldCntByEan).map((ean) => {
        const product = App.products[ean];
        return `
          <div class="db-item">
            <div class="di-label">${product ? product.name : `[${ean}]`}</div>
            <div class="di-value">${App.aggregates.soldCntByEan[ean]}</div>
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
      ${Object.keys(App.aggregates.revenueByTax).map((taxRate) => {
        return `
          <div class="db-item">
            <div class="di-label">${taxRate} %</div>
            <div class="di-value">${App.aggregates.revenueByTax[taxRate].formatMoney()}</div>
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
      ${Object.keys(App.aggregates.revenueByGroup).map((groupNumber) => {
        const group = App.groups[groupNumber];
        return `
          <div class="db-item">
            <div class="di-label">${group ? group.name : `[${groupNumber}]`}</div>
            <div class="di-value">${App.aggregates.revenueByGroup[groupNumber].formatMoney()}</div>
          </div>
        `;
      }).join('')}
    </div>
  `
  return card;
};
