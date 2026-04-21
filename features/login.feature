Feature: SauceDemo E2E

  # ── LOGIN ─────────────────────────────────────────────

  Scenario: Successful login
    Given I am on the login page
    When I login with "standard_user" and "secret_sauce"
    Then the inventory page should be loaded

  Scenario Outline: Failed login
    Given I am on the login page
    When I login with "<username>" and "<password>"
    Then I should see a flash message saying "<message>"

    Examples:
      | username         | password | message |
      |                  |          | Epic sadface: Username is required |
      | standard_user    |          | Epic sadface: Password is required |
      | nonexistent_user | foobar   | Epic sadface: Username and password do not match any user in this service|

# ── INVENTORY ─────────────────────────────────────────

  Scenario: Inventory shows correct number of products
    Given I am logged in
    Then I should see 6 products

  Scenario: Product has correct name and price
    Given I am logged in
    Then I should see a product named "Sauce Labs Backpack"
    And the product "Sauce Labs Backpack" should have price "$29.99"

  # ── CART ──────────────────────────────────────────────

  Scenario: Add item to cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    Then the cart badge should show 1
    
  Scenario: Reset app state clears cart
    Given I am logged in
    When I add "Sauce Labs Backpack" to the cart
    And I reset the app state
    Then the cart badge should show 0

  # ── NAVIGATION ────────────────────────────────────────

  Scenario: Click product opens detail page
    Given I am logged in
    When I click the product "Sauce Labs Backpack"
    Then I should see product detail page for "Sauce Labs Backpack"

  Scenario: Cart page opens
    Given I am logged in
    When I open the cart
    Then I should be on the cart page
