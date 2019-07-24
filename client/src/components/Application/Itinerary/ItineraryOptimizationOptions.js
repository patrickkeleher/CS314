import Pane from "../Pane";
import {Form, FormGroup} from "reactstrap";
import React from "react";

const ItineraryOptimizationOptions = (props)=>{

  return (
      <Pane header={'Itinerary Optimization Options'}>
        <Form inline>
          { props.allButtons.map((button,index)=>{
            return(
                <FormGroup key ={index} className="mb-2 mr-sm-2 mb-sm-0">
                  {button}

                </FormGroup>)
          })
          }

        </Form>
      </Pane>
  );
};

export default ItineraryOptimizationOptions;