import geb.spock.GebReportingSpec
import geb.Page

import java.text.SimpleDateFormat
import static java.util.Calendar.*

import pages.app.HomePage

import pages.app.OpportunitiesPage
import pages.app.OpportunitiesAdminCreatePage
import pages.app.OpportunitiesAdminCreateLandingPage
import pages.app.OpportunityDetailPage
import pages.app.OpportunitiesAdminEditPage

import pages.app.ProgramsPage
import pages.app.ProgramCreatePage
import pages.app.ProgramViewPage 
import pages.app.ProjectsPage
import pages.app.ProjectCreatePage
import pages.app.ProjectViewPage

import pages.app.SignedIn

import geb.module.RadioButtons
import org.openqa.selenium.By
import org.openqa.selenium.Keys

import spock.lang.Unroll
import spock.lang.Narrative
import spock.lang.Title


@Narrative('''The test will simulate an Administrator creating, in this order, a Program, a Project and one Opportunity.
They are required as preconditions for other tests.
 ''')


@Title("Create and publish projects, programs, and opportunities")
class CreateProgramProjectOpp extends GebReportingSpec {

    static def RandomID = UUID.randomUUID().toString()
    
        def setup() {
            to HomePage
            // Need to login as an admin
            def  loginOK= login."Login As An Administrator"("admin","adminadmin","Admin Local")
            assert loginOK
        }
/*
        @Unroll //Not actually necessary if we are using only single set of data (ie, creating only one program)
        def "Create Program: '#ProgramTitleValue'" () {
            given: "After login as Administrator, I go to the Programs Page"
                waitFor { to ProgramsPage }

            when: "Click on the Programs button"
                waitFor{ListProgramButton}
                ListProgramButton.click()

            then: "And open the Create Program page"
                at ProgramCreatePage

            when: "Enter the details for the new program"
                ProgramTitle.value(ProgramTitleValue)
                ShortDescription.value(ShortDescriptionValue)

                waitFor{ProgramDescriptionBox}
                //Note: the 'body' is inside an iframe. To identify the iframe I use the title because the id changes depending on the browser we are using.
                withFrame(ProgramDescriptionBox){$("body", id:"tinymce") << DescriptionValue}
                Website.value(WebsiteValue)

            and: "Click the 'Save Changes' button for the program: '#ProgramTitleValue'"
                SaveButton.click()

            then: "After Saving, the Programs View Page should be displayed and the Publish button show be there"
                waitFor { at ProgramViewPage }
                //waitFor {to ProgramViewPage } //Not sure if I need it
                assert waitFor{PublishButton}
    
            when: "Click the publish button"
                PublishButton.click()

            then: "The Program View Page reloadas with am 'Unpublish' button"
                //waitFor { at ProgramViewPage }
                assert UnpublishButton
                assert UnpublishButton.isDisplayed()
                sleep(1000)

            where: "The following values are used to populate the Program"
                ProgramTitleValue | ShortDescriptionValue | DescriptionValue | WebsiteValue
                "Program: Automation Test 1" | "Short Descriptive Program: Automation Test 1" | "Long description Program: Automation Test 1" | "https://www.google.com"
        }


        @Unroll  //Not actually necessary if we are using only single set of data (ie, creating only one project)
        def "Create Project: '#ProjectNameValue'" () {
            given: "Already logged as Administrator, go to Projects page"
                waitFor { to ProjectsPage }

            when: "Click on 'List a Project' button to create a new project- Program alredy exists"
                waitFor{ListProjectButton}
                ListProjectButton.click()

            then: "Load the Create Project page"
                waitFor{at ProjectCreatePage}

            when: "Enter the details for the new project"
                Program = ProgramValue
                ProjectName.value(ProjectNameValue)
                ShortDescription.value(ShortDescriptionValue)
               
                waitFor{ProjectDescriptionBox}
                //Note: the 'body' is inside an iframe. To identify the iframe I use the title because the id changes depending on the browser we are using.
                withFrame(ProjectDescriptionBox){$("body", id:"tinymce") << DescriptionValue}

                sleep(3000) //Makes no sense, but without this sleep it does not work
                waitFor{Github}
                Github.value(GithubValue)
                Tags.value(TagsValue)
                waitFor{ActivityLevel}
                ActivityLevel.value(ActivityLevelValue)

            and: "Click the 'Save Changes' button for the project: '#ProjectNameValue'"
                waitFor{SaveButton}
                SaveButton.click()
                reportInfo("142 URL inmediately after save is ${driver.currentUrl}"  )

            then: "I arrive to the Projects View Page, and verify the Publish button exists"
                waitFor {at ProjectViewPage}
                reportInfo("146 URL after loading ProjectViewPage  is ${driver.currentUrl}"  )
                //to ProjectViewPage

            reportInfo("149 URL after insisting loading ProjectViewPage is ${driver.currentUrl}"  )
                assert waitFor{PublishButton}

            when: "I click the publish button"
                PublishButton.click()

            then:"The Unpublish button exists and it is displayed"
                at ProjectViewPage
                assert waitFor{UnpublishButton}
                assert UnpublishButton.isDisplayed()

            where: "The values used to create the Project are:"
                ProjectNameValue | ShortDescriptionValue | DescriptionValue | GithubValue | TagsValue | ActivityLevelValue | ProgramValue
                "Project: Automation Test Project 1" | "Short Descriptive for Automation Test Project 1" | "Longer descriptive for Automation Test Project 1" | "https://github.com/BCDevExchange" | "javascript,html,mongo" | "3" | "Program: Automation Test 1"
        }

*/

       @Unroll   //Not actually necessary if we are using only single set of data (ie, creating only one opportunity)
            def "Publish Opportunity: '#TitleData'" () {
                //Assignements in the beginning
                // This section set and format the dates 
                Calendar calendar= Calendar.getInstance()
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd")

                calendar.add(Calendar.DATE,3)
                def deadline=calendar.getTime()  //Define the deadline for applications (set to 3 days from today)
                def Formatted_deadline=format.format( deadline )

                calendar.add(Calendar.DATE,21)
                def assignment=calendar.getTime() //Define the date the oppoortunity is assigned (set to 21 + 3 days from today)
                def Formatted_assignment=format.format(assignment)

                calendar.add(Calendar.DATE,21)
                def start=calendar.getTime()   //Define the start date for the work (set to 21+21+3 days from today)
                def Formatted_start=format.format(start)

                def  MyTitleData = TitleData + ": " + RandomID
                reportInfo("Variable a is :"  + TitleData  )
                reportInfo("Variable a is ${MyTitleData}"  )


                given: "Already logged as Administrator, go to Opportunities Page. Program and Project already exists"
                    waitFor { to OpportunitiesPage }

                when: "I click on 'Post and opportunity' button to create a new opportunity- Program and Project alredy exists"
                    PostAnOpportunity.click()

                then: "I load the Landing Page that allows to create a CWU or SWU opportunity"
                    waitFor{at OpportunitiesAdminCreateLandingPage}
                    reportInfo("URL line 203 is ${driver.currentUrl}"  )

                and: "Click on the Get Started button under CWU"  
                    waitFor{createCWUOpportunityButton}
                    createCWUOpportunityButton.click()
                    waitFor{at OpportunitiesAdminCreatePage}
                    reportInfo("URL line 209 is ${driver.currentUrl}"  )

                and: "Set the title,teaser, description.... and other details of the opportunity "
                    selectProject.value(Project)
                    reportInfo("project value is  ${selectProject.value()}"  )
                    reportInfo("URL line 214 is ${driver.currentUrl}"  )
                    oppTitle.value(MyTitleData) //Title
                    oppTeaser.value(Teaser) //teaser
                    oppGithub.value(Github) //Github location

                    //Now we move to the Background tab  
                    BackgroundTabClick
                    waitFor{OppBackgroundBox}
                    //Note: the 'body' is inside an iframe. To identify the iframe I use the title because the id changes depending on the browser we are using.
                    //There are three iframes in the OpportunitiesAdminCreatePage, this one is the 0, if order of the iframes change, then redo the element identifiers
                    withFrame(OppBackgroundBox){$("body", id:"tinymce") << Background }

                    DetailsTabClick //Now we move to the Details tab  
                    selectLocation.value(Location)
                    selectEarn.value(Earn)

                    //No Email field in the current incarnation of the application
                    // oppEmail.value(Email)
                    // oppEmail << Keys.chord(Keys.TAB)

                    assert proposalDeadLine.attr("name")== "deadline"
            //Dates
                    reportInfo("Deadline name:" + proposalDeadLine.attr("name") )
                    reportInfo("Deadline type:" + proposalDeadLine.attr("type") )
                    reportInfo("Deadline value:" + proposalDeadLine.value() )
                    reportInfo("Formatted_deadline value:" + Formatted_deadline )


                    $(By.xpath('//*[@id="deadline"]')).value("2020-01-01")
                    //proposalDeadLine.value(Formatted_deadline)
                    reportInfo("Deadline value -after-:" + proposalDeadLine.value() )
                    proposalAssignment.value(Formatted_assignment)
                    proposalStartDate.value(Formatted_start)
    
                    AcceptanceTabClick //Now we move to the Acceptance and Evaluatio tab  
                    waitFor{OppAcceptanceBox}
                    //Note: the 'body' is inside an iframe. To identify the iframe I use the title because the id changes depending on the browser we are using.
                    //There are three iframes in the OpportunitiesAdminCreatePage, this one is the 1, if order of the iframes change, then redo the element identifiers
                    withFrame(OppAcceptanceBox){$("body", id:"tinymce") << AcceptanceCriteria  }
                    sleep(1000)
                    waitFor{ProposalAcceptanceBox}
                    //Note: the 'body' is inside an iframe. To identify the iframe I use the title because the id changes depending on the browser we are using.
                    //There are three iframes in the OpportunitiesAdminCreatePage, this one is the 2, if order of the iframes change, then redo the element identifiers
                    withFrame(ProposalAcceptanceBox){$("body", id:"tinymce") << ProposalCriteria}
                    sleep(1000)
                    oppSkills.value(Skills) //Skills
                    sleep(1000)

                and: "I click the 'save changes' button for the opportunity: '#TitleData'"
                    SaveButton.click()  //This action saves the changes but does not change the page
                    sleep(3000) //This makes no sense given the next waitFor, but without it, then fails
                then: "Go to the opportunities page to publish it"
                    waitFor{to OpportunitiesPage}

                and: "Click on the newly created opportunity (still unpublished)"
                    //def OppTitle =PublishedOpportunity.text()  //Opportunity title
                    def MyCurrentURL=getCurrentUrl() //URL opportunity page
                    sleep(5000)
                    FirstListedOpportunity.click()  //it clicks on the first opportunity of the list
                    sleep(1000)
                    //The following is to create from the opp title the URL
                    def OppURL= MyCurrentURL + "/cwu/opp-" + MyTitleData.replaceAll(' ','-').replaceFirst(':','').replaceAll(':','-').toLowerCase()
                    def NewURL=getCurrentUrl() //This is the specific opportunity URL
           
                then: "Open the newly created opportunity"      
                    assert NewURL==OppURL  //matching the URL
                    assert waitFor{$("button",'data-automation-id':"button-opportunity-publish")}
                    $("button",'data-automation-id':"button-opportunity-publish").click()  //Finally, we publish the opp
                    //And then click Yes in the modal box that appears after clciking the Publish button
                    $("button",'data-automation-id':"button-modal-yes").click()
                    

     where: "The values used to create the Opportunity are:"
      Project | TitleData | Teaser | Background | Github | Location | Onsite | Skills | AcceptanceCriteria | Earn | ProposalCriteria | Email
      "Project: Automation Test Project 1" | "Opportunity: Automation Test Opportunity 1" | "Teaser for Automation Test Opportunity 1" | "Background for Automation Test Opportunity 1" | "https://github.com" | "Burnaby" | "onsite" | "Java, JS, css, html, django, python, postgressql" | "Acceptance Criteria Automation Test Opportunity 1" | "\$20,000.00" | "Proposal Evaluation Criteria Automation Test Opportunity 1" | "crochcunill@gmail.com"
  }

    
        def cleanup(){
            to HomePage
            //I get the base URL to build (in the LoginModule) the URL to the admin icon
            def baseURL = getBrowser().getConfig().getBaseUrl().toString()

            // Login off as an admin
            def  logoffOK=login."Logout as administrator"(baseURL)
            assert logoffOK
        }



}
