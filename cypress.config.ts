import { defineConfig } from 'cypress'
import cypressSplit  from 'cypress-split'

export default defineConfig({
    // projectId: 'p7ubfu',
    e2e: {
        baseUrl: "http://localhost:3000",
        viewportHeight: 960,
        viewportWidth: 1536, // macbook-16 preset. https://docs.cypress.io/api/commands/viewport#Arguments
        setupNodeEvents(on, config) {
            cypressSplit(on, config)
            // implement node event listeners here
            on('task', {
                log(message) {
                  console.log(message);
                  return null;
                },
            });

            return config;
        },
    },
    env: {
        username: "superadmin@email.com", // used to check valid logins
        password: "Admin@123", // used to check valid logins
        studentRegisterFormIds: {
            stage: 9,
            prod: 2
        }
    },
});