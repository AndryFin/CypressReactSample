describe("App", () => {
	
  function waitToLoadData() {
	 cy.get('.counter').find('span').invoke('text').should('not.contain','wait..')
    }
	
  beforeEach(() => {
	cy.intercept(
	      'POST',
		  '/count', (req) => {
			  if (req.body < 0) {
			    req.alias = 'submitFail'
                req.reply((res) =>	{
					res.send({statusCode: 400})
				})			
			  }
			  if (req.body >= 0) {
			    req.alias = 'submitOK'
                req.reply((res) =>	{
					res.send({statusCode :200})
				})			
			}
		}
	)
	cy.visit("/");
  });
  	
  it("1. renders", () => {
    cy.getByTestId("app").should("be.visible");
  });
  it("2. can increment a counter", () => {
	waitToLoadData();
    cy.getByTestId("increment").click();
	cy.get('.counter').find('span').invoke('text').should('eq','1');
  });
  it("3. can decrement a counter", () => {
	waitToLoadData();
	cy.getByTestId("decrement").click();
	cy.get('.counter').find('span').invoke('text').should('eq','-1');
  });
  it("4. submit button is disabled if the counter is > 20", () => {
	 waitToLoadData();
	  for (let i = 0; i < 21; i ++){
		cy.getByTestId("increment").click();
	  }
	  cy.get('button[type="submit"]').should('be.disabled');
  });
  it("5. submit button is disabled if the counter is < -10", () => {
	  waitToLoadData();
	  for (let i = 0; i < 11; i ++){
		cy.getByTestId("decrement").click();
	  }
	  cy.get('button[type="submit"]').should('be.disabled');
  });
 
  it("6. displays an error if a request is submitted with count < 0", () => {
	  waitToLoadData();
	  cy.getByTestId("decrement").click();
	  cy.get('button[type="submit"]').click();
	  cy.wait('@submitFail');
	  cy.get('.error').should('be.visible');
	});
  it("7. displays a success message if a request is submitted with count >= 0", () => {
	  waitToLoadData();
	  cy.getByTestId("increment").click();
	  cy.get('button[type="submit"]').click();
	  cy.wait('@submitOK')
	  cy.get('.success').should('be.visible');
  });
  it("8. fetches an initial count from a mocked endpoint and uses that count on initial render", () => {			  
	cy.fixture('example.json').then((json) => {
		cy.intercept('/getCount', (req) => {
			 req.reply((res) =>	{
				res.delay(3000)
				res.send(json)
			})	
		}).as('delayedReq')
	})
	cy.visit("/");
	cy.wait('@delayedReq')
	cy.get('.counter').find('span').invoke('text').should('contain','wait..');
	cy.get('.counter').find('span').invoke('text').should('eq','15');
  });
});
