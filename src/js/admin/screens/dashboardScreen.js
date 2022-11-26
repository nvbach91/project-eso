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
    App.fetchAggregates(startDate, endDate).done(renderDashboard).fail(clearDashboard);
    //console.log('START', moment(startDate).format(App.formats.date));
    //console.log('  END', moment(endDate).format(App.formats.date));
  }
}, 10);

App.renderDashboardScreen = () => {
  App.destroyDatePickers();
  const header = $(`
    <div id="cp-header" class="card-header">
      <div class="cp-name">${App.lang.admin_dashboard}</div>
      <div class="cp-control">
        <button class="btn btn-primary date-nav" id="date-prev">${App.getIcon('keyboard_arrow_left')}</button>
        <button class="btn btn-primary datepicker-btn" data-id="datepicker-start">${App.getIcon('date_range')}</button>
        <input type="text" class="form-control datetimepicker-input" id="datepicker-start">
        <button class="btn btn-primary datepicker-btn" data-id="datepicker-end">${App.getIcon('date_range')}</i></button>
        <input type="text" class="form-control datetimepicker-input" id="datepicker-end">
        <button class="btn btn-primary date-nav" id="date-next">${App.getIcon('keyboard_arrow_right')}</i></button>
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
        <div class="db-value">${App.sumObjectValues(App.aggregates.revByVat).formatMoney()}</div>
        <div class="db-label">${App.lang.dashboard_total_revenue}</div>
      </div>
      <div class="btn db-card" id="db-transactions">
        <div class="db-value">${App.aggregates.nTrans}</div>
        <div class="db-label">${App.lang.dashboard_transactions}</div>
      </div>
      <div class="btn db-card" id="db-sold-products">
        <div class="db-value">${App.aggregates.nProdSold}</div>
        <div class="db-label">${App.lang.dashboard_products_sold}</div>
      </div>
      <div class="db-card" id="db-hour-chart">
        <canvas></canvas>
      </div>
      <div class="btn db-card" id="db-average-revenue">
        <div class="db-value">${(App.sumObjectValues(App.aggregates.revByVat) / App.aggregates.nTrans).formatMoney()}</div>
        <div class="db-label">${App.lang.dashboard_average_revenue}</div>
      </div>
      ${generateRevByVat()}
      ${generateRevByGroup()}
      ${generateTopSoldCard()}
    </div>
  `);
  App.jControlPanelBody.replaceWith(dashboard);
  App.jControlPanelBody = dashboard;
  generateHourChart(dashboard.find('#db-hour-chart canvas'));
};

const clearDashboard = () => {
  const dashboard = $(`<button class="btn">${App.lang.tip_no_data_in_selected_period}</button>`);
  App.jControlPanelBody.replaceWith(dashboard);
  App.jControlPanelBody = dashboard;
};

const generateHourChart = (container) => {
  if (typeof Chart === 'function') {
    const data = {
      labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      datasets: [{
        data: mapHourValues(App.aggregates.hourSales),
        label: App.lang.dashboard_hour_total_revenues,
        yAxisID: 'y-axis-1',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,0.4)'
      }, {
        data: mapHourValues(App.aggregates.hourTrans),
        label: App.lang.dashboard_hour_transactions_count,
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

const mapHourValues = (hour) => {
  if (!hour) {
    return [];
  }
  const result = [];
  const hours = Object.keys(hour).map((hour) => {
    return parseInt(hour);
  }).sort((a, b) => a - b);
  const maxHour = (hours[hours.length - 1] || 0) + 1;
  for (let i = 0; i < maxHour; i++) {
    if (typeof hour[i] !== 'number') {
      hour[i] = 0;
    }
    result.push(+hour[i].toFixed(2));
  }
  return result;
};

const generateTopSoldCard = () => {
  const card = `
    <div class="db-card" id="db-top-sold">
      <div class="db-label">Top products</div>
      ${Object.keys(App.aggregates.soldCnt).sort((a, b) => App.aggregates.soldCnt[b] - App.aggregates.soldCnt[a]).map((ean) => {
        const product = App.products[ean];
        return `
          <div class="db-item">
            <div class="di-label">${product ? product.name : `[${ean}]`}</div>
            <div class="di-value">${App.aggregates.soldCnt[ean]}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return card;
};

const generateRevByVat = () => {
  const card = `
    <div class="db-card" id="db-revenues-by-vat">
      <div class="db-label">Revenues by VAT</div>
      ${Object.keys(App.aggregates.revByVat).map((taxRate) => {
        return `
          <div class="db-item">
            <div class="di-label">${taxRate} %</div>
            <div class="di-value">${App.aggregates.revByVat[taxRate].formatMoney()}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return card;
};

const generateRevByGroup = () => {
  const card = `
    <div class="db-card" id="db-revenues-by-group">
      <div class="db-label">Revenues by groups</div>
      ${Object.keys(App.aggregates.revByGroup).map((groupNumber) => {
        const group = App.groups[groupNumber];
        return `
          <div class="db-item">
            <div class="di-label">${group ? group.name : `[${groupNumber}]`}</div>
            <div class="di-value">${App.aggregates.revByGroup[groupNumber].formatMoney()}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return card;
};
