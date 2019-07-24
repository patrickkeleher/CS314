import React, {Component} from 'react'
import {Container, Row, Col, CardHeader} from 'reactstrap'
import Pane from '../Pane';
import { Card, CardImg, CardText, CardBody } from 'reactstrap';

export default class About extends Component{
    constructor(props) {
        super(props);
    }

    /*
     *  Col length code taken from: https://reactstrap.github.io/components/layout/
     *  *Note, to change layout of items on page, edit code here based on number of
     *  columns and rows needed.
     */

    render() {

        return(
            <Container>
                <Row className = 'mb-4'>
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        {this.heading()}
                    </Col>
                </Row>
                {this.memberData().map((member,index)=><span key ={index}>{this.addTeamMember(member)}</span>)}

            </Container>
        )
    }

    heading() {

        return (
            <Pane header={'About'}>
                {'Welcome to finiteLoop'}
            </Pane>
        );

    }

    addTeamMember(teammate){
        return (
                <Row className = 'mb-4'>
                    <Col sm="12" md={{size: 6, offset: 3}}>
                        <Card>
                            <CardHeader className='bg-csu-gold text-white font-weight-semibold'>
                                {teammate.name}
                            </CardHeader>
                            <CardImg top width="100%" src={teammate.imageSource} alt={`Image of ${teammate.name}`} />
                            <CardBody>
                                <CardText>{teammate.description}</CardText>
                            </CardBody>
                        </Card>

                    </Col>
                </Row>

        );
    }

    memberData(){
        return [ 

            { name: "Patrick", description: "I am a current senior in computer science. I am an avid hiker with currently 20 Colorado 14er summits." +
            "I also enjoy video games and drones.",
                imageSource: "http://i68.tinypic.com/xldo2b.jpg"},

              ]
    }


}



