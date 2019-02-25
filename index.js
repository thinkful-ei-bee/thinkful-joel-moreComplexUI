'use strict';
/* global $ */

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.

const STORE = {
  items: [
    {id: cuid(), name: 'apples', checked: false, edit: true},
    {id: cuid(), name: 'oranges', checked: false, edit: false },
    {id: cuid(), name: 'milk', checked: false, edit: false },
    {id: cuid(), name: 'bread', checked: false, edit: false },
  ],
  hideCompleted: false,
};

function generateItemElement(item, itemIndex, template) {
  return `<li data-item-id="${item.id}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
      </button>
    </div>
  </li>`;
}

function generateItemEdit(item, itemIndex, template) {
  return `<li data-item-id="${item.id}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">
      <form id="js-shopping-list-form">
        <input type="text" name="shopping-list-entry-edit" class="js-shopping-list-entry" value="${item.name}">
      </form>
    </span>
    <div class="shopping-item-controls">
      <button class="shopping-item-save js-item-toggle">
          <span class="button-label">Save</span>
      </button>
      <button class="shopping-item-cancel js-item-delete">
          <span class="button-label">Cancel</span>
      </button>
    </div>
  </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) =>
    item.edit === true ? generateItemEdit(item, index) : generateItemElement(item, index));
  
  return items.join('');
}

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');

  let filteredItems = STORE.items;

  if(STORE.hideCompleted) {
    filteredItems = filteredItems.filter(item => !item.checked)
  }

  const shoppingListItemsString = generateShoppingItemsString(filteredItems);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function addItemToShoppingList(itemName) {
  console.log(`Addint "${itemName}" to shopping list`);
  STORE.items.push({id: cuid(), name: itemName, checked: false});
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemId) {
  console.log(`Toggling checked property for item with id ${itemId}`);
  const item = STORE.items.find(item => item.id === itemId);
  item.checked = !item.checked;
}

function getItemIdFromElement(item) {
  return $(item).closest('li').data('item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` ran');
    const itemId = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
    renderShoppingList();
  });
}

function deleteListItem(itemId) {
  console.log(`Deleting item with id ${itemId}`);
  const item = STORE.items.find(item => item.id === itemId);
  STORE.items.splice(item, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', `.js-item-delete`, event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemId = getItemIdFromElement(event.currentTarget);
    deleteListItem(itemId);
    renderShoppingList();
  });
}

function toggleHideFilter() {
  STORE.hideCompleted = !STORE.hideCompleted;
}

function handleToggleHideFilter() {
  $('.js-hide-completed-toggle').on('click', () => {
    toggleHideFilter();
    renderShoppingList();
  });
}

function editListItem(itemId) {
  // handle edit state
  // save / cancel
  console.log(itemId);
}

function handleToggleEditClicked() {
  $('.js-shopping-list').on('click', `.js-shopping-item`, event => {
    console.log('`handleToggleEditClicked` ran');
    // Get itemId from DOM
    const itemId = getItemIdFromElement(event.currentTarget);
    // Match itemId from DOM to itemId in STORE.items
    const item = STORE.items.find(item => item.id === itemId);
    editListItem(item.id);
    //renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleHideFilter();
  handleToggleEditClicked();
}

// If STORE.editState is true, disable adding of new items

// Click on item text:
// Change inner html to form with input and submit/cancel buttons. Input field to have value of item pre-populated.
// Change edit state to true

// Search function
// Map SHOP.items if item name contains substring

// when the page loads, call 'handleShoppingList'
$(handleShoppingList);