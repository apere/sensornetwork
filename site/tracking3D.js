//Adam M. Pere
//Involution Studios
//January 2014
//
//This is a scatter plot to create the framework for my person tracking application.
//The data is broken up by users (or people in the studio). Each user has 4 points (this may change)
//that represent their current location (the largest most opaque dot) and thier last 3 previous locations
//(the smaller more opaque dots).
//
//Project: InvoLive
//This is a 2d birds eye view of the studio (bare bones simply to illustrate the idea).
//
//Each set of colored dots represents a person and their motion path. The largest and most opaque dot is the current location of the person and the smaller less opaque dots are their past locations (aka their walking/motion path). 
//
//The further apart the dots are, the faster he/she is moving. The closer they are, the slower he/or she is moving. 
//
//Once I get the tracking working, I plan on adding more detail (furniture and other fun) to the map and making it look nicer. 
//
//Other future plans:
//- To get live video with data overlaid
//- Collect studio data and map overtime/compare dates
//- To get tracking in multiple rooms
//- To identify people (are they in the studio: fitbit, phone connected to wifi, computer connected to network, etc. Hot Zones (aka people's working areas)
//- Finding other possible data to collect: heat across the room, etc.



//Width and height of svm
var w = 800;
var h = 800;
var padding = 40;

var anim = false; //Currently it is only used to know whether or not all users should randomly move forward (prototyping)

var selectedUser;

//Initializing the array of users
//Every user should have:
// user: A User ID -- I'm just using integers starting at 0 as this is what the kinect will give me?
// color: A unique (hopefully) color, this will be used for everything associated with that user (circle, line, etc.)
// pos: this is an array of length 4 (or less...never more than 4) of the user's most recent positions pos[0] should be the most recent location. Each index contains an array of length 2 [x-coordinate,y-coordinate]
// pastPos: this is an array of any length, it stores all of the user's past locations with the most recent at pastPos[0]. Each index contains an array of length 2 [x-coordinate,y-coordinate]
var users = [
    {
        user: 0,
        color: "#149314",
        pos: [[80, 85], [60, 75], [45, 60], [30, 35]],
        pastPos: []
      },
    {
        user: 1,
        color: "#3d3dc3",
        pos: [[60, 110], [70, 120], [80, 135], [90, 155]],
        pastPos: []
      },
    {
        user: 2,
        color: "#d6203c",
        pos: [[120, 140], [130, 160], [140, 185], [150, 200]],
        pastPos: []
    }

];


//This function should really only be used by the iterate function (I'm sure there are exceptions)
//This contains code that you want to execute each frame
//Including animations (aka breathing circles) or for continously 
//having user(s) move forward random amount when running tests/prototyping
var animate = function () {
    if (anim) {
        refreshData(series);
    }
};

//returns the user's ID (aka their user#)
//Some code might be using this as an index but that is frowned upon.
var key = function (d) {
    return d.user;
};

//returns a user's color
var getColor = function (d) {
    return d.color;
};

//returns a user's position
var getPosition = function (d) {
    return d.pos;
};

//returns the scaled x-coordinate
var getX = function (d) {
    return xScale(d[0]);
};

//Returns the scaled y-coordinate
var getY = function (d) {
    return yScale(d[1]);
};

var pointLabel = function (d, i, j) {
    return j + " - " + i + " : (" + d[0] + ", " + d[1] + ")";
};


//Returns the correct radius for the user's current location.
//Only works if you are iterating through a maximum of 4 circles.
//If you are are iterating through anymore, use radiusAnimate
var radius = function (d, i) {
    return rScale(4 - i);
};

//Returns the correct radius for the user's current locations
//even if you're iterating through ALL circles
var radiusAnimate = function (d, i) {
    return radius(d, i % 4);
};

//Returns the opactiy of each circle in the user's current locations
var opact = function (d, i) {
    return 1 / (i + 1) * 1.5;
};

//not updated for 3D
//Displays a non-updating trail of one (the current) user's past locations
//var showTrail = function (d) {
//    console.log("clicked on " + d.user);
//    svg.selectAll("#past").remove();
//    svg.append("g").attr("class", "pastCircles").attr("id", "past").style("fill", d.color);
//    var selection = svg.select("series, #past");
//
//    //draw all circles
//    svg.selectAll("series, #past")
//        .selectAll("circle")
//        .data(d.pastPos, function (d) {
//            return d;
//        })
//        .enter().append("circle")
//        .attr("id", "past")
//        .attr("cx", getX)
//        .attr("cy", getY)
//        .attr("r", function (d) {
//            return 5;
//        })
//        .style("opacity", .5);
//
//    //draw all connecting lines
//    var l = d.pastPos.length;
//
//    //line attaching this to current position
//    selection.append("line")
//        .attr("x1", xScale(d.pastPos[0][0]))
//        .attr("y1", yScale(d.pastPos[0][1]))
//        .attr("x2", xScale(d.pos[d.pos.length - 1][0]))
//        .attr("y2", yScale(d.pos[d.pos.length - 1][1]))
//        .style("stroke", 2)
//        .style("opacity", .5)
//        .style("stroke", d.color);
//
//
//    for (var i = 0; i < l - 1; i++) {
//        selection.append("line")
//            .attr("x1", xScale(d.pastPos[i][0]))
//            .attr("y1", yScale(d.pastPos[i][1]))
//            .attr("x2", xScale(d.pastPos[i + 1][0]))
//            .attr("y2", yScale(d.pastPos[i + 1][1]))
//            .style("stroke", 2)
//            .style("opacity", .5)
//            .style("stroke", d.color);
//    }
//
//};

//Moves the current user a random amount in the x and y direction. Useful for prototyping a real person's motion path
//for a person walking at varying speeds/velocities
var randomMove = function (d) {
    var temp = users[d].pos;
    temp = temp[0];

    if (users[d].pos.length >= 4) {
        var temp2 = users[d].pos.pop();
        users[d].pastPos.unshift(temp2);
    }

    var r1 = Math.floor(Math.random() * 40) - 10;
    var r2 = Math.floor(Math.random() * 40) - 10;
    var x1 = parseInt(temp[0]) + r1;
    var y1 = parseInt(temp[1]) + r2;
    console.log("at (" + temp[0] + "," + temp[1] + ") to (" + x1 + ", " + y1 + ")" + "randoms: " + r1 + ", " + r2);
    users[d].pos.unshift([x1, y1]);
};

var refreshData = function () {
    d3.json("userRead.php", function (error, data) {
        users = data;
    });

    updateData(series);
};

//This function updates all of the visuals connected with data
//adds or removes circles, updates circle locations (same thing for labels if you want those)
//updates anything associated per user (aka a legend and whatnot)
//If you want, it has code (commented out) to update the scales and the axes (if you want to zoom in as much as possible... but that doesn't work for the current model)
var updateData = function (d) {
    //updating the data for all users w/ their visual (weird wording?)

    series = series.data(users, key);

    //New elements
    //Adding new user(s)
    series.enter().append("x3d:group")
        .attr("class", "series")
        .style("diffuseColor", getColor)
        .attr("id", function (d) {
            return "user" + d.user
        });

    //adding new spheres(s)
    shapes = series.selectAll("transform").data(getPosition);
    shapesEnter = shapes
        .enter()
        .append("transform")
        .attr("translation", function (d, i) {
            return getX(d) + " 1.0 " + getY(d);
        })
        .append("shape")

    //updating all of the circles
    shapes.transition()
        .duration(1000)
        .attr("translation", function (d, i) {
            return getX(d) + " 1.0 " + getY(d);
        })

    shapesEnter
        .append("appearance")
        .append("material")
        .attr("diffuseColor", function (d, i) {
            var p = d3.select(this.parentNode.parentNode.parentNode.parentNode);
            return p.datum().color;
        });

    shapesEnter
        .append("sphere")
        .attr("radius", radius);


    select = select.data(users, key);
    //adding new users to dropdown menue
    select.enter()
        .append("option")
        .attr("value", function (d) {
            return d.user;
        })
        .text(function (d) {
            return "user " + d.user;
        });

    //updating the legend of users (adding or removing users)
    form = form.data(users, key);
    form.enter().append("p")
        .attr("id", key)
        .text(function (d) {
            return "user " + d.user;
        })
        .style("color", getColor);
    // .on("click", showTrail);

    //Updating current elements (no reason to update the users... they don't actually change...or shouldn't... if you change something about them, insert code here)
    series.style("color", getColor)




    //Removing all elements associated with data that no longer exists
    series.exit()
        .transition()
        .duration(100)
        .remove();

    shapes.exit()
        .transition()
        .duration(100)
        .remove();

    //removing users from dropdown
    select.exit().remove();

    //removing users from legend
    form.exit().remove();
};


//calculating the scale using the maximum position location values
var xScale = d3.scale.linear()
    .domain([0, 400])
    .range([-30, 30]);

var yScale = d3.scale.linear()
    .domain([0, 400])
    .range([-30, 30]);

var rScale = d3.scale.linear()
    .domain([1, 4])
    .range([.6, 1.5]);

//Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

//Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

var x3d = d3.select("#col2")
    .append("x3d")
    .attr("width", w)
    .attr("height", h);

var scene = x3d.append("scene");


scene.append("viewpoint")
    .attr("fieldOfView", 1.5)
    .attr("position", "0, 20, 40")
    .attr("orientation", "1 0 0 -0.75")
    .attr("zNear", .01)
    .attr("zFar", 1000);

//adding a light & activating shadows
scene.append("pointLight")
    .attr("ambientIntensity", 0)
    .attr("intensity", .4)
    .attr("location", "0 20 0")
    .attr("radius", 55)
    .attr("on", "true")
    .attr("shadowIntensity", .25)
    .attr("shadowCascades", 3)
    .attr("shadowFilterSize", 3);


scene.append("background").attr("skyColor", "1.000 1.000 1.000")

var past = "";

//getting all of the data points
var series = scene.selectAll("series")
    .data(users, key).enter().append("x3d:group")
    .attr("class", "series")
    .attr("id", function (d) {
        return "user" + d.user;
    })
    .attr("diffuseColor", getColor);


//Adding the circles
var shapes = series.selectAll("transform").data(getPosition);
var shapesEnter = shapes
    .enter()
    .append("transform")
    .attr("translation", function (d, i) {
        return getX(d) + " 1.0 " + getY(d);
    })
    .append("shape");


shapesEnter
    .append("appearance")
    .append("material")
    .attr("diffuseColor", function (d, i) {
        var p = d3.select(this.parentNode.parentNode.parentNode.parentNode);
        return p.datum().color;
    });


shapesEnter.append("sphere")
    .attr("radius", radius);

var floor = scene.append("x3d:group")
    .attr("class", "series")
    .attr("id", "floor")
    .append("transform")
    .attr("translation", "0 0 0")
    .append("shape");

floor.append("appearance")
    .append("material")
    .attr("diffuseColor", "#f8c900")
    .attr("transparency", .5);

floor.append("box").attr("size", "60 .2 60");


var select = d3.select("body").select("form").select("select").selectAll("userDrop").data(users, key)
    .enter()
    .append("option")
    .attr("value", function (d) {
        return d.user;
    })
    .text(function (d) {
        return "user " + d.user;
    })
    .style("color", getColor);

var form = d3.select("#col1").selectAll("p").data(users, key)
    .enter().append("p")
    .attr("id", key)
    .text(function (d) {
        return "user " + d.user;
    })
    .style("color", getColor);
//.on("click", showTrail);


//Actions for clicking buttons
d3.selectAll("button").on("click", function (d) {

    var buttonID = d3.select(this).attr("class");

    //Adds a random user to exact location
    //super each to make it go random... I should probably write an add user function***
    if (buttonID == "add") {

        var col1 = "hsl(" + Math.random() * 360 + ",70%,60%)";
        users.push({
            user: users.length,
            color: col1,
            pos: [[70, 40], [75, 34], [99, 80], [110, 85]],
            pastPos: []
        });

    }
    //Changes all user's most current location to this... currently it completely disregards the last 4 current
    //I should probably write it so that it pushes the last 4 into pastPos... but this is mainly for prototyping anyway
    //there isn't any real value to this function... (I know, bad programming Adam)
    else if (buttonID == "update") {
        var len = users.length;

        if (len >= 1) {
            users[0].pos = [[60, 110], [70, 120], [80, 135], [90, 155]];
        }
        if (len >= 2) {
            users[1].pos = [[90, 140], [100, 160], [120, 205], [110, 210]];
        }
        if (len >= 3) {
            users[2].pos = [[20, 70], [30, 80], [40, 85], [50, 95]];
        }
        if (len >= 4) {
            users[3].pos = [[20, 145], [120, 110], [90, 105], [320, 330]];
        }
        if (len >= 5) {
            users[4].pos = [[50, 50], [0, 0], [10, 95], [60, 300]];
        }

    }
    //Removes the user at position 0... hopefully one day, it will remove the selected user
    else if (buttonID == "remove") {
        var temp = document.getElementById("drop");
        var temp = temp.options[temp.selectedIndex].value;
        console.log("removing " + temp);

        if (temp == "none") {
            users.shift();
        } else {
            //EMPTY
        }
    }
    //Toggles whether or not we are currently animating
    //ATM, animating means moving all user a random amount (prototyping only?)
    else if (buttonID == "animate") {
        anim = !anim;
        console.log("animate: " + anim);
    }
    //Takes a random user and sets their current location to a random location
    //This does correctly update pastPos
    else if (buttonID == "updateOne") {
        var index = Math.floor(Math.random() * users.length);
        if (index >= users.length) {
            index = users.length - index;
        }
        console.log(index);
        var temp = users[index].pos.pop();
        users[index].pastPos.unshift(temp);
        users[index].pos.unshift([Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]);

    }
    //This button is the submission for the form. It either adds a new user and
    //puts its current location to the entered coordinates or it changes the
    //selected user's current location to the supplied coordinates
    else if (buttonID == "newLoc") {
        var sel = document.getElementById("drop");
        var selValue = sel.options[sel.selectedIndex].value;
        var newLoc = [document.getElementById("newLocX").value, document.getElementById("newLocY").value];
        console.log("user: " + selValue + " at (" + newLoc[0] + ", " + newLoc[1] + ")");

        if (!(isNaN(newLoc[0])) && !(isNaN(newLoc[1]))) {
            if (selValue == "newUser") {
                var col = "hsl(" + Math.random() * 360 + ",100%,50%)";

                console.log(col);
                users.push({
                    user: users.length,
                    color: col,
                    pos: [newLoc],
                    pastPos: []
                });

            } else {
                if (users[selValue].pos.length >= 4) {
                    var temp = users[selValue].pos.pop();
                    users[selValue].pastPos.unshift(temp);
                }
                users[selValue].pos.unshift(newLoc);

            }


        }
    } else if (buttonID == "move") {
        var t = document.getElementById("drop");
        var tV = t.options[t.selectedIndex].value;

        randomMove(tV);
    } else if (buttonID == "refresh") {
        refreshData();
    }

    //All of these buttons do something to the data
    //therefore, we need to update the visuals associated with that data
    updateData(series);

    return d;
});

//Calls that function ever #ms
setInterval(animate, 1000);