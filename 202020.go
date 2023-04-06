package main

import (
	"fmt"
	"os"
	"strconv"
	"time"

	notif "github.com/deckarep/gosx-notifier"

	"github.com/charmbracelet/bubbles/help"
	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/stopwatch"
	tea "github.com/charmbracelet/bubbletea"
)

type keymap struct {
	start key.Binding
	stop key.Binding
	reset key.Binding
	quit key.Binding
}

type model struct {
	stopwatch stopwatch.Model
	keymap keymap
	help help.Model
	quitting bool
}


const sessionLengthInMin int = 20

func pushNotification() {
	n := notif.NewNotification("Look 20ft away for 20 seconds")
	n.Title = "202020"
	n.Subtitle = "Give your eyes a break!"
	n.Group = "com.jonashellstrom.202020" // new notif replaces existing - avoids grouping
	n.Sound = notif.Default

	err := n.Push(); if err != nil {
		fmt.Println("Uh oh.. Something went wrong sending notification:", err)
		os.Exit(1)
	}
}

func (m model) Init() tea.Cmd {
	return m.stopwatch.Init()
}

func (m model) View() string {

	s := m.stopwatch.View()

	if !m.quitting {
		minElapsed := sessionLengthInMin - int(m.stopwatch.Elapsed().Minutes())
		s = "Current session: " + s + " (" + strconv.Itoa(minElapsed) + "m until break)" + "\n"
		s += m.helpView()
	}

	return s
}

func (m model) helpView() string {
	return "\n" + m.help.ShortHelpView([]key.Binding{
		m.keymap.start,
		m.keymap.stop,
		m.keymap.reset,
		m.keymap.quit,
	})
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch {
		case key.Matches(msg, m.keymap.quit):
			m.quitting = true
			return m, tea.Quit
		case key.Matches(msg, m.keymap.reset):
			return m, m.stopwatch.Reset()
		case key.Matches(msg, m.keymap.start, m.keymap.stop):
			m.keymap.stop.SetEnabled(!m.stopwatch.Running())
			m.keymap.start.SetEnabled(m.stopwatch.Running())
			return m, m.stopwatch.Toggle()
		}
	}

	var cmd tea.Cmd
	
	m.stopwatch, cmd = m.stopwatch.Update(msg)

	if (m.stopwatch.Elapsed().Minutes() == float64(sessionLengthInMin)) {
		pushNotification()
		return m, tea.Batch(m.stopwatch.Reset(), cmd)
	}

	return m, cmd
}

func main() {
	m := model{
		stopwatch: stopwatch.NewWithInterval(time.Second),
		keymap: keymap{
			start: key.NewBinding(
				key.WithKeys("s"),
				key.WithHelp("s", "start"),
			),
			stop: key.NewBinding(
				key.WithKeys("s"),
				key.WithHelp("s", "stop"),
			),
			reset: key.NewBinding(
				key.WithKeys("r"),
				key.WithHelp("r", "reset"),
			),
			quit: key.NewBinding(
				key.WithKeys("ctrl+c", "q"),
				key.WithHelp("q", "quit"),
			),
		},
		help: help.NewModel(),
	}

	m.keymap.start.SetEnabled(false)

	if _, err := tea.NewProgram(m).Run(); err != nil {
		fmt.Println("Uh oh.. Something went wrong:", err)
		os.Exit(1)
	}
}