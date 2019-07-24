import React from 'react';
import {Table,Button} from "reactstrap";
import { MdDelete,MdPinDrop,MdArrowUpward,MdArrowDownward,MdArrowDropUp} from "react-icons/md";

const  ItineraryTable = (props) => {
  const tableHeaders = ["#","Name","Latitude","longitude", `Leg Distance (${props.options.activeUnit})`
    ,`Cumulative Distance (${props.options.activeUnit})`,"Options"];
    return (
        <Table responsive hover borderless>
            <thead>
            <tr>
              {tableHeaders.map((tableHeader,index)=>{
                return(<th key={index}>{tableHeader}</th>)
              })}
            </tr>
            </thead>
            <tbody>
                {generateTableData (props)}

                <tr><td><Button onClick={ () => reverseItinerary(props)}> Reverse</Button></td>
                <td><Button onClick={ () => props.updateDisplayMarker([])}> Clear Markers</Button></td></tr>

            <tr>
                <th colSpan="5" scope="row">Grand Total</th>
                <td>{getTotalDistance(props) }</td>

            </tr>
            </tbody>
        </Table>);
};
const generateTableData = (props) =>{
    let cumulativeArray = [];
    getCumulativeDistance(props.itinerary, cumulativeArray);

        return(
        props.itinerary.places.map((place,index) => {
            return (<tr key={index}>
                <td>{index + 1}</td>
                <td>{place.name}</td>
                <td>{place.latitude}</td>
                <td>{place.longitude}</td>
                <td>{props.itinerary.distances[index]}</td>
                <td>{cumulativeArray[index]}</td>
                <td>
                    <Button className={'btn-csu'} onClick={ ()=>moveToFirst(props,place,index)}><MdArrowDropUp size={'1.4em'}/></Button>
                    <Button className={'btn-csu'} onClick={ ()=>moveUp(props,place,index)}><MdArrowUpward size={'1.4em'}/></Button>
                    <Button className={'btn-csu'} onClick={ ()=>moveDown(props,place,index)}><MdArrowDownward size={'1.4em'}/></Button>
                    <Button className={'btn-csu'} onClick={ ()=>{updateItinerary(props,place,index); deleteDisplayMarker(props,place)} }><MdDelete size={'1.4em'}/></Button>
                    <Button className={'btn-csu'} onClick={ ()=>updateDisplayMarker(props,place) }><MdPinDrop size={'1.4em'}/></Button>
                </td>
            </tr>)
        }))
};

export const getCumulativeDistance = (itinerary, cumulativeArray) => {

        let sum = 0;
        itinerary.distances.forEach((item) => {
                sum += item;
                cumulativeArray.push(sum);
            }
        );

};

export const getTotalDistance = (props) => {

        let sum = 0;
        props.itinerary.distances.forEach((item) => {
            sum += item;
            }
        );
        return sum;

};

export const moveToFirst = (props,place,index) => {
    if(index !== 0) {
        movePlace(props, index, 0);
    }
};

export const moveUp = (props,place,index) => {
    if(index !== 0) {
        movePlace(props, index, index - 1);
    }
};

export const moveDown = (props,place,index) => {
    if(index !== props.itinerary.places.length-1) {
        movePlace(props, index, index + 1);
    }
};

export const movePlace = (props, index, newIndex) => {
    let itineraryObject = Object.assign({}, props.itinerary);

    let temporaryPlace = itineraryObject.places[index];
    itineraryObject.places[index] = itineraryObject.places[newIndex];
    itineraryObject.places[newIndex] = temporaryPlace;
    props.getItineraryData(itineraryObject);
};

export const updateItinerary = (props,place,index) => {

  let aTest = Object.assign({}, props.itinerary);

  aTest.places.splice(index,1);
  aTest.distances.splice(index,1);

  props.getItineraryData(aTest);

};

export const reverseItinerary = (props) => {

  let aTest = Object.assign({}, props.itinerary);

  aTest.places.reverse();
  aTest.distances.reverse();

  props.getItineraryData(aTest);

};

export const updateDisplayMarker = (props,place) =>{

  let displayMarker = props.displayMarker;
  const placeIndex = displayMarker.filter(markerPlace => (markerPlace.name === place.name)).length;

  if (placeIndex > 0){

    displayMarker = displayMarker.filter(markerPlace => (markerPlace.name !== place.name))
  }

  else {

    displayMarker.push(place);
  }

  props.updateDisplayMarker(displayMarker);
  return displayMarker;
};
export const deleteDisplayMarker = (props,place) =>{

  let displayMarker = props.displayMarker;
  displayMarker = displayMarker.filter(markerPlace => (markerPlace.name !== place.name));
  props.updateDisplayMarker(displayMarker);
  return displayMarker;
};

export default ItineraryTable;