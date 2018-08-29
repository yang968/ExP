import React from 'react';
import recognizeMic from 'watson-speech/speech-to-text/recognize-microphone';

class TaskPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // fetching the token from our back-end
    this.props.fetchSpeechToken()
      .then(response => {
        return response.token
      })
      .then(token => {
        // grab token and use Watson's node module to stream from the computer mic and send that sound file to 
        // Watson's api for analysis.
        var stream = recognizeMic({
          token: token,
          objectMode: true,
          format: false,
          word_confidence: true
        });
        // We aren't doing anything with our errors yet.
        stream.on("error", err => {
          console.log(err);
        });
        // If we receive a "data" response then we need to key into the data and display it by
        // setting it to our state.
        stream.on("data", data => {
          //Watson sends multiple results per sentence, so we only want to display the "final"
          //result. Otherwise we may have the same sentence displayed 1-3 times.
          const final = data.results[0].final;
          const text = data.results[0].alternatives[0].transcript;
          if (final) {
            let dataNode = document.createTextNode(text);
            document.querySelector(".live-text").appendChild(dataNode);
          }
        });
        // Vanilla DOM to select the stop button and give it an onclick function to stop the stream.
        document.querySelector(".stop-button").onclick = this.stopStream(stream.stop.bind(stream));
      });
  }


  stopStream(stream) {
    stream 
    taskText = document.querySelector(".live-text".innerText);
    this.props.createTask({transcript: taskText, token: this.props.token});
  }

  render() {
    return (
      <div className="live-page">
        <h1>LIVE PAGE</h1>
        <button onClick={this.handleSubmit} className="start-button">
          Start
        </button>
        <button className="stop-button">Stop</button>
        <div className="live-text"
          // contentEditable="true"
          // suppressContentEditableWarning="true"
          // placeholder="Speech will generate here"
          id="live-feed"
        >
        </div>
      </div>
    );
  }
}

export default TaskPage;