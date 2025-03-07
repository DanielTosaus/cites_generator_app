import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const apiUrl = "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"

  const [state, setState] = useState({
    allQuotes: [],
    quote: "Example quote",
    author: "Me"
  })

  const [color, setColor] = useState("#000000")
  const [textColor, setTextColor] = useState("#ffffff")

  function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    return `#${randomColor.padStart(6, '0')}`
  }

  function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16)
    const g = parseInt(hexColor.substr(3, 2), 16)
    const b = parseInt(hexColor.substr(5, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 125 ? "#000000" : "#ffffff" // Choose black or white text based on brightness
  }

  function updateQuote() {
    if (state.allQuotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * state.allQuotes.length)
    const newColor = getRandomColor()
    setState(prev => ({
      ...prev,
      quote: state.allQuotes[randomIndex].quote,
      author: state.allQuotes[randomIndex].author
    }))
    setColor(newColor)
    setTextColor(getContrastColor(newColor))
  }

  useEffect(() => {
    console.log('Fetching quotes')
    fetch(apiUrl)
      .then(response => response.ok ? response.json() : null)
      .then(json => {
        if (json) {
          const randomIndex = Math.floor(Math.random() * json.quotes.length)
          const newColor = getRandomColor()
          setState({
            allQuotes: json.quotes,
            quote: json.quotes[randomIndex].quote,
            author: json.quotes[randomIndex].author
          })
          setColor(newColor)
          setTextColor(getContrastColor(newColor))
        }
      })
  }, [])

  useEffect(() => {
    document.body.style.backgroundColor = color
    document.body.style.color = textColor
  }, [color, textColor])

  let tweetText = state.quote && state.author ? `"${state.quote}" - ${state.author}` : "Check out this quote!";
  let tweet_link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  return (
    <main id="quote-box">
      <h1 id="text">{state.quote}</h1>
      <p id="author">{state.author}</p>
      <button onClick={updateQuote} id="new-quote" style={{ backgroundColor: textColor, color: color }}>New quote</button>
      <div className='socials-wrapper'>
        <a id="tweet-quote" href={tweet_link} className="fa fa-twitter" target="_blank" style={{ color: textColor }}></a>
        <a href="https://www.instagram.com" className="fa fa-instagram logo" target="_blank" style={{ color: textColor }}></a>
      </div>
    </main>
  )
}

export default App
