import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoTimerOutline, IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${(props) =>
    props.$darkMode ? "rgb(32, 67, 119)" : "rgba(32, 67, 119, 0.1)"};
  padding: 18px 24px 32px 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Helvetica", "Arial", sans-serif;
  user-select: none;
  -webkit-user-select: none;
  transition: background-color 0.3s ease;
  -webkit-app-region: drag;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
  text-align: center;
  cursor: default;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
  pointer-events: none;
  -webkit-user-drag: none;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${(props) =>
    props.$darkMode ? "rgba(173, 216, 230, 0.8)" : "rgba(32, 67, 119, 0.7)"};
  margin-bottom: 16px;
  text-align: center;
  line-height: 20px;
  max-width: 320px;
  cursor: default;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  max-height: ${(props) => (props.$visible ? "100px" : "0")};
  margin-bottom: ${(props) => (props.$visible ? "16px" : "0")};
  overflow: hidden;
  transition: opacity 0.3s ease-in-out, max-height 0.3s ease-in-out,
    margin-bottom 0.3s ease-in-out, color 0.3s ease;
`;

const TimerText = styled.div`
  font-size: 48px;
  font-weight: 300;
  color: ${(props) =>
    props.$darkMode ? "rgb(233, 236, 242)" : "rgb(32, 67, 119)"};
  margin-bottom: 16px;
  font-variant-numeric: tabular-nums;
  cursor: default;
  transition: color 0.3s ease;
`;

const ActionButton = styled.button`
  background-color: ${(props) =>
    props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)"};
  color: ${(props) => (props.$darkMode ? "rgb(32, 67, 119)" : "white")};
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease-in-out;
  width: 200px;
  margin-top: 0;
  -webkit-app-region: no-drag;

  &:hover {
    background-color: ${(props) =>
      props.$darkMode
        ? "rgba(245, 245, 247, 0.85)"
        : "rgba(32, 67, 119, 0.85)"};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StopButton = styled.button`
  background-color: transparent;
  color: ${(props) =>
    props.$darkMode ? "rgba(173, 216, 230, 0.7)" : "rgba(32, 67, 119, 0.6)"};
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  margin-top: 0;
  transition: all 0.3s ease-in-out;
  width: 200px;
  -webkit-app-region: no-drag;

  &:hover {
    background-color: ${(props) =>
      props.$darkMode
        ? "rgba(173, 216, 230, 0.15)"
        : "rgba(32, 67, 119, 0.08)"};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const TimerLabel = styled.div`
  font-size: 14px;
  color: ${(props) =>
    props.$darkMode ? "rgba(173, 216, 230, 0.8)" : "rgba(32, 67, 119, 0.7)"};
  margin-bottom: 4px;
  cursor: default;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out, color 0.3s ease;
`;

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
`;

const DragRegion = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  -webkit-app-region: drag;
  z-index: 1;
`;

const SettingsButton = styled.button`
  position: absolute;
  top: 12px;
  right: 52px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: ${(props) =>
    props.$darkMode ? "rgba(173, 216, 230, 0.7)" : "rgba(32, 67, 119, 0.6)"};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  -webkit-app-region: no-drag;
  z-index: 2;

  &:hover {
    color: ${(props) => (props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)")};
  }
`;

const DarkModeToggle = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: ${(props) =>
    props.$darkMode ? "rgba(173, 216, 230, 0.7)" : "rgba(32, 67, 119, 0.6)"};
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  -webkit-app-region: no-drag;
  z-index: 2;

  &:hover {
    color: ${(props) => (props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)")};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  -webkit-app-region: no-drag;
`;

const ModalContent = styled.div`
  background: ${(props) =>
    props.$darkMode ? "rgba(20, 45, 80, 0.95)" : "rgba(255, 255, 255, 0.95)"};
  padding: 32px;
  border-radius: 16px;
  width: 260px;
  max-width: 90%;
  transition: background-color 0.3s ease;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => (props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)")};
  margin-bottom: 24px;
  cursor: default;
  transition: color 0.3s ease;
`;

const SettingRow = styled.div`
  margin-bottom: 24px;
`;

const SettingLabel = styled.label`
  display: block;
  font-size: 14px;
  color: ${(props) => (props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)")};
  margin-bottom: 8px;
  font-weight: 500;
  cursor: default;
  transition: color 0.3s ease;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid
    ${(props) =>
      props.$darkMode ? "rgba(173, 216, 230, 0.3)" : "rgba(32, 67, 119, 0.2)"};
  border-radius: 8px;
  font-size: 14px;
  color: ${(props) => (props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)")};
  background: ${(props) =>
    props.$darkMode ? "rgba(20, 45, 80, 0.8)" : "white"};
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) =>
      props.$darkMode ? "rgba(173, 216, 230, 0.6)" : "rgb(32, 67, 119)"};
  }
`;

const CloseButton = styled.button`
  width: 100%;
  background-color: ${(props) =>
    props.$darkMode ? "#f5f5f7" : "rgb(32, 67, 119)"};
  color: ${(props) => (props.$darkMode ? "rgb(32, 67, 119)" : "white")};
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  -webkit-app-region: no-drag;

  &:hover {
    background-color: ${(props) =>
      props.$darkMode
        ? "rgba(173, 216, 230, 0.95)"
        : "rgba(32, 67, 119, 0.85)"};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SessionInfo = styled.div`
  font-size: 12px;
  color: ${(props) =>
    props.$darkMode ? "rgba(173, 216, 230, 0.7)" : "rgba(32, 67, 119, 0.6)"};
  margin-top: 0px;
  margin-bottom: 8px;
  text-align: center;
  cursor: default;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out, color 0.3s ease;
`;

const ButtonWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 44px;
  margin-top: 8px;
`;

const TWENTY_MINUTES = 20 * 60 * 1000; // 20 minutes in milliseconds
const TWENTY_SECONDS = 20 * 1000; // 20 seconds in milliseconds

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TWENTY_MINUTES);
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(0); // 0 means no limit
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Check system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });
  const intervalRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const sessionStartTimeRef = useRef(null);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatSessionTime = (ms) => {
    const totalMinutes = Math.floor(ms / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const sendNotification = async () => {
    try {
      await window.electronAPI.showNotification(
        "Time for a 202020 break!",
        "Look at something 20 feet away for 20 seconds to rest your eyes."
      );
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const startSession = async () => {
    // Request permission first
    try {
      await window.electronAPI.requestNotificationPermission();
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    }

    setIsRunning(true);
    setIsBreakTime(false);
    setTimeRemaining(TWENTY_MINUTES);
    sessionStartTimeRef.current = Date.now();

    // Start countdown
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      // Update session elapsed time
      if (sessionStartTimeRef.current) {
        setSessionElapsed(Date.now() - sessionStartTimeRef.current);
      }

      // Check if work duration has been exceeded
      if (workDuration > 0 && sessionStartTimeRef.current) {
        const sessionElapsed = Date.now() - sessionStartTimeRef.current;
        if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
          stopSession();
          sendNotification();
          return;
        }
      }

      const elapsed = Date.now() - startTime;
      const remaining = TWENTY_MINUTES - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsBreakTime(true);
        sendNotification();
        // Start 20-second break
        clearInterval(intervalRef.current);
        const breakStartTime = Date.now();
        intervalRef.current = setInterval(() => {
          // Update session elapsed time during break
          if (sessionStartTimeRef.current) {
            setSessionElapsed(Date.now() - sessionStartTimeRef.current);
          }

          const breakElapsed = Date.now() - breakStartTime;
          const breakRemaining = TWENTY_SECONDS - breakElapsed;

          if (breakRemaining <= 0) {
            // Break is over, start next work period
            setIsBreakTime(false);
            clearInterval(intervalRef.current);

            // Check work duration before starting next cycle
            if (workDuration > 0 && sessionStartTimeRef.current) {
              const sessionElapsed = Date.now() - sessionStartTimeRef.current;
              if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
                stopSession();
                return;
              }
            }

            const newStartTime = Date.now();
            intervalRef.current = setInterval(() => {
              // Update session elapsed time
              if (sessionStartTimeRef.current) {
                setSessionElapsed(Date.now() - sessionStartTimeRef.current);
              }

              // Check work duration again
              if (workDuration > 0 && sessionStartTimeRef.current) {
                const sessionElapsed = Date.now() - sessionStartTimeRef.current;
                if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
                  stopSession();
                  sendNotification();
                  return;
                }
              }

              const newElapsed = Date.now() - newStartTime;
              const newRemaining = TWENTY_MINUTES - newElapsed;

              if (newRemaining <= 0) {
                setTimeRemaining(0);
                setIsBreakTime(true);
                sendNotification();
                // Continue the cycle with another break
                clearInterval(intervalRef.current);
                startBreakCycle();
              } else {
                setTimeRemaining(newRemaining);
              }
            }, 100);
          } else {
            setTimeRemaining(breakRemaining);
          }
        }, 100);
      } else {
        setTimeRemaining(remaining);
      }
    }, 100);
  };

  const startBreakCycle = () => {
    const breakStartTime = Date.now();
    intervalRef.current = setInterval(() => {
      // Update session elapsed time during break
      if (sessionStartTimeRef.current) {
        setSessionElapsed(Date.now() - sessionStartTimeRef.current);
      }

      const breakElapsed = Date.now() - breakStartTime;
      const breakRemaining = TWENTY_SECONDS - breakElapsed;

      if (breakRemaining <= 0) {
        // Break is over, start next work period
        setIsBreakTime(false);
        clearInterval(intervalRef.current);

        // Check work duration before starting next cycle
        if (workDuration > 0 && sessionStartTimeRef.current) {
          const sessionElapsed = Date.now() - sessionStartTimeRef.current;
          if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
            stopSession();
            return;
          }
        }

        const newStartTime = Date.now();
        setTimeRemaining(TWENTY_MINUTES);
        intervalRef.current = setInterval(() => {
          // Update session elapsed time
          if (sessionStartTimeRef.current) {
            setSessionElapsed(Date.now() - sessionStartTimeRef.current);
          }

          // Check work duration
          if (workDuration > 0 && sessionStartTimeRef.current) {
            const sessionElapsed = Date.now() - sessionStartTimeRef.current;
            if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
              stopSession();
              sendNotification();
              return;
            }
          }

          const newElapsed = Date.now() - newStartTime;
          const newRemaining = TWENTY_MINUTES - newElapsed;

          if (newRemaining <= 0) {
            setTimeRemaining(0);
            setIsBreakTime(true);
            sendNotification();
            clearInterval(intervalRef.current);
            startBreakCycle();
          } else {
            setTimeRemaining(newRemaining);
          }
        }, 100);
      } else {
        setTimeRemaining(breakRemaining);
      }
    }, 100);
  };

  const stopSession = () => {
    setIsRunning(false);
    setIsBreakTime(false);
    setTimeRemaining(TWENTY_MINUTES);
    setSessionElapsed(0);
    sessionStartTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    // Listen for system theme changes when no preference is saved
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Container $darkMode={darkMode}>
      <DragRegion />
      <DarkModeToggle
        $darkMode={darkMode}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <IoSunnyOutline /> : <IoMoonOutline />}
      </DarkModeToggle>
      <SettingsButton
        $darkMode={darkMode}
        onClick={() => setShowSettings(true)}
      >
        <IoTimerOutline />
      </SettingsButton>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Image src={darkMode ? "eye_dark.png" : "eye.png"} alt="202020" />
        <Description $darkMode={darkMode} $visible={!isRunning}>
          Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet
          away for 20 seconds.
        </Description>

        <TimerWrapper>
          <TimerLabel $darkMode={darkMode} $visible={isRunning}>
            {isRunning
              ? isBreakTime
                ? "Break time - Give your eyes a rest!"
                : "Next break in"
              : ""}
          </TimerLabel>
          <TimerText $darkMode={darkMode}>
            {formatTime(timeRemaining)}
          </TimerText>
        </TimerWrapper>

        <SessionInfo $darkMode={darkMode} $visible={isRunning}>
          {isRunning && (
            <>
              {`Session running for ${formatSessionTime(sessionElapsed)}`}
              {workDuration > 0 &&
                ` • Auto-stop in ${formatSessionTime(
                  workDuration * 60 * 60 * 1000 - sessionElapsed
                )}`}
            </>
          )}
        </SessionInfo>

        <ButtonWrapper>
          <ActionButton
            $darkMode={darkMode}
            onClick={startSession}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: isRunning ? 0 : 1,
              pointerEvents: isRunning ? "none" : "auto",
            }}
          >
            Start Session
          </ActionButton>
          <StopButton
            $darkMode={darkMode}
            onClick={stopSession}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: isRunning ? 1 : 0,
              pointerEvents: isRunning ? "auto" : "none",
            }}
          >
            Stop Session
          </StopButton>
        </ButtonWrapper>
      </div>

      {showSettings && (
        <Modal onClick={() => setShowSettings(false)}>
          <ModalContent
            $darkMode={darkMode}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle $darkMode={darkMode}>Timer</ModalTitle>

            <SettingRow>
              <SettingLabel $darkMode={darkMode}>
                Auto-stop session after:
              </SettingLabel>
              <Select
                $darkMode={darkMode}
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
              >
                <option value={0}>Never (run continuously)</option>
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={4}>4 hours</option>
                <option value={6}>6 hours</option>
                <option value={8}>8 hours</option>
                <option value={10}>10 hours</option>
              </Select>
            </SettingRow>

            <CloseButton
              $darkMode={darkMode}
              onClick={() => setShowSettings(false)}
            >
              Done
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}

export default App;
