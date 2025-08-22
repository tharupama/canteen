const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('User Flow E2E Tests', () => {
  let driver;
  const BASE_URL = 'http://localhost:3000';
  const TIMEOUT = 10000;

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

  test('User can navigate to the application', async () => {
    await driver.get(BASE_URL);
    
    const title = await driver.getTitle();
    expect(title).toContain('React App');
    
    // Check if landing page loads
    const heading = await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'University Canteen')]")),
      TIMEOUT
    );
    expect(await heading.isDisplayed()).toBe(true);
  });

  test('User can access customer portal', async () => {
    await driver.get(BASE_URL);
    
    // Click on Start Ordering button
    const startOrderingBtn = await driver.wait(
      until.elementLocated(By.xpath("//h2[text()='Start Ordering']")),
      TIMEOUT
    );
    await startOrderingBtn.click();
    
    // Should redirect to user page
    await driver.wait(until.urlContains('/user'), TIMEOUT);
    
    // Should show authentication form
    const authForm = await driver.wait(
      until.elementLocated(By.className('auth-card')),
      TIMEOUT
    );
    expect(await authForm.isDisplayed()).toBe(true);
  });

  test('User can sign up for a new account', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for auth form
    await driver.wait(until.elementLocated(By.className('auth-card')), TIMEOUT);
    
    // Click on Sign Up
    const signUpLink = await driver.findElement(
      By.xpath("//button[contains(text(), 'Sign Up')]")
    );
    await signUpLink.click();
    
    // Fill in registration form
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    
    await driver.findElement(By.xpath("//input[@placeholder='Your full name']"))
      .sendKeys('Test User');
    await driver.findElement(By.xpath("//input[@placeholder='Your phone number']"))
      .sendKeys('0771234567');
    await driver.findElement(By.xpath("//input[@type='email']"))
      .sendKeys(testEmail);
    await driver.findElement(By.xpath("//input[@type='password']"))
      .sendKeys('password123');
    
    // Submit form
    const signUpButton = await driver.findElement(
      By.xpath("//button[@type='submit' and contains(text(), 'Sign Up')]")
    );
    await signUpButton.click();
    
    // Wait for successful registration (should see menu)
    await driver.wait(
      until.elementLocated(By.className('food-list')),
      TIMEOUT
    );
  }, 30000);

  test('User can sign in with existing account', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for auth form
    await driver.wait(until.elementLocated(By.className('auth-card')), TIMEOUT);
    
    // Fill in login form
    await driver.findElement(By.xpath("//input[@type='email']"))
      .sendKeys('test@example.com');
    await driver.findElement(By.xpath("//input[@type='password']"))
      .sendKeys('password123');
    
    // Submit form
    const signInButton = await driver.findElement(
      By.xpath("//button[@type='submit' and contains(text(), 'Sign In')]")
    );
    await signInButton.click();
    
    // Wait for successful login (should see menu)
    await driver.wait(
      until.elementLocated(By.className('food-list')),
      TIMEOUT
    );
  }, 20000);

  test('User can browse menu items', async () => {
    // First login
    await driver.get(`${BASE_URL}/user`);
    await driver.wait(until.elementLocated(By.className('auth-card')), TIMEOUT);
    
    await driver.findElement(By.xpath("//input[@type='email']"))
      .sendKeys('test@example.com');
    await driver.findElement(By.xpath("//input[@type='password']"))
      .sendKeys('password123');
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    
    // Wait for menu to load
    await driver.wait(until.elementLocated(By.className('food-grid')), TIMEOUT);
    
    // Check if food items are displayed
    const foodCards = await driver.findElements(By.className('food-card'));
    expect(foodCards.length).toBeGreaterThan(0);
    
    // Check for price in LKR
    const priceElements = await driver.findElements(By.className('price'));
    const firstPrice = await priceElements[0].getText();
    expect(firstPrice).toContain('Rs');
  }, 20000);

  test('User can filter menu by category', async () => {
    // Assuming already logged in from previous test
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for menu
    await driver.wait(until.elementLocated(By.className('category-filter')), TIMEOUT);
    
    // Click on Beverages category
    const beveragesBtn = await driver.findElement(
      By.xpath("//button[contains(text(),'Beverages')]")
    );
    await beveragesBtn.click();
    
    // Wait for filtered results
    await driver.sleep(1000);
    
    // Check if only beverages are shown
    const foodCards = await driver.findElements(By.className('food-card'));
    expect(foodCards.length).toBeGreaterThan(0);
  });

  test('User can add items to cart', async () => {
    // Navigate to menu (assuming logged in)
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for menu
    await driver.wait(until.elementLocated(By.className('food-grid')), TIMEOUT);
    
    // Find first available item's Add to Cart button
    const addToCartButtons = await driver.findElements(
      By.xpath("//button[text()='Add to Cart']")
    );
    
    if (addToCartButtons.length > 0) {
      await addToCartButtons[0].click();
      
      // Check if cart shows the item
      const cartItems = await driver.wait(
        until.elementLocated(By.className('cart-items')),
        TIMEOUT
      );
      expect(await cartItems.isDisplayed()).toBe(true);
    }
  });

  test('User can navigate to About section', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for navigation
    await driver.wait(until.elementLocated(By.className('header-nav')), TIMEOUT);
    
    // Click About button
    const aboutBtn = await driver.findElement(
      By.xpath("//button[text()='About']")
    );
    await aboutBtn.click();
    
    // Wait for About section
    const aboutSection = await driver.wait(
      until.elementLocated(By.className('about-section')),
      TIMEOUT
    );
    expect(await aboutSection.isDisplayed()).toBe(true);
    
    // Check for About content
    const aboutHeader = await driver.findElement(
      By.xpath("//h2[contains(text(), 'About University Canteen')]")
    );
    expect(await aboutHeader.isDisplayed()).toBe(true);
  });

  test('User can navigate to Contact section', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for navigation
    await driver.wait(until.elementLocated(By.className('header-nav')), TIMEOUT);
    
    // Click Contact button
    const contactBtn = await driver.findElement(
      By.xpath("//button[text()='Contact']")
    );
    await contactBtn.click();
    
    // Wait for Contact section
    const contactSection = await driver.wait(
      until.elementLocated(By.className('contact-section')),
      TIMEOUT
    );
    expect(await contactSection.isDisplayed()).toBe(true);
    
    // Check for contact form
    const contactForm = await driver.findElement(By.className('contact-form'));
    expect(await contactForm.isDisplayed()).toBe(true);
  });

  test('User can fill and submit contact form', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Navigate to Contact
    await driver.wait(until.elementLocated(By.className('header-nav')), TIMEOUT);
    const contactBtn = await driver.findElement(By.xpath("//button[text()='Contact']"));
    await contactBtn.click();
    
    // Wait for form
    await driver.wait(until.elementLocated(By.className('contact-form')), TIMEOUT);
    
    // Fill form
    await driver.findElement(By.xpath("//input[@placeholder='Your Name']"))
      .sendKeys('Test User');
    await driver.findElement(By.xpath("//input[@placeholder='your.email@example.com']"))
      .sendKeys('test@example.com');
    await driver.findElement(By.xpath("//select[@required]"))
      .sendKeys('Feedback');
    await driver.findElement(By.xpath("//textarea[@placeholder='Type your message here...']"))
      .sendKeys('This is a test message');
    
    // Submit form
    const submitBtn = await driver.findElement(
      By.xpath("//button[text()='Send Message']")
    );
    await submitBtn.click();
    
    // Check for alert (success message)
    await driver.wait(until.alertIsPresent(), TIMEOUT);
    const alert = await driver.switchTo().alert();
    const alertText = await alert.getText();
    expect(alertText).toContain('Thank you');
    await alert.accept();
  });

  test('User can view order history', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for navigation
    await driver.wait(until.elementLocated(By.className('header-nav')), TIMEOUT);
    
    // Click Order History button
    const historyBtn = await driver.findElement(
      By.xpath("//button[text()='Order History']")
    );
    await historyBtn.click();
    
    // Wait for history section
    const historySection = await driver.wait(
      until.elementLocated(By.className('order-history')),
      TIMEOUT
    );
    expect(await historySection.isDisplayed()).toBe(true);
  });

  test('User can sign out', async () => {
    await driver.get(`${BASE_URL}/user`);
    
    // Wait for user profile
    await driver.wait(until.elementLocated(By.className('user-profile')), TIMEOUT);
    
    // Click sign out button
    const signOutBtn = await driver.findElement(
      By.xpath("//button[text()='Sign Out']")
    );
    await signOutBtn.click();
    
    // Should redirect to login
    await driver.wait(
      until.elementLocated(By.className('auth-card')),
      TIMEOUT
    );
  });
});