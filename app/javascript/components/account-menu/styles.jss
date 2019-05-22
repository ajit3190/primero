:root {
  --black: #000;
  --white: #fff;
  --light-grey: #ebebeb;
  --dark-gray: #ccc;
}

.listIcon {
  min-width: 2.5em;
}

.listText {
  font-size: 14px;
  font-weight: 600;
}

.navListAccount {
  flex-grow: 1;

  & li {
    padding: 0;
  }
}

.accountListItem {
  padding: 0;

  & a {
    text-indent: 2.5em;
  }

  & span {
    font-size: 0.813em;
  }
}

.readOnlyNavListItem {
  cursor: default;
  padding: 8px 16px !important;
}

.navSeparator {
  width: 219px;
  height: 1px;
  margin: 0.375em 0 0.938em;
  background: linear-gradient(to left, rgba(238, 238, 238, 0), rgba(232, 232, 232, 0.26) 18%, #d8d8d8);
}

.navLink {
  text-decoration: none;
  color: var(--black);
  padding: 8px 16px;
  display: flex;
  width: 100%;
  align-items: center;
}

.navActive {
  background: var(--white);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);

  &:hover {
    background: var(--white);
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    right: 0;
    z-index: 99;
    height: 0.625em;
    width: 0.625em;
  }

  & svg {
    color: var(--black);
  }

  &:before {
    background-image: url("data:image/svg+xml,%0A%3Csvg width='10px' height='10px' viewBox='0 0 10 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10,0 L10,10 L0,10 C5.5228475,10 10,5.5228475 10,0 Z' id='Combined-Shape' fill='%23FFFFFF'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    top: -0.625em;
  }

  &:after {
    background-image: url("data:image/svg+xml,%0A%3Csvg width='10px' height='10px' viewBox='0 0 10 10' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd'%3E%3Cpath d='M10,0 L10,10 L0,10 C5.5228475,10 10,5.5228475 10,0 Z' id='Combined-Shape' fill='%23FFFFFF' transform='translate(5.000000, 5.000000) scale(1, -1) translate(-5.000000, -5.000000) '%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    bottom: -0.625em;
  }
}

@media $(theme.breakpoints.only('md')) {
  .listIcon {
    min-width: 5.5em;
  }

  .accountListItem {
    display: none;
  }
}
