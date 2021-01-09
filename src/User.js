import React from 'react'
import axios from 'axios'

const User = () => {
  const [userName, setUserName] = React.useState('')
  const [JSONresponse, setJSONresponse] = React.useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userName) {
      axios
        .get(
          `https://cwyurr5wr7.execute-api.us-east-1.amazonaws.com/test/calltwitter?username=${userName}`
        )
        .then((res) => {
          // const response = res.data
          // setJSONresponse(JSON.stringify(response, null, 2))
          setJSONresponse(res.data)
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      console.log('empty values')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          username:
          <input
            type='text'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <button type='submit'>Submit </button>
      </form>
      {/* <ul>
        {JSONresponse.map((tweet) => {
          // console.log(tweet)
          return <li key={tweet.id}>{JSON.stringify(tweet['created_at'])}</li>
        })}
      </ul> */}
      <pre>{JSON.stringify(JSONresponse, null, 2)}</pre>
    </div>
  )
}

export default User
