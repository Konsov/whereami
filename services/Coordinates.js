var randomPointsOnPolygon = require('random-points-on-polygon');
var turf = require('@turf/turf');

var africaPoly = turf.polygon([[
    [32.0097707, 30.8902829],
    [39.1289113, 14.4308179],
    [42.9960988, 9.7077645],
    [49.3242238, 9.6211692],
    [44.5781301,2.6384166],
    [38.9531301,-4.7339794],
    [38.9179771,-10.045861],
    [39.4453208,-14.7629238],
    [34.2597739,-19.4627205],
    [34.5234458,-23.3867689],
    [31.9746177,-25.1484286],
    [30.5683677,-29.3637635],
    [21.1640708,-33.7774629],
    [16.6816489,-27.7435371],
    [13.2539146,-18.215709],
    [15.6269614,-9.1797843],
    [11.3203208,-1.7524723],
    [10.6171958,6.2285682],
    [1.9160239,7.7978427],
    [-8.6308511,6.8394649],
    [-16.0312428,14.3967889],
    [-14.800774,20.9213553],
    [-11.285149,26.7825917],
    [-6.7148365,31.9099547],
    [-1.441399,34.3373311],
    [8.0859469,35.5184068],
    [8.3496188,32.3859449],
    [18.2812594,28.5253758],
    [21.7968844,30.5126365],
    [31.9043063,30.9656372]
]])

var points = randomPointsOnPolygon(numberOfPoints, africaPoly);