import { Given, When, Then } from '@wdio/cucumber-framework';
import { $, browser, expect } from '@wdio/globals';

import loginPage from '../pageobjects/login.page.js';

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
    await loginPage.login(user, password)
});

Then('the inventory page should be loaded', () => {
  // Write code here that turns the phrase above into concrete actions
})
