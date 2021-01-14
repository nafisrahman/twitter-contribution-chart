import React from 'react'
import axios from 'axios'
import parseJsonData from './parseJsonData'
import { prepareToCanvasData } from './processData'
// import ProgressBar from 'react-progress-bar-plus'
import './App.css'
import { drawContributions } from 'twitter-contributions-canvas'
import './entireframework.min.css'
import 'react-progress-bar-plus/lib/progress-bar.css'

class User extends React.Component {
  state = {
    username: '',
    rawData: null,
    parsedData: null,
    error: null,
    theme: 'standard',
    progress: 0,
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
        // const response = res.data
        // setParsedData(JSON.stringify(response, null, 2))
        this.setState(
          { error: null, rawData: res.data, parsedData: null, progress: 1 },
          () => {
            setTimeout(() => {
              parseJsonData(this.state.rawData, (newData) => {
                this.setState({ parsedData: newData }, () => this.drawCanvas())
              })
            }, 300)
          }
        )
        // const hold = parseJsonData(res.data)
        // console.log(hold)
        // if (hold.errors.length >= 0) {
        //   setError('Error while parsing')
        // } else {
        // setParsedData(hold)
        // console.log(parsedData)
        // drawCanvas()
        // }
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
        {/* <ProgressBar percent={this.state.progress} onTop /> */}
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
        {/* <ul>
          {parsedData.map((tweet) => {
            // console.log(tweet)
            return <li key={tweet.id}>{JSON.stringify(tweet['created_at'])}</li>
          })}
        </ul> */}
        {/* <pre>{this.state.parsedData}</pre> */}
        {this.state.error && <div className='error'>{this.state.error}</div>}
        <canvas ref={this.canvas} />
      </React.Fragment>
    )
  }
}

export default User
