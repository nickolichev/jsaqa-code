
  let token;
  it("Создаем пользователя", () => {
    cy.request({
      method: "POST",
      url: "https://petstore.swagger.io/v2/user",
      body: {
        id: 0,
        username: "borbos",
        firstName: "Andrei",
        lastName: "Nickolichev",
        email: "nickolichev@gmail.com",
        password: "dachshund",
        phone: "1234567890",
        userStatus: 0,
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body));
      expect(response.status).to.eq(200);
      expect(response.body.id).to.not.eq(0);
      expect(response.body.username).to.not.be.null;
      expect(response.body.firstName).to.not.be.null;
      expect(response.body.lastName).to.not.be.null;
      expect(response.body.email).to.not.be.null;
      expect(response.body.password).to.not.be.null;
      expect(response.body.phone).to.not.be.null;
      expect(response.body.phone).to.not.eq(0);

      cy.request({
        method: "GET",
        url: "https://petstore.swagger.io/v2/user/borbos",
      }).then((getUserResponse) => {
        expect(getUserResponse.body.username).to.eq("borbos");
        expect(getUserResponse.body.firstName).to.eq("Andrei");
        expect(getUserResponse.body.lastName).to.eq("Nickolichev");
        expect(getUserResponse.body.email).to.eq("nickolichev@gmail.com");
        expect(getUserResponse.body.password).to.eq("dachshund"); 
        expect(getUserResponse.body.phone).to.eq("1234567890");
      });
    });
  });

  it("Изменяем пользователя", () => {
  // авторизуемся
  cy.request({
    method: "GET",
    url: "https://petstore.swagger.io/v2/user/login",
    qs: {
      username: "borbos",
      password: "dachshund",
    },
  }).then((response) => {
    cy.log(JSON.stringify(response.body));
    expect(response.status).to.eq(200);
    expect(response.headers).to.have.property("x-rate-limit");
    token = response.headers["x-rate-limit"];
    cy.log(`Token: ${token}`);
    // Добавляем дополнительный лог для проверки сохранения токена
    cy.log(`Saved Token: ${Cypress.env("token")}`);
    Cypress.env("token", token);
    
    // вносим изменения
    cy.request({
      method: "PUT",
      url: "https://petstore.swagger.io/v2/user/borbos",
      headers: {Authorization: 'Bearer ' + token},
      body: {
        id: 0,
        username: "borbos",
        firstName: "Petr",
        lastName: "Ivanov",
        email: "ivanov@gmail.com",
        password: "dachshund",
        phone: "1234567890",
        userStatus: 1,
      },
    }).then((response) => {
      cy.log(JSON.stringify(response.body))

      // выходим из авторизации
      cy.request({
        method: "GET",
        url: "https://petstore.swagger.io/v2/user/logout",
      }).then((response) => {
        cy.log(JSON.stringify(response.body))

        // проверяем внесенные изменения
        cy.request({
          method: "GET",
          url: "https://petstore.swagger.io/v2/user/borbos",
        }).then((response) => {
          console.log(response.body)
          expect(response.status).to.eq(200);
          expect(response.body).to.be.eql({
            id: 0,
            username: "borbos",
            firstName: "Petr",
            lastName: "Ivanov",
            email: "ivanov@gmail.com",
            password: "dachshund",
            phone: "1234567890",
            userStatus: 1,
            });

          // проверка в таком формате также не проходит

          // expect(response.body.username).to.eq("borbos")
          // expect(response.body.firstName).to.eq("Petr")
          // expect(response.body.lastName).to.eq("Ivanov")
          // expect(response.body.email).to.eq("ivanov@gmail.com")
          // expect(response.body.password).to.eq("dachshund")
          // expect(response.body.phone).to.eq("1234567890")
          // expect(response.body.userStatus).to.eq(1)
        })
      })
    })
  })
})

  it("Удаляем пользователя", () => {
  let token;
  // авторизуемся
  cy.request({
    method: "GET",
    url: "https://petstore.swagger.io/v2/user/login",
    qs: {
      username: "borbos",
      password: "dachshund",
    },
  }).then((response) => {
    expect(response.headers).to.have.property("x-rate-limit");
    token = response.headers["x-rate-limit"];
    
    // Удаляем пользователя
    cy.request({
      method: "DELETE",
      url: "https://petstore.swagger.io/v2/user/borbos",
      headers: { Authorization: "Bearer " + token },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.code).to.eq(200);
      expect(response.body.message).to.eq("borbos");
      // выходим из авторизации
      cy.request({
        method: "GET",
        url: "https://petstore.swagger.io/v2/user/logout",
        headers: { Authorization: "Bearer " + token },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.type).to.eq("unknown");
        // проверяем, что пользователь удален
        cy.request({
          method: "GET",
          url: "https://petstore.swagger.io/v2/user/borbos",
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.code).to.not.eq(1);
        });
      });
    });
  });
});

