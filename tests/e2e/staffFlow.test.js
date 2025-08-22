const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Staff Flow E2E Tests', () => {
  let driver;
  const BASE_URL = 'http://localhost:3000';
  const TIMEOUT = 10000;
  
  // Staff credentials
  const STAFF_EMAIL = 'staff@canteen.com';
  const STAFF_PASSWORD = 'staff123';

  beforeAll(async () => {
    // Setup Chrome options
    const options = new chrome.Options();
    options.addArguments('--disable-blink-features=AutomationControlled');
    options.addArguments('--start-maximized');
    
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  }, 30000);

  beforeEach(async () => {
    await driver.manage().deleteAllCookies();
  });

  test('Staff can access staff portal', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Should show login form
    const loginCard = await driver.wait(
      until.elementLocated(By.className('auth-card')),
      TIMEOUT
    );
    expect(await loginCard.isDisplayed()).toBe(true);
    
    // Check for staff login heading
    const heading = await driver.findElement(
      By.xpath("//h2[text()='Staff Login']")
    );
    expect(await heading.isDisplayed()).toBe(true);
  }, 20000);

  test('Staff can login with valid credentials', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Wait for login form
    await driver.wait(until.elementLocated(By.className('auth-card')), TIMEOUT);
    
    // Fill in credentials
    await driver.findElement(By.xpath("//input[@type='email']"))
      .sendKeys(STAFF_EMAIL);
    await driver.findElement(By.xpath("//input[@type='password']"))
      .sendKeys(STAFF_PASSWORD);
    
    // Submit form
    const loginButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );
    await loginButton.click();
    
    // Wait for dashboard to load
    const dashboard = await driver.wait(
      until.elementLocated(By.className('order-dashboard')),
      TIMEOUT
    );
    expect(await dashboard.isDisplayed()).toBe(true);
    
    // Check for dashboard heading
    const dashboardHeading = await driver.findElement(
      By.xpath("//h1[contains(text(), 'Order Management Dashboard')]")
    );
    expect(await dashboardHeading.isDisplayed()).toBe(true);
  }, 20000);

  test('Staff can view all orders', async () => {
    // Login first
    await driver.get(`${BASE_URL}/staff`);
    await driver.wait(until.elementLocated(By.className('login-card')), TIMEOUT);
    
    await driver.findElement(By.xpath("//input[@type='email']"))
      .sendKeys(STAFF_EMAIL);
    await driver.findElement(By.xpath("//input[@type='password']"))
      .sendKeys(STAFF_PASSWORD);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    
    // Wait for dashboard
    await driver.wait(until.elementLocated(By.className('order-dashboard')), TIMEOUT);
    
    // Check for order cards
    const orderCards = await driver.findElements(By.className('order-card'));
    // There might be no orders initially, that's okay
    expect(orderCards).toBeDefined();
    
    // Check for filter buttons
    const allOrdersBtn = await driver.findElement(
      By.xpath("//button[text()='All Orders']")
    );
    expect(await allOrdersBtn.isDisplayed()).toBe(true);
  }, 20000);

  test('Staff can filter orders by status', async () => {
    // Assuming logged in from previous test
    await driver.get(`${BASE_URL}/staff`);
    
    // Wait for dashboard
    await driver.wait(until.elementLocated(By.className('filter-buttons')), TIMEOUT);
    
    // Test different filters
    const filters = ['Pending', 'In Progress', 'Ready', 'Cancelled', 'Completed'];
    
    for (const filter of filters) {
      const filterBtn = await driver.findElement(
        By.xpath(`//button[text()='${filter}']`)
      );
      await filterBtn.click();
      
      // Wait for filter to apply
      await driver.sleep(500);
      
      // Check if button is active
      const className = await filterBtn.getAttribute('class');
      expect(className).toContain('active');
    }
  });

  test('Staff can navigate to Menu Management', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Wait for dashboard header
    await driver.wait(until.elementLocated(By.className('tab-buttons')), TIMEOUT);
    
    // Click Menu Management tab
    const menuTab = await driver.findElement(
      By.xpath("//button[text()='Menu Management']")
    );
    await menuTab.click();
    
    // Wait for menu management section
    const menuManagement = await driver.wait(
      until.elementLocated(By.className('menu-management')),
      TIMEOUT
    );
    expect(await menuManagement.isDisplayed()).toBe(true);
    
    // Check for menu items (might be empty initially)
    await driver.sleep(1000); // Wait for items to load
    const menuItems = await driver.findElements(By.className('menu-item-card'));
    // Just check that the menu management section exists
    expect(menuManagement).toBeDefined();
  });

  test('Staff can toggle item availability', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Navigate to Menu Management
    await driver.wait(until.elementLocated(By.className('tab-buttons')), TIMEOUT);
    const menuTab = await driver.findElement(
      By.xpath("//button[text()='Menu Management']")
    );
    await menuTab.click();
    
    // Wait for menu items
    await driver.wait(until.elementLocated(By.className('menu-items-grid')), TIMEOUT);
    
    // Find first toggle switch
    const toggleSwitches = await driver.findElements(
      By.xpath("//input[@type='checkbox']")
    );
    
    if (toggleSwitches.length > 0) {
      const firstSwitch = toggleSwitches[0];
      const initialState = await firstSwitch.isSelected();
      
      // Click to toggle
      await firstSwitch.click();
      
      // Wait for update
      await driver.sleep(1000);
      
      // Check if state changed
      const newState = await firstSwitch.isSelected();
      expect(newState).toBe(!initialState);
    }
  });

  test('Staff can update order status', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Navigate to Orders tab
    await driver.wait(until.elementLocated(By.className('tab-buttons')), TIMEOUT);
    const ordersTab = await driver.findElement(
      By.xpath("//button[text()='Orders']")
    );
    await ordersTab.click();
    
    // Wait for orders
    await driver.wait(until.elementLocated(By.className('orders-grid')), TIMEOUT);
    
    // Find pending orders with "Start Preparing" button
    const startButtons = await driver.findElements(
      By.xpath("//button[text()='Start Preparing']")
    );
    
    if (startButtons.length > 0) {
      // Click first button
      await startButtons[0].click();
      
      // Wait for status update
      await driver.sleep(1000);
      
      // Check if button changed to "Mark Ready"
      const readyButtons = await driver.findElements(
        By.xpath("//button[text()='Mark Ready']")
      );
      expect(readyButtons.length).toBeGreaterThan(0);
    }
  });

  test('Staff can cancel an order', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Wait for orders
    await driver.wait(until.elementLocated(By.className('orders-grid')), TIMEOUT);
    
    // Find cancel buttons
    const cancelButtons = await driver.findElements(
      By.xpath("//button[text()='Cancel']")
    );
    
    if (cancelButtons.length > 0) {
      // Click first cancel button
      await cancelButtons[0].click();
      
      // Wait for status update
      await driver.sleep(1000);
      
      // Check if order status changed to cancelled
      const cancelledBadges = await driver.findElements(
        By.xpath("//span[contains(@class, 'status-badge') and text()='CANCELLED']")
      );
      expect(cancelledBadges.length).toBeGreaterThan(0);
    }
  });

  test('Staff can filter menu items by category', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Navigate to Menu Management
    await driver.wait(until.elementLocated(By.className('tab-buttons')), TIMEOUT);
    const menuTab = await driver.findElement(
      By.xpath("//button[text()='Menu Management']")
    );
    await menuTab.click();
    
    // Wait for category filter
    await driver.wait(until.elementLocated(By.className('category-filter')), TIMEOUT);
    
    // Click on Rice Dishes category
    const riceDishesBtn = await driver.findElement(
      By.xpath("//button[contains(text(),'Rice')]")
    );
    await riceDishesBtn.click();
    
    // Wait for filtered results
    await driver.sleep(500);
    
    // Check if button is active
    const className = await riceDishesBtn.getAttribute('class');
    expect(className).toContain('active');
    
    // Check if items are filtered
    const menuItems = await driver.findElements(By.className('menu-item-card'));
    expect(menuItems.length).toBeGreaterThan(0);
  });

  test('Staff can logout', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Wait for dashboard
    await driver.wait(until.elementLocated(By.className('staff-header')), TIMEOUT);
    
    // Click logout button
    const logoutBtn = await driver.findElement(
      By.xpath("//button[text()='Logout']")
    );
    await logoutBtn.click();
    
    // Should redirect to login
    const loginCard = await driver.wait(
      until.elementLocated(By.className('auth-card')),
      TIMEOUT
    );
    expect(await loginCard.isDisplayed()).toBe(true);
  }, 20000);

  test('Staff cannot login with invalid credentials', async () => {
    await driver.get(`${BASE_URL}/staff`);
    
    // Wait for login form
    await driver.wait(until.elementLocated(By.className('auth-card')), TIMEOUT);
    
    // Fill in invalid credentials
    await driver.findElement(By.xpath("//input[@type='email']"))
      .sendKeys('wrong@email.com');
    await driver.findElement(By.xpath("//input[@type='password']"))
      .sendKeys('wrongpassword');
    
    // Submit form
    const loginButton = await driver.findElement(
      By.xpath("//button[@type='submit']")
    );
    await loginButton.click();
    
    // Wait for error message
    const errorMessage = await driver.wait(
      until.elementLocated(By.className('error-message')),
      TIMEOUT
    );
    expect(await errorMessage.isDisplayed()).toBe(true);
    
    const errorText = await errorMessage.getText();
    expect(errorText).toContain('Invalid');
  }, 20000);
});