/// <reference types="cypress" />

describe('Kittens', () => {
  it.only('has History API', () => {
    cy.visit('/history/fluffy').its('')
  })

  it('navigates using history methods', () => {
    cy.visit('/')
  })
})
