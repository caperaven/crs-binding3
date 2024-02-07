# see app/data-definition

@Feature: validation

  @scenario: I define that a property path on a context is required - with default
    Given context exists
    When clear the property
    And the property is required
    And I have a default value defined
    Then Set the property to the default value

  @scenario: I define that a property path on a context is required - with default
    Given context exists
    When clear the property
    And the property is required
    And I DO NOT have a default value defined
    Then ??? JHR: somewhere / somehow I need to define that there is a problem


  @scenario: default values support

  @scenario: default validation support

  @scenario: conditional default value support based on property condition

  @scenario: conditional validation based on a property condition

  @scenario: error message support