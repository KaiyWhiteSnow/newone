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
