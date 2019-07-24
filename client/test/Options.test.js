import './enzyme.config.js'
import React from 'react'
import { shallow } from 'enzyme'
import Options from '../src/components/Application/Options/Options'
import Units from '../src/components/Application/Options/Units'
import AddUnit from '../src/components/Application/Options/AddUnit'

const startProperties = {
  'options': {
    'units': {'miles':3959, 'kilometers':6371, 'nautical miles': 3440},
    'activeUnit': 'miles'
  },
  'updateOption' : () => {},
  'addUnit' : () => {}
};

function testRender() {
  const options = shallow(<Options options={startProperties.options}
                                   config={null}
                                   updateOption={startProperties.updateOption}
                                   addUnit={startProperties.addUnit} />);

  expect(options.contains(<Units options={startProperties.options}
                                 activeUnit={startProperties.options.activeUnit}
                                 updateOption={startProperties.updateOption}/>)).toEqual(true);

  expect(options.contains(<AddUnit addUnit = {startProperties.addUnit}/>)).toEqual(true);
}

test('Check to see if a Units component is rendered', testRender);