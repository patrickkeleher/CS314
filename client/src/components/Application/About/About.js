import React, {Component} from 'react'
import {Container, Row, Col, CardHeader} from 'reactstrap'
import Pane from '../Pane';
import { Card, CardImg, CardText, CardBody } from 'reactstrap';

/* About gives information about members of team 10 - finiteLoop for cs314
 *  Members involved in the development and creation of this project include:
 *  Jonathan Perea, Saurav Shrestha, Patrick Keleher, and Jack Fitzgerald
 */
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
        return [ { name: "Jon", description: "I'm a senior at CSU studying Applied Computing Technologies. I work four jobs at the Lincoln Center. In my free time," +
            "I am a photographer hobbyist so I spend a lot of time shooting and editing photos, or I am playing video games, reading, watching tv," +
            "or working out.",
            imageSource: "https://photos.gurushots.com/unsafe/500x500/ccce38a7b1b46939b00b63dfd0fe0fea/3_04e86ebfb135035a652071581e8490bb.jpg"},

            { name: "Patrick", description: "I am a current junior in computer science. I am an avid hiker with currently 18 Colorado 14er summits." +
            "I also enjoy video games and drones.",
                imageSource: "http://i68.tinypic.com/xldo2b.jpg"},

            {name: "Saurav", description: "I am a senior CSU student studying Applied Computing Technology.",
                imageSource: "https://i.ibb.co/JcFhMwp/saurav.png"},

            {name: "Jack", description: "I'm currently a junior at CSU studying Computer Science",
                imageSource: "https://i.ibb.co/JKWx0RP/jacks-avatar.png"}
              ]
    }


}



