

// Factory functions return an object
function Trial(trial_dim, plot_size, alley_dim, origin_pt, angle) {
  
  this.param = {
    'columns' : trial_dim[0],
    'rows'    : trial_dim[1],
    'plot_x'  : plot_size[0],
    'plot_y'  : plot_size[1],
    'alley_x' : alley_dim[0],
    'alley_y' : alley_dim[1],
    'origin_x' : 0,
    'origin_y' : 0,
  };

  this.dimensions();
  this.extent = [];
  this.plots = this.create_plots();
  this.set_origin(origin_pt);
  this.rotate(origin_pt, angle)                   // origin_pt is L.point with
  this.unproject();
};



Trial.prototype.dimensions = function() {
  this.width = (this.param['columns']-1 * this.param['alley_x']) + (this.param['plot_x'] * this.param['columns']);
  this.height = (this.param['rows']-1 * this.param['alley_y']) + (this.param['plot_y'] * this.param['rows']);
  return([this.width, this.height]);
};


// Trial.prototype.set_origin = function(origin) {
//   console.log("Setting origin: " + origin);
//   this.origin = Object.create(turf.point([origin.x,  origin.y]));
//   this.param['origin_x'] = origin.x;
//   this.param['origin_y'] = origin.y;
//   this.set_extent();
// }


Trial.prototype.set_extent = function() {
  var ll = [this.param['origin_x'], this.param['origin_y']];
  var lr = [this.param['origin_x']+this.width, this.param['origin_y']];
  var ul = [this.param['origin_x'], this.param['origin_y']+this.height];
  var ur = [this.param['origin_x']+this.width, this.param['origin_y']+this.height];
  this.extent = Object.create(turf.polygon([[ll,lr,ur,ul,ll]], { name: 'extent' }));
}


Trial.prototype.draw_extent = function() {
  var coords = this.unprojectArrayXY(this.extent.geometry.coordinates[0]);
  var polygon = L.polygon(coords, {color: 'red'});
  return(polygon);
}


// loop through the columns and rows creating the polygons
Trial.prototype.create_plots = function() {
  console.log('CreatePlots called..');
  var id = 1;
  var plots = [];
  var plots_fg = L.featureGroup();
    for(let c=1; c < this.param['columns']+1; c++) {
      for(let r=1; r < this.param['rows']+1; r++) { 
          current_plot_ll = this.get_plot_ll(c, r);
	   		  var _plot = this.create_plot_poly(current_plot_ll[0], current_plot_ll[1], id);
	   		  plots.push(_plot)   
          id += 1;
     }
    }
    return(L.featureGroup(plots));
}


Trial.prototype.create_plot_poly = function(llx, lly, id) {
  var ll = [llx, lly];
  var ul = [llx+this.param['plot_x'], lly];
  var ur = [llx+this.param['plot_x'], lly+this.param['plot_y']];
  var lr = [llx, lly+this.param['plot_y']];
  var p = L.polygon([ll, ul, ur, lr], {color: 'red'});
  return(p)	
}  


// Get the lower left hand corner of a plot (x,y) pair based on column and row
//  - x and y are based off 0,0 orgin at this point in the code
Trial.prototype.get_plot_ll = function(column, row) {
	var llx = ((column-1)*this.param['alley_x']) + ((column-1)*this.param['plot_x'])
	var lly = ((row-1)*this.param['alley_y']) + ((row-1)*this.param['plot_y'])
	return([llx, lly])
}


Trial.prototype.rotate = function(rotate_pt, angle_deg) {
  console.log('Rotating Plots: ' + rotate_pt + '-' +  angle_deg);
  angleRad = (angle_deg * Math.PI) / 180.0;
  all_plots = this.plots.getLayers();
  var _new_xy = [];
  all_plots.forEach(function(plot, i) { 
    _new_xy = [];
    ring = plot.getLatLngs();
    ring.forEach(function(pts, i) {  
      pts.forEach(function(xy, i) {
				x = xy.lat - rotate_pt.x;
				y = xy.lng - rotate_pt.y;
				xr = (x * Math.cos(angleRad)) - (y * Math.sin(angleRad)) + rotate_pt.x;
				yr = (x * Math.sin(angleRad)) + (y * Math.cos(angleRad)) + rotate_pt.y;   
        _new_xy.push([xr, yr]);
      });  
    });  
    plot.setLatLngs(_new_xy);
  });
}



Trial.prototype.set_origin = function(origin) {
  console.log('Moving Plots: ' + origin.x + ' ' +  origin.y);
  all_plots = this.plots.getLayers();
  var _new_latlng = []         
  all_plots.forEach(function(plot, i) { 
    _new_latlng = [];
    latlngs = plot.getLatLngs();
    latlngs.forEach(function(xy, i) {  
      xy.forEach(function(p, i) {
        _new_latlng.push([p.lat+origin.x, p.lng+origin.y])
      });  
    });  
    plot.setLatLngs(_new_latlng)
  });
}


unproject_array = function(xy_array) {
  _latlng_array = [];
  xy_array.forEach(function(ring, i) {
    ring.forEach(function(pt, i) {
      _latlng_array.push(L.CRS.EPSG3857.unproject(L.point(pt.lat, pt.lng)));
    });  
  });  
  return(_latlng_array);
}

// loop through each plot unprojecting back to lats and longs
Trial.prototype.unproject = function() {
  console.log('Unprojecting...');
  all_plots = this.plots.getLayers();
  all_plots.forEach(function(plot, i) { 
    var _xy = plot.getLatLngs();
    var _latlngs = unproject_array(_xy);
    plot.setLatLngs(_latlngs);
  });
}






