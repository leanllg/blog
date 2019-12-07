import React from 'react'
import profilePic from '../../content/assets/profile-pic.jpg'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2),
        }}
      >
        <img
          src={profilePic}
          alt={`lean`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <p style={{ maxWidth: 200 }}>
          Personal blog by <a href="https://github.com/LLGZONE">Lean</a>. I'm a
          front end coder.
        </p>
      </div>
    )
  }
}

export default Bio
