:root {
  --light-grey: #f0f0f0;
  --white: #ffffff;
}

.appBar {
  transition: $(
    theme.transitions.create(
      [ "margin",
      "width" ],
      {easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
      }
    )
  );
}

.toolbar {
  background: linear-gradient(to top, var(--white), var(--light-grey)),
    linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.14));
  height: 2.5rem;

  & div {
    margin: 0;
    display: flex;
    flex-grow: 1;
  }

  & img {
    width: auto;
    margin: 0 1.125em;
    height: 2.5em;
  }
}

.appBarShift {
  width: calc(100% - 240px);
  margin-left: 240px;
  transition: $(
    theme.transitions.create(
      [ "margin",
      "width" ],
      {easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
      }
    )
  );
}
