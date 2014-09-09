@current
Feature: Get translation for a application
  In order to allow for multilingual experience on web applications
  As translator, developer, or copy manager
  I want to get all the translations that pertain to an application

  Scenario: Get a translation set
    Given translations
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |
    | About1  | OtherApp          | about1    | à propos1 | aangaande1| von1      |
    | About2  | MyApp             | about2    | à propos2 | aangaande2| von2      |
    | About3  | MyApp             | about3    |           |           |           |
    When I get the translations for translation set 'MyApp'
    Then the translations are returned
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |
    | About2  | MyApp             | about2    | à propos2 | aangaande2| von2      |
    | About3  | MyApp             | about3    |           |           |           |
