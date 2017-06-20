function Model() {
  this.map = null;
  this.infowindow = null;
}

var model = new Model();

var Location = function(data) {
  this.title = data.title;
  this.id = data.id;
  this.location = data.location;
  this.keys = data.keys;
  this.visible = true;
  this.marker = new google.maps.Marker({
    map: model.map,
    position: this.location,
    title: this.title,
    animation: google.maps.Animation.DROP,
    visible: true
  });
};

function ViewModel() {
  var self = this;
  this.locationList = ko.observableArray([]);
  this.filter = ko.observable("");

  /**
   * Function to show all markers on map
   */
  this.showAllMarkers = function() {
    self.locationList().forEach(function(location) {
      location.marker.setVisible(true);
    });
  };

  /**
   * Function to filter locations in the list
   */
  this.filteredItems = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
      self.showAllMarkers();
      return self.locationList();
    } else {
      return ko.utils.arrayFilter(self.locationList(), function(location) {
        if (location.title.toLowerCase().indexOf(filter) !== -1 ||
          location.keys.toString().indexOf(filter) != -1) {
          location.marker.setVisible(true);
          return true;
        } else {
          location.marker.setVisible(false);
          return false;
        }
      });
    }
  }, this);

  /**
   * Function to show infoWindow for chosen location
   */
  this.showInfoWindow = function(location) {
    var clientId = 'OBCNKT2ROUPNFWFVVP1QYEYMRRNNDRU2AR52YOZ5FRJCI13U';
    var clientSecret = '3DYBBVMJHUN4YT4HRFJO1P5AE1I2RK14PZ0LWWQCAFDA225R';
    var version = 20170101;
    var base_url = 'https://api.foursquare.com/v2/venues';
    var venue_id = location.id;
    var url = base_url + '/' + venue_id + '?client_id=' + clientId +
      '&client_secret=' + clientSecret + '&v=' + version;

    // Make Ajax call to Foursquare API and populate location's infoWindow
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        var result = data.response.venue;
        var content = self.getContent(location.title, result);
        model.infowindow.setContent(content);
        model.infowindow.open(map, location.marker);
      },
      error: function() {
        content += '<p>Failed to get Foursquare data.</p>';
        model.infowindow.setContent(content);
        model.infowindow.open(map, location.marker);
      }
    });

    // Bounce the marker
    self.bounceMarker(location.marker);
  };

  /**
   * Function to create content for marker's infoWindow
   */
  this.getContent = function(locationTitle, result) {
    var content, address, rating, ratingSignals, url, source;
    var title = '<h5>' + locationTitle + '</h5>';

    // Set variables based on output from Foursquare API
    address = (result.location.formattedAddress && result.location.formattedAddress.length) ? (result.location.formattedAddress[
          0] + '</br>' + result.location.formattedAddress[1] + '</br>' + result.location.formattedAddress[2] + '</p>') : "No address available"
    rating = result.rating ? result.rating : "No rating available";
    rating += result.ratingSignals ? " (" + result.ratingSignals + " ratings)" : "";
    url = result.url ? '<a href="' + result.url + '" target="_blank">' + result.url + '</a>' : 'No url available';
    source = 'Source: <a href="https://foursquare.com/" target="_blank">Foursquare</a>';

    // Set content for infoWindow
    content = title + '<div class="info"><p>' + address + '</p><p>' + rating + '</p><p>' + url + '</p><p>' + source + '</p><p></div>';

    return content;
  };

  /**
   * Success callback for Google Map API request
   */
  this.initMap = function() {
    // Map style from https://snazzymaps.com/
    var styles = [{
        "featureType": "water",
        "stylers": [{
          "color": "#19a0d8"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [{
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
        "stylers": [{
          "color": "#e85113"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
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
        "stylers": [{
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
        "stylers": [{
          "lightness": 100
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "lightness": -100
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.icon"
      },
      {
        "featureType": "landscape",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "landscape",
        "stylers": [{
            "lightness": 20
          },
          {
            "color": "#efe9e4"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "lightness": 100
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "lightness": -100
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "hue": "#11ff00"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "lightness": 100
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [{
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
        "stylers": [{
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
        "stylers": [{
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
        "stylers": [{
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
        "stylers": [{
          "visibility": "simplified"
        }]
      }
    ];

    // Create new map
    model.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 41.908803,
        lng: -87.679598
      },
      zoom: 15,
      styles: styles
    });

    // Create infoWindow
    model.infowindow = new google.maps.InfoWindow();

    // Get location data from json file
    $.ajax({
      url: '/../data.json',
      dataType: 'json',
      success: function(data) {
        data.locations.forEach(function(location) {
          var newLoc = new Location(location);

          // Add click event listener to marker
          newLoc.marker.addListener('click', function() {
            self.showInfoWindow(newLoc);
          });

          // Store in the location list
          self.locationList.push(newLoc);
        });
      },
      error: function() {
        $('.navbar-nav').append("<div class='error'>Error reading location data.</div>");
      }
    });
  };

  /**
   * Function to bounce marker on the map
   */
  this.bounceMarker = function(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 700);
  };

  /**
   * Error callback for Google Map API request
   */
  this.mapError = function() {
    // Error handling
    $('.map-container').prepend("<div class='error'>Google Map API failed to load.</div>");
  };
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);