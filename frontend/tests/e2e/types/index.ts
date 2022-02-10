declare global {
  namespace Cypress {
    interface Chainable {
      login(authToken?: string): Chainable<Element>;
      logout(): Chainable<Element>;
    }
  }
}

export default global;
