<!-- 
Adam Pere
Involution Studios
January 2014

This php file gets all of the current user's data and returns it in the correct json format:

Example output:

[
	{
		"ID":"1",
		"user":"1",
		"color":"#000000",
		"pos":[["200","10"],["250","10"],["255","0"],["300","10"]],
		"pastPos":[["200","10"],["150","10"]]
	},
	
	{
		"ID":"3",
		"user":"2",
		"color":"#FFF567",
		"pos":[["50","10"],["40","10"],["50","10"],["60","10"]]
	},
	
	{
		"ID":"4",
		"user":"4",
		"color":"#DDEF23",
		"pos":[["20","6"]]
	}
]
-->

    <?php
    $dbhost = 'localhost:8888';
    $dbuser = 'adam_select';
    $dbpass = 'password';
    $conn = mysql_connect($dbhost, $dbuser, $dbpass);
    
    if(! $conn )
    {
      die('Could not connect: ' . mysql_error());
    }
    $sql = 'Select a.ID, a.color, a.user, b.x, b.y, b.z, b.time_added
            From users a, positions b
            Where a.tracking = 1 and a.ID = b.ID
            Order By b.time_added';
    
    mysql_select_db('trackingdb');
    $retval = mysql_query( $sql, $conn );

    if(! $retval )
    {
      die('Could not get data: ' . mysql_error());
    }
    
    $array = [];

    while($row = mysql_fetch_array($retval, MYSQL_ASSOC))
    {
        if(array_key_exists($row["user"], $array)) {
            $array[$row["user"]]["pos"][] = [$row["x"], $row["y"]];
        }
        else {
            $temp = [];
            $temp["ID"] = $row["ID"];
            $temp["user"] = $row["user"];
            $temp["color"] = $row["color"];
            $temp["pos"][] = [$row["x"], $row["y"]];
            
            $array[$row["user"]] = $temp;
        } 
    } 
    
    $array = array_values($array);
    foreach ($array as &$value) {
        $c = count($value["pos"]);
        
        for($i = 0; $i < $c; $i++) {
            if($i >= 4){
                $value["pastPos"][] = $value["pos"][$i];
                unset($value["pos"][$i]);
            }
        }
    }
    

    //print_r($array);
    echo(json_encode($array));
    mysql_close($conn);
    ?>
