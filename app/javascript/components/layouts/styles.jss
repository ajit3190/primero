.root {
  display: flex;
}

.content {
  flex-grow: 1;
  height: 100vh;
  overflow: auto;
  padding: .5em;
  background: #fff;
  transition: $(theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }));
  padding-top: 4em;
  margin-left: -240px;
}

.contentShift {
  transition: $(theme.transitions.create('margin', {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }));
  padding-top: 0;
  margin-left: 0;
}
