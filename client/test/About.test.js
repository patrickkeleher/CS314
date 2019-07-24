import './enzyme.config.js';
import React from 'react';
import {mount} from 'enzyme';
import ErrorBanner from '../src/components/Application/ErrorBanner';
import About from "../src/components/Application/About/About";
import {getOriginalServerPort} from "../src/api/restfulAPI";
import {CardHeader} from "reactstrap";

const startProperties = {
    planOptions: {
        units: {'miles':3959, 'kilometers': 6371, 'nautical miles': 3440},
        activeUnit: 'miles'
    },
    clientSettings: {
        serverPort: getOriginalServerPort()
    },
    teamNames: {
        Jon: "Jon",
        Patrick: "Patrick",
        Saurav: "Saurav",
        Jack:  "Jack"
    }
};

function testCardHeaders() {
    const about = mount(<About options={startProperties.planOptions}
                               settings={startProperties.clientSettings}
                               createErrorBanner={createErrorBanner}/>);

    expect(about.containsMatchingElement(
        <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
            {startProperties.teamNames.Jon}
        </CardHeader>
    )).toEqual(true);

    expect(about.containsMatchingElement(
        <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
            {startProperties.teamNames.Patrick}
        </CardHeader>
    )).toEqual(true);

    expect(about.containsMatchingElement(
        <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
            {startProperties.teamNames.Saurav}
        </CardHeader>
    )).toEqual(true);

    expect(about.contains(
        <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
            {startProperties.teamNames.Jack}
        </CardHeader>
    )).toEqual(true);
}

function createErrorBanner(statusText, statusCode, message) {
    return (
        <ErrorBanner statusText={statusText}
                     statusCode={statusCode}
                     message={message}/>
    );
}

test("testing the CardHeader components in the teamMember() function", testCardHeaders);