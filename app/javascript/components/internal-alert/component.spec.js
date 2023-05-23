import { fromJS } from "immutable";
import { mountedComponent,screen} from "test-utils";
import InternalAlert from "./component";

describe("<InternalAlert />", () => {
  it("renders the InternalAlert", () => {
    mountedComponent(  <InternalAlert
        items={fromJS([{ message: 'Alert Message 1' }])}
        severity="warning"
      />
  
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Alert Message 1')).toBeInTheDocument();
    
  });

  it("does not render details if there is only one alert", () => {
    mountedComponent(<InternalAlert
        items={fromJS([{ message: 'Alert Message 1' }])}
        severity="warning"
      />
    );

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it("renders details if there are several alert", () => {
    mountedComponent(
        <InternalAlert
        items={fromJS([
          { message: 'Alert Message 1' },
          { message: 'Alert Message 2' },
        ])}
        severity="warning"
      />
    );

    expect(screen.queryByRole('listitem')).toHaveLength(2);
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Alert Message 1',
      'Alert Message 2',
    ]);
  });

  it("renders the specified title", () => {
    const title = "This is the title";
    mountedComponent(<InternalAlert
        title={title}
        items={fromJS([
          { message: 'Alert Message 1' },
          { message: 'Alert Message 2' },
        ])}
        severity="warning"
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
