@current
Feature: Get translation set names
  In order to select a set of translation for a web application
  As a translator, developer, or copy manager
  I want to get all the translations set names

  Scenario: Get a translation set
    Given translation sets
    | translation set |
    | My App          |
    | Another App     |
    When I request the translations set names
    Then I get the translation set names
    | translation set |
    | My App          |
    | Another App     |
