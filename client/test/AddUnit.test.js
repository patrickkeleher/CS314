import './enzyme.config.js';
import React from 'react';
import {mount, shallow} from 'enzyme';


import AddUnit from "../src/components/Application/Options/AddUnit";


const startProperties = {

 addUnit: () => {}
};



function AddUnitTest() {

  const addUnitForm = shallow(<AddUnit addUniit={startProperties.addUnit}
  />);
  expect(addUnitForm.find('Card')).toHaveLength(1);
  expect(addUnitForm.find('Form')).toHaveLength(1);
  expect(addUnitForm.find('FormGroup')).toHaveLength(4);

}

test('Testing that the AddUnitTest component gets rendered', AddUnitTest);