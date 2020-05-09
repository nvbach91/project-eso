App.renderProducts = (group) => {
  const container = $(`<div id="products">`);
  const header = $(`
    <div class="btn btn-primary btn-raised btn-lg products-header">
      <span>${App.groups[group].name}</span>
      ${App.getIcon('menu')}
    </div>
  `);
  header.appendTo(container);
  Object.keys(App.products).filter((ean) => {
    return group == App.products[ean].group;
  }).sort((a, b) => App.products[a].order - App.products[b].order).forEach((ean) => {
    const { highlight, img, name, price, order } = App.products[ean];
    const element = $(`
      <div class="product-offer${highlight ? ' highlight' : ''}" title="${ean} - ${order || 0}">
        <div class="btn btn-raised po-img"${App.getBackgroundImage(img)}>
          <button class="btn btn-primary btn-raised${App.cart[ean] ? '': ' hidden'} cart-quantity-indicator" data-id="${ean}">
            ${App.getIcon('shopping_cart')}
            <span>${App.cart[ean] ? App.cart[ean].quantity : 0}</span>
          </button>
        </div>
        <div class="po-name">${name}</div>
        <div class="po-row">
          <div class="po-price">${price} ${App.settings.currency.symbol}</div>
          <div class="po-control">
            <button class="btn btn-raised btn-primary add">
              ${App.getIcon('playlist_add')}
            </button>
          </div>
        </div>
      </div>
    `);
    element.hide();
    element.find('.po-img').click(() => {
      App.showProductDetail(ean);
    });
    element.find('.add').click((e) => {
      e.stopPropagation();
      App.addToCart(ean);
      App.nextTab();
    });
    const cartQuantityIndicator = element.find('.cart-quantity-indicator');
    cartQuantityIndicator.click((e) => {
      e.stopPropagation();
      App.showCart();
    });
    container.append(element);
  });
  App.jProducts.replaceWith(container);
  App.jProducts = container;
  App.jProducts.children().each(function (i) {
    $(this).delay(i * (App.getAnimationTime() ? 100 : 0)).slideDown(App.getAnimationTime());
  });
  App.hideSpinner();
};

App.showProductDetail = (ean) => {
  const { img, name, price, desc } = App.products[ean];
  const element = $(`
    <div class="product-details">
      <div class="pd-img"${App.getBackgroundImage(img)}></div>
      <div class="pd-details">
        <div class="pd-info">
          <div class="pd-name">${name}</div>
          ${desc ? `<textarea disabled class="pd-description">${desc}</textarea>` : ''}
          <hr>
          <div class="pd-price">${price} ${App.settings.currency.symbol}</div>
        </div>
        <div class="pd-mod">
          ${Object.keys(App.modTypes).filter((type) => {
            return Object.keys(App.mods).filter((modNumber) => {
              return App.modTypes[type].includes(Number(modNumber));
            }).filter((modNumber) => {
              return !!App.productMods[ean] && App.productMods[ean].includes(Number(modNumber));
            }).filter((display) => display).length > 0;
          }).map((type) => {
            return (`
              <div class="product-mods">
                <label class="bmd-label-static">${type}</label>
                <div class="horizontal-scroll">
                  ${Object.keys(App.mods).filter((modNumber) => {
                    return App.modTypes[type].includes(Number(modNumber));
                  }).map((modNumber) => {
                    const display = !!App.productMods[ean] && App.productMods[ean].includes(Number(modNumber));
                    const active = App.cart[ean] && App.cart[ean].mods ? App.cart[ean].mods.includes(Number(modNumber)) : false;
                    return (!display ? '' : `
                      <button type="button" class="product-mod btn btn-raised btn-${active ? 'primary' : 'secondary'}" data-active="${active}" data-number="${modNumber}">
                        ${App.mods[modNumber].name} ${active ? App.getIcon('done') : ''}
                      </button>
                    `);
                  }).join('')}
                </div>
              </div>
            `)
          }).join('')}
        </div>
        <div class="pd-control">
          <div class="pd-row justify-content-start">
            <button class="btn btn-primary${App.cart[ean] ? '': ' hidden'} remove">${App.getIcon('remove')}</button>
            <button class="btn btn-primary cart-quantity-indicator" data-id="${ean}">
              ${App.getIcon('shopping_cart')}
              <span>${App.cart[ean] ? App.cart[ean].quantity : 0}</span>
            </button>
            <button class="btn btn-primary add">${App.getIcon('add')}</button>
          </div>
          <button class="btn btn-raised btn-primary order">
            <span>${App.lang.order_products_order_btn}</span>&nbsp;
            ${App.getIcon('playlist_add')}
          </button>
        </div>
      </div>
    </div>
  `);
  if (desc) { // resizing the description textbox
    const descriptionContainer = element.find('.pd-description')[0];
    const nLines = desc.split(/\r\n/).length;
    descriptionContainer.style.height = `${nLines * 24}px`;
  }
  element.find('.cart-quantity-indicator').click((e) => {
    App.showCart();
  });
  element.find('.remove').click(() => {
    App.decrementFromCart(ean);
    if (!App.cart[ean]) {
      setTimeout(() => {
        App.closeModal();
      }, App.getAnimationTime());
    }
  });
  element.find('.add').click(() => {
    App.addToCart(ean, getMods(element));
    element.find('.remove').removeClass('hidden');
  });
  element.find('.order').click(() => {
    // if (!App.cart[ean]) {
      App.addToCart(ean, getMods(element));
    // }
    App.closeModal();
    App.nextTab();
  });
  element.find('.product-mod').click(function () {
    const t = $(this);
    const active = t.data('active');
    t.removeClass(active ? 'btn-primary' : 'btn-secondary').addClass(!active ? 'btn-primary' : 'btn-secondary');
    t.data('active', !active);
    if (active) {
      t.find('i').remove();
    } else {
      t.append(App.getIcon('done'));
    }
  });
  App.showInModal(element, 'Product details');
  App.jModal.find('.cs-cancel').remove();
  
};

const getMods = (container) => {
  const mods = [];
  container.find('.product-mod').each(function () {
    const t = $(this);
    if (t.data('active')) {
      mods.push(t.data('number'));
    }
  });
  if (mods.length) return mods;
};
