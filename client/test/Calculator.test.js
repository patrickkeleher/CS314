import './enzyme.config.js';
import React from 'react';
import {mount} from 'enzyme';
import Calculator from '../src/components/Application/Calculator/Calculator';
import ErrorBanner from '../src/components/Application/ErrorBanner';


const startProperties = {
  'serverConfig': null,
  'planOptions': {
    'units': {'miles':3959, 'kilometers': 6371, 'nautical miles': 3440},
    'activeUnit': 'miles'
  },
  'clientSettings': {
    'serverPort': 'black-bottle.cs.colostate.edu:31400'
  },
  'errorMessage': null
};

function createErrorBanner(statusText, statusCode, message) {
  return (
      <ErrorBanner statusText={statusText}
                   statusCode={statusCode}
                   message={message}/>
  );
}

//Jest fix for Polyline issue from: https://github.com/Leaflet/Leaflet/issues/6297
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => {
    return {
      fillRect: function() {},
      clearRect: function(){},
      putImageData: function() {},
      createImageData: function(){ return []},
      setTransform: function(){},
      drawImage: function(){},
      save: function(){},
      fillText: function(){},
      restore: function(){},
      beginPath: function(){},
      moveTo: function(){},
      lineTo: function(){},
      closePath: function(){},
      stroke: function(){},
      translate: function(){},
      scale: function(){},
      rotate: function(){},
      arc: function(){},
      fill: function(){},
      transform: function(){},
      rect: function(){},
      clip: function(){},
    }
  }
});

function testCreateInputFields() {
  const calculator = mount((
      <Calculator options={startProperties.planOptions}
                  settings={startProperties.clientSettings}
                  createErrorBanner={createErrorBanner}/>
  ));

  let numberOfInputs = calculator.find('Input').length;
  expect(numberOfInputs).toEqual(4);

  let actualInputs = [];
  calculator.find('Input').map((input) => actualInputs.push(input.prop('name')));

  let expectedInputs = [
    'latitude',
    'longitude',
    'latitude',
    'longitude'
  ];

  expect(actualInputs).toEqual(expectedInputs);
}

/* Tests that createForm() correctly renders 4 Input components */
test('Testing the createForm() function in Calculator', testCreateInputFields);

function testInputsOnChange() {
  const calculator = mount((
      <Calculator options={startProperties.planOptions}
                  settings={startProperties.clientSettings}
                  createErrorBanner={createErrorBanner}/>
  ));

  for (let inputIndex = 0; inputIndex < 4; inputIndex++){
    simulateOnChangeEvent(inputIndex, calculator);
  }
  expect(calculator.state().origin.latitude).toEqual(0);
  expect(calculator.state().origin.longitude).toEqual(1);
  expect(calculator.state().destination.latitude).toEqual(2);
  expect(calculator.state().destination.longitude).toEqual(3);
}

function simulateOnChangeEvent(inputIndex, reactWrapper) {
  let eventName = (inputIndex % 2 === 0) ? 'latitude' : 'longitude';
  let event = {target: {name: eventName, value: inputIndex}};
  switch(inputIndex) {
    case 0:
      reactWrapper.find('#originLatitude').at(0).simulate('blur', event);
      break;
    case 1:
      reactWrapper.find('#originLatitude').at(0).simulate('blur', event);
      break;
    case 2:
      reactWrapper.find('#destinationLatitude').at(0).simulate('blur', event);
      break;
    case 3:
      reactWrapper.find('#destinationLongitude').at(0).simulate('blur', event);
      break;
    default:
  }
  reactWrapper.update();
}

/* Loop through the Input indexes and simulate an onChange event with the index
 * as the input. To simulate the change, an event object needs to be created
 * with the name corresponding to its Input 'name' prop. Based on the index,
 * find the corresponding Input by its 'id' prop and simulate the change.
 *
 * Note: using find() with a prop as a selector for Inputs will return 2 objects:
 * 1: The function associated with the Input that is created by React
 * 2: The Input component itself
 *
 * The values in state() should be the ones assigned in the simulations.
 *
 * https://github.com/airbnb/enzyme/blob/master/docs/api/ShallowWrapper/simulate.md
 * https://airbnb.io/enzyme/docs/api/ReactWrapper/props.html
 * https://airbnb.io/enzyme/docs/api/ReactWrapper/find.html
 */
test('Testing the onChange event of longitude Input in Calculator', testInputsOnChange);