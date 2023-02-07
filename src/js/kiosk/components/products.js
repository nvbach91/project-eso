App.renderProducts = (group) => {
  const container = $(`<div id="products">`);
  const header = $(`
    <div class="btn btn-primary btn-raised btn-lg products-header">
      <span>${App.groups[group].name}</span>
      ${App.getIcon('menu')}
    </div>
  `);
  header.appendTo(container);
  if (App.groups[group].description) {
    container.append(`<div class="btn btn-primary products-description"><h2>${App.groups[group].description}</h2></div>`)
  }
  const products = Object.keys(App.products).filter((ean) => {
    return App.products[ean].active && group == App.products[ean].group;
  }).sort((a, b) => App.products[a].position - App.products[b].position);
  products.forEach((ean) => {
    const { highlight, img, name, price, position, available } = App.products[ean];
    const productHasMandatoryMod = App.productMods[ean] && App.productMods[ean].filter((modNumber) => {
      return App.mods[modNumber].type.endsWith('.') || (App.mods[modNumber].type.endsWith('!') && App.deliveryMethod === 'takeout');
    }).length > 0;
    const element = $(`
      <div class="product-offer${highlight ? ' highlight' : ''}${available ? '' : ' unavailable'}" title="#${ean} [${position || 0}]">
        <div class="btn btn-raised po-img"${App.getBackgroundImage(img)}>
          <!--button class="btn btn-primary btn-raised${App.cart[ean] ? '': ' hidden'} cart-quantity-indicator" data-id="${ean}">
            ${App.getIcon('shopping_cart')}
            <span>${App.cart[ean] ? App.cart[ean].quantity : 0}</span>
          </button-->
          ${App.productMods[ean] ? `<div class="po-ribbon${productHasMandatoryMod ? ' mandatory' : ''}">M</div>` : ''}
        </div>
        <div class="po-name">
          <span>${name}</span><span>${available ? '' : `${App.getIcon('block', 24, '', ['text-danger'])}`}</span>
        </div>
        <div class="po-row">
          <div class="po-price">${price} ${App.settings.currency.symbol}</div>
          <div class="po-control">
            <button class="btn btn-raised btn-primary add">${App.getIcon('playlist_add')}</button>
          </div>
        </div>
      </div>
    `);
    element.hide();
    element.find('.po-img').click(() => {
      App.showProductDetail(null, ean);
    });
    element.find('.add').click((e) => {
      e.stopPropagation();
      // if (App.productMods[ean] && productHasMandatoryMod) {
        App.showProductDetail(null, ean);
      // } else {
      //   App.addToCart(ean);
      //   App.nextTab();
      // }
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

App.showProductDetail = (id, ean) => {
  const { img, name, price, desc, available } = App.products[ean];
  const element = $(`
    <div class="product-details${available ? '' : ' unavailable'}">
      <div class="pd-img"${App.getBackgroundImage(img)}></div>
      <div class="pd-details">
        <div class="pd-info">
          <div class="pd-name">
            <span>${available ? '' : `${App.getIcon('block', 24, '', ['text-danger'])}`}</span><span>${name}</span>
          </div>
          <div class="pd-price">${price} ${App.settings.currency.symbol}</div>
        </div>
        ${desc ? `<div class="pd-info"><p class="pd-description">${desc.split(/[\r\n]+/).join('<br>')}</p></div>` : ''}
        <div class="pd-mod">
          ${Object.keys(App.modTypes).filter((type) => {
            return Object.keys(App.mods).filter((modNumber) => {
              return App.modTypes[type].includes(Number(modNumber));
            }).filter((modNumber) => {
              return !!App.productMods[ean] && App.productMods[ean].includes(Number(modNumber));
            }).filter((display) => display).length > 0;
          }).filter((type) => {
            if (type.endsWith('!') && App.deliveryMethod !== 'takeout') {
              return false;
            }
            return true;
          }).map((type) => {
            return (`
              <div class="product-mods">
                <h5><strong>${/[!.]$/.test(type) ? type.slice(0, -1) : type}</strong></h5>
                <div class="horizontal-scroll">
                  ${Object.keys(App.mods).filter((modNumber) => {
                    return App.modTypes[type].includes(Number(modNumber)) && !!App.productMods[ean] && App.productMods[ean].includes(Number(modNumber));
                  }).map((modNumber, index) => {
                    const mod = App.mods[modNumber];
                    // const display = !!App.productMods[ean] && App.productMods[ean].includes(Number(modNumber));
                    let active = !!App.cart[id] && !!App.cart[id].mods.filter((m) => m.number === Number(modNumber)).length;
                    if (index === 0 && type.endsWith('.') && !active && !App.cart[id]) {
                      active = true;
                    }
                    if (index === 0 && type.endsWith('!') && !active && !App.cart[id]) {
                      active = true;
                    }
                    const modQuantity = active && App.cart[id] ? App.cart[id].mods.find((m) => m.number === Number(modNumber)).quantity : 1;
                    const modPrice = (modQuantity * mod.price).formatMoney(mod.price.includes('.') ? 2 : 0);
                    const imgStyle = mod.img ? ` style="background-image: url(${App.imageUrlBase}${mod.img})"` : '';
                    return (`
                      <div class="product-mod-wrapper">
                        <div class="pm-img"${imgStyle}>
                          ${parseFloat(mod.price) ? `
                            <div class="pm-control">
                              <div class="pm-price" data-price="${mod.price}">+${modPrice} ${App.settings.currency.symbol}</div>
                              ${mod.limit !== 1 ? (`
                                <div class="pm-quantity"${active ? '' : ' style="display: none;"'}>
                                  <button class="btn" data-action="decrement" data-mod="${modNumber}">
                                    <span>-</span>
                                  </button>
                                  <div class="mod-quantity" title="Limit: ${mod.limit}">${modQuantity}</div>
                                  <button class="btn" data-action="increment" data-mod="${modNumber}">
                                    <span>+</span>
                                  </button>
                                </div>
                              `) : ''}
                            </div>
                          ` : ''}
                          ${active ? App.getIcon('done', 24, '#fff', ['bg-primary']) : ''}
                        </div>
                        <button type="button" class="product-mod btn-toggle btn${active ? ' btn-raised' : ''} btn-${active ? 'primary' : 'secondary'}" data-type="${type}" data-active="${active}" data-number="${modNumber}">
                          ${mod.name}
                        </button>
                      </div>
                    `);
                  }).join('')}
                </div>
              </div>
            `)
          }).join('<hr>')}
        </div>
        <div class="pd-control">
          <div class="pd-row justify-content-center">
            <!--button class="btn btn-primary${App.cart[id] ? '': ' hidden'} remove">${App.getIcon('remove')}</button-->
            <!--button class="btn btn-primary cart-quantity-indicator" data-id="${id}">
              ${App.getIcon('shopping_cart')}
              <span>${App.cart[id] ? App.cart[id].quantity : 0}</span>
            </button-->
            <!--button class="btn btn-primary add">${App.getIcon('add')}</button-->
          </div>
          ${App.cart[id] ? '' : 
            `<button class="btn btn-raised btn-primary order">
              <span>${App.lang.order_products_order_btn}</span>&nbsp;
              ${App.getIcon('playlist_add')}
            </button>`
          }
        </div>
      </div>
    </div>
  `);
  if (desc) { // resizing the description textbox
    const descriptionContainer = element.find('.pd-description')[0];
    const nLines = desc.split(/\r\n/).length;
    descriptionContainer.style.minHeight = `${nLines * 24}px`;
  }
  element.find('.cart-quantity-indicator').click((e) => {
    App.showCart();
  });
  // element.find('.remove').click(() => {
  //   App.decrementFromCart(id, ean);
  //   if (!App.cart[id]) {
  //     setTimeout(() => {
  //       App.closeModal();
  //     }, App.getAnimationTime());
  //   }
  // });
  // element.find('.add').click(() => {
  //   App.addToCart(ean, getMods(element));
  //   element.find('.remove').removeClass('hidden');
  // });
  element.find('.order').click(() => {
    if (!available) {
      return App.showWarning(App.lang.modal_product_unavailable);
    }
    App.addToCart(ean, getMods(element), 1, id);
    App.closeModal();
    App.nextTab();
  });
  if (!id) { // if not in cart
    App.bindToggleButtons(element, '.product-mod', 24, '.pm-img');
    element.find('.product-mod-wrapper').each(function () {
      const t = $(this);
      const modQuantityContainer = t.find('.pm-quantity .mod-quantity');
      const pmPriceContainer = t.find('.pm-price');
      t.find('.pm-quantity .btn[data-action="decrement"], .pm-quantity .btn[data-action="increment"]').click(function (e) {
        e.stopPropagation();
        const button = $(this);
        const action = button.data('action');
        const newQuantity = Number(modQuantityContainer.text()) + (action === 'decrement' ? -1 : 1);
        const unitPrice = pmPriceContainer.data('price').toString();
        const newPrice = (newQuantity * unitPrice).formatMoney(unitPrice.includes('.') ? 2 : 0);
        if (action === 'decrement') {
          if (newQuantity > 0) {
            modQuantityContainer.text(newQuantity);
            pmPriceContainer.text(`+${newPrice} ${App.settings.currency.symbol}`);
          }
          if (newQuantity === 0) {
            t.find('.product-mod').click();
          }
        } else {
          const limit = App.mods[button.data('mod')].limit;
          if (newQuantity <= limit) {
            modQuantityContainer.text(newQuantity);
            pmPriceContainer.text(`+${newPrice} ${App.settings.currency.symbol}`);
          }
        }
      });
    });
  }
  App.showInModal(element, App.lang.modal_product_detail_title, () => {}, { fullScreen: true });
  App.jModal.find('.cs-cancel').remove();
};

const getMods = (container) => {
  const mods = [];
  container.find('.product-mod-wrapper').each(function () {
    const t = $(this);
    const productMod = t.find('.product-mod');
    if (productMod.data('active')) {
      const number = productMod.data('number');
      const quantity = Number(t.find('.mod-quantity').text()) || 1;
      mods.push({ number, price: App.mods[number].price, quantity });
    }
  });
  return mods;
};
