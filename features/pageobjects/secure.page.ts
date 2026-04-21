import { $, $$ } from '@wdio/globals'
import Page from './page.js';

type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get flashAlert () {
        return $('#flash');
    }

    // ── Inventory ─────────────────────────────────────────────────────────────

    get inventoryContainer() {
        return $('[data-test="inventory-container"]');
    }

    get inventoryList() {
        return $('[data-test="inventory-list"]');
    }

    get inventoryItems() {
        return $$('[data-test="inventory-item"]');
    }

    get burgerMenuButton() {
        return $('#react-burger-menu-btn');
    }

    get burgerMenuWrap() {
        return $('.bm-menu-wrap');
    }

    get burgerMenuCloseButton() {
        return $('#react-burger-cross-btn');
    }

    get logoutLink() {
        return $('#logout_sidebar_link');
    }

    get resetAppStateLink() {
        return $('#reset_sidebar_link');
    }

    get productSortContainer() {
        return $('[data-test="product-sort-container"]');
    }

    get shoppingCartLink() {
        return $('[data-test="shopping-cart-link"]');
    }

    get shoppingCartBadge() {
        return $('[data-test="shopping-cart-badge"]');
    }

    async getItemNames() {
        const items = await $$('[data-test="inventory-item-name"]');
        const names = [];
        for (const item of items) {
            names.push(await item.getText().then(text => text.trim()));
        }
        return names;
    }

    async getItemByName(name: string) {
        const items = await $$('[data-test="inventory-item"]');
        for (const item of items) {
            const itemName = await item.$('[data-test="inventory-item-name"]').getText();
            if (itemName.trim() === name) {
                return item;
            }
        }
        return null;
    }

    async addItemToCart(name: string) {
        const item = await this.getItemByName(name);
        if (!item) {
            throw new Error(`Product "${name}" not found`);
        }
        const addButton = await item.$('.btn_inventory');
        await addButton.waitForClickable();
        await addButton.click();
        await browser.pause(500);
    }

    async getShoppingCartCount() {
        await this.clickShoppingCart();
        await browser.pause(500);
        const items = await $$('.cart_item');
        const count = items.length;
        await browser.back();
        return count;
    }

    async clickItemTitle(name: string) {
        const item = await this.getItemByName(name);
        if (!item) {
            throw new Error(`Product "${name}" not found`);
        }
        const title = await item.$('[data-test="inventory-item-name"]');
        await title.click();
    }

    public open() {
        return super.open('/inventory.html');
    }

    async openBurgerMenu(): Promise<void> {
        await this.burgerMenuButton.click();
        await this.burgerMenuWrap.waitForDisplayed({ timeout: 3000 });
    }

    async closeBurgerMenu(): Promise<void> {
        await this.burgerMenuCloseButton.click();
        await this.burgerMenuWrap.waitForDisplayed({ timeout: 3000, reverse: true });
    }

    async logout(): Promise<void> {
        await this.openBurgerMenu();
        await this.logoutLink.click();
    }

    async resetAppState(): Promise<void> {
        await this.openBurgerMenu();
        await this.resetAppStateLink.click();
        await this.closeBurgerMenu();
    }

    async sortProducts(option: SortOption): Promise<void> {
        await this.productSortContainer.selectByAttribute('value', option);
    }

    async clickShoppingCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }


}

export default new SecurePage();
