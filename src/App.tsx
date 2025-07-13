import "./styles.scss";
import sample from "./data/sample.json";
import { useEffect, useRef, useState } from "react";
import BrightcovePlayer from "@brightcove/react-player-loader";
import demoVideo from "./data/demo.mp4";

export default function App() {
  const videoPlayer = useRef<any>(null);
  const [highlightPercentage, setHighlightPercentage] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(1);

  const switchToPlayCurrentWord = (time: number) => {
    videoPlayer.current.currentTime(time);
  };

  const text = () => {
    return sample.words.map((word, index) => {
      const { start, end } = word;

      // Handle change color in current playing word
      const isPlayingCurrentWord = currentTime >= start && currentTime < end;
      let currentPercentage = 0;
      if (isPlayingCurrentWord) {
        const duration = end - start;
        currentPercentage = ((currentTime - start) / duration) * 100;
      }

      // Handle isPlayed word 's color
      const isPlayed = currentTime > end;

      return (
        <span
          key={word.id}
          className={
            isPlayingCurrentWord ? "playing" : isPlayed ? "played" : "normal"
          }
          style={{
            "--highlight-percentage": `${currentPercentage}%`,
          }}
          onClick={() => switchToPlayCurrentWord(start)}
        >
          {word.forceAlignment}
          {index < sample.words.length - 1 ? "，" : "。"}
        </span>
      );
    });
  };

  const onSuccess = (player: any) => {
    videoPlayer.current = player.ref;

    if (videoPlayer.current) {
      videoPlayer.current.on("timeupdate", (player) => {
        const time = videoPlayer.current.currentTime();
        setCurrentTime(time);
      });
    }
  };

  useEffect(() => {
    // Highlighting the current playing word
    document.documentElement.style.setProperty(
      "--highlight-percentage",
      `${highlightPercentage}%`
    );
  }, [highlightPercentage]);

  return (
    <div className="App">
      <div>
        <h1>Demo Video</h1>
        <div className="reference">
          <video controls>
            <source src={demoVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <hr />
      <div>
        <h1>Tasks</h1>
        <ul>
          <li>
            Align the text with the audio timing (approximate alignment is
            acceptable).
          </li>
          <li>
            When the text is clicked, it will jump to a specific point in the
            audio and play continuously.
          </li>
          <li>If the audio is paused, the text effect will also stop.</li>
          <small>
            (In sample json, the start and end times are based on the specific
            sentence and its corresponding audio timestamps.)
          </small>
        </ul>
      </div>
      <div>
        <h1>Requirements</h1>
        <ul>
          <li>Fork this project.</li>
          <li>Code in TypeScript, React but no jQuery .</li>
          <li>Keep the code simple and clean.</li>
          <li>
            Run in latest Chrome. No need to worry about browser compatibility.
          </li>
          <li>
            The test is suggested to take around 30 - 45 minutes to complete.
          </li>
        </ul>
      </div>
      <div>
        <h1>Implementation</h1>
        <BrightcovePlayer
          accountId="6144772950001"
          videoId="6299964659001"
          onSuccess={onSuccess}
          preload="none"
        />
        <div>{text()}</div>
      </div>
    </div>
  );
}
