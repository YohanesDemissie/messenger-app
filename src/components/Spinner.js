import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => ( //creating a stateless component without render/return
  <Dimmer active>
    <Loader size='huge' content={"Preparing chat..."}/>
  </Dimmer>
  )

export default Spinner;