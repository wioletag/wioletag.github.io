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
  this.mapErrorMsg = ko.observable();
  this.locErrorMsg = ko.observable();

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
        model.infowindow.close();
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
    var content ="";

    // Make Ajax call to Foursquare API and populate location's infoWindow
    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(data) {
        var result = data.response.venue;
        content = self.getContent(location.title, result);
        model.infowindow.setContent(content);
        model.infowindow.open(map, location.marker);
      },
      error: function() {
        // Error handling
        content = '<p>Failed to get Foursquare data.</p>';
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
    var address, rating, url, source;
    var content = '<h5>' + locationTitle + '</h5>';

    // Set variables based on output from Foursquare API
    if (result){
      address = (result.location.formattedAddress && result.location.formattedAddress.length) ? (result.location.formattedAddress[
          0] + '</br>' + result.location.formattedAddress[1] + '</br>' + result.location.formattedAddress[2] + '</p>') : "No address available";
      rating = result.rating ? result.rating : "No rating available";
      rating += result.ratingSignals ? " (" + result.ratingSignals + " ratings)" : "";
      url = result.url ? '<a href="' + result.url + '" target="_blank">' + result.url + '</a>' : 'No url available';
      source = 'Source: <a href="https://foursquare.com/" target="_blank">Foursquare</a>';

      // Set content for infoWindow
      content += '<div class="info"><p>' + address + '</p><p>' + rating + '</p><p>' + url + '</p><p>' + source + '</p><p></div>';
    }

    return content;
  };

  /**
   * Success callback for Google Map API request
   */
  this.initMap = function() {

    // Create new map
    model.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 41.908803,
        lng: -87.679598
      },
      zoom: 15
    });

    // Set map style
    self.setMapStyle();

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
        // Error handling
        self.locErrorMsg("Error reading location data.")
      }
    });
  };

  /**
   * Function to read map style from json file
   */
  this.setMapStyle = function() {
    $.ajax({
      url: '/../mapStyle.json',
      dataType: 'json',
      success: function(data) {
        console.log(data.style);
        model.map.setOptions({styles: data.style});
      },
      error: function() {
        // Error handling
        // If style fails to load, we still want to display map with the default still so no error is thrown.
        // Only a message to the console is logged.
        console.log("Map style failed to load. Default style will be used.");
      }
    });
  }

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
   self.mapErrorMsg("Google Map API failed to load.");
  };
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);