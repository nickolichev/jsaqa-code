Feature: Тестирование сервиса Идем в кино

  Scenario: Бронирование билетов на фильм "Train arrival"    
    When user goes to the main page of the service "https://qamid.tmweb.ru/client/index.php"
    Then user selects session "3"
    Given save the date of the selected session
    Then user then sees that the session date is selected
    Then user checks that the movie "Train arrival" is in the repertoire
    Then user checks for the existence of the desired session on the selected date and time "21:00"
    Then that the session at the specified time is available for selection
    When user selects session time "1260"
    Then go to the page for choosing seats in the hall with the film "Train arrival"
    Then check that the "Забронировать" button is in the status "Disabled"
    Then user selects places "5" and "6" in the "10" row
    Given Places "5" and "6" in the "10" row changed to "Selected" status
    Then the "Забронировать" button is in the "Enable" status
    Then user is booking the selected seats
    Then go to the payment page "Вы выбрали билеты:" with order details
    Given information about the order is checked: movie "Train arrival"
    Given information about the order is checked: row_seats "10/5, 10/6"
    Given information about the order is checked: hall "SuperHall"
    Given information about the order is checked: screening date
    Given information about the order is checked: order amount "2000"
    Given button "Получить код бронирования" is in the "Enable"

  Scenario: Корректность расчета суммы заказа на "Фильм 3"
    When user goes to the main page of the service "https://qamid.tmweb.ru/client/index.php"
    Then user selects session "4" 
    Then user selects session time "600"
    Given go to the page for choosing seats in the hall with the film "Фильм 3" 
    Then user selects regular places: "5" in the "3" row and "4" in the "4" row
    Then user selects VIP places: "4" in the "3" row and "5" in the "4" row
    Given calculation of the order amount based on the price for a regular seat, the price for a VIP seat and selected seats
    Then user is booking the selected seats
    Then go to the payment page "Вы выбрали билеты:" with order details
    Then check the cost of the order on the payment page with the previously saved amount
    Given button "Получить код бронирования" is in the "Enable"

  Scenario: Тестируем баг "Сервис позволяет заказать билеты на места со статусом "Занято"
    When user goes to the main page of the service "https://qamid.tmweb.ru/client/index.php"
    Then user selects session "6" 
    Given save the date of the selected session
    Then user selects session time "1140"
    Given go to the page for choosing seats in the hall with the film "Логан" 
    Then check that the "Забронировать" button is in the status "Disabled"
    Then user selects place "4" in the "7" row
    Then the "Забронировать" button is in the "Enable" status
    Then user is booking the selected seats
    Then go to the payment page "Вы выбрали билеты:" with order details
    Given information about the order is checked: movie "Логан"
    Given information about the order is checked: row_seats "7/4"
    Given information about the order is checked: hall "Зал 1"
    Given information about the order is checked: screening date
    Given information about the order is checked: order amount "350"
    Given button "Получить код бронирования" is in the "Enable"