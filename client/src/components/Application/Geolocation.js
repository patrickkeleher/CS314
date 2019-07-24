import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import 'leaflet/dist/leaflet.css';
import React, {Component} from 'react';
import {Marker, Popup} from 'react-leaflet';
import Cookies from 'js-cookie';
export default class Geolocation extends Component {
    constructor(props){
        super(props);

        this.success = this.success.bind(this);
        this.error = this.error.bind(this);

        //default state (no geolocation) is coordinates of the CSU oval
        this.state = {
            latitude: 40.576179,
            longitude: -105.080773,
            location: 'Colorado State University',
            geolocationFlag: false
        };


    }

    render() {


        return (
            <Marker position={L.latLng(this.state.latitude, this.state.longitude)}
                    icon={this.markerIcon()}>
                <Popup className="font-weight-extrabold">{this.state.location}</Popup>
            </Marker>
        );
    }

    updateStateWithCookieCoordinates() {
        if (Cookies.get().hasOwnProperty('geoLatitude') && Cookies.get().hasOwnProperty('geoLongitude') ){
            this.setState({
                latitude: Cookies.get("geoLatitude"),
                longitude: Cookies.get("geoLongitude")
            });
        }

         if(Cookies.get().hasOwnProperty('geoFlag') ){
            this.setState({geolocationFlag : Cookies.get('geoFlag') === "true"});
        }
    }

    checkGeolocationFlag(){

        if (this.state.geolocationFlag){
            this.state.location = "Your Current Location";
        }

        else {
            this.state.location = "Colorado State University";
        }
    }

    getCurrentCoordinates() {
        try {

            const options = {
                enableHighAccuracy: true,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(this.success, this.error, options);
        }

        catch (e) {

        }
    }

    success(pos) {
        const crd = pos.coords;

        this.setState({
            latitude: crd.latitude,
            longitude: crd.longitude,
            location: 'Your current location',
            geolocationFlag: true
        });
        Cookies.set('geoLatitude',crd.latitude);
        Cookies.set('geoLongitude',crd.longitude);
        Cookies.set('geoFlag','true');

    }

    error(err) {
        console.log(`ERROR(${err.code}): ${err.message}`);

        this.setState({
            latitude: 40.576179,
            longitude: -105.080773,
            location: 'Colorado State University',
            geolocationFlag: false
        });
        Cookies.set('geoLatitude', '40.576179');
        Cookies.set('geoLongitude', '-105.080773');
        Cookies.set('geoFlag', 'false');
    }

    markerIcon() {
        // react-leaflet does not currently handle default marker icons correctly,
        // so we must create our own
        return L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [12,40]  // for proper placement
        })
    }


    componentDidMount(){
        this.getCurrentCoordinates();
        this.updateStateWithCookieCoordinates();
        this.checkGeolocationFlag();

    }
}

