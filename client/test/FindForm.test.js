import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';

import FindForm from '../src/components/Application/Find/FindForm'
import ErrorBanner from '../src/components/Application/ErrorBanner';

import {getOriginalServerPort} from '../src/api/restfulAPI';


const startProperties = {
  serverConfig: null,
  planOptions: {
    units: {'miles':3959, 'kilometers': 6371, 'nautical miles': 3440},
    activeUnit: 'miles'
  },
  clientSettings: {
    serverPort: getOriginalServerPort()
  },
  errorMessage: null,
  getFindData: () => {},
  display: () => {},
  updateDisplay: () => {}
};

function createErrorBanner(statusText, statusCode, message) {
  return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
  );
}

function findFormTest() {

  const findForm = shallow(<FindForm settings={startProperties.settings}
                                 createErrorBanner={createErrorBanner}
                                 getFindData={startProperties.getFindData}
                                 display={startProperties.display}
                                 updateDisplay={startProperties.updateDisplay}
  />);
  expect(findForm.find('Form')).toHaveLength(1);
}

test('Testing that the findForm component gets rendered', findFormTest);