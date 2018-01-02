define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ol', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojlabel', 'ojs/ojcheckboxset'],
    function (oj, ko, $, ol) {
        'use strict';
        function WorkAreaViewModel() {
            var self = this;

            self.currentCountries = ko.observableArray([]);

            self.countryMap = {};
            self.countryMap['in'] = { "place_id": "177729185", "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright", "osm_type": "relation", "osm_id": "304716", "boundingbox": ["6.5546079", "35.6745457", "68.1113787", "97.395561"], "lat": "22.3511148", "lon": "78.6677428", "display_name": "India", "class": "boundary", "type": "administrative", "importance": 0.3133568788165, "icon": "http://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png", "address": { "country": "India", "country_code": "in" } };
            self.countryMap['es'] = { "place_id": "179962651", "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright", "osm_type": "relation", "osm_id": "1311341", "boundingbox": ["27.4335426", "43.9933088", "-18.3936845", "4.5918885"], "lat": "40.0028028", "lon": "-4.003104", "display_name": "Spain", "class": "boundary", "type": "administrative", "importance": 0.22447060272487, "icon": "http://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png", "address": { "country": "Spain", "country_code": "es" } };
            self.countryMap['ma'] = { "place_id": "217466685", "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright", "osm_type": "relation", "osm_id": "3630439", "boundingbox": ["21.3365321", "36.0505269", "-17.2551456", "-0.998429"], "lat": "31.1728192", "lon": "-7.3366043", "display_name": "Morocco", "class": "boundary", "type": "administrative", "importance": 0.19300832455819, "icon": "http://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png", "address": { "country": "Morocco", "country_code": "ma" } }
            self.countryMap['ro'] = { "place_id": "177563889", "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright", "osm_type": "relation", "osm_id": "90689", "boundingbox": ["43.618682", "48.2653964", "20.2619773", "30.0454257"], "lat": "45.9852129", "lon": "24.6859225", "display_name": "Romania", "class": "boundary", "type": "administrative", "importance": 0.30982735099944, "icon": "http://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png", "address": { "country": "Romania", "country_code": "ro" } };
            self.countryMap['uy'] = { "place_id": "179428864", "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://www.openstreetmap.org/copyright", "osm_type": "relation", "osm_id": "287072", "boundingbox": ["-35.7824481", "-30.0853962", "-58.4948438", "-53.0755833"], "lat": "-32.8755548", "lon": "-56.0201525", "display_name": "Uruguay", "class": "boundary", "type": "administrative", "importance": 0.18848351906936, "icon": "http://nominatim.openstreetmap.org/images/mapicons/poi_boundary_administrative.p.20.png", "address": { "country": "Uruguay", "country_code": "uy" } };

            for (const c in self.countryMap) {
                // create a feature for each country in the map 
                var coordinates = ol.proj.transform([1 * self.countryMap[c].lon, 1 * self.countryMap[c].lat], 'EPSG:4326', 'EPSG:3857');
                var featurething = new ol.Feature({
                    name: self.countryMap[c].display_name,
                    geometry: new ol.geom.Point(coordinates)
                });
                self.countryMap[c].feature = featurething;
            }


            $(document).ready
                (
                // when the document is fully loaded and the DOM has been initialized
                // then instantiate the map
                function () {
                    initMap();
                })


            function initMap() {
                self.elem = document.getElementById("text-input");
                self.map = new ol.Map({
                    target: 'map',
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.OSM()
                        })
                    ],
                    view: new ol.View({
                        center: ol.proj.fromLonLat([-2, -5]),
                        zoom: 3
                    })
                });
            }

           
            // triggered whenever a checkbox is selected or deselected
            self.selectionListener = function (event) {
                console.log("Country Selection Changed");

                var vectorSource = new ol.source.Vector({}); // to hold features for currently selected countries
                for (var i = 0; i < self.currentCountries().length; i++) {
                    // add the feature to the map for each currently selected country
                    vectorSource.addFeature(self.countryMap[self.currentCountries()[i]].feature);
                }//for

                var layers = self.map.getLayers();
                // remove the feature layer from the map if it already was added
                if (layers.getLength() > 1) {
                    self.map.removeLayer(layers.item(1));
                }
                //Create and add the vector layer with features to the map
                // define the style to apply to these features: bright red, circle with radius 10 and a X as (text) content
                var vector_layer = new ol.layer.Vector({
                    source: vectorSource
                    ,style: function(feature) {
                        var style = new ol.style.Style({
                            image: new ol.style.Circle({
                              radius: 10,
                              stroke: new ol.style.Stroke({
                                color: '#fff'
                              }),
                              fill: new ol.style.Fill({
                                //color: '#3399CC' // light blue
                                color: 'red' // light blue
                            })
                            }),
                            text: new ol.style.Text({
                              text: "X",
                              fill: new ol.style.Fill({
                                color: '#fff'
                              })
                            })
                          });
                          return style;
                        }
                 } )
                self.map.addLayer(vector_layer);

            }//selectionListener

        }

        return new WorkAreaViewModel();
    }


);