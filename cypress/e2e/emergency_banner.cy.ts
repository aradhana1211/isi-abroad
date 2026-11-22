import EmergencyBanner from "../support/PageObjects/EmergencyBanner";

describe("EmergencyBanner test case check", () => {
    const emergencyBanner = new EmergencyBanner();

    beforeEach(() => {
        cy.doLogin();

        cy.intercept({
            method: 'GET',
            url: 'api/v1/banners**',
        }).as('emergencyBannerListing');

        emergencyBanner.navigate();

        cy.wait('@emergencyBannerListing');
        cy.wait(300)
    })
    /**
     * This is for template, base structure for how tests should be implemented.
     */
    it("create emergency banner page", () => {
        emergencyBanner.getEmergencyBannerPage()
            .should('be.visible');

        emergencyBanner.getAddEmergencyBannerLink()
            .should('be.visible')
            .click();

        cy.wait(500);

        cy.url().should('contain','/admin/setting/emergency-banner/add')

        cy.wait(800);

        const title = `test_${Math.random().toString(36).substring(5)}`
        
        emergencyBanner.getTitleInput()
            .should("be.visible")
            .should("be.enabled")   
            .type(title, { delay: 100 });

        emergencyBanner.getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = Number(String(currentDate.getHours()).padStart(2, '0'));
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDate = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

        emergencyBanner.getStartDateInput()
            .should("be.visible")
            .type(formattedDate,{delay:100})

        // Click the submit button
        emergencyBanner.getSubmitButton()
            .should("exist")
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 1);

        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDate.getDate()).padStart(2, '0');
        const endYear = endDate.getFullYear();
        const endHours = Number(String(endDate.getHours()).padStart(2, '0'));
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        const endmpm = endHours >= 12 ? 'PM' : 'AM';
        const formattedEndDate = `${endMonth}/${endDay}/${endYear} ${endHours}:${endMinutes} ${endmpm}`;

        emergencyBanner.getEndDateInput()
            .should("be.visible")
            .type(formattedEndDate, { delay: 350 });
    
        emergencyBanner.getInstituteSelect()
           .click();

        cy.intercept({
            url: /.*\/api\/v1\/setting\/students.*/,
            times: 5
        }).as('updateStudent');

        emergencyBanner.getInstituteOptions().first().click()
        
        cy.wait('@updateStudent')
        cy.get('body').click()

        emergencyBanner.getSessionSelect()
           .click();

        emergencyBanner.getSessionOptions().first().click()

        cy.wait('@updateStudent')
        cy.get('body').click()

        emergencyBanner.getProgramSelect()
            .click()

        emergencyBanner.getProgramOptions().first().click()

        cy.wait('@updateStudent')
        cy.get('body').click()

        emergencyBanner.getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(1000)

        cy.url().should("contain", "/admin/setting/emergency-banner");
    })

    //Edit Emergency Banner Page
    it('edit emergency banner page',() => {
        emergencyBanner.getEmergencyBannerPage()
        .should('be.visible');

        emergencyBanner.getEmergencyBannerEditPage()
            .should('be.visible')
            .click();
        cy.wait(500)

        cy.get('[type="text"]').clear()

        emergencyBanner.getStartDateInput()
            .click()
            .click()

        emergencyBanner.getStartDateInput()
            .find('input')
            .clear({ force: true })

        emergencyBanner.getEndDateInput()
            .click()
            .click()

        emergencyBanner.getEndDateInput()
            .find('input')
            .clear({ force: true })
        const title = `test_${Math.random().toString(36).substring(5)}`
        
        emergencyBanner.getTitleInput()
            .should("be.visible")
            .should("be.enabled")
            .click()

        cy.wait(500)

        emergencyBanner.getTitleInput()
            .click()
            .type(title, { delay: 100 });

        emergencyBanner.getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const year = currentDate.getFullYear();
        const hours = Number(String(currentDate.getHours()).padStart(2, '0'));
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedDate = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

        emergencyBanner.getStartDateInput()
            .should("be.visible")
            .click()

        cy.wait(1000)

        emergencyBanner.getStartDateInput()
            .should("be.visible")
            .click()
            .type(formattedDate,{delay:100})

        // Click the submit button
        emergencyBanner.getSubmitButton()
            .should("exist")
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(500)

        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + 1);

        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDate.getDate()).padStart(2, '0');
        const endYear = endDate.getFullYear();
        const endHours = Number(String(endDate.getHours()).padStart(2, '0'));
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        const endmpm = endHours >= 12 ? 'PM' : 'AM';
        const formattedEndDate = `${endMonth}/${endDay}/${endYear} ${endHours}:${endMinutes} ${endmpm}`;

        emergencyBanner.getEndDateInput()
            .should("be.visible")
            .click()

        cy.wait(1000)
        emergencyBanner.getEndDateInput()
            .should("be.visible")
            .click()
            .type(formattedEndDate, { delay: 100 });

        emergencyBanner.getSubmitButton()
            .should("be.visible")
            .should("be.enabled")
            .click();

        cy.wait(1000)

        cy.url().should("contain", "/admin/setting/emergency-banner");
    });
})