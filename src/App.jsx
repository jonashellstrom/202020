import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { IoTimerOutline } from 'react-icons/io5'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffffff;
  padding: 18px 24px 32px 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  user-select: none;
  -webkit-user-select: none;
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 4px;
  text-align: center;
  cursor: default;
`

const AppIcon = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 8px;
  pointer-events: none;
  -webkit-user-drag: none;
`

const Description = styled.p`
  font-size: 14px;
  color: #86868b;
  margin-bottom: 16px;
  text-align: center;
  line-height: 20px;
  max-width: 320px;
  cursor: default;
`

const TimerText = styled.div`
  font-size: 48px;
  font-weight: 300;
  color: #1d1d1f;
  margin-bottom: 16px;
  font-variant-numeric: tabular-nums;
  cursor: default;
`

const ActionButton = styled.button`
  background-color: #2e2e2eff;
  color: white;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease-in-out;
  width: 200px;
  margin-top: 0;

  &:hover {
    background-color: #333333ff;
  }

  &:active {
    transform: scale(0.98);
  }
`

const StopButton = styled.button`
  background-color: transparent;
  color: #86868b;
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  margin-top: 0;
  transition: all 0.3s ease-in-out;
  width: 200px;

  &:hover {
    background-color: #f5f5f5;
  }

  &:active {
    transform: scale(0.98);
  }
`

const TimerLabel = styled.div`
  font-size: 14px;
  color: #86868b;
  margin-bottom: 4px;
  cursor: default;
  height: 18px;
  line-height: 18px;
  overflow: hidden;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
`

const DragRegion = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  -webkit-app-region: drag;
  z-index: 1;
`

const SettingsButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #86868b;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  -webkit-app-region: no-drag;
  z-index: 2;

  &:hover {
    color: #1d1d1f;
  }
`

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
`

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 320px;
  max-width: 90%;
`

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24px;
  cursor: default;
`

const SettingRow = styled.div`
  margin-bottom: 24px;
`

const SettingLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #1d1d1f;
  margin-bottom: 8px;
  font-weight: 500;
  cursor: default;
`

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  color: #1d1d1f;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #393939ff;
  }
`

const CloseButton = styled.button`
  width: 100%;
  background-color: #202020ff;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &:hover {
    background-color: #393939ff;
  }

  &:active {
    transform: scale(0.98);
  }
`

const SessionInfo = styled.div`
  font-size: 12px;
  color: #86868b;
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
  cursor: default;
  height: 16px;
  line-height: 16px;
  overflow: hidden;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
`

const ButtonWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 44px;
  margin-top: 8px;
`

const TWENTY_MINUTES = 20 * 60 * 1000; // 20 minutes in milliseconds

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(TWENTY_MINUTES)
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [workDuration, setWorkDuration] = useState(0) // 0 means no limit
  const intervalRef = useRef(null)
  const notificationTimeoutRef = useRef(null)
  const sessionStartTimeRef = useRef(null)

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const formatSessionTime = (ms) => {
    const totalMinutes = Math.floor(ms / 1000 / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const sendNotification = async () => {
    try {
      await window.electronAPI.showNotification(
        'Time for a break! 👀',
        'Look at something 20 feet away for 20 seconds to rest your eyes.'
      )
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  const startSession = async () => {
    // Request permission first
    try {
      await window.electronAPI.requestNotificationPermission()
    } catch (error) {
      console.error('Failed to request notification permission:', error)
    }

    setIsRunning(true)
    setTimeRemaining(TWENTY_MINUTES)
    sessionStartTimeRef.current = Date.now()

    // Start countdown
    const startTime = Date.now()
    intervalRef.current = setInterval(() => {
      // Update session elapsed time
      if (sessionStartTimeRef.current) {
        setSessionElapsed(Date.now() - sessionStartTimeRef.current)
      }

      // Check if work duration has been exceeded
      if (workDuration > 0 && sessionStartTimeRef.current) {
        const sessionElapsed = Date.now() - sessionStartTimeRef.current
        if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
          stopSession()
          sendNotification()
          return
        }
      }

      const elapsed = Date.now() - startTime
      const remaining = TWENTY_MINUTES - elapsed

      if (remaining <= 0) {
        setTimeRemaining(0)
        sendNotification()
        // Reset timer after notification
        clearInterval(intervalRef.current)
        const newStartTime = Date.now()
        intervalRef.current = setInterval(() => {
          // Update session elapsed time
          if (sessionStartTimeRef.current) {
            setSessionElapsed(Date.now() - sessionStartTimeRef.current)
          }

          // Check work duration again
          if (workDuration > 0 && sessionStartTimeRef.current) {
            const sessionElapsed = Date.now() - sessionStartTimeRef.current
            if (sessionElapsed >= workDuration * 60 * 60 * 1000) {
              stopSession()
              sendNotification()
              return
            }
          }

          const newElapsed = Date.now() - newStartTime
          const newRemaining = TWENTY_MINUTES - newElapsed

          if (newRemaining <= 0) {
            setTimeRemaining(0)
            sendNotification()
            // Continue the cycle
            clearInterval(intervalRef.current)
            startSession()
          } else {
            setTimeRemaining(newRemaining)
          }
        }, 100)
      } else {
        setTimeRemaining(remaining)
      }
    }, 100)
  }

  const stopSession = () => {
    setIsRunning(false)
    setTimeRemaining(TWENTY_MINUTES)
    setSessionElapsed(0)
    sessionStartTimeRef.current = null
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Container>
      <DragRegion />
      <SettingsButton onClick={() => setShowSettings(true)}>
        <IoTimerOutline />
      </SettingsButton>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <AppIcon src="icon.png" alt="202020" />
        <Description>
          Follow the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.
        </Description>
        
        <TimerWrapper>
          <TimerLabel $visible={isRunning}>{isRunning ? 'Next break in' : ''}</TimerLabel>
          <TimerText>{formatTime(timeRemaining)}</TimerText>
        </TimerWrapper>

        <SessionInfo $visible={isRunning}>
          {isRunning && (
            <>
              {`Session running for ${formatSessionTime(sessionElapsed)}`}
              {workDuration > 0 && ` • Auto-stop in ${formatSessionTime(workDuration * 60 * 60 * 1000 - sessionElapsed)}`}
            </>
          )}
        </SessionInfo>

        <ButtonWrapper>
          <ActionButton 
            onClick={startSession}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isRunning ? 0 : 1,
              pointerEvents: isRunning ? 'none' : 'auto'
            }}
          >
            Start Session
          </ActionButton>
          <StopButton 
            onClick={stopSession}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: isRunning ? 1 : 0,
              pointerEvents: isRunning ? 'auto' : 'none'
            }}
          >
            Stop Session
          </StopButton>
        </ButtonWrapper>
      </div>

      {showSettings && (
        <Modal onClick={() => setShowSettings(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Settings</ModalTitle>
            
            <SettingRow>
              <SettingLabel>Auto-stop session after:</SettingLabel>
              <Select 
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

            <CloseButton onClick={() => setShowSettings(false)}>
              Done
            </CloseButton>
          </ModalContent>
        </Modal>
      )}
    </Container>
  )
}

export default App
