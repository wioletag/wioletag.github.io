function Model() {
	this.locations = [
		{
			title: 'Handlebar',
			id: '40f08300f964a5204b0a1fe3',
			location: {
				lat: 41.910175,
				lng: -87.68529
			},
        	keys: [
        		"bar", "food", "restaurant"]
		},
        {
        	title: 'Stan\'s Donuts & Coffee',
        	id: '52f2eebd498ea23d1a8d16d5',
        	location: {
        		lat: 41.909976,
        		lng: -87.677554
        	},
        	keys: ["food", "bakery", "cafe"]
        },
        {
        	title: 'The Violet Hour',
        	id: '49ba99c9f964a5207e531fe3',
        	location: {
        		lat: 41.909086,
        		lng: -87.677829
        	},
        	keys: ["bar"]
        },
        {
        	title: 'Native Foods Cafe',
        	id: '4e383e35d4c0dc7ad2ee1415',
        	location: {
        		lat: 41.908824,
        		lng: -87.675274
        	},
        	keys: ["food", "restaurant"]
        },
        {
        	title: 'Parlor Pizza Bar',
        	id: '575b49f5498e2d45df7b1399',
        	location: {
        		lat: 41.903404,
        		lng: -87.673424
        	},
        	keys: ["bar", "food", "restaurant"]
        },
        {
        	title: 'Dimo\'s Pizza',
        	id: '51eee947498e5566f01655c0',
        	location: {
        		lat: 41.911033,
        		lng: -87.677328
        	},
        	keys: ["food", "restaurant"]
        },
        {
        	title: 'Lou Malnati\'s Pizzeria',
        	id: '4b42698af964a52071d325e3',
        	location: {
        		lat: 41.908878,
        		lng: -87.677965
        	},
        	keys: ["food", "restaurant"]
        },
        {
        	title: 'Big Star',
        	id: '4adbf2bbf964a520242b21e3',
        	location: {
        		lat: 41.909172,
        		lng: -87.677105
        	},
        	keys: ["bar", "food", "restaurant"]
        },
        {
        	title: 'Whiskey Business',
        	id: '56a0503e498e82754e49607e',
        	location: {
        		lat: 41.906752,
        		lng: -87.671554
        	},
        	keys: ["bar", "food", "restaurant"]
        },
        {
        	title: 'Zakopane',
        	id: '40b28c80f964a5203ffd1ee3',
        	location: {
        		lat: 41.903428,
        		lng: -87.671315
        	},
        	keys: ["bar"]
        },
        {
        	title: 'Wicker Park',
        	id: '4ae49d01f964a520519c21e3',
        	location: {
        		lat: 41.908049,
        		lng: -87.676738
        	},
        	keys: ["park"]
        },
        {
        	title: 'Bangers & Lace',
        	id: '4c5847e030d82d7ff8b4db62',
        	location: {
        		lat: 41.903445,
        		lng: -87.670233
        	},
        	keys: ["bar"]
        },
        {
        	title: 'The Fifty/50',
        	id: '49e55491f964a520be631fe3',
        	location: {
        		lat: 41.902895,
        		lng: -87.679063
        	},
        	keys: ["bar", "food", "restaurant"]
        }
	];
	this.map = null;
}

var model = new Model();

var Location = function(data){
	this.title = data.title;
	this.id = data.id;
	this.location = data.location;
	this.keys = data.keys;
    this.visible = true;
    this.windowOpened = false;
    this.marker = new google.maps.Marker({
		map: model.map,
		position: this.location,
		title: this.title,
		animation: google.maps.Animation.DROP,
		visible: true
	});
	this.infowindow = new google.maps.InfoWindow();
};

function ViewModel() {
	var self = this;
	this.locationList = ko.observableArray([]);
	this.filter = ko.observable("");

	// Function to show all markers on map
	this.showAllMarkers = function(){
		self.locationList().forEach(function(location){
			location.marker.setVisible(true);
		});
	};

	// Function to filter locations in the list
	this.filteredItems = ko.computed(function() {
	    var filter = self.filter().toLowerCase();
	    if (!filter) {
	    	self.showAllMarkers();
	        return self.locationList();
	    }
	    else {
	    	return ko.utils.arrayFilter(self.locationList(), function(location) {
	        	if (location.title.toLowerCase().indexOf(filter) !== -1 || location.keys.toString().indexOf(filter) != -1){
	        		location.marker.setVisible(true);
	        		return true;
	        	}
	        	else {
	        		location.marker.setVisible(false);
	        		// Close infoWindow for this marker if opened
	        		if (location.windowOpened){
	        			location.infowindow.close();
	        			location.windowOpened = false;
	        		}
	        		return false;
	        	}
	        });
	    }
	}, this);

	// Function to close any open infoWindow
	this.closeInfoWindows = function(){
		self.locationList().forEach(function(location){
			if (location.windowOpened){
	        	location.infowindow.close();
	        	location.windowOpened = false;
	        }
		});
	};

	// Function to show infoWindow for chosen location
	this.showInfoWindow = function(location){
		var clientId = 'OBCNKT2ROUPNFWFVVP1QYEYMRRNNDRU2AR52YOZ5FRJCI13U';
		var clientSecret = '3DYBBVMJHUN4YT4HRFJO1P5AE1I2RK14PZ0LWWQCAFDA225R';
		var version = 20170101;
		var base_url = 'https://api.foursquare.com/v2/venues';
		var venue_id = location.id;
		var url = base_url + '/' + venue_id + '?client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + version;
		var content = '<h5>' + location.title + '</h5>';

		// Make Ajax call to Foursquare API and populate location's infoWindow
		$.ajax({
			url: url,
		    dataType: 'jsonp',
		   	success: function(data){
		   		var result = data.response.venue;
		        content += '<div class="info"><p>' + result.location.formattedAddress[0] + '</p>';
		        content += '<p>' + result.location.formattedAddress[1] + '</p>';
		        content += '<p>' + result.location.formattedAddress[2] + '</p>';
		        content += '<p>' + result.rating + " (" + result.ratingSignals + " ratings)" + '</p>';
		        content += '<p><a href="' + result.url + '" target="_blank">'+ result.url + '</a></p>';
		        content += '<p>Source: <a href="https://foursquare.com/" target="_blank">Foursquare</a></p></div>';
		        location.infowindow.setContent(content);
		    },
		    error: function() {
		         content += '<p>Failed to get Foursquare data.</p>';
		         location.infowindow.setContent(content);
		    }
    	});

		// Close any open infoWindow before opening a new one
		self.closeInfoWindows();

		// Open infoWindow for chosen location
		location.infowindow.open(map, location.marker);
		location.windowOpened = true;

		// Bounce the marker
		self.bounceMarker(location.marker);
	};

	// Function to initialize map
	this.initMap = function(){
		// Map style from https://snazzymaps.com/
		var styles = [
			{
		    	"featureType": "water",
		        "stylers": [
		            {
		                "color": "#19a0d8"
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "labels.text.stroke",
		        "stylers": [
		            {
		                "color": "#ffffff"
		            },
		            {
		                "weight": 6
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "labels.text.fill",
		        "stylers": [
		            {
		                "color": "#e85113"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "geometry.stroke",
		        "stylers": [
		            {
		                "color": "#efe9e4"
		            },
		            {
		                "lightness": -40
		            }
		        ]
		    },
		    {
		        "featureType": "road.arterial",
		        "elementType": "geometry.stroke",
		        "stylers": [
		            {
		                "color": "#efe9e4"
		            },
		            {
		                "lightness": -20
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "labels.text.stroke",
		        "stylers": [
		            {
		                "lightness": 100
		            }
		        ]
		    },
		    {
		        "featureType": "road",
		        "elementType": "labels.text.fill",
		        "stylers": [
		            {
		                "lightness": -100
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "labels.icon"
		    },
		    {
		        "featureType": "landscape",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "landscape",
		        "stylers": [
		            {
		                "lightness": 20
		            },
		            {
		                "color": "#efe9e4"
		            }
		        ]
		    },
		    {
		        "featureType": "landscape.man_made",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "labels.text.stroke",
		        "stylers": [
		            {
		                "lightness": 100
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "labels.text.fill",
		        "stylers": [
		            {
		                "lightness": -100
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels.text.fill",
		        "stylers": [
		            {
		                "hue": "#11ff00"
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels.text.stroke",
		        "stylers": [
		            {
		                "lightness": 100
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels.icon",
		        "stylers": [
		            {
		                "hue": "#4cff00"
		            },
		            {
		                "saturation": 58
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "visibility": "on"
		            },
		            {
		                "color": "#f0e4d3"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#efe9e4"
		            },
		            {
		                "lightness": -25
		            }
		        ]
		    },
		    {
		        "featureType": "road.arterial",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#efe9e4"
		            },
		            {
		                "lightness": -10
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "labels",
		        "stylers": [
		            {
		                "visibility": "simplified"
		            }
		        ]
		    }
		];

		// Create new map
		model.map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 41.908803, lng: -87.679598},
			zoom: 15,
			styles: styles
		});

		// Create locations
		model.locations.forEach(function(location){
			var newLoc = new Location(location);
			// Add click event listener to marker
			newLoc.marker.addListener('click', function(){
				self.showInfoWindow(newLoc);
			});

			// Store in the location list
			self.locationList.push(newLoc);
		});
	};

	// Function to bounce marker on the map
	this.bounceMarker = function(marker) {
    	marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){
			marker.setAnimation(null);
		}, 750);
	};
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);
