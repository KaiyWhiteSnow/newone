import { $, $$ } from '@wdio/globals'
import Page from './page.js';

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

    async getItemNames() {
        const items = await $$('[data-test="inventory-item-name"]');
        const names = [];
        for (const item of items) {
            names.push(await item.getText());
        }
        return names;
    }

    async getItemByName(name: string) {
        const items = await $$('[data-test="inventory-item"]');
        for (const item of items) {
            const itemName = await item.$('[data-test="inventory-item-name"]').getText();
            if (itemName === name) {
                return item;
            }
        }
        return null;
    }
}

export default new SecurePage();
