export default class Login {
    navigate() {
        cy.visit("/");
    }

    getLoginPage() {
        return cy.get('section[data-cy="login-page"]');
    }

    getEmailInput() {
        return this.getLoginPage().find('input[data-cy="email"]');
    }

    getPasswordInput() {
        return this.getLoginPage().find('input[data-cy="password"]');
    }

    getErrorMessage() {
        return this.getLoginPage().find('[data-cy="error"]');
    }

    getSubmitButton() {
        return this.getLoginPage().find('button[data-cy="submit"]');
    }
}
