package pages.app
import geb.Page


class InitialCWUProposalPage extends Page {
	static at = { title.startsWith("BCDevExchange") }
	//static at = { title == "BCDevExchange - Proposals List" }
	//static url = ${driver.currentUrl()}   <-- It seems it can not be set dynamically
	static content = {
            DeveloperTab{ $('[data-automation-id ~= "tab-cwu-proposal-developer"]')}
            CompanyTab { $('[data-automation-id ~= "tab-cwu-proposal-company"]') }
            ProposalTab { $('[data-automation-id ~= "tab-cwu-proposal-proposal"]') }
            AttachmentTab { $('[data-automation-id ~= "tab-cwu-proposal-attachment"]') }
            TermsTab { $('[data-automation-id ~= "tab-cwu-proposal-terms"]') }
           
            CheckTerms{ $('[data-automation-id ~= "checkbox-cwu-proposal-terms"]') }

            ButtonSubmit { $('[data-automation-id ~= "button-cwu-proposal-submit"]') }
            ButtonSaveUpdates { $('[data-automation-id ~= "button-cwu-proposal-save-updates"]') }
            ButtonSaveChanges { $('[data-automation-id ~= "button-cwu-proposal-save-changes"]') }
            ButtonDelete { $('[data-automation-id ~= "button-cwu-proposal-delete"]') }
            ButtonWithdraw { $('[data-automation-id ~= "button-cwu-proposal-withdraw"]') }

            ButtonUploadFile{ $('[data-automation-id~="button-cwu-proposal-upload-file"]') }
            

            ButtonModalYes{$('[data-automation-id~="button-modal-yes"]')}
            

            FirstName{ $('[id ~= "firstName"]') }

            proposalOppFrame(page: MCEFrame) { $(By.xpath('//iframe[@id=concat(//textarea[@data-automation-id="text-proposal-description"]//@id,"_ifr")]'), 0) }
           
    }


    void "Add Proposal"(String desc){
            //waitFor { angularReady }
            withFrame( waitFor { proposalOppFrame } ) {
              mceBody << desc
          }
    }
    
}
