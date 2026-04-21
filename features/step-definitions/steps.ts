import { Given, When, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';

import loginPage from '../pageobjects/login.page.js';
import inventoryPage from '../pageobjects/secure.page.js';

const pages = {
    login: loginPage,
};

// ─────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────
Given(/^I am on the (\w+) page$/, async (page: keyof typeof pages) => {
    await pages[page].open()
});

When('I login with {string} and {string}', async (username: string, password: string) => {
    await loginPage.login(username, password)
});


Then(
    'I should see a flash message saying {string}',
    async (message: string) => {
        const error = await loginPage.flashAlert.getText();
        expect(error).toEqual(message);
    }
);

// ─────────────────────────────────────────────────────────────
// SHARED LOGIN STATE
// ─────────────────────────────────────────────────────────────

Given(/^I am logged in$/, async () => {
    const user = 'standard_user';
    const password = 'secret_sauce';
    await loginPage.open();
    await loginPage.login(user, password);
    await inventoryPage.resetAppState();
});


// ─────────────────────────────────────────────────────────────
// INVENTORY
// ─────────────────────────────────────────────────────────────

Then('I should see {int} products', async (count: number) => {
    const items = await inventoryPage.inventoryItems;
    expect(items).toHaveLength(count);
});

Then('I should see a product named {string}', async (name: string) => {
    const names = await inventoryPage.getItemNames();
    expect(names).toContain(name);
});

Then(
    'the product {string} should have price {string}',
    async (name: string, price: string) => {
        const item = await inventoryPage.getItemByName(name);
        if (!item) {
            throw new Error(`Product "${name}" not found`);
        }
        const actualPrice = await item
            .$('[data-test="inventory-item-price"]')
            .getText();

        expect(actualPrice).toEqual(price);
    }
);

Then('the inventory page should be loaded', async () => {
    await expect(inventoryPage.inventoryContainer).toBeDisplayed();
});


// Cart actions
When(/^I add "([^"]*)" to the cart$/, async (name: string) => {
    await inventoryPage.addItemToCart(name);
});

When(/^I reset the app state$/, async () => {
    await inventoryPage.resetAppState();
});

Then(/^the cart badge should show (\d+)$/, async (count: string) => {
    const actual = await inventoryPage.getShoppingCartCount();
    expect(actual).toBe(parseInt(count, 10));
});

// Product navigation
When(/^I click the product "([^"]*)"$/, async (name: string) => {
    await inventoryPage.clickItemTitle(name);
});

Then(
    /^I should see product detail page for "([^"]*)"$/,
    async (name: string) => {
        const title = await $('[data-test="inventory-item-name"]');
        await expect(title).toHaveText(name);
    }
);

// Cart page
When(/^I open the cart$/, async () => {
    await inventoryPage.clickShoppingCart();
});

Then(/^I should be on the cart page$/, async () => {
    await expect($('.cart_list')).toBeDisplayed();
});