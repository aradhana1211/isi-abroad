export default class Profile{
    navigate() {
        cy.visit('/admin/profile');
    }

    getProfilePage(){
        return cy.get('div[data-cy="profile-page"]');
    }

    getNameInput(){
        return this.getProfilePage().find('input[data-cy="name"]');
    }

    getEmailInput(){
        return this.getProfilePage().find('input[data-cy="email"]')
    }

    getErrorMessage(){
        return this.getProfilePage().find('[data-cy="error"]');
    }

    getSubmitButton(){
        return this.getProfilePage().find('button[data-cy="save-btn"]');
    }

    getChangePasswordButton() {
        return this.getProfilePage().find('button[data-cy="change-save-btn"]');
    }
}