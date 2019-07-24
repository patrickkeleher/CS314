import React from 'react';
import {Table,Button} from "reactstrap";
import { MdAdd} from "react-icons/md";

const  FindTable = (props) => {
  const tableHeaders = ["Add","#","City","Latitude","Longitude"];
  return (
      <Table responsive hover borderless>
        <thead>
        <tr>
          {tableHeaders.map(tableHeader=><th key ={tableHeader}>{tableHeader}</th>)}
        </tr>
        </thead>
        <tbody>
        {generateTableData (props)}


        </tbody>
      </Table>);
};

export const generateTableData = (props) =>{
  return(
      props.find.places.map((place,index) => {
        return (<tr key={index}>
          <td><Button className={'btn-csu'} onClick={()=>updateItinerary(props,place)}><MdAdd size ={'1.4em'}/></Button></td>
          <td>{index + 1}</td>
          <td>{place.name}</td>
          <td>{place.latitude}</td>
          <td>{place.longitude}</td>

        </tr>)
      }))
};

export const updateItinerary = (props,place) => {

      let itinerary = Object.assign({}, props.itinerary);

      itinerary .places.push(place);

    props.getItineraryData(itinerary);

    return itinerary;

};
export default FindTable;