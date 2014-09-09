Feature: Manage translations
  In order to allow for multilingual experience on the website I am building
  As a developer
  I want to create a content to be translated

  Scenario: Create a translation
    When I create a translation
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |
    Then the new translation is returned
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |
    And the translation is part of translation set 'MyApp'
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |

  Scenario: Replace a translation
    Given translations
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | 3rdApp            | about1    | à propos1 | aangaande1| von1      |
    When I create a translation
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |
    Then the new translation is returned
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |
    And the translation is part of translation set 'MyApp'
    | key     | translationSets   | en value  | fr value  | nl value  | ge value  |
    | About   | MyApp,OtherApp    | about     | à propos  | aangaande | von       |

