/// <reference types="cypress" />

describe('Kittens', () => {
  it('redirects to a cat at the start', () => {
    cy.visit('/')

    cy.location('pathname').should('equal', '/history/fluffy')
    cy.log('**has History API**')
    cy.window()
      .its('history')
      .should('respondTo', 'pushState')
      .and('have.property', 'state')
      // inspect the state object
      .should('deep.include', {
        content: 'Fluffy!',
      })
  })

  it('spies on history.pushState', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // spy on the "pushState" method
        cy.spy(win.history, 'pushState').as('pushState')
      },
    })

    cy.location('pathname').should('equal', '/history/fluffy')
    cy.get('@pushState')
      .should('have.been.calledOnce')
      .its('args.0')
      .should('deep.equal', [
        { content: 'Fluffy!', photo: 'https://placekitten.com/200/200' },
        'Fluffy',
        '/history/fluffy',
      ])
  })

  it('navigates using history methods', () => {
    cy.visit('/')
    cy.contains('#content', 'Fluffy!')
    cy.location('pathname').should('equal', '/history/fluffy')

    cy.contains('a', 'Socks').click()
    cy.contains('#content', 'Socks!')
    cy.location('pathname').should('equal', '/history/socks')

    cy.contains('a', 'Whiskers').click()
    cy.contains('#content', 'Whiskers!')
    cy.location('pathname').should('equal', '/history/whiskers')

    cy.contains('a', 'Bob').click()
    cy.contains('#content', 'Just Bob.')
    cy.location('pathname').should('equal', '/history/bob')

    cy.log('**go back in history**')
    cy.window().its('history').invoke('back')
    cy.contains('#content', 'Whiskers!')
    // unfortunately Cypress does not change the URL _shown_
    // but it does change the URL _in_ the browser
    cy.location('pathname').should('equal', '/history/whiskers')

    cy.log('**go -2 in history**')
    cy.window().its('history').invoke('go', -2)
    cy.contains('#content', 'Fluffy!')
    cy.location('pathname').should('equal', '/history/fluffy')
  })

  it('fires popstate event', () => {
    cy.visit('/').invoke(
      'addEventListener',
      'popstate',
      cy.stub().as('popstate'),
    )
    cy.contains('#content', 'Fluffy!')
    cy.location('pathname').should('equal', '/history/fluffy')

    cy.contains('a', 'Socks').click()
    cy.contains('#content', 'Socks!')
    cy.location('pathname').should('equal', '/history/socks')

    cy.window().its('history').invoke('back')
    // should trigger the popstate event
    cy.get('@popstate')
      .should('have.been.calledOnce')
      .its('firstCall.args.0.state')
      .should('deep.include', {
        content: 'Fluffy!',
      })
      .and('have.property', 'photo')
  })

  it('starts at our state', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // populate the state history
        win.history.pushState(
          {
            cat: 'robot-whiskers',
            content: 'Robot Whiskers!',
            // we can even use some other photos during testing
            photo: 'https://robohash.org/CE6.png?set=set4&size=150x150',
            title: 'Robot Whiskers',
            href: '/history/robot-whiskers',
          },
          'Robot Whiskers',
          '/history/robot-whiskers',
        )
      },
    })

    cy.contains('#content', 'Robot Whiskers!')
    cy.location('pathname').should('equal', '/history/robot-whiskers')
  })
})
