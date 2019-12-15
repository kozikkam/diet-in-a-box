*** Settings ***
Library           Selenium2Library

*** Variables ***
${SERVER}         localhost:3000
${BROWSER}        Chrome
${DELAY}          0
${LOGIN URL}      http://${SERVER}/login
${HOME URL}    http://${SERVER}
${DASHBOARD URL}    http://${SERVER}/panel
${APP_ICON}  //*[contains(@class, 'LoginView_logo')]


${LOGIN_INPUT}  xpath=//*[@name="email"]
${PASSWORD_INPUT}  xpath=//*[@name="password"]
${INVALID_USER}     invaliduser
${INVALID_USER_2}   invaliduser2@gmail.com
${INVALID_PASSWORD}    invalidpassword
${VALID_USER}     test@gmail.com
${VALID_PASSWORD}    test
${SUBMIT_LOGIN_BUTTON}  xpath=//*//form/button
${LOGIN_VALIDATION_ERROR_MESSAGE}  Invalid email
${LOGIN_ERROR_MESSAGE}  Wrong credentials sent
${USER_LOGGED_IN_INFO}  xpath=//*[text()="WYLOGUJ"]


*** Keywords ***

Open Browser To Homepage
    Open Browser    ${HOME URL}     ${BROWSER}
    Maximize Browser Window

App Icon Should Be Visible
    Wait Until Page Contains  ${APP_ICON} 5

Open Browser To Login Page
    Open Browser    ${LOGIN URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Sleep  1

Go To Login Page
    Go To    ${LOGIN URL}

Input Username
    [Arguments]    ${username}
    Input Text    ${LOGIN_INPUT}    ${username}

Input Password
    [Arguments]    ${password}
    Empty Text Field    ${PASSWORD_INPUT}
    Input Text    ${PASSWORD_INPUT}    ${password}

Empty Text Field
    [Arguments]    ${Field_Locator}
    ${value}=     Get Element Attribute   ${Field_Locator}      value
    ${backspaces count}=    Get Length      ${value}
    Run Keyword If    """${value}""" != ''
    ...     Repeat Keyword  ${backspaces count +1}  Press Key  ${Field_Locator}   \\08

Submit Credentials
    Click Button    ${SUBMIT_LOGIN_BUTTON}

Welcome Page Should Be Open
    Location Should Be    ${HOME_URL}

Dashboard Page Should Be Open
    Sleep  5
    Location Should Be  ${DASHBOARD URL}

Validation Error Should Appear
    Wait Until Page Contains  ${LOGIN_VALIDATION_ERROR_MESSAGE}

Wrong Credentails Error Should Appear
    Wait Until Page Contains  ${LOGIN_ERROR_MESSAGE}

Open Main Menu
    Wait Until Element Is Visible  ${SIDEBAR_MENU_BUTTON}
    Sleep  2
    Click Element  ${SIDEBAR_MENU_BUTTON}

*** Settings ***
Documentation     A test suite for testing logging in
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.


*** Test Cases ***

Logging into application should work properly
    [Documentation]    Opens a browser to login page, checks form submitting with valid and invalid credentials
    [Tags]    Loginpage Smoke ReadOnly
    Open Browser To Login Page
    Input Username    ${INVALID_USER}
    Input Password    ${INVALID_PASSWORD}
    Validation Error Should Appear
    Input Username    ${INVALID_USER_2}
    Submit Credentials
    Wrong Credentails Error Should Appear
    Input Username    ${VALID_USER}
    Input Password    ${VALID_PASSWORD}
    Submit Credentials
    Dashboard Page Should Be Open
    [Teardown]    Close Browser
