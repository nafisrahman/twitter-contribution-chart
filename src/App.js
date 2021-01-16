import React from 'react'
import axios from 'axios'
import parseJsonData from './parseJsonData'
import { prepareToCanvasData } from './processData'
import './App.css'
import { drawContributions } from 'twitter-contributions-canvas'
import './entireframework.min.css'

class App extends React.Component {
  state = {
    username: '',
    rawData: null,
    parsedData: null,
    error: null,
    theme: 'standard',
  }

  canvas = React.createRef()

  handleUsernameChange = (e) => {
    this.setState({
      username: e.target.value,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    e.persist()
    if (!this.state.username) {
      this.setState({ error: 'No username found' })
      return
    }
    axios
      .get(
        `https://cwyurr5wr7.execute-api.us-east-1.amazonaws.com/test/calltwitter?username=${this.state.username}`
      )
      .then((res) => {
        console.log(res.data)
        this.setState(
          { error: null, rawData: res.data, parsedData: null },
          () => {
            setTimeout(() => {
              parseJsonData(this.state.rawData, (newData) => {
                this.setState({ parsedData: newData }, () => this.drawCanvas())
              })
            }, 300)
          }
        )
      })
      .catch((error) => {
        console.log(error)
      })
  }

  drawCanvas() {
    if (this.state.parsedData) {
      // console.log(this.state.parsedData)
      const canvasData = prepareToCanvasData(this.state.parsedData)
      drawContributions(this.canvas.current, {
        data: canvasData,
        username: this.state.username,
        themeName: this.state.theme,
        footerText: 'Made with ❤️, originally by @sallar for github',
      })
    } else {
      this.setState({ error: 'Data is not parsed' })
    }
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <label>
            username:
            <input
              type='text'
              placeholder='Your Twitter Username'
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
          </label>
          <button type='submit'>Submit </button>
        </form>
        {this.state.error && <div className='error'>{this.state.error}</div>}
        <canvas ref={this.canvas} />
      </React.Fragment>
    )
  }
}

export default App
