# Playwright E2E Testing Implementation Guide for Turborepo Monorepo

This guide provides a comprehensive implementation plan for setting up Playwright end-to-end testing in your Turborepo monorepo with separate testing packages for the `store` and `admin` applications.

## Overview

Your current monorepo structure:
```
mono-f7/
├── apps/
│   ├── admin/ (TanStack Start app on port 3001)
│   ├── server/ (Bun/Hono API on port 3035)
│   └── store/ (TanStack Start app on port 3000)
├── packages/
│   ├── api/ (tRPC)
│   ├── auth/ (Better Auth)
│   ├── db/ (Drizzle ORM)
│   └── ui/ (React components)
```

## 1. Package Structure Setup

Create three new Playwright packages following Turborepo best practices:

### Directory Structure
```
packages/
├── e2e-store/           # E2E tests for store app
├── e2e-admin/           # E2E tests for admin app
└── e2e-shared/          # Shared test utilities
```

## 2. Dependencies and Workspace Configuration

### Update Root package.json Catalog
Add Playwright dependencies to your workspace catalog:

```json
{
  "workspaces": {
    "catalog": {
      "@playwright/test": "^1.40.0",
      "playwright": "^1.40.0"
    }
  }
}
```

### Root Scripts
Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "test:e2e": "turbo run test",
    "test:e2e:store": "turbo run test --filter=e2e-store",
    "test:e2e:admin": "turbo run test --filter=e2e-admin",
    "test:e2e:ui": "turbo run test:ui",
    "test:e2e:headed": "turbo run test:headed",
    "test:e2e:debug": "turbo run test:debug"
  }
}
```

## 3. Shared E2E Package

### packages/e2e-shared/package.json
```json
{
  "name": "@repo/e2e-shared",
  "private": true,
  "type": "module",
  "scripts": {
    "lint": "ultracite lint",
    "format": "ultracite format",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/auth": "*",
    "@repo/db": "*",
    "@playwright/test": "catalog:",
    "playwright": "catalog:"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "typescript": "catalog:"
  },
  "peerDependencies": {
    "@playwright/test": "*"
  }
}
```

### packages/e2e-shared/src/fixtures/auth.ts
```typescript
import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export interface AuthUser {
  email: string;
  password: string;
  name: string;
}

export interface TestFixtures {
  authenticatedPage: Page;
  testUser: AuthUser;
}

export const test = base.extend<TestFixtures>({
  testUser: async ({}, use) => {
    const testUser: AuthUser = {
      email: `test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
      name: 'Test User'
    };
    await use(testUser);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', testUser.password);
    await page.click('[data-testid="login-button"]');
    
    // Wait for successful login
    await page.waitForURL('/dashboard');
    
    await use(page);
  }
});

export { expect };
```

### packages/e2e-shared/src/utils/database.ts
```typescript
import { db } from '@repo/db';

export class TestDatabase {
  static async cleanup() {
    // Clean up test data
    // Add your database cleanup logic here
    console.log('Cleaning up test database...');
  }

  static async seed() {
    // Seed test data
    console.log('Seeding test database...');
  }

  static async createTestUser(email: string, password: string, name: string) {
    // Create test user logic
    console.log(`Creating test user: ${email}`);
  }

  static async deleteTestUser(email: string) {
    // Delete test user logic
    console.log(`Deleting test user: ${email}`);
  }
}
```

### packages/e2e-shared/src/page-objects/base-page.ts
```typescript
import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  abstract url: string;
  abstract pageTitle: string;

  async goto() {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async verifyPageTitle() {
    await expect(this.page).toHaveTitle(this.pageTitle);
  }

  async clickButton(selector: string) {
    await this.page.click(selector);
  }

  async fillInput(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async getText(selector: string): Promise<string> {
    return await this.page.textContent(selector) || '';
  }

  async waitForSelector(selector: string) {
    await this.page.waitForSelector(selector);
  }
}
```

## 4. Store E2E Package

### packages/e2e-store/package.json
```json
{
  "name": "e2e-store",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "install-browsers": "playwright install",
    "lint": "ultracite lint",
    "format": "ultracite format",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/e2e-shared": "*",
    "@repo/ui": "*",
    "@repo/auth": "*",
    "@playwright/test": "catalog:",
    "playwright": "catalog:"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "typescript": "catalog:"
  }
}
```

### packages/e2e-store/playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: [
    {
      command: 'bun run dev --filter=server',
      url: 'http://localhost:3035/health',
      name: 'API Server',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'bun run dev --filter=store',
      url: 'http://localhost:3000',
      name: 'Store App',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],

  globalSetup: path.resolve(__dirname, 'global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'global-teardown.ts'),
});
```

### packages/e2e-store/global-setup.ts
```typescript
import { chromium, FullConfig } from '@playwright/test';
import { TestDatabase } from '@repo/e2e-shared/utils/database';

async function globalSetup(config: FullConfig) {
  console.log('🧪 Setting up store E2E tests...');
  
  // Database setup
  await TestDatabase.cleanup();
  await TestDatabase.seed();

  // Create test users if needed
  await TestDatabase.createTestUser(
    'store-test@example.com',
    'TestPassword123!',
    'Store Test User'
  );

  console.log('✅ Store E2E setup complete');
}

export default globalSetup;
```

### packages/e2e-store/global-teardown.ts
```typescript
import { TestDatabase } from '@repo/e2e-shared/utils/database';

async function globalTeardown() {
  console.log('🧹 Cleaning up store E2E tests...');
  
  // Clean up test data
  await TestDatabase.deleteTestUser('store-test@example.com');
  await TestDatabase.cleanup();

  console.log('✅ Store E2E cleanup complete');
}

export default globalTeardown;
```

### packages/e2e-store/tests/auth/login.spec.ts
```typescript
import { test, expect } from '@repo/e2e-shared/fixtures/auth';

test.describe('Store Authentication', () => {
  test('should allow user to login', async ({ page, testUser }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[data-testid="email"]', testUser.email);
    await page.fill('[data-testid="password"]', testUser.password);
    
    // Submit form
    await page.click('[data-testid="login-button"]');
    
    // Verify successful login
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]')).toContainText(testUser.name);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});
```

### packages/e2e-store/tests/user/dashboard.spec.ts
```typescript
import { test, expect } from '@repo/e2e-shared/fixtures/auth';

test.describe('User Dashboard', () => {
  test('should display user dashboard after login', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/dashboard');
    await expect(authenticatedPage.locator('h1')).toContainText('Dashboard');
    await expect(authenticatedPage.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should allow user to logout', async ({ authenticatedPage }) => {
    await authenticatedPage.click('[data-testid="user-menu"]');
    await authenticatedPage.click('[data-testid="logout-button"]');
    
    await expect(authenticatedPage).toHaveURL('/login');
  });
});
```

## 5. Admin E2E Package

### packages/e2e-admin/package.json
```json
{
  "name": "e2e-admin",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report",
    "install-browsers": "playwright install",
    "lint": "ultracite lint",
    "format": "ultracite format",
    "check-types": "tsc --noEmit"
  },
  "dependencies": {
    "@repo/e2e-shared": "*",
    "@repo/ui": "*",
    "@repo/auth": "*",
    "@playwright/test": "catalog:",
    "playwright": "catalog:"
  },
  "devDependencies": {
    "@repo/typescript-config": "*",
    "typescript": "catalog:"
  }
}
```

### packages/e2e-admin/playwright.config.ts
```typescript
import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results.json' }],
    process.env.CI ? ['github'] : ['list']
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox', 
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: [
    {
      command: 'bun run dev --filter=server',
      url: 'http://localhost:3035/health',
      name: 'API Server',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'bun run dev --filter=admin',
      url: 'http://localhost:3001',
      name: 'Admin App',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    }
  ],

  globalSetup: path.resolve(__dirname, 'global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'global-teardown.ts'),
});
```

### packages/e2e-admin/tests/admin/dashboard.spec.ts
```typescript
import { test, expect } from '@repo/e2e-shared/fixtures/auth';

test.describe('Admin Dashboard', () => {
  test('should display admin dashboard', async ({ authenticatedPage }) => {
    await expect(authenticatedPage).toHaveURL('/');
    await expect(authenticatedPage.locator('h1')).toContainText('Admin Dashboard');
  });

  test('should have admin navigation menu', async ({ authenticatedPage }) => {
    const navigation = authenticatedPage.locator('[data-testid="admin-nav"]');
    await expect(navigation).toBeVisible();
    
    // Check for common admin menu items
    await expect(navigation.locator('text=Users')).toBeVisible();
    await expect(navigation.locator('text=Settings')).toBeVisible();
  });
});
```

## 6. Turbo Configuration Updates

### Update turbo.json
```json
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"]
    },
    "test": {
      "dependsOn": ["^build"],
      "env": ["DATABASE_URL", "PLAYWRIGHT_*", "CI"],
      "outputs": [
        "playwright-report/**",
        "test-results/**",
        "test-results.json"
      ]
    },
    "test:ui": {
      "dependsOn": ["^build"],
      "env": ["DATABASE_URL", "PLAYWRIGHT_*"],
      "cache": false,
      "persistent": true
    },
    "test:headed": {
      "dependsOn": ["^build"],
      "env": ["DATABASE_URL", "PLAYWRIGHT_*"],
      "cache": false
    },
    "test:debug": {
      "dependsOn": ["^build"],
      "env": ["DATABASE_URL", "PLAYWRIGHT_*"],
      "cache": false,
      "persistent": true
    },
    "install-browsers": {
      "cache": false
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "server#dev": {
      "cache": false,
      "persistent": true,
      "env": ["DATABASE_URL", "SERVER_*", "PUBLIC_WEB_URL"]
    },
    "store#dev": {
      "cache": false,
      "persistent": true,
      "env": ["PUBLIC_*", "VITE_*"]
    },
    "admin#dev": {
      "cache": false,
      "persistent": true,
      "env": ["PUBLIC_*", "VITE_*"]
    }
  }
}
```

## 7. Environment Configuration

### .env.test (for CI/CD)
```env
# Test Database
DATABASE_URL=postgresql://test:test@localhost:5432/test_db

# API Configuration
SERVER_PORT=3035
PUBLIC_WEB_URL=http://localhost:3000

# Test Configuration
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
CI=true
```

### packages/e2e-store/.env
```env
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

### packages/e2e-admin/.env
```env
PLAYWRIGHT_BASE_URL=http://localhost:3001
```

## 8. GitHub Actions Workflow

### .github/workflows/e2e-tests.yml
```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  e2e-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_USER: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Bun
      uses: oven-sh/setup-bun@v1
      with:
        bun-version: latest
        
    - name: Install dependencies
      run: bun install
      
    - name: Install Playwright Browsers
      run: |
        bun run --filter=e2e-store install-browsers
        bun run --filter=e2e-admin install-browsers
        
    - name: Run database migrations
      run: bun run db:migrate
      env:
        DATABASE_URL: postgresql://test:test@localhost:5432/test_db
        
    - name: Build applications
      run: bun run build
      
    - name: Run E2E tests
      run: bun run test:e2e
      env:
        DATABASE_URL: postgresql://test:test@localhost:5432/test_db
        CI: true
        
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: |
          packages/e2e-store/playwright-report/
          packages/e2e-admin/playwright-report/
        retention-days: 30
```

## 9. TypeScript Configuration

### packages/e2e-shared/tsconfig.json
```json
{
  "extends": "@repo/typescript-config/base.json",
  "include": ["src/**/*"],
  "exclude": ["dist", "build", "node_modules"]
}
```

### packages/e2e-store/tsconfig.json
```json
{
  "extends": "@repo/typescript-config/base.json",
  "include": ["tests/**/*", "*.config.ts"],
  "exclude": ["dist", "build", "node_modules", "test-results", "playwright-report"]
}
```

### packages/e2e-admin/tsconfig.json
```json
{
  "extends": "@repo/typescript-config/base.json", 
  "include": ["tests/**/*", "*.config.ts"],
  "exclude": ["dist", "build", "node_modules", "test-results", "playwright-report"]
}
```

## 10. Usage Examples

### Running Tests
```bash
# Run all E2E tests
bun run test:e2e

# Run store tests only
bun run test:e2e:store

# Run admin tests only  
bun run test:e2e:admin

# Run tests in UI mode
bun run test:e2e:ui

# Run tests in headed mode
bun run test:e2e:headed

# Debug specific test
bun run test:debug --filter=e2e-store

# Run specific test file
cd packages/e2e-store && bun run test tests/auth/login.spec.ts
```

### Test Data Management
```typescript
// In your test files
import { TestDatabase } from '@repo/e2e-shared/utils/database';

test.beforeEach(async () => {
  await TestDatabase.cleanup();
  await TestDatabase.seed();
});
```

## 11. Best Practices

### Test Organization
- Keep tests focused on user journeys
- Use Page Object Models for complex interactions
- Share common utilities in the e2e-shared package
- Separate authentication logic into fixtures

### Performance
- Use `fullyParallel: true` for faster test execution
- Configure proper timeouts for CI environments
- Use `trace: 'on-first-retry'` to avoid unnecessary overhead

### Reliability
- Always clean up test data between tests
- Use data-testid attributes for reliable selectors
- Configure retries for flaky tests in CI
- Use proper wait strategies (`waitForLoadState`, `waitForSelector`)

### Debugging
- Use `test:ui` mode for interactive debugging
- Enable video recording for failed tests
- Use screenshots on failure
- Use `test:debug` for step-by-step debugging

## 12. Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure your webServer configuration uses unique ports
2. **Database state**: Always clean up test data between tests
3. **Timing issues**: Use proper wait strategies instead of fixed timeouts
4. **Authentication**: Use fixtures for consistent auth state
5. **Environment variables**: Ensure all required vars are passed through in turbo.json

### Debugging Commands
```bash
# Show test report
cd packages/e2e-store && bun run test:report

# Run single test in debug mode
cd packages/e2e-store && bun run playwright test --debug tests/auth/login.spec.ts

# Generate test code
cd packages/e2e-store && bunx playwright codegen localhost:3000
```

This comprehensive setup provides a robust foundation for E2E testing in your Turborepo monorepo, with proper separation of concerns, shared utilities, and CI/CD integration.