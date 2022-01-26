// Not the most elegant code but fit enough for this example. Enjoy the kitten goodness!
var contentEl = document.getElementById('content'),
  photoEl = document.getElementById('photo'),
  linkEls = document.getElementsByTagName('a'),
  cats = {
    fluffy: {
      content: 'Fluffy!',
      photo: 'https://placekitten.com/200/200',
    },
    socks: {
      content: 'Socks!',
      photo: 'https://placekitten.com/280/280',
    },
    whiskers: {
      content: 'Whiskers!',
      photo: 'https://placekitten.com/350/350',
    },
    bob: {
      content: 'Just Bob.',
      photo: 'https://placekitten.com/320/210',
    },
  }

// Switcheroo!
function updateContent(data) {
  if (data == null) return

  contentEl.textContent = data.content
  photoEl.src = data.photo
}

function goTo(cat, title, href) {
  const data = cats[cat] || null // In reality this could be an AJAX request
  updateContent(data)

  // Add an item to the history log
  history.pushState(data, title, href)
}

// Load some mock JSON data into the page
function clickHandler(event) {
  var cat = event.target.getAttribute('href').split('/').pop()

  goTo(cat, event.target.textContent, event.target.href)

  return event.preventDefault()
}

// Attach event listeners
for (var i = 0, l = linkEls.length; i < l; i++) {
  linkEls[i].addEventListener('click', clickHandler, true)
}

// Revert to a previously saved state
window.addEventListener('popstate', function (event) {
  console.log('popstate fired!')

  updateContent(event.state)
})

// redirect the initial page to a valid state
console.log('href', document.location.href)
const initialCat = document.location.href.split('/').pop()
if (!cats[initialCat]) {
  // maybe there is something in the history?
  if (history.state) {
    console.log('initial history state', history.state.cat)
    updateContent(history.state)
    // goTo(history.state.cat, history.state.title, history.state.href)
  } else {
    // go to the first cat
    goTo('fluffy', 'Fluffy', '/history/fluffy')
  }
} else {
  // Store the initial content so we can revisit it later
  console.log('storing the initial state')
  history.replaceState(
    {
      cat: initialCat,
      content: contentEl.textContent,
      photo: photoEl.src,
      title: document.title,
      href: document.location.href,
    },
    document.title,
    document.location.href,
  )
}
